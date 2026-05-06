# Precise Plan for Fixing Mobile Filter "Popular on Top" Bug
Date: 2026-05-06 08:30

## Issue Summary
The mobile filter dropdown (e.g., "Same Day Collect") forces specific "Popular" items to the top of the grid, even when they don't match the intended sort order. This is caused by redundant "enforcement" logic in the filtering system that physically reorders the DOM for a specific group of filters (Popular, Hot, Starter, etc.).

## 1. Remove Physical Reordering in FilterManager
In [`buy-gold/body/filter-manager.js`](buy-gold/body/filter-manager.js), I will remove the calls to physical reordering methods inside `applyAllFiltersOptimized`. This ensures that applying a filter only hides/shows items and does **not** move them in the DOM.

- **Action**: Comment out or remove calls to `applyPopularSortCSS()`, `applyStarterSortCSS()`, `applyHotSortCSS()`, and `applyInvestorSortCSS()`.
- **Impact**: Filtering will now respect the active sort order (Price, Weight, or Default) without forced overrides.

## 2. Integrate Popular Group into Standard Evaluation
In [`buy-gold/body/filter-evaluator.js`](buy-gold/body/filter-evaluator.js), I will remove the special "Step 3" that treats popular group filters as a mandatory base set. Instead, these filters will be handled by the standard attribute-based logic in Steps 4 and 5.

- **Action**: 
    - Remove `this.popularGroupFilters` array.
    - Remove the entire "STEP 3: Popular Group Evaluation" block.
    - Update Step 5 to correctly handle filters like `checkbox_popular` and `checkbox_starter` by checking for the existence of their respective data-attributes.

## 3. Update Filter Configuration
In [`buy-gold/head/filter-config.js`](buy-gold/head/filter-config.js), I will remove the `popular_group` from `exclusiveGroups`.

- **Action**: Remove the `popular_group` entry in the `exclusiveGroups` object.
- **Impact**: These filters will now be additive/subtractive like all other filters, and will no longer clear each other or trigger special group-wide styling overrides that were linked to the "Popular" group.

## 4. Disable Manual Prepending
In [`buy-gold/body/filter-custom-profile.js`](buy-gold/body/filter-custom-profile.js), I will empty the priority sequences.

- **Action**: Set `mobileInStockPriority` and `hotFilterSequence` to empty arrays `[]`.
- **Impact**: Prevents any other scripts (like the "Hottest" button handler) from manually forcing items to the top of the DOM.

## 5. Preserve Default Behavior
The "Default (Popular)" sort option in the dropdown will continue to work exactly as it does now because [`buy-gold/body/sort-manager.js`](buy-gold/body/sort-manager.js) handles it by calling `restoreOriginalOrder()`. Since the original Webflow order **is** popular-first, selecting "Default" will still display popular items first.

## Verification
- **All Gold / All Silver**: Will continue to filter correctly based on metal.
- **Same Day Collect**: Will filter for in-stock items and respect the current sort (e.g., if "Price: Low to High" is selected, it will stay sorted by price).
- **Desktop**: Filtering remains functional, but without the physical reordering "snap" for special filters, making it more consistent with the sorting system.
