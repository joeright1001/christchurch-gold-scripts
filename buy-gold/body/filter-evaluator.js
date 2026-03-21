// =========================================================================
// FILTER EVALUATOR
// Extracted logic to cleanly separate filter selection evaluation from UI logic.
// Evaluates products against active filters according to complex business rules.
// =========================================================================

class FilterEvaluator {
  constructor(config) {
    this.config = config;

    // The Popular Group acts as the base selection.
    // It is an exclusive group (defined in filter-config.js) meaning only one can be active.
    this.popularGroupFilters = [
      'checkbox_popular',
      'checkbox_hot',
      'checkbox_investor',
      'checkbox_starter',
      'checkbox_dealer',
      'checkbox_collectables'
    ];
  }

  /**
   * Evaluates if a single product meets the criteria of all active filters
   * @param {HTMLElement} dataElement - The product data element
   * @param {Object} filterStates - The current state of all filters
   * @param {Array<string>} specificProductSlugs - Whitelisted specific slugs (if any)
   * @returns {boolean} True if the product should be shown, false otherwise
   */
  evaluateProduct(dataElement, filterStates, specificProductSlugs) {
    // -------------------------------------------------------------------------
    // STEP 1: Whitelist Check (Specific Products)
    // -------------------------------------------------------------------------
    if (specificProductSlugs && specificProductSlugs.length > 0) {
      const slug = dataElement.getAttribute('data-slug');
      if (!specificProductSlugs.includes(slug)) {
        return false;
      }
    }

    const activeFilters = Object.entries(filterStates)
      .filter(([_, isActive]) => isActive)
      .map(([filterName]) => filterName);

    if (activeFilters.length === 0) return true;

    // -------------------------------------------------------------------------
    // STEP 2: Dealer Block Check
    // -------------------------------------------------------------------------
    // Dealer filter always overrides and hides product cards
    if (filterStates.checkbox_dealer) {
      return false;
    }

    // -------------------------------------------------------------------------
    // STEP 3: Popular Group Evaluation (Base Set)
    // -------------------------------------------------------------------------
    // Check if any filter from the popular group is active
    const activePopularFilter = this.popularGroupFilters.find(f => filterStates[f]);

    if (activePopularFilter) {
      let passesPopular = false;

      if (activePopularFilter === 'checkbox_popular') {
        const val = dataElement.getAttribute('data-popular');
        passesPopular = (val && !isNaN(parseInt(val, 10)));
      } else if (activePopularFilter === 'checkbox_starter') {
        const val = dataElement.getAttribute('data-getting-started');
        passesPopular = (val && !isNaN(parseInt(val, 10)));
      } else if (activePopularFilter === 'checkbox_dealer') {
        return false; // Handled above, but kept for logical completeness
      } else {
        // For hot, investor, collectables, use their standard rules
        const rule = this.config.rules[activePopularFilter];
        if (rule && rule.attribute) {
          const val = dataElement.getAttribute(rule.attribute);
          passesPopular = rule.values && rule.values.includes(val);
        }
      }

      // If the product doesn't pass the base popular filter, immediately hide it
      if (!passesPopular) {
        return false;
      }
    }

    // -------------------------------------------------------------------------
    // STEP 4: Standard Attribute Grouping
    // -------------------------------------------------------------------------
    const filtersByAttribute = {};

    for (const filterName of activeFilters) {
      // Skip filters belonging to the popular group, as they've already been evaluated!
      // This is crucial for subtractive logic.
      if (this.popularGroupFilters.includes(filterName)) {
        continue;
      }

      const rule = this.config.rules[filterName];
      if (!rule) continue;

      // Use attribute for grouping
      // Note: Stock filters share 'data-stock-status' attribute, so they group together
      const groupKey = rule.attribute || filterName;

      if (!filtersByAttribute[groupKey]) {
        filtersByAttribute[groupKey] = [];
      }
      filtersByAttribute[groupKey].push(rule);
    }

    // -------------------------------------------------------------------------
    // STEP 5: Subtractive / Additive Evaluation
    // -------------------------------------------------------------------------
    // Check each attribute group
    // - Between different attribute groups: AND logic (Subtractive)
    // - Within the same attribute group: OR logic (Additive)
    for (const [attribute, rules] of Object.entries(filtersByAttribute)) {
      const productValue = dataElement.getAttribute(attribute);

      if (!productValue) {
        // If product doesn't have the attribute but filters are active for it, hide it
        return false;
      }

      // Check if product matches ANY of the rules in this group (OR logic within group)
      let matchFound = false;
      for (const rule of rules) {
        if (rule.values && rule.values.includes(productValue)) {
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        return false;
      }
    }

    return true;
  }
}

// Expose to global namespace
window.FilterEvaluator = FilterEvaluator;
