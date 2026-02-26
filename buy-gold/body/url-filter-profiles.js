/**
 * URL Filter Profiles Configuration
 * 
 * Defines shortcut profiles for URL filtering.
 * Usage: ?filter=profile-name
 * 
 * Each profile maps to:
 * - filters: Array of checkbox IDs to activate
 * - sort: (Optional) Sort type to apply (e.g., 'value', 'lowest-price', 'lowest-weight')
 */
window.FILTER_PROFILES = {
  // Silver Profiles
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default'
  },
  'all-silver-by-oz': {
    filters: ['checkbox_silver'],
    sort: 'value' // Sort by weight (low to high)
  },
  'all-silver-instock': {
    filters: ['checkbox_silver', 'checkbox_in_stock'],
    sort: 'default'
  },

  // Example Profiles (Placeholders)
  'profile1': {
    filters: ['checkbox_gold', 'checkbox_1oz'],
    sort: 'value' // Best Value per Oz
  },
  'profile2': {
    filters: ['checkbox_gold', 'checkbox_cast_bar'],
    sort: 'lowest-price'
  },
  'profile3-10': {
    filters: ['checkbox_silver', 'checkbox_coin', 'checkbox_in_stock'],
    sort: 'latest' // Latest Year
  }
};
