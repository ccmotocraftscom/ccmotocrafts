# CC Motocrafts — Website Problem & Upgrade Log

Project: CC Motocrafts | AI Engine Labs  
Domain: https://ccmotocrafts.in  
Current package baseline: CC_Motocrafts_App_Logo_Integrated_27_Oct_2026.zip  
Record created: 27 October 2026

## How to report a problem
Send a message to the project owner/assistant with:
1. Page or feature (booking, My Bookings, AI diagnostics, reviews, logo/app install, mobile layout, etc.)
2. What you tapped/entered, step by step
3. What you expected to happen
4. What actually happened / exact error text
5. Phone/browser and approximate time
6. Screenshot or short screen recording if possible

Do not include customer passwords, OTPs, payment card details, or other sensitive information. For a booking issue, mask most of the customer's phone number and registration number in screenshots.

## Issue register
| ID | Report date | Area | Problem / reproduction steps | Expected | Actual | Priority | Status | Fix/build | Retest result |
|---|---|---|---|---|---|---|---|---|---|
| CM-001 | 27 Oct 2026 | My Bookings / database | Frontend currently assumes `bike_bookings` has `phone`, `registration_number`, `customer_hidden`, and `submitted_at`. Live table schema and access policies have not been verified. | Authenticated customer sees only their own booking history. | Not verified against live Supabase; do not treat as production-tested. | Critical | Open — verify schema and secure access before relying on it | Pending | Not tested |
| CM-002 | 27 Oct 2026 | Google Reviews | Exact Google Business Profile review URL was not supplied; button currently opens a Google Maps search, not a direct review form. | Customer reaches the correct business profile/review flow. | Direct listing/review destination not verified. | Medium | Open — replace with exact official review link when provided | Pending | Not tested |
| CM-003 | 27 Oct 2026 | Booking / notifications | Live booking insert, email confirmation, and WhatsApp dispatch have not been end-to-end tested. | Booking is saved and customer/business receives the intended confirmation. | Not verified live. | Critical | Open — test with a safe test booking | Pending | Not tested |
| CM-004 | 27 Oct 2026 | App logo / PWA | Latest package includes logo assets, app icons, favicon and manifest. | New icon appears after deployment and re-install/update on device. | Package files included; live deployment and phone icon change not verified. | Medium | Package prepared; deployment pending | App Logo Integrated 27 Oct 2026 | Not tested on live site/device |

## Update rules
- Add each new report as a new issue ID; do not erase old reports.
- Prioritize booking/data privacy and lost booking reports as Critical.
- Back up the current live files before deployment; test in `/preview/` first where possible.
- Preserve Hostinger email DNS/MX settings; do not change them for website-only fixes.
- A fix is not marked Done until the specific steps are retested. Keep separate labels for “code changed”, “ZIP checked”, and “live test passed”.
- Do not claim live deployment, database integration, email delivery, WhatsApp delivery, or app installation succeeded unless it was actually verified.

## Current test status
- ZIP archive structure: checked when packaged.
- Logo/app icon assets: included in package.
- Live hosting deployment: not confirmed.
- Live Supabase schema/RLS and customer privacy: not verified.
- Real booking, email, WhatsApp, Google review and mobile install end-to-end tests: not verified.


## CM-005 — Under Review / Customer Feedback (29 Oct 2026)
- Code change: review section heading updated to “UNDER REVIEW • CUSTOMER CARE”; all 1–5 ratings remain selectable; private WhatsApp support remains available for any rating.
- Google destination: currently a Google search URL, not a verified direct review form. Exact Google Business Profile review URL still required.
- Live website, Supabase feedback persistence, WhatsApp delivery, and Google review destination: NOT verified.
