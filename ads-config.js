// CC Motocrafts Ai Engine Labs Service (2W) & CarS CareS Motocrafts Ai Engine Labs Service (4W)
// Google Ads Account: 344-054-3047 | Base Tag: AW-18345537681 | GTM: GTM-57JRWFN3
// LIVE CONVERSION TARGET: AW-18345537681/5Aa6CO-tyr8dEJHh6qtE (Book appointment)
window.CC_ADS_CONFIG = {
  ADS_ID: 'AW-18345537681',
  GTM_ID: 'GTM-57JRWFN3',
  // Paste ONLY the label after 'AW-18345537681/' below:
  CONVERSION_LABEL: '5Aa6CO-tyr8dEJHh6qtE',
  // Keep false so gtag fires conversion ONCE cleanly (avoids GTM + gtag double-firing):
  USE_GTM_ONLY: false,
  fireVerifiedConversion: function (bookingId, mode, valueInr, urlToken) {
    try {
      if (!bookingId || !urlToken) return false;
      var verifiedId = sessionStorage.getItem('cc_verified_booking_id');
      var verifiedToken = sessionStorage.getItem('cc_verified_booking_token');
      if (verifiedId !== bookingId || !verifiedToken || verifiedToken !== urlToken) return false;
      var dedupeKey = 'cc_conv_fired_' + bookingId;
      if (sessionStorage.getItem(dedupeKey) === '1') return false;

      var modeUpper = String(mode || '').toLowerCase() === '4w' ? '4W' : '2W';
      var val = Number(valueInr || (modeUpper === '4W' ? 1499 : 499));
      var label = String(this.CONVERSION_LABEL || '').trim();

      // Always push structured verified event to GTM-57JRWFN3 dataLayer (1 time per Booking ID)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cc_verified_booking_confirmed',
        booking_id: bookingId,
        service_mode: modeUpper,
        value: val,
        currency: 'INR',
        transaction_id: bookingId
      });

      // Fire Google Ads AW-18345537681 conversion directly ONCE when label is configured
      if (!this.USE_GTM_ONLY && typeof window.gtag === 'function' && label && label.indexOf('PASTE_') !== 0) {
        window.gtag('event', 'conversion', {
          send_to: this.ADS_ID + '/' + label,
          value: val,
          currency: 'INR',
          transaction_id: bookingId,
          service_mode: modeUpper
        });
      }

      sessionStorage.setItem(dedupeKey, '1');
      sessionStorage.removeItem('cc_verified_booking_token');
      return true;
    } catch (err) {
      return false;
    }
  }
};
