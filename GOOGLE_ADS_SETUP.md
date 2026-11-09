# Google Ads lead tracking — one-time configuration

The website now pushes `cc_booking_submit_success` only after `/api/bookings` returns a successful saved booking. It does not fire on button clicks, validation errors, or failed database writes. The event contains a transaction ID only; it does not send name, phone, email, vehicle registration, or other personal data to Google tags.

## Configure once

1. In Google Tag Manager, create a **Custom Event** trigger named `CE - CC Booking Saved` with event name exactly `cc_booking_submit_success`.
2. Create a Google Ads Conversion Tracking tag using the conversion ID and conversion label from the Google Ads conversion action. Fire it only on `CE - CC Booking Saved`.
3. Add a Conversion Linker tag firing on all pages.
4. Publish the GTM container. If using the Google tag directly instead of GTM, install the official Google tag on all pages and configure the matching conversion event. Do not install both duplicate conversion implementations.
5. In Google Ads, use the website booking conversion as the primary action for bidding only after test conversions appear and attribution is verified. Keep Google-hosted lead form submissions as a separate conversion action if that form is still active.
6. In Goals > Conversions, set counting to **One** for lead actions, use an appropriate click-through window, and mark duplicate/legacy actions secondary or remove them only after confirming they are not used by another campaign.
7. Test with Tag Assistant and a real test booking. Confirm: no conversion on page view/click, one conversion after a successful saved booking, and no conversion when the API/database fails.

## Important

- Do not invent or paste a guessed `AW-...` ID or conversion label. Obtain the exact values from the existing Google Ads conversion action.
- Google Ads spend cannot be guaranteed to be zero while a campaign is enabled. Use campaign budget limits, Hyderabad-only location targeting, relevant search terms, and negative keywords to control waste.
- Store `gclid`, `gbraid`, and `wbraid` from the landing-page URL with the booking for later attribution/CRM matching. Do not upload offline conversions until consent, conversion action settings, and the required Google Ads API/upload method are configured.
