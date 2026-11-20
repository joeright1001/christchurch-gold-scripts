/**
 * Initial display and Default/reset preserve the order supplied by the CMS.
 * Empty legacy priority lists prevent the mobile stock button overriding it.
 */
window.CUSTOM_FILTER_PROFILES = {
  mobileInStockPriority: [],
  hotFilterSequence: []
};

// Keep the existing Popular control wired correctly without moving any cards on load.
document.addEventListener('DOMContentLoaded', function() {
  // Keep the pasted head configuration aligned with the existing Popular button.
  if (window.FILTER_CONFIG && window.FILTER_CONFIG.rules) {
    window.FILTER_CONFIG.rules.checkbox_hot = window.FILTER_CONFIG.rules.checkbox_popular;
  }
});
