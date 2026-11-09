export const json = (data, status = 200, extraHeaders = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extraHeaders }
});

export function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || env.PUBLIC_ORIGIN || 'https://ccmotocrafts.in').split(',').map(x => x.trim());
  const accepted = allowed.includes(origin) ? origin : allowed[0];
  return {
    'access-control-allow-origin': accepted,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'authorization,content-type,x-tracking-token',
    'access-control-max-age': '86400',
    'vary': 'Origin'
  };
}

export function validateBooking(input) {
  const errors = [];
  const aliases = { customer_name: input?.customer_name ?? input?.name, customer_phone: input?.customer_phone ?? input?.phone, vehicle_model: input?.vehicle_model ?? input?.model, vehicle_reg: input?.vehicle_reg ?? input?.registration_number, service_package: input?.service_package ?? input?.complaint, pincode: input?.pincode };
  const required = ['customer_name', 'customer_phone', 'vehicle_model', 'vehicle_reg', 'service_package', 'pincode'];
  for (const key of required) if (!String(aliases[key] ?? '').trim()) errors.push(`${key} is required`);
  if (input?.division && !['2W', '4W'].includes(input.division)) errors.push('division must be 2W or 4W');
  if (input?.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customer_email)) errors.push('customer_email is invalid');
  if (input?.customer_phone && !/^\+?[0-9 ()-]{8,18}$/.test(input.customer_phone)) errors.push('customer_phone is invalid');
  if (input?.pincode && !/^\d{6}$/.test(String(input.pincode).match(/\d{6}/)?.[0] || '')) errors.push('pincode must contain a 6-digit PIN');
  if (String(input?.customer_name || '').length > 120) errors.push('customer_name is too long');
  if (String(input?.customer_notes || '').length > 3000) errors.push('customer_notes is too long');
  return errors;
}

export function normalizeBooking(input) {
  const aliases = { customer_name: input.customer_name ?? input.name, customer_phone: input.customer_phone ?? input.phone, customer_email: input.customer_email ?? input.email, vehicle_reg: input.vehicle_reg ?? input.registration_number, vehicle_model: input.vehicle_model ?? input.model, service_package: input.service_package ?? input.complaint, customer_notes: input.customer_notes ?? input.complaint, vehicle_class: input.vehicle_class ?? input.brand, machinery_spec: input.machinery_spec ?? (input.engine_cc ? `${input.engine_cc} CC` : undefined), area: input.area, landmark: input.landmark, customer_source: input.customer_source ?? 'website', gclid: input.gclid, gbraid: input.gbraid, wbraid: input.wbraid, idempotency_key: input.request_key ?? input.job_id };
  const allowed = ['division','customer_name','customer_phone','customer_email','vehicle_reg','vehicle_class','vehicle_model','custom_vehicle_name','service_package','machinery_spec','pincode','pickup_fee','preferred_date','preferred_slot','customer_notes','gps_lat','gps_lng','google_maps_link','area','landmark','customer_source','gclid','gbraid','wbraid','idempotency_key','customer_whatsapp_opt_in','customer_email_opt_in','location_capture_method','pickup_requested'];
  const out = {};
  for (const key of allowed) { const value = input[key] ?? aliases[key]; if (value !== undefined && value !== null && value !== '') out[key] = value; }
  out.pincode = String(input.pincode || '').match(/\d{6}/)?.[0] || '';
  if (out.idempotency_key) out.idempotency_key = String(out.idempotency_key).slice(0,120);
  out.division ??= '2W';
  out.status = 'request_received';
  out.job_id = `CC-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  return out;
}

export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join('');
}

export function randomOtp() {
  const a = new Uint32Array(1); crypto.getRandomValues(a);
  return String(a[0] % 1000000).padStart(6, '0');
}

export function htmlEscape(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
