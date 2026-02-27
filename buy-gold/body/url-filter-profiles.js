/**
 * URL Filter Profiles Configuration
 * 
 * Defines shortcut profiles for URL filtering.
 * Usage: ?filter=profile-name
 * 
 * Each profile maps to:
 * - filters: Array of checkbox IDs to activate
 * - products: (Optional) Array of product slugs to show (whitelist). If present, only these products are shown.
 * - sort: (Optional) Sort type to apply (e.g., 'value', 'lowest-price', 'lowest-weight')
 * - displayName: Text to display on the mobile "Clear Filter" button AND the desktop notification banner.
 */
window.FILTER_PROFILES = {
  // Silver Profiles
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default',
    displayName: 'Only Viewing Silver Products. Click to clear filter'
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
    filters: ['checkbox_gold', 'checkbox_1oz', 'checkbox_silver, checkbox_1kg'],
    sort: 'value', // Best Value per Oz
    displayName: 'Filtered view showing best value 1oz Gold, Silver and 1kg. Click to clear'
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
  },

  // Specific Product Selection Example
  'example-specific-products': {
    products: ['1-oz-silver', '1-oz-gold-cast-bar'], // Replace with actual slugs
    sort: 'default',
    displayName: 'Viewing Specific Selection. Click to clear'
  },

  // Test Profile: 1oz Gold and 1oz Silver
  'test-1oz-gold-silver': {
    products: ['1-oz-gold', '1-oz-silver'],
    sort: 'default',
    displayName: 'Viewing 1oz Gold & Silver. Click to clear'
  },

  // Silver Investor Profile
  'silver-investor': {
    products: [
      '1-oz-silver',
      '1-oz-silver-maple-leaf-2026',
      '10-oz-silver-various-dg',
      '1-kg-silver-various-dg',
      '5-oz-silver-various-dg',
      '1-kg-silver-perth-kookaburra-various',
      '1-kg-silver-perth-koala-various',
      '250-gram-silver-various-dg'
    ],
    sort: 'value',
    displayName: 'Recommended silver investment. Click to clear filter.'
  },

  // Gold Investor Profile
  'gold-investor': {
    products: [
      '1-oz-gold-kangaroo-various',
      '1-oz-gold-maple-leaf-2026',
      '1-oz-gold-perth-cast-bar',
      '1-oz-gold'
    ],
    sort: 'value',
    displayName: 'Recommended gold investment. Click to clear filter.'
  }
};
