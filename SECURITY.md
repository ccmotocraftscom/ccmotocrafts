# Security model

- No static partner/customer master password exists in client source. Supplied passcodes such as `cc105` and `cc1005` are not treated as authentication credentials.
- Supabase Auth manages user identity. Platform administrator status is read from trusted Auth `app_metadata` or active memberships; users must not be allowed to set this themselves.
- Garage membership and PostgreSQL RLS enforce tenant boundaries. The service-role key is used only by the Cloudflare Worker and bypasses RLS, so every Worker route using it must validate input and scope queries by verified user/garage.
- Public endpoints do not permit arbitrary database reads. Customer tracking requires registered booking details, OTP verification, a hashed OTP record, attempt limit, expiry and a signed short-lived tracking token.
- Internal notes and technician-only records are not returned to customer tracking endpoints.
- Use Cloudflare WAF/rate limiting, log redaction, least privilege, periodic secret rotation, database backups and restore drills before production.
- Never show fake “system check” messages implying a code was sent when no provider confirms delivery. A pending request is clearly labelled pending.
