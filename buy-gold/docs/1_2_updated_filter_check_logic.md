# Updated Filter Check Logic (v1.2)

## Overview
This document outlines the updated logic for the checkbox filtering system on the Buy Gold page. The primary goal is to accommodate complex filter interactions—specifically, handling the "Popular" group as an exclusive base selection, while enforcing subtractive (AND) logic for subsequent standard filter categories, and additive (OR) logic within the same category.

Additionally, we are refactoring the codebase to separate the core **selection/evaluation logic** from the **display/UI logic**, ensuring it is clearly identifiable and well-documented.

## Core Requirements & Logic Rules

### 1. The "Popular" Group (Exclusive Base Selection)
The following filters are classified as the "Popular" group (representing the primary view contexts):
- Popular (`checkbox_popular`)
- Hot Products (`checkbox_hot`)
- Best Investment (`checkbox_investor`)
- Getting Started (`checkbox_starter`)
- Speak to Dealer (`checkbox_dealer`)
- Collectables (`checkbox_collectables`)

**Rule:** This group is **mutually exclusive**. Only ONE choice from this group can be active at a time. Selecting a new option within this group automatically deselects the previous one. 

**Behavior:** When an option from this group is active, it defines the *base set* of products.

### 2. Standard Filters (Subtractive Across Categories)
Standard filters exist outside the Popular group (e.g., In Stock, 1oz, Gold, Cast Bar). 

**Rule:** Once a base selection is made from the Popular group, the *next* choice from anywhere else (standard filters) must act as a **subtractive (AND)** filter. 

**Example:**
- **Action:** Select "Hot Products" (Popular Group).
  - **Result:** Shows all Hot Products.
- **Action:** Select "In Stock" (Standard Filter).
  - **Result:** Shows `Hot Products AND In Stock`. The display updates to only show items from the base set that meet this new criteria.

### 3. Additive Selection (Within the Same Category)
When selecting multiple standard filters that share the same attribute/category (e.g., both are Stock Statuses, or both are Metals), the filters should act additively.

**Rule:** A third selection, if it belongs to the same attribute category as the second, operates using **additive (OR)** logic.

**Example:**
- **Current State:** `Hot Products AND In Stock`
- **Action:** Select "Live at Mint" (which shares the `data-stock-status` attribute with "In Stock").
- **Result:** Shows `Hot Products AND (In Stock OR Live at Mint)`.

*Note: If no selection is made from the Popular group at all, all standard filters follow this same logic: Additive (OR) within the same category, Subtractive (AND) across different categories.*

---

## Implementation Pathway

### Phase 1: Configuration Update
1. Modify `buy-gold/head/filter-config.js` to define the Popular group as an exclusive group.
   ```javascript
   exclusiveGroups: {
     popular_group: [
       'checkbox_popular',
       'checkbox_hot',
       'checkbox_investor',
       'checkbox_starter',
       'checkbox_dealer',
       'checkbox_collectables'
     ]
   }
   ```
   *This automatically hooks into `filter-manager.js`'s existing toggle logic to handle mutual exclusivity.*

### Phase 2: Logic Extraction & Refactoring
To ensure the logic is highly readable and not buried within the 1,200+ line `filter-manager.js`, we will extract the product evaluation logic into a new, dedicated file.

1. **Create `buy-gold/body/filter-evaluator.js`**:
   - Create a class `FilterEvaluator` that takes the `config`, active `filterStates`, and `specificProductSlugs` (whitelist).
   - Implement the `evaluateProduct(dataElement)` method with heavily commented, linear logic:
     - **Step 1:** Whitelist check (Specific Products).
     - **Step 2:** Dealer block check.
     - **Step 3:** Popular Group evaluation (if one is active, product must pass it).
     - **Step 4:** Standard Attribute grouping (group active filters by attribute).
     - **Step 5:** Subtractive/Additive evaluation (AND across groups, OR within groups).

2. **Update `buy-gold/body/filter-manager.js`**:
   - Initialize `window.FilterEvaluator` inside the `FilterManager` constructor.
   - Strip out the old `shouldShowProduct` logic and replace it with a simple passthrough to the new `evaluator.evaluateProduct()` method.
   
3. **Build Script Architecture**:
   - Because `build.ps1` processes JS files alphabetically, naming the new file `filter-evaluator.js` ensures it is loaded BEFORE `filter-manager.js` in the final `main.js` bundle.

## Expected Outcomes
- The complex requirements surrounding Hot Products vs In Stock filters will be resolved.
- Future developers will have a single, clean file (`filter-evaluator.js`) to read and modify when tweaking how products are matched against filters.
- The UI logic (adding classes, scrolling, showing/hiding banners) will remain cleanly separated in `filter-manager.js`.