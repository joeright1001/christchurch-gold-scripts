# Buy Gold - Sorting & Filtering Architecture Fix Plan
**Date:** May 6, 2026, 10:14 UTC
**Project File:** buy-gold 

## 1. Issue Overview
The core issue reported is that "popular" items are stuck at the top of the product stack, and sorting options like "Price: Low to High" seemingly do not work or only apply to products beneath this popular group. Additionally, the standard dropdown filtering options (e.g., "All Gold", "All Silver") continue to function normally.

## 2. Root Cause Analysis
After examining the code and the DOM structure, the root cause was identified as a structural disconnect between the JavaScript logic and the rendered Webflow HTML:

1. **Brittle Selectors:** 
   The `SortManager` inside `buy-gold/body/sort-manager.js` relies on a strict CSS selector to identify the grid container: `document.querySelector('.w-dyn-items.w-row')`. 
   Because the `.w-row` class is no longer present on the container in the current Webflow layout, this selector fails and returns `null`.
   
2. **Aborted Sort Operations:** 
   Since the `SortManager` cannot find the `gridContainer`, it immediately aborts any sort operation (such as "Price: Best per Oz" or "Latest") without throwing a visible error to the user. **No sorting algorithm is ever executed.**

3. **The "Popular Items" Illusion:**
   Because sorting silently fails, the products remain in the exact order that Webflow originally loaded them into the DOM. Webflow natively places the "popular" items at the top of the list. This created the illusion that the sort was working but starting "after" the popular items, when in reality, the sort was doing absolutely nothing.

4. **Why Filters Still Worked:** 
   The `FilterManager` (handling checkboxes and dropdown items like "All Silver") uses a fallback mechanism. It selects all `.product-data` elements directly (`document.querySelectorAll('.product-data')`) rather than relying exclusively on the parent container. It successfully applied the `display: none` style or `.filter-hidden` class to non-matching products, leaving the impression that part of the dropdown was working while the rest was broken.

## 3. Proposed Fix
To resolve this and prevent it from breaking in the future due to minor Webflow class updates, we will implement the following solutions across the scripting ecosystem:

1. **Implement Robust Container Selection:**
   Update the queries in `sort-manager.js`, `filter-manager.js`, `search-manager.js`, and `url-filter-handler.js` to avoid rigid multi-class strictness. 
   - Primary: `document.querySelector('.w-dyn-items')`
   - Fallback: Dynamically find the container by traversing upwards from the first loaded product: `document.querySelector('.product-data').closest('.w-dyn-items')`

2. **Handle Edge Case Sort Values:**
   Update `SortManager.applySortRuleOptimized()` to handle edge cases where products might lack the required sort attribute (e.g., a missing price). Instead of ignoring them (which inadvertently leaves them at the top of the DOM), they will be collected and appended to the *bottom* of the sorted fragment list.

3. **Refactor Child Selectors:**
   Ensure `querySelectorAll('.w-dyn-item')` is used consistently, but provide identical robust fallbacks (e.g., `element.closest('.w-dyn-item') || element.closest('[role="listitem"]')`) so sorting can physically manipulate the DOM wrapper nodes securely.

## 4. Execution Steps
1. Update `buy-gold/body/sort-manager.js`
2. Update `buy-gold/body/filter-manager.js` 
3. Update `buy-gold/body/search-manager.js`
4. Update `buy-gold/body/url-filter-handler.js`