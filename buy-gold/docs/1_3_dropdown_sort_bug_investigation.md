# Dropdown & Sort Bug Investigation
**Date:** 2026-05-06  
**Version at start of session:** v1.0.390  
**Version at end of session:** v1.0.393  
**Status:** UNRESOLVED — Code changes made but NONE have been confirmed working by testing

---

## Bug Report
The `#custom-filter` dropdown on the buy-gold page was **completely broken** — selecting any option did nothing. Both sort operations (Price, Weight, Value) and filter operations (All Gold, All Silver, In Stock) produced no effect.

---

## Files Modified This Session

| File | Changes Made |
|------|------|
| [`buy-gold/body/dropdown-component.js`](../body/dropdown-component.js) | Added `removeAttribute('data-w-id')` and `removeAttribute('style')` in `buildDropdown()` |
| [`buy-gold/body/sort-manager.js`](../body/sort-manager.js) | Rewrote product-finding logic to use `.product-data` elements instead of direct `.w-dyn-item` child queries; added `ensureOriginalOrder()` lazy capture; fixed `restoreOriginalOrder()` |
| [`buy-gold/body/filter-manager.js`](../body/filter-manager.js) | No logic changes — debug logs added and then removed |

---

## Investigation Findings

### Finding #1 — Webflow IX2 Injecting Inline Styles on `#custom-filter`

The HTML extract from the live page showed:
```html
<div id="custom-filter" data-w-id="5de4a73d-7a66-791f-41cb-c8e3ab7398fd" 
     style="border-color:rgb(255,255,255)" class="custom-dropdown">
  <div style="color:rgb(255,255,255)" class="text-block-1245">
    dropdown - replace with script
  </div>
</div>
```

Observations:
- The inner element still shows the original Webflow placeholder `"dropdown - replace with script"` — meaning `buildDropdown()` had NOT yet run at the time this HTML was captured (its first action is `this.element.innerHTML = ''` which would have wiped it)
- `border-color` and `color` are both `rgb(255,255,255)` — white on white
- `data-w-id="5de4a73d..."` is a Webflow IX2 interaction binding which continuously injects these styles

**However:** It is NOT confirmed whether this was the cause of the "dropdown does nothing" issue or a separate cosmetic issue. The user reported the dropdown was visible before this session's changes.

### Finding #2 — Sort Manager Queries Wrong DOM Location for Sort Attributes

Console output showed:
```
main.js:1 🚀 PERFORMANCE: Sorted 0 items by Price: Low to High
```

The original `sort-manager.js` `applySortRuleOptimized()` was doing:
```javascript
// For each .w-dyn-item card...
const dataElement = item.querySelector(`[${rule.attribute}]`);
// e.g. item.querySelector('[data-price-nzd]')  → always returns null
```

The sort attributes (`data-price-nzd`, `data-value`, `data-weight-grams`, `data-year`) are on **hidden `.product-data` elements** — a separate data layer — NOT on the visible card's direct DOM children.

`filter-manager.js` correctly uses `document.querySelectorAll('.product-data')` and finds 83 products. `sort-manager.js` was not using this pattern.

**Additionally**, `captureOriginalOrder()` ran at `DOMContentLoaded` when Webflow CMS hadn't finished rendering — so `originalOrder` was always an empty array at init time (confirmed: `🚀 PERFORMANCE: Found products container with 0 products`).

---

## Code Changes Made (NOT confirmed working)

### Change 1 — `dropdown-component.js` `buildDropdown()`

Added two lines before `innerHTML = ''`:
```javascript
this.element.removeAttribute('data-w-id');  // severs Webflow IX2 binding
this.element.removeAttribute('style');       // removes any injected inline styles
```

**Rationale:** Prevent Webflow IX2 from re-applying white-on-white styles after the dropdown is built.  
**Risk:** Unknown effect on the dropdown's visual appearance — user reported "dropdown graphic is oddly shaded" after this change was deployed in v1.0.391/392.

### Change 2 — `sort-manager.js` `applySortRuleOptimized()`

Replaced direct `.w-dyn-item` child attribute query with `.product-data` document-level query:
```javascript
// OLD (broken):
const currentItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item'));
currentItems.forEach(item => {
  const dataElement = item.querySelector(`[${rule.attribute}]`); // always null
});

// NEW (intended fix):
const allDataElements = Array.from(document.querySelectorAll('.product-data'));
allDataElements.forEach(dataElement => {
  const container = dataElement.closest('.w-dyn-item');
  const rawValue = dataElement.getAttribute(rule.attribute); // reads from data layer
  // push {element: container, value: sortValue}
});
```

### Change 3 — `sort-manager.js` `captureOriginalOrder()`

Changed from querying `.w-dyn-item` children to `document.querySelectorAll('.product-data')` to capture slugs.

### Change 4 — `sort-manager.js` — New `ensureOriginalOrder()` method

Added lazy re-capture of `originalOrder` at sort time in case init-time capture was empty.

### Change 5 — `sort-manager.js` `restoreOriginalOrder()`

Changed slug-to-element lookup from:
```javascript
this.gridContainer.querySelector(`[data-slug="${slug}"]`) // looks in grid only
```
To:
```javascript
document.querySelector(`.product-data[data-slug="${slug}"]`) // searches whole document
```

---

## Deployment History This Session

| Version | Key Changes |
|---------|------------|
| v1.0.390 | Starting version — bug present |
| v1.0.391 | `dropdown-component.js`: added `removeAttribute('data-w-id')` + `removeAttribute('style')` |
| v1.0.392 | `sort-manager.js`: first attempt at lazy container re-query (incomplete) |
| v1.0.393 | `sort-manager.js`: full rewrite of product-finding logic to use `.product-data` pattern |

---

## Test Results

| Version | Dropdown visible | Dropdown clickable | Sort fires | Sort reorders products |
|---------|-----------------|-------------------|------------|----------------------|
| v1.0.390 | ❓ (user said yes) | ❌ no | ❌ no | ❌ no |
| v1.0.391 | ❌ disappeared | — | — | — |
| v1.0.392 | — | — | ✅ events fire | ❌ sorted 0 items |
| v1.0.393 | ❌ no `main.js` logs at all | — | — | — |

---

## Outstanding Questions / Unresolved Issues

1. **Why did v1.0.393 produce no `main.js:1` console logs at all?**  
   - `node --check main.js` passes with exit 0 — no syntax errors in the bundle
   - Most likely: CDN cache serving old version, OR Webflow page embed not updated to v1.0.393 URL
   - OR: a runtime error (not syntax) in the bundle that stops execution before any logs fire

2. **Was the dropdown hidden BEFORE this session's changes?**  
   - User stated the dropdown was visible before changes
   - The `removeAttribute('style')` + `removeAttribute('data-w-id')` change may be causing the visual shading issue
   - If the dropdown was visually fine before, the IX2 white-on-white issue may be a timing thing that resolved itself — and our `removeAttribute` changes may be removing styles the dropdown legitimately needs

3. **Do `.product-data` elements actually have the sort attributes?**  
   - Never confirmed — run this in browser console to verify:
   ```javascript
   const el = document.querySelector('.product-data');
   console.log('data-price-nzd:', el.getAttribute('data-price-nzd'));
   console.log('data-value:', el.getAttribute('data-value'));
   console.log('data-weight-grams:', el.getAttribute('data-weight-grams'));
   console.log('data-year:', el.getAttribute('data-year'));
   ```
   - If these all return `null`, the sort attribute names in `SORT_CONFIG` need to be updated to match the actual attribute names in the CMS template

---

## Recommended Next Steps for New Session

### Step 1 — Establish clean baseline
1. Open browser DevTools → Network tab
2. Load buy-gold page
3. Find the `main.js` request and confirm which version number it's loading
4. If not v1.0.393: update Webflow custom code with content from `X_Inside 'body' tag.txt` and republish

### Step 2 — Check if main.js bundle loads at all
After confirming v1.0.393 loads, check console for ANY `main.js:1` log. If none appear, the bundle has a runtime error. Run:
```javascript
// In browser console, after page loads:
fetch('https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@v1.0.393/buy-gold/body/main.js')
  .then(r => r.text())
  .then(code => { eval(code) })
  .catch(e => console.error(e))
```
This will surface any runtime error with a proper stack trace.

### Step 3 — Verify `.product-data` sort attributes
Run in browser console:
```javascript
const all = document.querySelectorAll('.product-data');
console.log('Total product-data elements:', all.length);
const first = all[0];
console.log('Attributes on first product-data:');
Array.from(first.attributes).forEach(a => console.log(a.name, '=', a.value));
```
Confirm whether `data-price-nzd`, `data-value`, `data-weight-grams`, `data-year` exist.

### Step 4 — If sort still shows 0 items after v1.0.393 loads correctly
Add a temporary console.log inside the forEach to see what's happening:
```javascript
// Paste in browser console to test the sort logic manually:
const rule = { attribute: 'data-price-nzd', type: 'number', direction: 'asc' };
const all = document.querySelectorAll('.product-data');
let count = 0;
all.forEach(el => {
  const val = el.getAttribute(rule.attribute);
  const container = el.closest('.w-dyn-item');
  console.log('slug:', el.getAttribute('data-slug'), '| attr:', val, '| container found:', !!container);
  count++;
});
console.log('Total processed:', count);
```

### Step 5 — Resolve dropdown visual shading
If the dropdown has a visual issue, check what Webflow CSS is targeting `#custom-filter` — there may be designer styles beyond the IX2 inline styles that were removed.
