import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBooking, normalizeBooking, hmacHex, safeEqual, randomOtp } from '../src/lib.js';
import worker from '../src/index.js';

test('booking validator rejects missing required fields', () => {
  assert.ok(validateBooking({}).length >= 5);
});

test('booking validator accepts a valid 2W request and rejects invalid division', () => {
  const base = { customer_name:'Test Customer', customer_phone:'+919876543210', vehicle_model:'Test Bike', vehicle_reg:'TS09AB1234', service_package:'General service', pincode:'500089', division:'2W' };
  assert.deepEqual(validateBooking(base), []);
  assert.ok(validateBooking({ ...base, division:'truck' }).some(x=>x.includes('division')));
});

test('normalizer strips non-PIN text and generates a server-side job reference', () => {
  const row = normalizeBooking({ customer_name:'A', pincode:'500089 (VIP area)', division:'2W' });
  assert.equal(row.pincode, '500089');
  assert.match(row.job_id, /^CC-\d{8}-[A-F0-9]{8}$/);
  assert.equal(row.status, 'request_received');
  const extended = normalizeBooking({ customer_name:'B', pincode:'500089 (VIP)', area:'Gachibowli', landmark:'Metro', job_id:'client-request-123', complaint:'Engine noise', registration_number:'TS09AB1234' });
  assert.equal(extended.area, 'Gachibowli');
  assert.equal(extended.landmark, 'Metro');
  assert.equal(extended.idempotency_key, 'client-request-123');
  assert.equal(extended.pincode, '500089');
});

test('HMAC and constant-time comparison helper work', async () => {
  const a = await hmacHex('test-secret','payload');
  const b = await hmacHex('test-secret','payload');
  assert.equal(a,b);
  assert.equal(safeEqual(a,b),true);
  assert.equal(safeEqual(a,'0'.repeat(a.length)),false);
});

test('OTP is six numeric digits', () => assert.match(randomOtp(), /^\d{6}$/));

test('health endpoint responds without external credentials', async () => {
  const req = new Request('https://example.workers.dev/api/health');
  const res = await worker.fetch(req, { PUBLIC_ORIGIN:'https://ccmotocrafts.in' });
  assert.equal(res.status,200);
  const data = await res.json();
  assert.equal(data.ok,true);
});

test('public booking endpoint rejects invalid payload before database access', async () => {
  const req = new Request('https://example.workers.dev/api/bookings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})});
  const res = await worker.fetch(req, { PUBLIC_ORIGIN:'https://ccmotocrafts.in' });
  assert.equal(res.status,400);
});


test('legacy singular booking endpoint is supported and validates before database access', async () => {
  const req = new Request('https://example.workers.dev/api/booking',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})});
  const res = await worker.fetch(req, { PUBLIC_ORIGIN:'https://ccmotocrafts.in' });
  assert.equal(res.status,400);
});


test('normalizer preserves explicit notification consent and GPS capture metadata', async () => {
  const booking = normalizeBooking({
    customer_name: 'Website Customer', customer_phone: '9876543210', vehicle_model: 'Honda Activa',
    vehicle_reg: 'TS09AB1234', service_package: 'General service', pincode: '500081',
    customer_whatsapp_opt_in: true, customer_email_opt_in: false, location_capture_method: 'browser_gps', pickup_requested: true
  });
  assert.equal(booking.customer_whatsapp_opt_in, true);
  assert.equal(booking.customer_email_opt_in, false);
  assert.equal(booking.location_capture_method, 'browser_gps');
  assert.equal(booking.pickup_requested, true);
});
