# Supplier Stock Level Capping Logic

## Overview
This feature introduces deterministic logic to cap the maximum order quantity based on the available stock level when specific supplier conditions are met. This ensures that users cannot order more items than currently held in stock if an external supplier is no longer actively selling a product for the direct delivery (DG) market.

## Requirements
1. The script must check three elements on the DOM:
   - Supplier Active Sell (`#supplier-isactivesell`)
   - Market (`#market`)
   - Stock Level (`#stock-level`)
2. If the supplier's active sell value equates to "N" and the market equates to "dg" (both evaluated case-insensitively), the maximum value allowed in the quantity selector must be strictly limited to the numerical value within `#stock-level`.
3. If the currently predefined maximum quantity (`#max-quantity-value`) is greater than the available stock level, or is undefined, it must be programmatically updated to match the stock level.

## Implementation Details
The `buy-gold-details/body/quantity-manager.js` script manages the bounds of the quantity selector input (`#quantity`). It initializes the maximum quantity limit by reading the `#max-quantity-value` element upon `DOMContentLoaded`. 

To seamlessly enforce the stock limit without breaking or bypassing any downstream validation, the new capping logic will be implemented as an interceptor precisely at the start of the `DOMContentLoaded` execution context, prior to any event listeners or input max attribute settings. By mutating the text content of `#max-quantity-value` early, the rest of `quantity-manager.js` will inherently absorb the capped value as the new native `max`.

**Exact Logic Flow:**
1.  **Element Selection:** Attempt to retrieve elements `#supplier-isactivesell`, `#market`, and `#stock-level`. Use `document.getElementById()`.
2.  **Condition Evaluation:** 
    - Extract text from `#supplier-isactivesell`, trim whitespace, and convert to uppercase. Verify if it strictly equals `"N"`.
    - Extract text from `#market`, trim whitespace, and convert to lowercase. Verify if it strictly equals `"dg"`.
    - Parse the text content of `#stock-level` to an integer base 10 (`stockLevel`).
    - Parse the text content of `#max-quantity-value` to an integer base 10 (`currentMax`).
3.  **Application:** 
    - If both conditions (`isSupplierActiveN` and `isMarketDg`) are evaluated to `true`, and `stockLevel` is a valid number (`!isNaN`), evaluate the capping necessity.
    - If `currentMax` is Not-a-Number (NaN) or if `stockLevel < currentMax`, programmatically assign `maxQtyEl.textContent = stockLevel.toString()`.
4. **Execution Positioning:** This snippet will sit exactly inside `quantity-manager.js`, immediately after verifying `qtyInput` exists and displaying it, but before it starts reading `minQtyEl` and `maxQtyEl` to set the DOM element attributes `min` and `max`.

## Impact Assessment

### Impact on other scripts
- **No adverse impacts on existing scripts.** Because we are merely adjusting the `textContent` of the `#max-quantity-value` element before the existing logic in `quantity-manager.js` consumes it, all existing functions (`enforceQtyLimits`, `recalcTotals`, warning badge creators) will behave normally. They will simply compute their limits against the new, lower threshold.
- Other scripts interacting with the cart or quote data read the actual value of `#quantity`, which is clamped securely by `quantity-manager.js`. Thus, downstream payload generation scripts (like `quote-data-transfer.js` or `order-data-transfer.js`) will naturally receive the correctly clamped quantity.

### Impact on UI/UX
- The UI will natively reflect the capped limit. The visual badge rendering `max: [value]` will automatically display the newly capped stock limit instead of the generic maximum order limit, informing the user correctly.
- If a user tries to type a number higher than the stock level, the existing `enforceQtyLimits` will forcefully correct their input down to the available stock limit, triggering the maximum boundary warning message.

## Code Blueprint

### Modified Section in `buy-gold-details/body/quantity-manager.js`
```javascript
  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    if (!qtyInput) return;

    /* inject style for the badges once */
    if (!document.getElementById("qty-limits-style")) {
      const style = document.createElement("style");
      style.id = "qty-limits-style";
      style.textContent = \`
        .min-qty-message,
        .max-qty-message {
          margin-left: 5px;
          font-size: 0.875rem;
          line-height: 1;
          vertical-align: middle;
          color: #c00; /* red */
        }
      \`;
      document.head.appendChild(style);
    }

    qtyInput.style.display = "inline-block";

    // --- NEW: DG Supplier Stock Level Capping Logic ---
    // If supplier is not actively selling (N) and market is DG, we cannot order more than what we have on hand.
    // We cap the max order display value here so the rest of the script automatically enforces it.
    const supplierIsActiveSellEl = document.getElementById("supplier-isactivesell");
    const marketEl = document.getElementById("market");
    const stockLevelEl = document.getElementById("stock-level");

    if (maxQtyEl && supplierIsActiveSellEl && marketEl && stockLevelEl) {
      const isSupplierActiveN = supplierIsActiveSellEl.textContent.trim().toUpperCase() === "N";
      const isMarketDg = marketEl.textContent.trim().toLowerCase() === "dg";
      
      if (isSupplierActiveN && isMarketDg) {
        const stockLevel = parseInt(stockLevelEl.textContent.trim(), 10);
        const currentMax = parseInt(maxQtyEl.textContent.trim(), 10);
        
        if (!isNaN(stockLevel)) {
           // Cap the max quantity text content if stock level is lower or current max is invalid
           if (isNaN(currentMax) || stockLevel < currentMax) {
               maxQtyEl.textContent = stockLevel.toString();
           }
        }
      }
    }
    // ---------------------------------------------------

    // ensure starting value meets minimum
    // ... [existing initialization code continues] ...