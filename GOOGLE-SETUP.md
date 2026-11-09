# Google setup for ccmotocrafts.in

## 1. Before anything
- Site live on https://ccmotocrafts.in (see README.md). Google cannot rank a page it cannot open.
- Search Console: add the domain, verify, submit https://ccmotocrafts.in/sitemap.xml. Paste the verification code in the 4 html files (PASTE_SEARCH_CONSOLE_CODE).
- Analytics: create a GA4 property, paste the G- ID in config.js. In GA4 > Admin > Events, mark booking_submit as a key event (your conversion).

## 2. Google Maps (Business Profile)
- Same name everywhere: CC Motocrafts AI Engine Labs Service. Same phone: +91 83330 84261. Website: https://ccmotocrafts.in
- Category: Motorcycle repair shop. Add services (general service, engine work, scooter service, pickup and drop), service areas (the 12 areas), photos, hours.
- Ask every happy customer for a review. Reply to every review.
- Maps clicks, calls and direction requests show in Business Profile > Performance.

## 3. Google Ads: one campaign per zone, each to its own page
Link format (keeps keyword and area in your booking data):
https://ccmotocrafts.in/PAGE.html?utm_source=google&utm_medium=cpc&utm_campaign=ZONE&utm_term={keyword}
- Zone 1 page jubilee-banjara-film-nagar.html: "bike service jubilee hills", "bike service banjara hills", "bike service film nagar", "royal enfield service jubilee hills", "superbike service hyderabad", "bike pickup and drop service banjara hills"
- Zone 2 page gachibowli-financial-district-kokapet.html: "bike service gachibowli", "bike service financial district", "bike service kokapet", "bike service narsingi", "bike pickup and drop gachibowli", "bike engine repair gachibowli"
- Zone 3 page hitech-city-madhapur-kondapur.html: "bike service madhapur", "bike service hitech city", "bike service kondapur", "scooter service madhapur", "bike pickup and drop kondapur", "activa service hitech city"
- Negative keywords: free, cheap, job, jobs, course, training, spare parts shop, second hand, buy, sale, showroom, accessories
- Targeting: only the pincodes in each zone. Ad hours: when you can answer WhatsApp. Start with the budget in your 90-day plan.

## 4. Where to see what
| Question | Look here |
|---|---|
| How many visit, from Chrome or mobile, from which city | GA4 > Reports > Tech and Acquisition |
| Which Google searches find me | Search Console > Performance (queries, pages, clicks) |
| Who finds me on Maps, calls, directions | Business Profile > Performance |
| Which ad keyword and area gave a booking | Supabase bookings table: columns source, campaign, keyword, landing |
| Button clicks | GA4 events: brand_select, pincode_check, booking_submit, whatsapp_click, call_click, review_submit |

## 5. Weekly check (10 minutes)
Open the four places above, note visits, bookings, calls. Send me the numbers or screenshots and I will tell you what to change. I cannot log in to your Google accounts, so I only see what you share.
