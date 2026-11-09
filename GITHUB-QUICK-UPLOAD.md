# GitHub upload — CC Motocrafts

## Upload
1. Create an empty GitHub repository.
2. Open the repository's **Add file → Upload files** page.
3. Upload the CONTENTS of this project folder, including hidden files such as `.gitignore`.
4. Keep the supplied folder paths intact. `worker/src`, `worker/test`, `frontend/public`, and `supabase/migrations` are required paths used by Wrangler, tests, the static site, and the SQL setup. Flattening these folders would break the build.
5. Commit the upload.

## Local checks already run
- `npm run check` — passed.
- `npm test` — 9 tests passed.

## Before deployment
- Follow `docs/SUPABASE_COPY_PASTE_GUIDE.md` and `docs/DEPLOYMENT.md`.
- Configure Cloudflare Worker secrets privately; do not commit `.env`, `.dev.vars`, service-role keys, signing secrets, or provider tokens.
- Set `frontend/public/runtime-config.json` with the correct Supabase project URL and public anon/publishable key only.
- Run `npx wrangler deploy` from the repository root after Cloudflare authentication and secrets are configured.
- Verify `/api/health` and submit a test booking before directing campaign traffic.

## Important
This ZIP is a cleaned upload package, not a live deployment. Cloudflare and Supabase account actions, credentials, partner onboarding, notification provider setup, and production acceptance tests still require account-owner access.
