# CC Motocrafts International Master Platform

A production-oriented full-stack foundation using the supplied existing CC Motocrafts website as the customer-facing base, Cloudflare Workers for server-side APIs, and Supabase PostgreSQL/Auth for persistence and identity.

## Included

- Existing 743 KB HTML website preserved at `frontend/index.html` (with the embedded fake Supabase sample key removed and direct browser-to-database booking write replaced by the Worker API call).
- Customer job tracking portal with OTP request/verify and short-lived signed tracking token.
- Partner portal with Supabase password sign-in, garage-scoped job list, and technical AI request UI.
- Admin portal shell and authenticated operations overview API.
- Public booking and access-request APIs (both `/api/bookings` and legacy `/api/booking` supported), PIN-based partner routing, and server-confirmed Google Ads/GTM conversion event.
- Partner invoice creation API with server-side totals.
- Optional email (Resend) and SMS/WhatsApp (Twilio) delivery adapters. Successful booking writes trigger owner emails to aisupport.on@gmail.com and info@ccmotocrafts.in when Resend is configured.
- Optional server-side AI diagnostic adapter.
- Supabase schema migrations 0001 + 0002 + 0003 with multi-tenant RLS, PIN-based partner routing, idempotency, click-attribution fields, customer notification consent, parts-approval evidence fields, `bike_bookings` compatibility view and backend-only OTP storage.
- Homepage quick-booking panel with mobile-first fields, manual PIN routing, optional GPS capture, optional customer email/WhatsApp consent, and spare-parts approval policy.
- Node test suite and deployment documentation.

## Important current integration status

This is a deployable application foundation, not a claim that third-party accounts are already connected. You must configure your own Supabase project, Cloudflare Worker secrets, email/SMS/WhatsApp provider credentials, and AI provider credentials. No passwords, service-role keys, or permanent master passcodes are embedded in browser code. The customer OTP endpoint only reports a channel as sent when the configured provider returns success.

The original website had a permissive sample SQL policy that allowed anonymous reads of all bookings and a fake sample API key. Those browser-side credentials and permissive SQL snippet were neutralized. Use the secure migration in `supabase/migrations/0001_master_schema.sql`; do not reuse the old public-read policy.

## Local checks

Requirements: Node.js 20+.

```bash
npm install
npm run check
npm test
```

## Deployment

Follow `docs/SUPABASE_COPY_PASTE_GUIDE.md`, `docs/GOOGLE_ADS_SETUP.md`, then `docs/DEPLOYMENT.md` in order. For a new project use `SUPABASE_ONE_TIME_ALL_IN_ONE.sql`; for a project that already ran migrations 0001 and 0002, run only migration 0003. Keep Hostinger mail hosting and existing MX records unchanged. Cloudflare Pages custom-domain activation may require DNS records, but do not change nameservers or MX records as part of this project. Review only the web A/AAAA/CNAME records required by your Cloudflare Pages setup.


## Contact configuration (locked in this package)
- WhatsApp: +91 8333084261 (`+918333084261`)
- Email: info@ccmotocrafts.in

## Business notifications\n\nSet `RESEND_API_KEY` and `MAIL_FROM` as Cloudflare Worker secrets. The Worker sends each successful booking notification to both addresses in `BUSINESS_ALERT_EMAILS`. Delivery is provider-dependent; without valid Resend credentials, the booking is still saved but email delivery is reported as not configured.\n\n## Job-card creation
Apply migration `0004_auto_create_job_cards.sql` after migrations 0001–0003. It creates a starter `job_cards` row in the same database transaction as each new booking insert.
