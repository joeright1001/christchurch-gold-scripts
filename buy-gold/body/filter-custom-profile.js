/**
 * Custom Filter Profiles Configuration
 * 
 * Centralized configuration for custom sorting and priority sequences used by the filtering system.
 * Modifying these lists will alter the display order when specific filters or buttons are active.
 */
window.CUSTOM_FILTER_PROFILES = {
  // Sequence of product slugs to prioritize at the very top of the grid 
  // when the mobile "In Stock" (Hottest) button is activated.
  // The first item in this array will be at the very top of the stack.
  mobileInStockPriority: [
    '1-kg-silver'
  ],

  // Sequence of product slugs to prioritize at the very top of the grid
  // when the "Hot" filter checkbox is active.
  // The first item in this array will be at the very top of the stack.
  hotFilterSequence: [
    '5-oz-silver-various-dg',
    '100-oz-silver-lbma-brands-dg',
    '1-kg-silver'
  ]
};
