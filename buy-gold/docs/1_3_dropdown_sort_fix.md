# Dropdown & Sort Functions Fix (v1.3)

## Overview
This document outlines the root cause and the implementation strategy to fix the broken dropdown and sorting functionality on the Buy Gold page.

## Symptoms
- All drop down / sort functions are broken.
- Exception: The mobile dropdown options for "All Gold" and "All Silver" still work.
- Previous attempts to fix the sorting logic resulted in a worsening of the issue (fundamentally breaking the grid layout).
- Standard checkbox filters and search continue to work as expected.

## Root Cause Analysis

### 1. The Sorting DOM Manipulation Bug (`sort-manager.js`)
The primary reason the sorting feature breaks the grid layout is due to a flaw in the `applySortRuleOptimized` method. 
When a sort is executed, the script identifies all currently visible items (`.w-dyn-item:not(.filter-hidden)`), evaluates their sorting attribute (e.g., price, weight), sorts the array, and appends them back to the grid container using a `DocumentFragment`.

**The Flaw:** `appendChild` removes elements from their current DOM position and places them at the end of the specified parent node. Because the script *only* appends the items that have valid sort values, any elements that were hidden (`.filter-hidden`) or did not have the specific sort attribute are left floating at the top of the grid container. 
This breaks the underlying DOM order. If a user subsequently changes filters or clears the search, the items at the top of the grid appear randomly out of place. Repeated use of the sort feature exponentially scrambles the DOM.

### 2. The Desktop vs. Mobile Discrepancy (`dropdown-component.js`)
The reason the mobile "All Gold" and "All Silver" options still function properly while the desktop dropdown fails lies in the event dispatching logic inside `dropdown-component.js`.

When a user selects a dropdown option, the script dispatches a custom event (`filterOperation` or `sortOperation`). This event payload includes a boolean flag:
`resetFirst: window.innerWidth <= 1023`

- **On Mobile (True):** When `FilterManager` receives the event, it completely resets all active filters before applying the new Gold/Silver filter. This provides a clean slate, meaning the items display correctly.
- **On Desktop (False):** The script attempts to append the new filter on top of existing active filters. Because the master dropdown is intended to act as a primary view override, failing to clear the previous state causes conflicting additive logic (e.g., trying to show products that are simultaneously in two conflicting categories), resulting in broken views or empty grids.

## Strategy to Fix

### Step 1: Surgically Fix `sort-manager.js` (DOM Preservation)
We must ensure that every single item within the `.w-dyn-items` grid is accounted for and correctly repositioned during a sort operation.

**Implementation:**
Update `applySortRuleOptimized` to sort elements into three distinct groups:
1.  **Sorted Items:** Visible items that contain the requested sort attribute.
2.  **Unsorted Visible Items:** Visible items missing the requested sort attribute (appended sequentially after sorted items).
3.  **Hidden Items:** Items currently hidden by the `.filter-hidden` class (appended at the very end).

By appending all three groups to the `DocumentFragment` before writing to the DOM, we maintain absolute control over the container's contents, ensuring hidden items and edge-case products don't bleed to the top of the page.

### Step 2: Fix Dropdown Logic (`dropdown-component.js`)
We will unify the behavior of the custom dropdown so that it acts consistently across devices.

**Implementation:**
Modify `dropdown-component.js` so that `resetFirst` is `true` for all interactions originating from the custom dropdown, regardless of screen width. This reinforces the dropdown's role as a master view controller rather than a standard additive checkbox.

### Step 3: Verify and Test
After applying these specific fixes, we will verify that the default checkboxes and search functions remain untouched and operational, strictly adhering to the requirement to not "improve" the working legacy filter code.