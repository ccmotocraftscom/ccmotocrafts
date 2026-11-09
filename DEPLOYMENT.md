# Deployment and launch runbook

## 0. Safety and backup

1. Keep a dated backup of the current Hostinger `public_html` before changing any DNS or website files.
2. Do not change Hostinger nameservers, MX records, SPF, DKIM, or DMARC records for this deployment.
3. The package does not contain real provider credentials. Never paste a Supabase service-role key, Twilio token, or AI key into HTML, Git, or `runtime-config.json`.

## 1. Supabase project

1. Open the Supabase project you intend to use and confirm it is the correct project.
2. Follow `docs/SUPABASE_COPY_PASTE_GUIDE.md`. New project: run `SUPABASE_ONE_TIME_ALL_IN_ONE.sql` once. Existing project with 0001+0002 already applied: run only migration 0003. See the guide for the 12-garage PIN routing setup.
3. In Authentication > URL Configuration, add the production portal URLs and local development URL.
4. Create the first platform administrator using Supabase Auth. Set the user's **app_metadata** (not user_metadata) server-side to `{ "platform_role": "platform_admin" }`. Do not allow users to self-assign this role.
5. Create each garage row and an active `memberships` row for each approved partner user. Set the membership `garage_id`, `user_id`, and least-privilege role. A partner must only be assigned to its own garage.
6. Check RLS using two test garage users. Each must be unable to read the other's bookings, invoices, job cards, or diagnostic records.

The migration intentionally grants no anonymous table access. Public booking, access requests, and OTP writes go through the Cloudflare Worker using its server-only service-role secret.

## 2. Cloudflare Worker

1. Create a Worker named `cc-motocrafts-api` or deploy this repository with Wrangler.
2. Set Worker secrets:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put TOKEN_SIGNING_SECRET
npx wrangler secret put OTP_PEPPER
```

Generate separate random secrets (at least 32 bytes) for `TOKEN_SIGNING_SECRET` and `OTP_PEPPER`.

3. Optional email delivery: configure `RESEND_API_KEY`, `MAIL_FROM`, and `BUSINESS_ALERT_EMAIL`. Verify the sending domain with the transactional email provider. This does not require changing Hostinger MX records. Keep the existing Hostinger mailbox for normal inbound/outbound business email.
4. Optional SMS/WhatsApp: configure Twilio account secrets and sender IDs. WhatsApp requires an approved WhatsApp Business sender/template and recipient opt-in; the sample sandbox sender is not production-ready.
5. Optional AI: configure `OPENAI_API_KEY` and a model available to your account. The diagnostic endpoint returns a clear unavailable response when not configured.
6. Restrict `ALLOWED_ORIGINS` to your exact website origin(s). Configure Cloudflare WAF/rate-limiting rules for `/api/bookings`, `/api/access-requests`, and `/api/tracking/otp/*`. Use bot protection and request-size limits.
7. Deploy and test `GET /api/health`.

## 3. Frontend / Cloudflare Pages

1. Set the Pages project root to `frontend/public` if serving the static website directly, and deploy the contents of that directory.
2. Replace `frontend/public/runtime-config.json` with your Supabase project URL and public anon/publishable key. This public key is designed for browser use and is safe only because RLS is enabled. Never put the service-role key here.
3. Set `CC_API_BASE` to the Worker API base if the Worker is on a separate hostname. If the Worker is routed under the same site as `/api/*`, leave the default `/api`.
4. Confirm the portal routes:
   - `/portals/partner.html`
   - `/portals/customer.html`
   - `/portals/admin.html`
5. Test on mobile and desktop. The original homepage is preserved, but legacy modules outside the new Worker-backed booking path may still require integration work before launch.

## 4. Hostinger email and DNS protection

- Keep Hostinger Email as the mailbox provider for `info@ccmotocrafts.in`.
- Do not replace MX records or change nameservers.
- Cloudflare Pages custom-domain setup may request web DNS records. Add only the specific web records instructed by Cloudflare, after recording current DNS values. Do not proxy or edit MX records.
- Transactional email in this package uses an optional HTTP email provider (Resend) because Cloudflare Workers do not provide direct SMTP socket access. You can use a transactional sender on a verified subdomain while keeping the Hostinger mailbox untouched.

## 5. Acceptance test checklist

- [ ] Homepage loads without console errors on Android Chrome and desktop.
- [ ] A test booking is saved in Supabase and receives a unique job ID.
- [ ] A booking request is not described as confirmed until an admin/garage confirms it.
- [ ] Partner A cannot see Partner B data (test direct API and direct Supabase queries).
- [ ] Customer OTP is delivered through at least one configured provider and expires after five minutes.
- [ ] Five incorrect OTP attempts lock the challenge.
- [ ] Tracking token expires after 15 minutes and cannot open another booking.
- [ ] Customer sees only customer-visible job updates; internal notes remain private.
- [ ] Invoice totals are calculated server-side and GST is shown only for a registered garage with validated GSTIN.
- [ ] AI diagnostic answers include safety caveats and do not invent OEM torque/pinout data.
- [ ] Hostinger `info@ccmotocrafts.in` can send and receive mail before and after web deployment.
- [ ] MX, SPF, DKIM and DMARC records remain intact.

## 6. Google Ads conversion setup

Follow `GOOGLE_ADS_SETUP.md`. The frontend emits `cc_booking_submit_success` only after the Worker confirms a saved booking. Add the real Google Ads conversion ID/label in GTM; no placeholder or guessed ID is embedded.

## 7. Current limitations requiring operational setup

- Real-time camera streaming requires a separate secure WebRTC/RTSP gateway, camera hardware, per-job authorization, and privacy controls. This package deliberately does not fake a live feed.
- SMS/WhatsApp OTP depends on provider credentials, approved templates, and user consent.
- Partner onboarding and role assignment are administrator-controlled database operations at this stage; self-service password elevation is not provided.
- Diagnostic photo/audio analysis and OEM service-data licensing need additional storage, upload scanning, model support, and validated reference data before being advertised as available.
- Warranty terms must be reviewed by the business/legal advisor and displayed as written terms accepted by the customer; the AI should explain them, not independently void a warranty.
- GST invoices require correct GSTIN, place-of-supply, tax split, HSN/SAC, invoice numbering and statutory review. The UI/API foundation does not replace accounting compliance review.
