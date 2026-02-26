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