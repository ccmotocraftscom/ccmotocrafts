# Application routes

| URL path | Purpose | Access |
|---|---|---|
| `/` | Existing CC Motocrafts customer website | Public |
| `/portals/customer.html` | Customer OTP verification and job-card status | Booking match + OTP |
| `/portals/partner.html` | Partner garage workspace and technical AI | Supabase Auth + active garage membership |
| `/portals/admin.html` | Master operations overview | Supabase Auth + trusted platform-admin app metadata |
| `/api/health` | Worker health check | Public |
| `/api/bookings` | Create booking request | Public, validated, rate-limit at edge |
| `/api/access-requests` | Request partner/tracking access | Public, pending review |
| `/api/tracking/otp/request` | Request tracking OTP | Registered booking details |
| `/api/tracking/otp/verify` | Verify OTP and issue short-lived token | OTP challenge |
| `/api/tracking/:jobId` | Customer-visible job updates | Signed tracking token |
| `/api/partner/summary` | List assigned garage bookings | Authenticated garage membership |
| `/api/partner/invoices` | Create invoice draft | Authenticated garage membership |
| `/api/admin/overview` | Access requests and recent bookings | Platform administrator |
| `/api/diagnostics` | Technical AI assistant endpoint | Provider key configured |

If the Worker uses a separate hostname, configure `CC_API_BASE` in `portal.js` (or replace its default) and set exact allowed origins in Worker configuration.
