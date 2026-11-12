# CC Motocrafts AI Engine Labs Service — Production Repository (100cc–2500cc Two-Wheeler Platform)

**Official Website:** `https://ccmotocrafts.in`  
**Official Business Email:** `info@ccmotocrafts.in` *(All legacy `aisupport.on@gmail.com` references removed)*  
**Official Business WhatsApp & Helpline:** `+91 8333084261` *(All legacy `+91 8333007351` references removed)*  
**Configured Supabase Publishable Key:** `sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I`

---

## 1. Root-Cause Audit: Why Old `ccmotocrafts.in` Had Booking, Supabase & Google Ranking Issues

1. **Wrong & Conflicting Contact Numbers / Email on Live Site:**
   - The old live site had `+91 8333007351` hardcoded in the Customer Care / Management WhatsApp section and legacy `aisupport.on@gmail.com` references, causing customer inquiries and confirmations to go to the wrong destination.
   - **Fixed:** Every header, booking form, popup pass, AI assistant, partner job card, and footer now routes strictly to **`+91 8333084261`** and **`info@ccmotocrafts.in`**.

2. **Why Supabase Bookings Were Failing (`sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I`):**
   - Your key `sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I` is a Supabase Publishable API Key. However, a Supabase REST call requires **three things** together:
     1. The **Publishable Key** (`sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I`) — now pre-configured in `assets/js/supabase-config.js` and `cloudflare-worker/wrangler.toml`.
     2. Your **Supabase Project URL** (`https://YOUR_PROJECT_ID.supabase.co`) — you can paste this directly inside **`admin.html` → Section 1 (Database & API Key Configuration)** or in `assets/js/supabase-config.js`.
     3. **Row-Level Security (RLS) `INSERT` and `SELECT` Policies** for public bookings — without an `ANON / PUBLIC INSERT` policy on `public.bookings`, Supabase rejects browser bookings with `401 / 403 RLS error`.
   - **Fixed:** Run `supabase/schema_and_rls.sql` in your Supabase SQL Editor to create all 8 tables (`customers`, `vehicles`, `service_pricing`, `partner_garages`, `active_sessions`, `bookings`, `job_cards`, `audit_logs`), RLS policies, and storage buckets without losing existing data (`CREATE TABLE IF NOT EXISTS`). Furthermore, the frontend now includes an **instant local fallback + WhatsApp dispatch**, so even if Supabase is offline, **zero customer bookings are ever lost**.

3. **Hidden `.trashed-*` Portfolio Image Filenames Breaking GitHub Upload:**
   - Out of 25 images in your portfolio ZIP, 23 were named `.trashed-1796648326-IMG-...jpg`. Because files starting with a dot (`.`) are treated as hidden system files on Linux/GitHub/Cloudflare, drag-and-dropping them in the browser skipped them or broke image links, and the 3.7 MB PNG certificate slowed mobile loading.
   - **Fixed:** All 25 images are renamed to clean, SEO-friendly filenames inside `assets/images/` and compressed for fast mobile loading.

4. **Google & Chrome Top-1 Ranking Blockers:**
   - The old site lacked `MotorcycleRepair` JSON-LD Schema markup for your 8 VIP Hyderabad PIN codes, lacked `sitemap.xml` and `robots.txt`, and had an unlinked Google Review state.
   - **Fixed:** Full `MotorcycleRepair` JSON-LD schema, hyper-local keywords for all 3 VIP clusters (`500033, 500034, 500096, 500032, 500075, 500089, 500081, 500084`), `sitemap.xml`, `robots.txt`, and `CNAME` are now built-in.

---

## 2. How to Drag-and-Drop to GitHub & Go Live Today (3 Minutes)

1. **Unzip** `CC_Motocrafts_AI_Engine_Labs_Production_Ready.zip` on your computer or phone.
2. Open your GitHub repository for `ccmotocrafts.in` → click **Add file** → **Upload files**.
3. **Drag and drop** all extracted files and folders (`index.html`, `admin.html`, `partner.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `assets/`, `supabase/`, `cloudflare-worker/`) directly into GitHub and click **Commit changes**.
4. Open **Supabase Dashboard → SQL Editor**, paste the contents of `supabase/schema_and_rls.sql`, and click **Run**.
5. Open `https://ccmotocrafts.in/admin.html`, paste your `https://YOUR_PROJECT_ID.supabase.co` URL into Section 1, and click **Save & Connect Supabase**.

---

## 3. Complete Image Placement Map (All 25 Uploaded Files Used)

- **Brand Logo (Header, Footer, Favicon, OpenGraph):**
  - `assets/images/logo-cc-crafts-3d.jpg` *(from `IMG-20261109-WA0005.jpg`)*
- **Master Technician Certificate Section (`#certificate-sec`):**
  - `assets/images/certificate-master-technician.jpg` *(from `IMG_20261110_024412.png` — Mr. Shaik Mujahid Qadri)*
- **Hero Showcase & VIP Flatbed Fleet Grid (5 Visuals):**
  - `assets/images/hero-ecu-dyno-tuning.jpg` *(Performance Tuning & ECU Remapping)*
  - `assets/images/hero-mobile-pickup-van.jpg` *(Mobile Diagnostic Flatbed Van Unit-01)*
  - `assets/images/hero-zero-damage-van-interior.jpg` *(Zero-Damage Transport Protocol)*
  - `assets/images/hero-doorstep-inspection.jpg` *(Step 01: Doorstep Tablet Inspection)*
  - `assets/images/hero-ai-hud-telemetry.jpg` *(Live AI HUD Telemetry)*
- **Filterable 100cc–2500cc Workshop Portfolio Showcase (`#portfolio-sec` — 18 Visuals):**
  - `portfolio-superbike-inline4-rebuild.jpg`, `portfolio-ducati-trellis-rebuild.jpg`, `portfolio-aprilia-superbike-overhaul.jpg`, `portfolio-kawasaki-z900-exhaust.jpg`, `portfolio-cylinder-head-valve-care.jpg`, `portfolio-crankcase-precision-assembly.jpg`, `portfolio-fi-ecu-troubleshooting.jpg`, `portfolio-adventure-obd-scan.jpg`, `portfolio-bmw-g310r-diagnostics.jpg`, `portfolio-himalayan-suspension-forks.jpg`, `portfolio-royal-enfield-general.jpg`, `portfolio-cruiser-brake-service.jpg`, `portfolio-commuter-sport-red.jpg`, `portfolio-clutch-transmission-bay.jpg`, `portfolio-retro-electrical-wiring.jpg`, `portfolio-scooter-vespa-yellow.jpg`, `portfolio-scooter-cvt-drivetrain.jpg`, `portfolio-scooter-vespa-red.jpg`.
