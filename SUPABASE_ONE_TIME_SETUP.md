# Supabase one-time setup

For exact copy/paste instructions, see `docs/SUPABASE_COPY_PASTE_GUIDE.md`. For a new project, use the root file `SUPABASE_ONE_TIME_ALL_IN_ONE.sql`. If migrations 0001 and 0002 were already applied, run only migration 0003. Do not rerun the all-in-one SQL on an existing installation.

# CC Motocrafts — Supabase one-time setup

This bundle uses `public.bookings` as the canonical table. Migration `0002` also creates a compatibility view named `public.bike_bookings`; do not create a second independent bookings table. All public booking writes must go through the Cloudflare Worker. Never expose `SUPABASE_SERVICE_ROLE_KEY` in HTML, JavaScript, Git, or `runtime-config.json`.

## A. Run SQL in this order

1. Supabase Dashboard → correct project → SQL Editor → New query.
2. Paste and run the complete file `supabase/migrations/0001_master_schema.sql`.
3. Paste and run the complete file `supabase/migrations/0002_booking_routing_ads.sql`.
4. Confirm these objects exist: `bookings`, `bike_bookings` (view), `garages`, `memberships`, `partner_service_areas`, `job_cards`, `job_card_updates`, `invoices`, `otp_challenges`.
5. Confirm RLS is enabled on all tenant tables and that there are no anon read policies for bookings, customers, garages, invoices, or OTP records.

Do not rerun or replace the project if these tables already contain live records. The migrations are additive; take a Supabase backup/export before applying them to an existing production database.

## B. Add the 12 garages once

1. Create each verified garage in `public.garages` with its real display name, phone, email, service divisions, and `status='active'` only after approval.
2. Create an Auth user for each garage owner/technician. Add the correct `public.memberships` row linking that user to exactly one `garage_id`, with the least-privilege role and `status='active'`.
3. Insert one `partner_service_areas` row for every six-digit PIN that garage really services. If two garages cover one PIN, use a lower `priority` number for the preferred garage.
4. Never invent garage phone numbers, coverage PINs, or partner IDs. Use the supplied partner roster and confirm every PIN with the garage.
5. Test two partner accounts: Partner A must not see Partner B bookings, invoices, job cards, or customer records.

Template SQL (replace every placeholder with verified values):

```sql
insert into public.partner_service_areas (garage_id, pincode, priority, is_active)
values
  ('<VERIFIED_GARAGE_UUID>', '500089', 10, true);
```

## C. Configure Cloudflare Worker secrets once

From the project directory, run `npm install`, then set secrets using `npx wrangler secret put NAME`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `SUPABASE_ANON_KEY`
- `TOKEN_SIGNING_SECRET` (unique random value, 32+ bytes)
- `OTP_PEPPER` (different unique random value, 32+ bytes)

Set Worker vars in `wrangler.toml` or the Cloudflare dashboard:

- `ALLOWED_ORIGINS=https://ccmotocrafts.in,https://www.ccmotocrafts.in`
- `BUSINESS_ALERT_EMAIL=info@ccmotocrafts.in`
- `BUSINESS_WHATSAPP=+918333084261`

Optional notifications require provider setup: `RESEND_API_KEY` and verified `MAIL_FROM`; Twilio `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` and approved WhatsApp sender/templates/recipient opt-in. WhatsApp notifications are not live just because a phone number is entered.

## D. Deploy and test

1. `npm run check`
2. `npm test`
3. `npx wrangler deploy`
4. Confirm `GET https://ccmotocrafts.in/api/health` returns `{ "ok": true }` after routing is configured.
5. Submit one test booking using the website. Confirm one row in `public.bookings`, a generated job ID, correct normalized six-digit PIN, and either the correct assigned `garage_id` or the central queue when no PIN route exists.
6. Confirm the API response lists notification channel outcomes. A saved booking remains saved even if an optional notification provider is not configured; do not tell the customer a WhatsApp/email was sent unless provider response confirms it.
7. Submit the same `request_key` again. The API should return the existing booking instead of creating a duplicate.
8. Test both `/api/bookings` and legacy `/api/booking` routes.

## E. Protect existing services

Keep Hostinger nameservers, MX, SPF, DKIM, DMARC, and the `info@ccmotocrafts.in` mailbox unchanged. Do not replace the production site until the above checks pass. This archive cannot apply SQL to your account or deploy the Worker without your authenticated Supabase/Cloudflare dashboard actions.
