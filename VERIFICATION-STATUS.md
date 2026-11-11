# Verification status

- Source ZIP archive integrity: checked before repacking.
- Structure: single `CC-Motocrafts-Deployment/` wrapper; `frontend/`, `worker/`, `supabase/`, `wrangler.toml`, and root `package.json` are direct children.
- Portal entry points: `frontend/customer.html`, `frontend/partner.html`, `frontend/admin.html`; shared portal assets remain in `frontend/portals/`.
- Contacts in source/config files: updated to WhatsApp +91 8333084261 and info@ccmotocrafts.in.
- Booking -> job_cards: migration 0004 adds a PostgreSQL AFTER INSERT trigger, creating the job card in the same transaction as the booking insert.
- Worker booking API writes to `public.bookings`; it does not directly POST to `job_cards`. Migration 0004 supplies the atomic database-side creation.
- Not live-verified: Supabase project availability/schema application, Cloudflare Worker deployment/secrets, provider delivery (WhatsApp/email), live domain routing, and authenticated portal workflows.
- Important: the original homepage has legacy sections and simulated/client-side interactions alongside the Worker-backed booking flow. Do not treat every legacy UI feature as a verified backend workflow.

- Local audit update: Worker syntax and all 9 existing Node tests pass after the notification/CORS configuration update.
- CORS allowlist explicitly includes both https://ccmotocrafts.in and https://www.ccmotocrafts.in.
- Booking owner email fan-out targets aisupport.on@gmail.com and info@ccmotocrafts.in; actual delivery still requires valid Resend API key and MAIL_FROM secrets.
- Not implemented/verified in this codebase: remote session kill-switch that forces already-open staff/partner clients into view-only mode, and live dynamic service/pricing CRUD synchronization. These must not be represented as completed features.
- Static asset audit found no local image-file references in the main homepage; it uses embedded/remote presentation assets. This does not prove third-party assets remain available in production.
