# Additive Checkbox Filtering Implementation Plan

## Overview
The goal is to migrate the existing single-select filter options (Type, Weight, Mint, Metal) to an additive (multi-select) approach, similar to the recent changes made for the Stock filters ("In Stock" and "Live at the Mint"). This will allow users to select multiple options within the same filter category (e.g., selecting both "1oz" and "2oz" weights) and see products that match *any* of the selected options within that category.

## Current Behavior
Currently, the filtering system enforces single-selection for most filter groups through the `exclusiveGroups` configuration in `buy-gold/head/filter-config.js`. When a user clicks a filter, any other active filter in the same group is automatically deactivated. 

Furthermore, the filtering logic in `buy-gold/body/filter-manager.js` (`shouldShowProduct` method) uses strict AND logic across all active filters. If multiple filters were somehow active for the same attribute (e.g., `data-size`), a product would have to match *all* of them simultaneously, which is impossible for a single product, resulting in no products being shown.

## Proposed Solution

To implement additive filtering, we need to make changes in two main areas:

### 1. Configuration Update (`buy-gold/head/filter-config.js`)
We need to remove the exclusivity constraints for the standard filter groups so that users can select multiple checkboxes simultaneously.

**Changes:**
- Remove `type`, `weight`, `mint`, and `metal` arrays from the `exclusiveGroups` object.
- Keep `main_category` as an exclusive group, as these represent distinct views/sorts (Popular, Starter, Investor, Dealer, Collectables) that logically conflict if combined.

### 2. Filtering Logic Update (`buy-gold/body/filter-manager.js`)
We need to update the `shouldShowProduct` method to handle multiple active filters for the same attribute using OR logic, while maintaining AND logic across different attributes.

**Changes:**
- Group all active standard filters by their target attribute (e.g., `data-size`, `data-mint`).
- For each attribute group that has active filters, check if the product's attribute value matches *at least one* of the active filters in that group (OR logic).
- If the product fails to match any active filter within an attribute group, hide the product.
- The product must satisfy the conditions for *all* active attribute groups (AND logic across groups).
- Retain the existing special handling for Stock filters (which already use OR logic) and special category filters (Popular, Starter, Dealer).

## Step-by-Step Implementation Guide

### Step 1: Update `filter-config.js`
Modify `window.FILTER_CONFIG.exclusiveGroups` to remove the standard filter groups:

```javascript
  // Defines groups where only one filter can be active at a time
  exclusiveGroups: {
    // Removed type, weight, mint, and metal to allow additive selection
    main_category: [
      'checkbox_popular',
      'checkbox_starter',
      'checkbox_investor',
      'checkbox_dealer',
      'checkbox_collectables'
    ]
  }
```

### Step 2: Update `filter-manager.js`
Replace the `shouldShowProduct` method in the `FilterManager` class with the following logic:

```javascript
    shouldShowProduct(dataElement) {
      const activeFilters = Object.entries(this.filterStates).filter(([_, isActive]) => isActive);
      if (activeFilters.length === 0) return true;

      // Special handling for dealer filter
      if (this.filterStates.checkbox_dealer) {
        return false;
      }

      // Handle Stock Filters (Additive / OR logic)
      const inStockActive = this.filterStates.checkbox_in_stock;
      const liveMintActive = this.filterStates.checkbox_live_mint;

      if (inStockActive || liveMintActive) {
        const stockStatus = dataElement.getAttribute('data-stock-status');
        let stockMatch = false;

        if (inStockActive && stockStatus === 'in-stock') {
          stockMatch = true;
        }
        if (liveMintActive && stockStatus === 'live-at-the-mint') {
          stockMatch = true;
        }

        if (!stockMatch) {
          return false;
        }
      }

      // Group standard active filters by attribute
      const activeFiltersByAttribute = {};
      let popularActive = false;
      let starterActive = false;

      for (const [filterName, isActive] of activeFilters) {
        if (!isActive) continue;

        // Skip stock filters as they are handled above
        if (filterName === 'checkbox_in_stock' || filterName === 'checkbox_live_mint') {
          continue;
        }

        // Special handling for popular filter
        if (filterName === 'checkbox_popular') {
          popularActive = true;
          continue;
        }

        // Special handling for starter filter
        if (filterName === 'checkbox_starter') {
          starterActive = true;
          continue;
        }
        
        // Get the rule for standard filters
        const rule = this.config.rules[filterName];
        if (!rule || !rule.attribute) continue;
        
        if (!activeFiltersByAttribute[rule.attribute]) {
          activeFiltersByAttribute[rule.attribute] = [];
        }
        activeFiltersByAttribute[rule.attribute].push(rule);
      }

      // Check special filters
      if (popularActive) {
        const popularValue = dataElement.getAttribute('data-popular');
        if (!popularValue || isNaN(parseInt(popularValue))) {
          return false;
        }
      }

      if (starterActive) {
        const starterValue = dataElement.getAttribute('data-getting-started');
        if (!starterValue || isNaN(parseInt(starterValue))) {
          return false;
        }
      }

      // Check standard attribute filters (AND between attributes, OR within attribute)
      for (const attribute in activeFiltersByAttribute) {
        const rules = activeFiltersByAttribute[attribute];
        const productValue = dataElement.getAttribute(attribute);
        
        if (!productValue) {
          return false;
        }
        
        // Product must match AT LEAST ONE of the active filters for this attribute
        let attributeMatch = false;
        for (const rule of rules) {
          if (rule.values.includes(productValue)) {
            attributeMatch = true;
            break;
          }
        }
        
        if (!attributeMatch) {
          return false;
        }
      }

      return true;
    }
```

## Conclusion
By removing the exclusivity constraints in the configuration and updating the filtering logic to group by attribute, the filtering system will seamlessly support additive selections. Users will be able to select multiple options within any category (e.g., "Gold" and "Silver", or "1oz" and "10oz") and see all relevant products, significantly improving the UX.

---

# URL-Based Filter Profiles Design

## Overview
This feature introduces "Filter Profiles" which allow users to apply a predefined set of filters and sort options via a single URL parameter (e.g., `?filter=all-silver`). This simplifies sharing specific product views and enhances marketing campaigns.

## Configuration Structure
A new configuration object `window.FILTER_PROFILES` will be defined in `buy-gold/body/url-filter-profiles.js`. This object maps profile names (slugs) to an object containing:
- `filters`: An array of checkbox IDs to activate.
- `sort`: (Optional) A sort key to apply (e.g., 'value', 'lowest-price').

**Example Structure:**
```javascript
window.FILTER_PROFILES = {
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default'
  },
  'all-silver-by-oz': {
    filters: ['checkbox_silver'],
    sort: 'lowest-weight' // Assumed "by oz" means sorted by weight
  },
  'all-silver-instock': {
    filters: ['checkbox_silver', 'checkbox_in_stock'],
    sort: 'default'
  },
  'profile1': {
    filters: ['checkbox_gold', 'checkbox_1oz'],
    sort: 'value'
  },
  'profile2': {
    filters: ['checkbox_gold', 'checkbox_cast_bar'],
    sort: 'lowest-price'
  },
  'profile3-10': {
    filters: ['checkbox_silver', 'checkbox_coin', 'checkbox_in_stock'],
    sort: 'latest'
  }
};
```

## Integration Logic
The existing `buy-gold/body/url-filter-handler.js` will be updated to support profile names within the `filter` URL parameter.

**Logic Flow:**
1.  **Initialization:** Wait for DOM content loaded.
2.  **Parameter Parsing:** Iterate through `filter` parameters in the URL query string.
3.  **Profile Lookup:** Check if the parameter value exists as a key in `window.FILTER_PROFILES`.
4.  **Application:** 
    - If a profile is found:
        - Iterate through the `filters` array and simulate a click on each valid checkbox element.
        - If `sort` is defined, call `window.sortManager.handleSortSelection(sortType, false)`.
    - If not a profile, proceed with existing logic (parsing `attribute=value` or `all-live` shortcut).
5.  **Timing:** Ensure this happens after the page has fully loaded and other scripts (like `FilterManager`) are initialized (using the existing `setTimeout` mechanism).
6.  **Interaction:** Trigger the Webflow interaction (filter icon block) if any filters were applied.

## Implementation Steps

### Step 1: Create `buy-gold/body/url-filter-profiles.js`
Create a new file to store the profile definitions.

```javascript
// URL Filter Profiles Configuration
window.FILTER_PROFILES = {
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default'
  },
  'all-silver-by-oz': {
    filters: ['checkbox_silver'],
    sort: 'lowest-weight'
  },
  'all-silver-instock': {
    filters: ['checkbox_silver', 'checkbox_in_stock'],
    sort: 'default'
  },
  'profile1': {
    filters: ['checkbox_gold', 'checkbox_1oz'],
    sort: 'value'
  },
  'profile2': {
    filters: ['checkbox_gold', 'checkbox_cast_bar'],
    sort: 'lowest-price'
  },
  'profile3-10': {
    filters: ['checkbox_silver', 'checkbox_coin', 'checkbox_in_stock'],
    sort: 'latest'
  }
};
```

### Step 2: Update `buy-gold/body/url-filter-handler.js`
Modify the existing handler to check for profiles.

```javascript
// ... inside the loop iterating filterParams ...

        console.log(`URL Filter Handler: Processing param "${filterParam}"`);
        
        // Check for Profile
        if (window.FILTER_PROFILES && window.FILTER_PROFILES[filterParam]) {
            console.log(`URL Filter Handler: Applying profile "${filterParam}"`);
            const profile = window.FILTER_PROFILES[filterParam];
            
            // Apply Filters
            if (profile.filters) {
                profile.filters.forEach(checkboxId => {
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox) {
                        console.log(`URL Filter Handler: Clicking profile checkbox ${checkboxId}`);
                        checkbox.click();
                        filtersApplied = true;
                    } else {
                        console.warn(`URL Filter Handler: Profile checkbox ${checkboxId} not found`);
                    }
                });
            }
            
            // Apply Sort
            if (profile.sort && window.sortManager) {
                console.log(`URL Filter Handler: Applying profile sort "${profile.sort}"`);
                // Use a small timeout to ensure filters are processed first
                setTimeout(() => {
                    window.sortManager.handleSortSelection(profile.sort, false);
                }, 100);
            }
            
            return; // Skip standard processing
        }

        // Special shortcut: filter=all-live
        // ... existing code ...
```

### Step 3: Update Build Scripts
Ensure the new `buy-gold/body/url-filter-profiles.js` file is included in the build process (e.g., `buy-gold/body/build.ps1`) so it's loaded on the page.

---

# Phase 3: Mobile View Enhancement

## Overview
Enhance the mobile view to support a dedicated "Clear Filter" button when a URL profile is active. This involves toggling between the default "Show In Stock" button and a new custom "Profile Active" button.

## Requirements
1.  **Update Profile Configuration:**
    *   Add `displayName` to each profile in `buy-gold/body/url-filter-profiles.js`.
2.  **Implement Button Toggling Logic:**
    *   **Elements:**
        *   `buy-banner-product1-hottest-button`: Default mobile button (Show In Stock / Show All).
        *   `buy-banner-product1-filter-button`: New custom button for profiles.
    *   **Behavior:**
        *   **Default State:** Show `hottest-button`, Hide `filter-button`.
        *   **Profile Active State:** Hide `hottest-button`, Show `filter-button`.
        *   **Profile Button Text:** "Currently viewing [Profile Name]. Click to clear".
    *   **Action:**
        *   Clicking `buy-banner-product1-filter-button` should remove the filter from the URL and reload the page to the default state.

## Implementation Plan

### 1. Update `buy-gold/body/url-filter-profiles.js`
Add `displayName` property to each profile object.

```javascript
window.FILTER_PROFILES = {
  'all-silver': {
    filters: ['checkbox_silver'],
    sort: 'default',
    displayName: 'all Silver sorted by best value per Oz'
  },
  // ... other profiles
};
```

### 2. Update `buy-gold/body/url-filter-handler.js`

**A. Add Helper Function `activateMobileProfileButton`**
Create a function to handle the button swap and text update.

```javascript
function activateMobileProfileButton(displayName) {
  if (window.innerWidth > 991) return;

  const defaultButton = document.getElementById('buy-banner-product1-hottest-button');
  const profileButton = document.getElementById('buy-banner-product1-filter-button');
  
  if (!profileButton) {
      console.warn('URL Filter Handler: Profile button not found');
      return;
  }

  // Hide default button
  if (defaultButton) {
      defaultButton.style.display = 'none';
  }

  // Show profile button
  profileButton.style.display = 'flex'; // Assuming flex, or 'block'

  // Update Text
  // UPDATED: Use ID 'buy-banner-title1-filter'
  const textElement = document.getElementById('buy-banner-title1-filter');
  if (textElement) {
    textElement.textContent = `Currently viewing ${displayName}. Click to clear`;
  } else {
      // Fallback to class if ID not found
      const textElementByClass = profileButton.querySelector('.buy-banner-title1-filter');
      if (textElementByClass) {
          textElementByClass.textContent = `Currently viewing ${displayName}. Click to clear`;
      }
  }

  // Add Click Listener to Reload
  profileButton.addEventListener('click', () => {
      console.log('URL Filter Handler: Clearing profile and reloading');
      // Reload page without query parameters
      window.location.href = window.location.pathname;
  });
}
```

**B. Integrate into Main Loop**
Call `activateMobileProfileButton` when a profile is successfully applied.

```javascript
// Inside filterParams.forEach loop
if (window.FILTER_PROFILES && window.FILTER_PROFILES[trimmedParam]) {
    const profile = window.FILTER_PROFILES[trimmedParam];
    // ... apply filters ...
    
    // NEW: Activate mobile profile button if profile has display name
    if (profile.displayName) {
        activateMobileProfileButton(profile.displayName);
    }
}
```

**C. Ensure Default State**
Ensure the profile button is hidden by default on load (if not handled by CSS).

```javascript
// At start of DOMContentLoaded
const profileButton = document.getElementById('buy-banner-product1-filter-button');
if (profileButton) {
    profileButton.style.display = 'none';
}
```
