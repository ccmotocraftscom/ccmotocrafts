# GitHub upload (mobile or desktop)

1. Extract this ZIP once. It creates one folder: `CC-Motocrafts-Deployment`.
2. Open that folder. Select its contents (`frontend`, `worker`, `supabase`, `wrangler.toml`, `package.json`, etc.) and upload those contents to the GitHub repository root. Do not upload an extra parent folder inside another folder.
3. For Cloudflare Pages, set the build output directory to `frontend` (static site; no build command required for this source).
4. Deploy the Worker separately using Wrangler from the repository root. Configure secrets from `.env.example` in Cloudflare Worker settings; never commit actual secrets.
5. Apply Supabase migrations 0001 through 0004 in order. If the project is inactive, reactivate it before running migrations or live tests.
6. Test `/api/health`, then submit a test booking and verify both `public.bookings` and `public.job_cards`, then test OTP/tracking, partner, admin and AI diagnostics with configured providers/accounts.

GitHub upload alone does not deploy the Worker or run Supabase migrations.
