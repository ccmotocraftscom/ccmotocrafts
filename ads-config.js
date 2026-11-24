// ============================================================================
// CC MOTOCRAFTS (2W) & CARS CARES MOTOCRAFTS (4W) — TRACKING & BACKEND CONFIG
// Paste your Google Ads Conversion Label on Line 9 below (from Google Ads ->
// Goals -> Conversions -> Event snippet -> 'AW-18345537681/YOUR_CONVERSION_LABEL')
// ============================================================================
window.CCM_LIVE_CONFIG = {
  GOOGLE_ADS_ID: "AW-18345537681",
  GOOGLE_ADS_CONVERSION_LABEL: "YOUR_CONVERSION_LABEL",
  GTM_ID: "GTM-57JRWFN3",
  SUPABASE_URL: "https://xrrlbqxbgxmetrwgiwvk.supabase.co",
  SUPABASE_FALLBACK_URL: "https://mnwrebfyappibbnrkjct.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__tSqrIUKNrSttvdG0PLk3g_4CnXeKw0"
};

window.getGoogleAdsSendTo = function () {
  var c = window.CCM_LIVE_CONFIG || {};
  var id = c.GOOGLE_ADS_ID || "AW-18345537681";
  var label = String(c.GOOGLE_ADS_CONVERSION_LABEL || "").trim();
  if (label && label !== "YOUR_CONVERSION_LABEL") {
    return id + "/" + label;
  }
  return id;
};
