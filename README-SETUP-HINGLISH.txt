CC MOTOCRAFTS | SCHEMA-MATCHED ADMIN + MY ORDER PACKAGE
Build date: 31 October 2026

WHAT YOUR SUPABASE EXPORT SHOWED
- bike_bookings: id, booking_id, customer_name, phone, email, vehicle_brand, bike_model, reg_number, vehicle_class, engine_cc, service_type, area, booking_date, time_slot, complaint_note, address, landmark, status, odometer_km, service_date, engine_warranty_status, warranty_parts_covered, warranty_void_rule, pickup_zone_type, pickup_charge, cancellation_penalty, total_dispatch_fee, vehicle_displacement_class, rating, feedback.
- booking_status_events: UUID id, booking_code, old_status, new_status, changed_by, change_note, created_at.
- customer_reviews: consent + moderation fields are present.
- platform_issues: private issue-tracking fields are present.
- ai_chat_audit_logs: contains customer speech/input and AI diagnosis text; must not be publicly readable.
- Your four exported policies included public SELECT USING true on bike_bookings and ai_chat_audit_logs. This allowed unrestricted public reads. Both public read policies are dropped by schema-security.sql. Public AI audit INSERT is also removed.

PACKAGE CONTENTS
- index.html: customer website; booking form now maps to the exact bike_bookings columns you supplied.
- admin.html: private admin login; calls database function ccm_is_admin(), loads actual column names, updates booking status and appends booking_status_events; invoice/print includes the exact 30-day guarantee text.
- my-order.html: customer email OTP sign-in; retrieves only records whose email matches the verified Supabase Auth email, plus their status history; shows warranty text.
- schema-security.sql: schema-matched RLS hardening + admin allow-list + guarantee fields + admin settings. It preserves existing booking rows.
- config.js: browser publishable key only; never put service_role/secret keys here.
- config.example.js: example configuration.
- _headers / _redirects / PWA assets / partner registration page.

IMPORTANT SECURITY CHANGE
The old policy rows Allow public read on bike_bookings and Allow public log reads on ai_chat_audit_logs were unsafe because qual= true. Migration drops these exact policies. The public booking INSERT is retained for the existing public booking form, with basic name/phone checks. Add Cloudflare Turnstile and server-side rate limiting before accepting public production traffic. Public AI audit inserts are disabled in the browser; a secure server-side endpoint is not included.

HOW TO APPLY SAFELY
1. Back up your Supabase project and current deployed website first.
2. Open schema-security.sql and review it. Run it in Supabase SQL Editor as project owner. Do not run twice in parallel.
3. Run the policy verification query from the deployment checklist. Confirm no remaining public SELECT policy with USING true exists on private tables.
4. In Supabase Authentication, create/confirm the owner user info@ccmotocrafts.in, use a strong unique password, enable MFA, and confirm email. The SQL inserts this email into ccm_admin_allowlist. Do not share owner login with garages/partners.
5. In Authentication URL Configuration, add the exact preview URL and /my-order.html redirect URL. Enable email OTP/magic link.
6. In Database > Publications, enable Realtime for public.bike_bookings if the live admin refresh is required.
7. Upload the extracted folder to a Cloudflare Pages PREVIEW deployment. Do not replace production first.
8. Test a dummy booking using a customer test email. Confirm it appears in bike_bookings with the mapped columns and a generated id.
9. Open /admin.html; sign in as the allow-listed owner. Confirm admin can read/update. Confirm a non-admin authenticated user is denied.
10. Open /my-order.html; request email link for the same test email. Confirm only that email's bookings appear. Test another customer's email and confirm no cross-account data is returned.
11. Update a booking status in admin. Confirm matching booking_status_events row appears. Print/save invoice as PDF and verify the guarantee wording.
12. Test that logged-out/anonymous requests cannot SELECT bike_bookings, ai_chat_audit_logs, booking_status_events or platform_issues. Confirm approved + consented reviews are the only public review rows.
13. Verify Hostinger email send/receive. Do not change Hostinger MX, SPF, DKIM, DMARC or nameservers as part of this package.
14. Only after every test passes should the preview be promoted to production.

VERIFICATION QUERY
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname='public' order by tablename, policyname;

LIMITATIONS / HONEST STATUS
- The package is schema-matched to the two SQL exports supplied in chat. It has not been executed against your live Supabase project from this chat; I cannot see your project credentials or operate your Cloudflare account.
- Therefore live authentication, RLS enforcement, booking writes, Realtime, OTP email delivery and Hostinger mail delivery are NOT claimed as passed. Run the checklist above with dummy test accounts.
- Email notification destinations are stored in the admin settings table; this browser package does not send email. SMTP credentials must never be put in browser code. A server-side mail function/provider is a separate integration.
- WhatsApp button opens a prefilled message; a human must press Send. It does not auto-send.
- The 30-day wording is a workmanship guarantee for eligible services only, subject to the job card and exclusions. It does not replace or extend the separate engine/parts warranty fields already in your database.
- No existing customer booking rows are deleted by the migration. Review SQL and keep a backup before applying.

HOSTINGER EMAIL SAFETY
This package does not change DNS. When connecting Cloudflare Pages, preserve Hostinger MX/SPF/DKIM/DMARC records and verify mail send/receive afterwards.
