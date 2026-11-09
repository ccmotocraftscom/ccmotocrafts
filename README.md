# CC Motocrafts AI Engine Labs Service
1. GitHub: new repository, drag and drop ALL files and the images folder. Commit.
2. Settings > Pages > Branch main, folder / (root). Tick Enforce HTTPS.
3. Domain: A records for ccmotocrafts.in to 185.199.108.153, .109.153, .110.153, .111.153 and CNAME www to YOUR-GITHUB-USERNAME.github.io.
4. Supabase: SQL Editor, paste supabase.sql, Run.
5. Open config.js (the ONLY file to edit): SUPABASE_URL is already filled; paste GA_ID. Replace PASTE_SEARCH_CONSOLE_CODE in the 4 html files. Submit sitemap.xml in Search Console.
6. After each service, in Supabase Table Editor > bookings, fill that row: status (new, pickup, inspection, quoted, approved, repair, ready, delivered), service_km, serviced_at, work_done, labour_charge, parts_charge. Customers see it in Track my bike with booking code + mobile.
7. Reminders: SQL Editor: select * from due_reminders where next_service_date <= current_date + 7;
Photos, logo, certificate are in images/ (replace with same file name). Brand logos: see images/brands/README.txt. Google setup, keywords and tracking: GOOGLE-SETUP.md.
After updating from an older version, run supabase.sql again (adds photo storage and marketing columns).
