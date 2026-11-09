const API = window.CC_API_BASE || '/api';
const $ = id => document.getElementById(id);
const readSession = () => { try { return JSON.parse(sessionStorage.getItem('cc_session') || 'null'); } catch { return null; } };
const saveSession = value => sessionStorage.setItem('cc_session', JSON.stringify(value));
const clearSession = () => sessionStorage.removeItem('cc_session');
async function api(path, options={}) {
  const session = readSession();
  const headers = { 'content-type':'application/json', ...(options.headers||{}) };
  if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
async function signIn() {
  const msg = $('message'); msg.textContent = 'Authenticating…';
  try {
    const cfg = await fetch('/runtime-config.json').then(r=>r.json());
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) throw new Error('Supabase public runtime configuration is not set. Follow deployment instructions.');
    const res = await fetch(`${cfg.supabaseUrl}/auth/v1/token?grant_type=password`, {method:'POST',headers:{apikey:cfg.supabaseAnonKey,'content-type':'application/json'},body:JSON.stringify({email:$('email').value,password:$('password').value})});
    const data = await res.json(); if (!res.ok) throw new Error(data.msg || data.message || 'Sign-in failed');
    saveSession(data); $('loginPanel').classList.add('hidden'); $('dashboard').classList.remove('hidden'); msg.textContent='';
    if ($('jobs')) await loadPartner();
  } catch(e) { msg.textContent=e.message; }
}
async function loadPartner() {
  try { const d=await api('/partner/summary'); $('garageMeta').textContent=`Garage: ${d.garage_id} · Role: ${d.role}`; $('jobs').innerHTML='';
    if(!d.bookings.length) $('jobs').textContent='No jobs assigned to this garage yet.';
    for(const b of d.bookings){const el=document.createElement('article');el.className='job';el.textContent=`${b.job_id} · ${b.vehicle_model} · ${b.status} · ${b.customer_name}`;$('jobs').append(el);}
  } catch(e){$('message').textContent=e.message;}
}
async function signOut(){clearSession();location.reload();}
if($('signIn')) $('signIn').addEventListener('click',signIn);
if($('signOut')) $('signOut').addEventListener('click',signOut);
if($('diagnose')) $('diagnose').addEventListener('click',async()=>{const out=$('diagnosticResult');out.textContent='Analyzing…';try{const d=await api('/diagnostics',{method:'POST',body:JSON.stringify({vehicle:$('vehicle').value,question:$('question').value})});out.textContent=d.answer;}catch(e){out.textContent=e.message;}});
if($('sendOtp')) $('sendOtp').addEventListener('click',async()=>{const m=$('message');m.textContent='Requesting verification…';try{const d=await api('/tracking/otp/request',{method:'POST',body:JSON.stringify({job_id:$('jobId').value.trim(),phone:$('phone').value.trim(),email:$('email').value.trim()})});window.ccChallenge=d.challenge_id;$('otpArea').classList.remove('hidden');m.textContent=`Code delivery status: ${d.channels.map(x=>`${x.name}: ${x.sent?'sent':'not configured'}`).join(', ')}`;}catch(e){m.textContent=e.message;}});
if($('verifyOtp')) $('verifyOtp').addEventListener('click',async()=>{const m=$('message');m.textContent='Verifying…';try{const d=await api('/tracking/otp/verify',{method:'POST',body:JSON.stringify({challenge_id:window.ccChallenge,otp:$('otp').value.trim()})});sessionStorage.setItem('cc_tracking_token',d.tracking_token);const t=await fetch(`${API}/tracking/${encodeURIComponent($('jobId').value.trim())}`,{headers:{'x-tracking-token':d.tracking_token}}).then(r=>r.json());if(!t.booking)throw new Error(t.error||'Could not load job card');$('requestPanel').classList.add('hidden');$('trackingPanel').classList.remove('hidden');$('jobSummary').textContent=`${t.booking.job_id} · ${t.booking.vehicle_model} · ${t.booking.status}`;$('timeline').innerHTML='';for(const u of t.updates){const li=document.createElement('li');li.textContent=`${u.title} — ${u.description||u.status} (${new Date(u.created_at).toLocaleString()})`;$('timeline').append(li);}if(!t.updates.length){const li=document.createElement('li');li.textContent='Your booking has been received. Workshop progress updates will appear here.';$('timeline').append(li);}m.textContent='';}catch(e){m.textContent=e.message;}});
if($('loadAdmin')) $('loadAdmin').addEventListener('click',async()=>{try{$('adminData').textContent=JSON.stringify(await api('/admin/overview'),null,2);}catch(e){$('adminData').textContent=e.message;}});
