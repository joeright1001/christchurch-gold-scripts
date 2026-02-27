/**
 * URL Filter Profiles Configuration
 * 
 * Defines shortcut profiles for URL filtering.
 * Usage: ?filter=profile-name
 * 
 * Each profile maps to:
 * - filters: Array of checkbox IDs to activate
 * - sort: (Optional) Sort type to apply (e.g., 'value', 'lowest-price', 'lowest-weight')
 * - displayName: Text to display on the mobile "Clear Filter" button
 */
window.FILTER_PROFILES = {
  // Silver Profiles
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default',
    displayName: 'Silver'
  },
  'all-silver-by-oz': {
    filters: ['checkbox_silver'],
    sort: 'value', // Sort by weight (low to high)
    displayName: 'Silver sorted by Value'
  },
  'all-silver-instock': {
    filters: ['checkbox_silver', 'checkbox_in_stock'],
    sort: 'default',
    displayName: 'In-Stock Silver'
  },

  // Migrated from handler
  'all-live': {
    filters: ['checkbox_in_stock', 'checkbox_live_mint'],
    sort: 'value',
    displayName: 'In Stock & Live at Mint'
  },

  // Example Profiles (Placeholders)
  'profile1': {
    filters: ['checkbox_gold', 'checkbox_1oz'],
    sort: 'value', // Best Value per Oz
    displayName: '1oz Gold Best Value'
  },
  'profile2': {
    filters: ['checkbox_gold', 'checkbox_cast_bar'],
    sort: 'lowest-price',
    displayName: 'Gold Cast Bars'
  },
  'profile3-10': {
    filters: ['checkbox_silver', 'checkbox_coin', 'checkbox_in_stock'],
    sort: 'latest', // Latest Year
    displayName: 'In-Stock Silver Coins'
  }
};
