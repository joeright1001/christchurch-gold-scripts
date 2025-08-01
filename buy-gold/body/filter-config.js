// Global configuration and utilities
// ==================== FILTER CONFIGURATION ====================
window.FILTER_CONFIG = {
  // Desktop checkbox IDs (all filters now use checkbox format)
  buttons: {
    checkbox_5g: 'checkbox_5g',
    checkbox_10g: 'checkbox_10g',
    checkbox_20g: 'checkbox_20g',
    checkbox_1_10oz: 'checkbox_1-10oz',
    checkbox_1_20oz: 'checkbox_1-20oz',
    checkbox_1_4oz: 'checkbox_1-4oz',
    checkbox_1_2oz: 'checkbox_1-2oz',
    checkbox_1oz: 'checkbox_1oz',
    checkbox_2oz: 'checkbox_2oz',
    checkbox_5oz: 'checkbox_5oz',
    checkbox_10oz: 'checkbox_10oz',
    checkbox_1kg: 'checkbox_1kg',
    checkbox_canada: 'checkbox_canada',
    checkbox_perth: 'checkbox_perth',
    checkbox_royal: 'checkbox_royal',
    checkbox_pamp: 'checkbox_pamp',
    checkbox_african: 'checkbox_african',
    checkbox_highland: 'checkbox_highland',
    checkbox_investor: 'checkbox_investor',
    checkbox_collectables: 'checkbox_collectables',
    checkbox_gold: 'checkbox_gold',
    checkbox_silver: 'checkbox_silver',
    checkbox_in_stock: 'checkbox_in-stock',
    checkbox_live_mint: 'checkbox_live-mint',
    checkbox_popular: 'checkbox_popular',
    checkbox_dealer: 'checkbox_dealer',
    checkbox_starter: 'checkbox_starter',
    checkbox_coin: 'checkbox_coin',
    checkbox_minted_bar: 'checkbox_minted_bar',
    checkbox_cast_bar: 'checkbox_cast_bar'
  },
  
  // Clear all filters button
  clearButton: 'clear-filter',
  
  // Filter rules - defines how each filter works
  rules: {
    checkbox_5g: {
      attribute: 'data-size',
      values: ['5g']
    },
    checkbox_10g: {
      attribute: 'data-size',
      values: ['10g']
    },
    checkbox_20g: {
      attribute: 'data-size',
      values: ['20g']
    },
    checkbox_1_10oz: {
      attribute: 'data-size',
      values: ['1-10oz']
    },
    checkbox_1_20oz: {
      attribute: 'data-size',
      values: ['1-20oz']
    },
    checkbox_1_4oz: {
      attribute: 'data-size',
      values: ['1-4oz']
    },
    checkbox_1_2oz: {
      attribute: 'data-size',
      values: ['1-2oz']
    },
    checkbox_1oz: {
      attribute: 'data-size',
      values: ['1oz']
    },
    checkbox_2oz: {
      attribute: 'data-size',
      values: ['2oz']
    },
    checkbox_5oz: {
      attribute: 'data-size',
      values: ['5oz']
    },
    checkbox_10oz: {
      attribute: 'data-size',
      values: ['10oz']
    },
    checkbox_1kg: {
      attribute: 'data-size',
      values: ['1kg']
    },
    checkbox_canada: {
      attribute: 'data-mint',
      values: ['The Royal Canadian Mint']
    },
    checkbox_perth: {
      attribute: 'data-mint',
      values: ['The Perth Mint']
    },
    checkbox_royal: {
      attribute: 'data-mint',
      values: ['The Royal Mint']
    },
    checkbox_pamp: {
      attribute: 'data-mint',
      values: ['PAMP Sussie']
    },
    checkbox_african: {
      attribute: 'data-mint',
      values: ['South African Mint']
    },
    checkbox_highland: {
      attribute: 'data-mint',
      values: ['The Highland Mint']
    },
    checkbox_investor: {
      attribute: 'data-product-type',
      values: ['investor']
    },
    checkbox_collectables: {
      attribute: 'data-product-type',
      values: ['collectable']
    },
    checkbox_gold: {
      attribute: 'data-metal',
      values: ['gold']
    },
    checkbox_silver: {
      attribute: 'data-metal',
      values: ['silver']
    },
    checkbox_in_stock: {
      attribute: 'data-stock-status',
      values: ['in-stock']
    },
    checkbox_live_mint: {
      attribute: 'data-stock-status',
      values: ['live-at-the-mint']
    },
    checkbox_popular: {
      attribute: 'data-popular',
      specialHandling: true
    },
    checkbox_dealer: {
      specialHandling: 'dealer'
    },
    checkbox_starter: {
      attribute: 'data-getting-started',
      specialHandling: true
    },
    checkbox_coin: {
      attribute: 'data-type',
      values: ['coin', 'all']
    },
    checkbox_minted_bar: {
      attribute: 'data-type',
      values: ['minted-bar', 'all']
    },
    checkbox_cast_bar: {
      attribute: 'data-type',
      values: ['cast-bar', 'all']
    }
  }
};
