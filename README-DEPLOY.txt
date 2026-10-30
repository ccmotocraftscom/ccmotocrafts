CC MOTOCRAFTS — NETLIFY DEPLOY PACKAGE

CONTENTS
- index.html: latest available portal update (Oct 25 build)
- partner-register.html: partner registration page
- manifest.json, sw.js, app icons: PWA support (updated using the supplied CC Motocrafts logo)
- robots.txt, sitemap.xml: basic crawl metadata
- _redirects, netlify.toml: Netlify routing configuration

DEPLOY
1. Extract this ZIP on your device/computer.
2. In Netlify, open your site > Deploys. Drag the extracted folder contents (not the ZIP file itself, if the UI requests a folder) into the manual deploy area, or connect your Git repository and use publish directory ".".
3. Test the Netlify *.netlify.app URL first on desktop and mobile.
4. Only after testing, configure the custom domain. Keep Hostinger MX/email DNS records unchanged; do not replace nameservers or mail records just to point the website. Follow Netlify's exact DNS instructions for website records only.
5. If the domain currently serves Hostinger, do not switch the live website until the preview works and you have a copy of the current public_html files.

IMPORTANT VERIFICATION LIMITS
- This ZIP was integrity-checked locally. The live website has NOT been deployed or tested from this package.
- Supabase schema, RLS policies, Netlify Forms delivery, customer email delivery, WhatsApp dispatch, booking creation, and My Bookings visibility need live end-to-end testing.
- A WhatsApp link opens a prefilled draft; it does not automatically send a message.
- Customer record lookup/hiding should be protected by phone OTP or equivalent authentication and server-side authorization. Do not expose staff PINs or service-role keys in frontend code.
- VIP PIN-code matching is not proof of an exact 20 km radius. Confirm service coverage manually/geographically before promising free pickup.
- Dispatch ETA is an estimate and must depend on confirmed technician availability.
- The package uses the latest available index.html from the previous portal-update build; it is not a fresh rewrite of any source file uploaded in this turn.


THIS UPDATE
- Updated 192px and 512px PWA icons from the supplied CC Motocrafts logo.
- Changed service-worker cache version so browsers can refresh the app shell after deployment.
- My Bookings now tries common phone-column names and does not immediately fail only because customer_hidden is absent.
- This fallback is a diagnostic compatibility measure, not proof that the live Supabase schema/RLS is correct. If the table uses different column names, or SELECT access is denied, the database still needs a schema/policy correction.
- Do NOT create a public SELECT policy exposing every customer booking. Phone-only lookup is not secure authentication; use OTP/customer auth plus server-side authorization before public production.
- Local package integrity and JavaScript syntax checks are performed separately; no live Supabase write/read, email delivery, WhatsApp send, or deployment is claimed.


REVIEW + MY BOOKINGS UPGRADE (27 Oct 2026)
- Review CTA opens a Google Maps search for CC Motocrafts; this is not an exact direct-review URL. Replace with the verified Google Business Profile review link when available. Customers must submit their own Google review.
- My Bookings UI now includes vehicle registration as an optional second check, but mobile number remains required. Confirm the actual Supabase column names and RLS policies before production. For proper security, add OTP/authenticated backend verification; do not expose customer history based on vehicle number alone.
- This ZIP has not been end-to-end tested against the live Supabase project.


Problem tracking: see WEBSITE-ISSUE-UPGRADE-LOG.md. Add reports there and only mark a fix done after retesting. Live deployment and integrations must be verified separately.


RELEASE STATUS (29 OCT 2026)
See RELEASE-AND-BACKEND-VERIFICATION-STATUS.txt. This is a release candidate, not a live-verified production release. Preview and backend verification are required before replacing the live site or starting a campaign.
