// CC Motocrafts AI Engine Labs Service — Strict Zero-Waste Google Ads Conversion Config (v44.2)
// Account: 344-054-3047 | Base Tag: AW-18345537681
// INSTRUCTIONS: Replace PASTE_YOUR_CONVERSION_LABEL_HERE on Line 8 with your Google Ads Conversion Label.
window.CC_ADS_CONFIG = {
  ADS_ID: 'AW-18345537681',
  GTM_ID: 'GTM-57JRWFN3',
  // Paste ONLY the label after 'AW-18345537681/' below:
  CONVERSION_LABEL: 'PASTE_YOUR_CONVERSION_LABEL_HERE',
  fireVerifiedConversion: function (bookingId, mode, valueInr, urlToken) {
    try {
      if (!bookingId || !urlToken || typeof window.gtag !== 'function') return false;
      var label = String(this.CONVERSION_LABEL || '').trim();
      if (!label || label.indexOf('PASTE_') === 0) return false;
      var verifiedId = sessionStorage.getItem('cc_verified_booking_id');
      var verifiedToken = sessionStorage.getItem('cc_verified_booking_token');
      if (verifiedId !== bookingId || !verifiedToken || verifiedToken !== urlToken) return false;
      var dedupeKey = 'cc_conv_fired_' + bookingId;
      if (sessionStorage.getItem(dedupeKey) === '1') return false;
      window.gtag('event', 'conversion', {
        send_to: this.ADS_ID + '/' + label,
        value: Number(valueInr || (mode === '4w' ? 1499 : 499)),
        currency: 'INR',
        transaction_id: bookingId
      });
      sessionStorage.setItem(dedupeKey, '1');
      sessionStorage.removeItem('cc_verified_booking_token');
      return true;
    } catch (err) {
      return false;
    }
  }
};
