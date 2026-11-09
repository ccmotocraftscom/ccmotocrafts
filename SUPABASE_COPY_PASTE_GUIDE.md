# CC Motocrafts — Supabase exact one-time setup (copy/paste guide)

## First identify your situation

- **New/empty Supabase project:** run `SUPABASE_ONE_TIME_ALL_IN_ONE.sql` once in SQL Editor. It contains migrations 0001, 0002 and 0003 in order.
- **Existing project where migrations 0001 and 0002 were already run:** run ONLY `supabase/migrations/0003_quick_booking_customer_notifications_parts_approval.sql`. Do not rerun the all-in-one file: migration 0001 creates enum types and is not intended to be rerun.
- **Unsure what was run:** stop and inspect Database → Tables and SQL Editor history before running anything. Export/backup the project first.

## A. One-time SQL steps

1. Open https://supabase.com/dashboard and select the CC Motocrafts project.
2. Open **SQL Editor → New query**.
3. Open the matching SQL file from this ZIP and copy its entire contents.
4. Paste into SQL Editor and click **Run** once.
5. Check **Table Editor** for `bookings`, `garages`, `memberships`, `partner_service_areas`, `job_cards`, `invoices`, `otp_challenges` and the `bike_bookings` compatibility view.
6. In SQL Editor, verify the new booking consent and parts-approval fields:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('bookings', 'job_cards')
  and column_name in (
    'customer_whatsapp_opt_in', 'customer_email_opt_in',
    'location_capture_method', 'pickup_requested',
    'parts_quote', 'parts_photo_video_url',
    'customer_parts_approved', 'customer_parts_approval_method',
    'customer_parts_approved_at'
  )
order by table_name, column_name;
```

## B. Add your 12 real partner garages

Do not use invented names, UUIDs, phones, emails or PIN codes. Create/approve the garage records first, then add the real service PINs. Each garage must have an Auth user and one active membership tied to its own `garage_id`.

After you have real garage UUIDs and verified PIN codes, paste this template and replace every placeholder:

```sql
insert into public.partner_service_areas (garage_id, pincode, priority, is_active)
values
  ('<GARAGE_1_UUID>', '<VERIFIED_6_DIGIT_PIN>', 10, true),
  ('<GARAGE_2_UUID>', '<VERIFIED_6_DIGIT_PIN>', 20, true)
on conflict (garage_id, pincode)
do update set priority = excluded.priority, is_active = excluded.is_active;
```

Repeat values for all verified PINs across the 12 garages. If multiple garages serve the same PIN, the lower `priority` number is selected first. A PIN with no active match remains in the central dispatch queue; never silently assign it to an unverified garage.

## C. Required security settings

- Keep RLS enabled. The public website must NOT receive anonymous SELECT/INSERT access to booking, customer, invoice, OTP or partner tables.
- Public booking requests go through the Cloudflare Worker `/api/bookings` endpoint. The Worker uses the Supabase service-role key on the server only.
- Never put `SUPABASE_SERVICE_ROLE_KEY`, `TOKEN_SIGNING_SECRET`, `OTP_PEPPER`, Resend or Twilio secrets in HTML, browser JavaScript, `runtime-config.json`, or a public Git repository.
- Create the first owner/admin through Supabase Auth. Assign `app_metadata.platform_role = platform_admin` only server-side; never let a public signup choose this role.
- Test with two different partner users: Partner A must not read Partner B's bookings, job cards or invoices.

## D. Cloudflare Worker secrets (one time)

From the project folder run `npm install`, then set each secret when prompted:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put TOKEN_SIGNING_SECRET
npx wrangler secret put OTP_PEPPER
```

Generate separate random secrets of at least 32 bytes for `TOKEN_SIGNING_SECRET` and `OTP_PEPPER`. Set Worker variables:

```text
ALLOWED_ORIGINS=https://ccmotocrafts.in,https://www.ccmotocrafts.in
BUSINESS_ALERT_EMAIL=info@ccmotocrafts.in
BUSINESS_WHATSAPP=+918333084261
```

For email notifications, configure `RESEND_API_KEY` and `MAIL_FROM` using a sender/domain verified with Resend. For WhatsApp, configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, approved WhatsApp templates where required, and recipient opt-in. A phone number alone does not activate WhatsApp delivery. Keep Hostinger MX, SPF, DKIM, DMARC and nameservers unchanged.

## E. Deploy and test

```bash
npm run check
npm test
npx wrangler deploy
```

Then test `https://ccmotocrafts.in/api/health`, submit a real test booking, and verify exactly one row appears in `public.bookings`. Confirm the returned `job_id`, route result, and each notification channel outcome. Test a second submission with the same request key to confirm duplicate protection. Test both an assigned PIN and a PIN with no partner match.

## F. Customer notification and parts approval behaviour

- The homepage quick form sends a booking request to the Worker. The request is **not a confirmed appointment** until the owner/dispatch team confirms it.
- Customer WhatsApp updates are attempted only when the customer ticks the WhatsApp consent box. Customer email updates are attempted only when the customer supplies an email and ticks email consent.
- Email requires Resend credentials and a verified sender. WhatsApp requires an approved production WhatsApp sender/template and consent. Delivery results are returned by the API; do not claim a message was sent unless the provider reports success.
- Job-card schema stores the proposed parts list, photo/video evidence URL, approval method and approval timestamp. A parts approval cannot be marked true without method and timestamp. The workshop policy displayed on the site is: **no spare part replacement before the customer receives photo/video evidence and an itemized quotation and approves it**.

## G. What is still account-specific

This ZIP cannot log into or change your Supabase or Cloudflare accounts. You must run the SQL, enter the real 12 garage records/PIN coverage, set private secrets, deploy the Worker, configure approved notification providers, and perform live tests. Do not switch production traffic until all acceptance checks pass.
