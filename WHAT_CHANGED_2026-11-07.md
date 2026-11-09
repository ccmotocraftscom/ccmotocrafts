# CC Motocrafts Quick Booking package — 7 November 2026

## Homepage updates
- Kept the existing CC Motocrafts homepage and placed the mobile-first two-wheeler quick booking panel at the top of the home page.
- Required booking inputs: mobile, bike/scooter model, registration number, problem/service and six-digit pickup PIN (PIN is needed for service-area routing).
- Optional browser GPS capture; manual PIN/landmark fallback remains available.
- Added a bold, high-visibility customer protection policy with the exact requested wording: “No spare part replaced without prior WhatsApp photo/video update and customer quotation approval.”
- Added explicit WhatsApp/email notification opt-in controls.

## Booking and attribution
- Browser sends the booking to `/api/bookings`; the Cloudflare Worker validates it and writes to Supabase using the server-side service-role secret.
- GCLID, GBRAID and WBRAID are captured from the landing URL and included with the booking for attribution.
- A Google Tag Manager dataLayer event / gtag event is emitted only after the Worker returns a successful saved booking response.
- The database schema stores attribution IDs and booking idempotency keys.

## Notification and tracking capabilities
- Worker supports business email, partner email/WhatsApp and customer email/WhatsApp notifications when credentials, sender identity, destination and customer opt-in are configured.
- Customer tracking endpoints include OTP verification and signed tracking-token authorization. This is booking-status tracking, not live GPS movement tracking.
- Spare-part approval evidence fields and a database guard prevent marking parts approved without approval method and timestamp.

## Local verification
- `npm run check` passed.
- `npm test` passed: 9/9 tests.
- ZIP integrity check passed after packaging.

## Must be completed in the owner's accounts before campaign launch
- Configure Supabase URL and anon key in the site's runtime config; configure Worker `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets.
- Deploy the Cloudflare Worker and bind the static assets / route `ccmotocrafts.in/*` to it.
- Configure Resend sender/API key and Twilio SMS/WhatsApp credentials; verify WhatsApp template/session rules and customer opt-in.
- Seed only verified active partner garages and PIN service areas.
- Enable Google Ads auto-tagging, configure the actual Google Ads conversion ID/label in GTM, publish the container, and test a real booking end-to-end.
- Run live production checks on the domain. Local tests do not prove account deployment, email/WhatsApp delivery, Google Ads conversion attribution, or pickup dispatch.
