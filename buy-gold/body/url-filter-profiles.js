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
    displayName: 'Currently Only Viewing Silver Products. Click to clear filter'
  },
  'all-silver-by-oz': {
    filters: ['checkbox_silver'],
    sort: 'value', // Sort by weight (low to high)
    displayName: 'Currently viewing Silver sorted by Value. Click to clear'
  },
  'all-silver-instock': {
    filters: ['checkbox_silver', 'checkbox_in_stock'],
    sort: 'default',
    displayName: 'Currently viewing In-Stock Silver. Click to clear'
  },

  // Migrated from handler
  'all-live': {
    filters: ['checkbox_in_stock', 'checkbox_live_mint'],
    sort: 'value',
    displayName: 'Currently viewing In Stock & Live at Mint. Click to clear'
  },

  // Example Profiles (Placeholders)
  'profile1': {
    filters: ['checkbox_gold', 'checkbox_1oz'],
    sort: 'value', // Best Value per Oz
    displayName: 'Currently viewing 1oz Gold Best Value. Click to clear'
  },
  'profile2': {
    filters: ['checkbox_gold', 'checkbox_cast_bar'],
    sort: 'lowest-price',
    displayName: 'Currently viewing Gold Cast Bars. Click to clear'
  },
  'profile3-10': {
    filters: ['checkbox_silver', 'checkbox_coin', 'checkbox_in_stock'],
    sort: 'latest', // Latest Year
    displayName: 'Currently viewing In-Stock Silver Coins. Click to clear'
  }
};
