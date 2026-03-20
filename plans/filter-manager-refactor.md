# Filter Manager Refactoring Plan

## Objective
Separate the "business logic" (rules that define custom filters and UI presentation) from the "DOM execution engine" (the code that physically toggles classes, reorders nodes, and manipulates element styles).

## New Architecture

### 1. The Configuration File: `buy-gold/body/filter-custom-profile.js`
We will create a new file specifically to house the business logic for custom filters. This file will sit alongside the existing `filter-config.js` (which handles CMS attributes) and will define:

*   **Custom Sort Rules:** E.g., The "Hot" filter sequence (`['1-kg-silver']`), and the attributes/directions for "Investor" (`data-value`), "Popular" (`data-popular`), and "Starter" (`data-getting-started`).
*   **Presentation (Div Visibility) Rules:** A mapping of which promotional blocks (like `speakToDealer` or `investmentBlock`) should be shown or hidden when a specific custom filter is activated.
*   **Product Hiding Rules:** E.g., The rule that says all standard products should be hidden when the `checkbox_dealer` filter is active.

### 2. The Execution Engine: `buy-gold/body/filter-manager.js`
We will strip all hardcoded business logic out of the Filter Manager. It will be refactored to:
*   Read the rules from the newly created `window.FILTER_CUSTOM_PROFILE`.
*   Replace the repetitive sorting methods (`applyHotSortCSS`, `applyInvestorSortCSS`, etc.) with a single, generic `applyCustomSort(rule)` method that handles both sequence-based and numeric-based DOM reordering.
*   Refactor `manageDivVisibility()` to become a generic UI controller that reads the `divVisibility` mapping from the profile and toggles elements accordingly.
*   Refactor `shouldShowProduct()` to check the `hideRules` from the profile instead of having hardcoded `if (this.filterStates.checkbox_dealer) return false;` statements.

## Next Steps / Todo List
1.  **Create `buy-gold/body/filter-custom-profile.js`:** Define the `FILTER_CUSTOM_PROFILE` object containing all current custom logic.
2.  **Refactor `buy-gold/body/filter-manager.js`:** 
    *   Update `manageDivVisibility` to be a generic engine.
    *   Merge the 4 hardcoded sorting methods into a generic custom sorting engine.
    *   Remove hardcoded dealer logic from `shouldShowProduct`.
3.  **Update Build Script:** Ensure `filter-custom-profile.js` is included in the build process (e.g., `buy-gold/body/build.ps1` or `X_compile-webflow-body-tags.ps1`) if necessary.