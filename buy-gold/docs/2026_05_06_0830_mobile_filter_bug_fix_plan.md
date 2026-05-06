# Precise Plan for Fixing Mobile Filter "Popular on Top" Bug
Date: 2026-05-06 08:30
Status: COMPLETED

## Issue Summary
The mobile filter dropdown (e.g., "Same Day Collect") forces specific "Popular" items to the top of the grid, even when they don't match the intended sort order. This is caused by redundant "enforcement" logic in the filtering system that physically reorders the DOM for a specific group of filters (Popular, Hot, Starter, etc.).

## 1. Remove Physical Reordering in FilterManager
In [`buy-gold/body/filter-manager.js`](buy-gold/body/filter-manager.js), I have removed the calls to physical reordering methods inside `applyAllFiltersOptimized`. This ensures that applying a filter only hides/shows items and does **not** move them in the DOM.

- **Action**: Commented out calls to `applyPopularSortCSS()`, `applyStarterSortCSS()`, `applyHotSortCSS()`, and `applyInvestorSortCSS()`.
- **Impact**: Filtering now respects the active sort order (Price, Weight, or Default) without forced overrides.

## 2. Integrate Popular Group into Standard Evaluation
In [`buy-gold/body/filter-evaluator.js`](buy-gold/body/filter-evaluator.js), I have removed the special "Step 3" that treats popular group filters as a mandatory base set. Instead, these filters are now handled by the standard attribute-based logic in Steps 4 and 5.

- **Action**: 
    - Set `this.popularGroupFilters` to an empty array `[]`.
    - Commented out the "STEP 3: Popular Group Evaluation" block.
    - Updated Step 5 to correctly handle filters with `specialHandling: true` (like `checkbox_popular` and `checkbox_starter`) by checking if the attribute exists and is numeric.

## 3. Update Filter Configuration
In [`buy-gold/head/filter-config.js`](buy-gold/head/filter-config.js), I have removed the `popular_group` from `exclusiveGroups`.

- **Action**: Commented out the `popular_group` entry in the `exclusiveGroups` object.
- **Impact**: These filters are now additive like all other filters and no longer clear each other.

## 4. Manual Prepending (Not Modified)
After further review, the manual prepending logic in `url-filter-handler.js` was not modified as it is part of a custom view that should remain intact. The core bug was resolved via the architectural changes in the Filter Manager and Evaluator.

## 5. Preserve Default Behavior
The "Default (Popular)" sort option in the dropdown continues to work as intended because [`buy-gold/body/sort-manager.js`](buy-gold/body/sort-manager.js) handles it by calling `restoreOriginalOrder()`. Since the original Webflow order is popular-first, selecting "Default" still displays popular items first.

## Verification
- **All Gold / All Silver**: Continue to filter correctly.
- **Same Day Collect**: Now filters for in-stock items while respecting the current sort order.
- **Desktop**: Filtering remains functional without forced DOM snaps.
