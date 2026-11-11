import { json, corsHeaders, validateBooking, normalizeBooking, hmacHex, randomOtp, safeEqual } from './lib.js';

const supabase = (env, path, options={}) => fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
  ...options,
  headers: {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'content-type': 'application/json',
    ...(options.headers || {})
  }
});

async function notifyEmail(env, to, subject, textBody) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return { configured: false };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text: textBody })
  });
  return { configured: true, ok: res.ok, status: res.status };
}

async function notifySms(env, to, body, whatsapp=false) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) return { configured: false };
  const from = whatsapp ? env.TWILIO_WHATSAPP_FROM : env.TWILIO_FROM_NUMBER;
  if (!from) return { configured: false };
  const rawTo = String(to || '').replace(/^whatsapp:/, '').replace(/[\s()-]/g, '');
  const whatsappE164 = rawTo.startsWith('+') ? rawTo : (rawTo.length === 10 ? `+91${rawTo}` : (rawTo.startsWith('91') ? `+${rawTo}` : `+${rawTo}`));
  const form = new URLSearchParams({ To: whatsapp ? `whatsapp:${whatsappE164}` : to, From: from, Body: body });
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST', headers: { authorization: `Basic ${auth}`, 'content-type': 'application/x-www-form-urlencoded' }, body: form
  });
  return { configured: true, ok: res.ok, status: res.status };
}

async function getAuthUser(request, env) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  const r = await fetch(`${env.SUPABASE_URL.replace(/\/$/,'')}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, authorization: `Bearer ${token}` }
  });
  return r.ok ? r.json() : null;
}

async function requireMembership(request, env, role=null) {
  const user = await getAuthUser(request, env);
  if (!user?.id) return { error: 'Authentication required', status: 401 };
  if (user.app_metadata?.platform_role === 'platform_admin') return { user, membership: { garage_id: null, role: 'platform_admin', status: 'active' } };
  const r = await supabase(env, `memberships?select=garage_id,role,status&user_id=eq.${encodeURIComponent(user.id)}&status=eq.active`);
  if (!r.ok) return { error: 'Membership lookup failed', status: 503 };
  const memberships = await r.json();
  const membership = memberships.find(m => !role || m.role === role || m.role === 'platform_admin');
  if (!membership) return { error: 'Access not authorized', status: 403 };
  return { user, membership };
}

async function findPartnerRoute(env, pincode) {
  const routes = await supabase(env, `partner_service_areas?select=garage_id,priority&pincode=eq.${encodeURIComponent(pincode)}&is_active=eq.true&order=priority.asc&limit=1`);
  if (!routes.ok) return { garage: null, routeLookupFailed: true };
  const route = (await routes.json())[0];
  if (!route?.garage_id) return { garage: null, routeLookupFailed: false };
  const garages = await supabase(env, `garages?select=id,display_name,phone,email,status&id=eq.${encodeURIComponent(route.garage_id)}&status=eq.active&limit=1`);
  if (!garages.ok) return { garage: null, routeLookupFailed: true };
  return { garage: (await garages.json())[0] || null, routeLookupFailed: false };
}

async function handleBooking(request, env) {
  const input = await request.json();
  const errors = validateBooking(input);
  if (errors.length) return json({ error: 'Validation failed', details: errors }, 400);
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({ error: 'Booking database is not configured. Request was not saved.', code: 'DATABASE_NOT_CONFIGURED' }, 503);

  const booking = normalizeBooking(input);
  if (booking.idempotency_key) {
    const prior = await supabase(env, `bookings?select=job_id,status,garage_id&idempotency_key=eq.${encodeURIComponent(booking.idempotency_key)}&limit=1`);
    if (prior.ok) {
      const existing = (await prior.json())[0];
      if (existing) return json({ ok: true, duplicate: true, job_id: existing.job_id, status: existing.status, garage_id: existing.garage_id, message: 'This booking request was already received.' }, 200);
    }
  }

  const routing = await findPartnerRoute(env, booking.pincode);
  if (routing.garage) booking.garage_id = routing.garage.id;
  const r = await supabase(env, 'bookings', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify(booking) });
  if (!r.ok) return json({ error: 'Booking could not be saved. No success confirmation was issued.', detail: await r.text() }, 502);
  const saved = (await r.json())[0];

  const message = `New CC Motocrafts booking ${saved.job_id}\nCustomer: ${saved.customer_name}\nPhone: ${saved.customer_phone}\nVehicle: ${saved.vehicle_model} (${saved.vehicle_reg})\nPIN: ${saved.pincode}\nArea: ${saved.area || 'Not supplied'}\nIssue: ${saved.service_package}`;
  const deliveries = [];
  // Send the owner notification to both configured business inboxes.
  // BUSINESS_ALERT_EMAIL remains supported for backward compatibility.
  const ownerEmails = [...new Set(String(env.BUSINESS_ALERT_EMAILS || env.BUSINESS_ALERT_EMAIL || '')
    .split(',').map(value => value.trim().toLowerCase()).filter(Boolean))];
  for (const recipient of ownerEmails) {
    try {
      deliveries.push({ channel: 'business_email', recipient, ...(await notifyEmail(env, recipient, `New CC Motocrafts booking ${saved.job_id}`, message)) });
    } catch (error) {
      deliveries.push({ channel: 'business_email', recipient, configured: true, ok: false, error: 'delivery_failed' });
    }
  }
  if (routing.garage?.email) {
    try { deliveries.push({ channel: 'partner_email', ...(await notifyEmail(env, routing.garage.email, `Assigned booking ${saved.job_id}`, message)) }); }
    catch (error) { deliveries.push({ channel: 'partner_email', configured: true, ok: false, error: 'delivery_failed' }); }
  }
  try {
    if (routing.garage?.phone) deliveries.push({ channel: 'partner_whatsapp', ...(await notifySms(env, routing.garage.phone, message, true)) });
    else if (env.BUSINESS_WHATSAPP) deliveries.push({ channel: 'business_whatsapp', ...(await notifySms(env, env.BUSINESS_WHATSAPP, message, true)) });
  } catch (error) { deliveries.push({ channel: 'whatsapp', configured: true, ok: false, error: 'delivery_failed' }); }

  // Customer notifications are sent only where the customer supplied the address/number and opted in.
  const customerMessage = `Thank you for choosing CC Motocrafts! Your booking request ${saved.job_id} has been received. Our team will contact you to confirm pickup availability; the 35–45 minute pickup target applies only after dispatch confirmation and service-area availability.`;
  if (saved.customer_email && saved.customer_email_opt_in) {
    try { deliveries.push({ channel: 'customer_email', ...(await notifyEmail(env, saved.customer_email, `CC Motocrafts booking request ${saved.job_id}`, customerMessage)) }); }
    catch (error) { deliveries.push({ channel: 'customer_email', configured: true, ok: false, error: 'delivery_failed' }); }
  }
  if (saved.customer_whatsapp_opt_in) {
    try { deliveries.push({ channel: 'customer_whatsapp', ...(await notifySms(env, saved.customer_phone, customerMessage, true)) }); }
    catch (error) { deliveries.push({ channel: 'customer_whatsapp', configured: true, ok: false, error: 'delivery_failed' }); }
  }

  return json({ ok: true, job_id: saved.job_id, status: saved.status, garage_id: saved.garage_id || null, routing: routing.garage ? 'partner_assigned' : (routing.routeLookupFailed ? 'route_lookup_unavailable' : 'central_queue_no_pincode_match'), notifications: deliveries, message: 'Booking saved. Appointment and pickup remain subject to team confirmation.' }, 201);
}

async function handleAccessRequest(request, env) {
  const body = await request.json();
  const kind = body.request_type;
  if (!['partner_access','customer_tracking'].includes(kind)) return json({ error: 'Invalid request type' }, 400);
  if (!body.name || !body.phone || !body.email) return json({ error: 'Name, phone and email are required' }, 400);
  const payload = { request_type: kind, name: String(body.name).slice(0,120), phone: String(body.phone).slice(0,24), email: String(body.email).slice(0,254), details: body.details || {}, status: 'pending' };
  const r = await supabase(env, 'access_requests', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify(payload) });
  if (!r.ok) return json({ error: 'Request could not be recorded' }, 502);
  const row = (await r.json())[0];
  if (env.BUSINESS_ALERT_EMAIL) await notifyEmail(env, env.BUSINESS_ALERT_EMAIL, `CC Motocrafts access request: ${kind}`, `Request ID: ${row.id}\nType: ${kind}\nName: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nDetails: ${JSON.stringify(payload.details)}`);
  return json({ ok: true, request_id: row.id, status: 'pending_review', message: 'Your request has been received and is awaiting manual verification. No access code has been sent.' }, 201);
}

async function handleOtpRequest(request, env) {
  const body = await request.json();
  if (!body.job_id || !body.phone || !body.email) return json({ error: 'Job ID, registered phone and email are required' }, 400);
  if (!env.OTP_PEPPER || !env.TOKEN_SIGNING_SECRET) return json({ error: 'OTP service is not configured' }, 503);
  const check = await supabase(env, `bookings?select=id,job_id,customer_phone,customer_email&job_id=eq.${encodeURIComponent(body.job_id)}&limit=1`);
  if (!check.ok) return json({ error: 'Could not verify booking' }, 502);
  const booking = (await check.json())[0];
  if (!booking || booking.customer_phone !== body.phone || (booking.customer_email || '').toLowerCase() !== String(body.email).toLowerCase()) return json({ error: 'Details do not match the booking record' }, 403);
  const otp = randomOtp();
  const challengeId = crypto.randomUUID();
  const otpHash = await hmacHex(env.OTP_PEPPER, `${challengeId}:${otp}`);
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const ins = await supabase(env, 'otp_challenges', { method: 'POST', headers: { prefer: 'return=minimal' }, body: JSON.stringify({ id: challengeId, booking_id: booking.id, otp_hash: otpHash, expires_at: expires, attempts: 0 }) });
  if (!ins.ok) return json({ error: 'Could not create verification challenge' }, 502);
  const msg = `CC Motocrafts verification code: ${otp}. It expires in 5 minutes. Do not share this code.`;
  const results = await Promise.all([
    notifyEmail(env, body.email, 'Your CC Motocrafts verification code', msg),
    notifySms(env, body.phone, msg, false),
    notifySms(env, body.phone, msg, true)
  ]);
  if (!results.some(x => x.configured && x.ok)) return json({ error: 'No OTP delivery channel is configured or available. Contact the service desk.', challenge_id: challengeId }, 503);
  return json({ ok: true, challenge_id: challengeId, expires_at: expires, channels: results.map((x,i)=>({name:['email','sms','whatsapp'][i],sent:!!(x.configured&&x.ok)})) }, 200);
}

async function handleOtpVerify(request, env) {
  const body = await request.json();
  if (!body.challenge_id || !/^\d{6}$/.test(String(body.otp || ''))) return json({ error: 'Challenge ID and six-digit OTP are required' }, 400);
  const q = await supabase(env, `otp_challenges?select=id,booking_id,otp_hash,expires_at,attempts,used_at&id=eq.${encodeURIComponent(body.challenge_id)}&limit=1`);
  if (!q.ok) return json({ error: 'Verification unavailable' }, 502);
  const c = (await q.json())[0];
  if (!c || c.used_at || new Date(c.expires_at).getTime() < Date.now() || c.attempts >= 5) return json({ error: 'Code expired or challenge locked' }, 403);
  const actual = await hmacHex(env.OTP_PEPPER, `${c.id}:${body.otp}`);
  if (!safeEqual(actual, c.otp_hash)) {
    await supabase(env, `otp_challenges?id=eq.${encodeURIComponent(c.id)}`, { method: 'PATCH', body: JSON.stringify({ attempts: c.attempts + 1 }) });
    return json({ error: 'Invalid verification code' }, 403);
  }
  await supabase(env, `otp_challenges?id=eq.${encodeURIComponent(c.id)}`, { method: 'PATCH', body: JSON.stringify({ used_at: new Date().toISOString() }) });
  const expires = Math.floor(Date.now()/1000) + 15*60;
  const payload = `${c.booking_id}.${expires}`;
  const sig = await hmacHex(env.TOKEN_SIGNING_SECRET, payload);
  return json({ ok: true, tracking_token: `${btoa(payload)}.${sig}`, expires_at: new Date(expires*1000).toISOString() });
}

async function handleTracking(request, env, jobId) {
  const token = request.headers.get('x-tracking-token') || '';
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return json({ error: 'Tracking authorization required' }, 401);
  let payload;
  try { payload = atob(encoded); } catch { return json({ error: 'Invalid tracking token' }, 401); }
  const expected = await hmacHex(env.TOKEN_SIGNING_SECRET, payload);
  if (!safeEqual(signature, expected)) return json({ error: 'Invalid tracking token' }, 401);
  const [bookingId, expiry] = payload.split('.');
  if (Number(expiry) < Math.floor(Date.now()/1000)) return json({ error: 'Tracking session expired' }, 401);
  const r = await supabase(env, `bookings?select=job_id,division,vehicle_model,status,preferred_date,preferred_slot,created_at&id=eq.${encodeURIComponent(bookingId)}&job_id=eq.${encodeURIComponent(jobId)}&limit=1`);
  if (!r.ok) return json({ error: 'Tracking unavailable' }, 502);
  const booking = (await r.json())[0];
  if (!booking) return json({ error: 'Job not found' }, 404);
  const j = await supabase(env, `job_card_updates?select=status,title,description,created_at&booking_id=eq.${encodeURIComponent(bookingId)}&visible_to_customer=eq.true&order=created_at.asc`);
  return json({ booking, updates: j.ok ? await j.json() : [] });
}

async function handleDiagnostic(request, env) {
  if (!env.OPENAI_API_KEY) return json({ error: 'Technical AI provider is not configured yet', mode: 'safe_fallback' }, 503);
  const body = await request.json();
  const question = String(body.question || '').slice(0,5000);
  if (!question.trim()) return json({ error: 'Describe the symptom or enter an OBD code' }, 400);
  const prompt = `You are CC Motocrafts Technical Assistant. Give cautious diagnostic hypotheses, safe step-by-step checks, required tools, and when to stop and consult the OEM service manual. Never invent torque values, pinouts, wire colours, or claim certainty without vehicle year/model/engine details. Ask for missing details. This is not a substitute for a qualified inspection. Vehicle: ${String(body.vehicle || 'not supplied').slice(0,200)}. User question: ${question}`;
  const r = await fetch('https://api.openai.com/v1/responses', { method:'POST', headers:{authorization:`Bearer ${env.OPENAI_API_KEY}`,'content-type':'application/json'}, body:JSON.stringify({model:env.OPENAI_MODEL || 'gpt-6',input:prompt}) });
  if (!r.ok) return json({ error: 'AI provider request failed', provider_status: r.status }, 502);
  const data = await r.json();
  const answer = data.output?.flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n') || 'No diagnostic response returned.';
  return json({ ok:true, answer, disclaimer:'AI suggestions are preliminary. Verify against OEM service information and physical measurements.' });
}

async function handlePartnerSummary(request, env) {
  const auth = await requireMembership(request, env);
  if (auth.error) return json({ error: auth.error }, auth.status);
  const garageId = auth.membership.garage_id;
  const r = await supabase(env, `bookings?select=id,job_id,division,customer_name,vehicle_model,status,created_at&garage_id=eq.${encodeURIComponent(garageId)}&order=created_at.desc&limit=100`);
  if (!r.ok) return json({ error: 'Could not load partner bookings' }, 502);
  return json({ garage_id: garageId, role: auth.membership.role, bookings: await r.json() });
}

async function handleAdminOverview(request, env) {
  const auth = await requireMembership(request, env, 'platform_admin');
  if (auth.error) return json({ error: auth.error }, auth.status);
  if (auth.membership.role !== 'platform_admin') return json({ error: 'Platform administrator permission required' }, 403);
  const [requests, bookings] = await Promise.all([
    supabase(env, 'access_requests?select=id,request_type,name,phone,email,status,created_at&order=created_at.desc&limit=100'),
    supabase(env, 'bookings?select=id,job_id,garage_id,division,customer_name,vehicle_model,status,created_at&order=created_at.desc&limit=100')
  ]);
  if (!requests.ok || !bookings.ok) return json({ error: 'Could not load operations data' }, 502);
  return json({ access_requests: await requests.json(), recent_bookings: await bookings.json() });
}

async function handlePartnerInvoice(request, env) {
  const auth = await requireMembership(request, env);
  if (auth.error) return json({ error: auth.error }, auth.status);
  const garageId = auth.membership.garage_id;
  if (!garageId) return json({ error: 'A garage membership is required' }, 403);
  const body = await request.json();
  if (!body.booking_id || !Array.isArray(body.line_items) || !body.line_items.length) return json({ error: 'Booking and line items are required' }, 400);
  const bookingRes = await supabase(env, `bookings?select=id,job_id&garage_id=eq.${encodeURIComponent(garageId)}&id=eq.${encodeURIComponent(body.booking_id)}&limit=1`);
  if (!bookingRes.ok || !(await bookingRes.json()).length) return json({ error: 'Booking not found in this garage' }, 404);
  const garageRes = await supabase(env, `garages?select=display_name,gst_registered,gstin,address&id=eq.${encodeURIComponent(garageId)}&limit=1`);
  if (!garageRes.ok) return json({ error:'Could not verify garage tax profile' }, 502);
  const garage = (await garageRes.json())[0];
  if (!garage) return json({ error:'Garage profile not found' }, 404);
  if (garage.gst_registered && !garage.gstin) return json({ error:'GST is enabled but the garage GSTIN is missing. Complete profile verification first.' }, 409);
  const items = body.line_items.slice(0,80).map(i => ({ description:String(i.description||'').slice(0,180), quantity:Math.max(1,Math.min(1000,Number(i.quantity)||1)), unit_price:Math.max(0,Math.min(10000000,Number(i.unit_price)||0)), tax_rate:Math.max(0,Math.min(28,Number(i.tax_rate)||0)) }));
  if (items.some(i=>!i.description)) return json({ error: 'Every line item needs a description' }, 400);
  const subtotal = items.reduce((s,i)=>s+i.quantity*i.unit_price,0);
  const taxTotal = items.reduce((s,i)=>s+i.quantity*i.unit_price*i.tax_rate/100,0);
  const invoiceNumber = `CC-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  const invoice = { booking_id:body.booking_id, garage_id:garageId, invoice_number:invoiceNumber, invoice_type:garage.gst_registered ? 'gst' : 'retail', gst_snapshot:{gst_registered:garage.gst_registered,gstin:garage.gstin,address:garage.address}, line_items:items, subtotal:Number(subtotal.toFixed(2)), tax_total:Number(taxTotal.toFixed(2)), grand_total:Number((subtotal+taxTotal).toFixed(2)), watermark_text:'CC MOTOCRAFTS', created_by:auth.user.id };
  const saved = await supabase(env, 'invoices', { method:'POST', headers:{prefer:'return=representation'}, body:JSON.stringify(invoice) });
  if (!saved.ok) return json({ error:'Invoice could not be saved', detail:await saved.text() }, 502);
  return json({ ok:true, invoice:(await saved.json())[0] }, 201);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    let response;
    try {
      if (url.pathname === '/api/health' && request.method === 'GET') response = json({ ok:true, service:'cc-motocrafts-api', timestamp:new Date().toISOString() });
      else if (['/api/bookings','/api/booking'].includes(url.pathname) && request.method === 'POST') response = await handleBooking(request, env);
      else if (url.pathname === '/api/access-requests' && request.method === 'POST') response = await handleAccessRequest(request, env);
      else if (url.pathname === '/api/tracking/otp/request' && request.method === 'POST') response = await handleOtpRequest(request, env);
      else if (url.pathname === '/api/tracking/otp/verify' && request.method === 'POST') response = await handleOtpVerify(request, env);
      else if (url.pathname.startsWith('/api/tracking/') && request.method === 'GET') response = await handleTracking(request, env, decodeURIComponent(url.pathname.split('/').pop()));
      else if (url.pathname === '/api/diagnostics' && request.method === 'POST') response = await handleDiagnostic(request, env);
      else if (url.pathname === '/api/partner/summary' && request.method === 'GET') response = await handlePartnerSummary(request, env);
      else if (url.pathname === '/api/partner/invoices' && request.method === 'POST') response = await handlePartnerInvoice(request, env);
      else if (url.pathname === '/api/admin/overview' && request.method === 'GET') response = await handleAdminOverview(request, env);
      else response = json({ error:'Not found' }, 404);
    } catch (e) { response = json({ error:'Unexpected server error', request_id:crypto.randomUUID() }, 500); }
    const headers = new Headers(response.headers);
    for (const [k,v] of Object.entries(cors)) headers.set(k,v);
    return new Response(response.body, { status:response.status, headers });
  }
};
