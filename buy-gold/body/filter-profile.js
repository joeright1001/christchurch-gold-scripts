/**
 * FILTER PROFILE MANAGER
 *
 * This file is used to manage custom filter options (Shortcuts) and is shared with 
 * Desktop and Mobile.
 * 
 * SHORTCUTS: These are UI-triggered filter groups that toggle multiple checkboxes 
 * and can perform special actions (like moving specific products to the top).
 * 
 * NOTE: This is separate from URL-based profile filtering (url-filter-handler.js), 
 * which is triggered by URL parameters rather than UI interactions.
 */
window.FILTER_SHORTCUTS = {
  // Hottest In-Stock shortcut
  checkbox_hot: {
    filters: ['checkbox_in_stock', 'checkbox_live_mint'],
    priorityProduct: '1-kg-silver'
  }
  // Add future shared shortcut groups here
};
