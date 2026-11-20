/**
 * Popular order comes from the CMS, with the highest positive number first.
 * Empty legacy priority lists prevent the mobile stock button overriding it.
 */
window.CUSTOM_FILTER_PROFILES = {
  mobileInStockPriority: [],
  hotFilterSequence: []
};

// Runs before the filter and sort managers capture their default/reset order.
document.addEventListener('DOMContentLoaded', function() {
  // Keep the pasted head configuration aligned with the existing Popular button.
  if (window.FILTER_CONFIG && window.FILTER_CONFIG.rules) {
    window.FILTER_CONFIG.rules.checkbox_hot = window.FILTER_CONFIG.rules.checkbox_popular;
  }

  const grid = document.querySelector('.w-dyn-items.w-row');
  if (!grid) return;

  const rank = item => {
    const data = item.querySelector('.product-data');
    const value = Number(data && data.getAttribute('data-popular'));
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
  const items = Array.from(grid.children).filter(item => item.classList.contains('w-dyn-item'));
  // Equal scores and unranked products keep their CMS order.
  items.sort((a, b) => rank(b) - rank(a));
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(item));
  grid.appendChild(fragment);
});
