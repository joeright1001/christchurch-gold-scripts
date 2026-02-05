/* qty-limits.js – shows red min/max badges 5 px right of field */
(function () {

  /* ------------------------------------------------------------------
     Elements
  ------------------------------------------------------------------ */
  const qtyInput     = document.getElementById("quantity");
  // Visible display elements (Targets)
  const minQtyEl     = document.getElementById("min-quantity-value");
  const maxQtyEl     = document.getElementById("max-quantity-value");
  
  // Hidden data elements (Sources)
  const orderMinEl   = document.getElementById("order-min");
  const orderMaxEl   = document.getElementById("order-max");
  const stockLevelEl = document.getElementById("stock-level");

  const priceNZDEl   = document.getElementById("price_nzd");       // optional
  const totalPriceEl = document.getElementById("total-price");     // optional

  const unitPriceEl      = document.getElementById("unit-price-nzd");
  const unitGstEl        = document.getElementById("unit-gst");

  // Calculated fields for tax records
  const unitTotalPriceEl = document.getElementById("unit-total-price-nzd");
  const unitTotalGstEl   = document.getElementById("unit-total-gst");
  const gstTotalEl       = document.getElementById("gst-total");
  const subTotalEl       = document.getElementById("sub-total");

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const num = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

  /* ------------------------------------------------------------------
     Totals
  ------------------------------------------------------------------ */
  function recalcTotals() {
    const qty = parseInt(qtyInput?.value, 10) || 1;
    const unitPrice = num(unitPriceEl.textContent);
    const unitGst = num(unitGstEl.textContent);

    // Perform all calculations
    const unitTotalPrice = unitPrice * qty;
    const unitTotalGst = unitGst * qty;

    // Update the user-visible total price (original logic)
    if (priceNZDEl && totalPriceEl) {
      totalPriceEl.textContent = (num(priceNZDEl.textContent) * qty).toFixed(2);
    }

    // Update all hidden fields for tax records
    if (unitTotalPriceEl) unitTotalPriceEl.textContent = unitTotalPrice.toFixed(2);
    if (unitTotalGstEl) unitTotalGstEl.textContent = unitTotalGst.toFixed(2);
    if (gstTotalEl) gstTotalEl.textContent = unitTotalGst.toFixed(2);
    if (subTotalEl) subTotalEl.textContent = unitTotalPrice.toFixed(2);
  }

  /* ------------------------------------------------------------------
     Warning badge creation
  ------------------------------------------------------------------ */
  function createWarn(message, className) {
    const span = document.createElement("span");
    span.className   = className;
    span.textContent = message;
    span.style.display = "none";
    qtyInput.parentNode.insertBefore(span, qtyInput.nextSibling);
    return span;
  }

  /* ------------------------------------------------------------------
     Limit enforcement
  ------------------------------------------------------------------ */
  let minWarnSpan = null;
  let maxWarnSpan = null;
  let userInteracted = false;

  function enforceQtyLimits() {
    if (!qtyInput) return;

    // read min / max values from DOM
    let minQty = 1;
    if (minQtyEl) {
      const parsed = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) minQty = parsed;
    }
    let maxQty = Infinity;
    if (maxQtyEl) {
      const parsed = parseInt(maxQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) maxQty = parsed;
    }

    // clamp value
    let val = parseInt(qtyInput.value, 10) || minQty;
    if (val < minQty) val = minQty;
    if (val > maxQty) val = maxQty;
    qtyInput.value = val;

    // show / hide badges once the shopper has interacted
    if (userInteracted) {
      if (minWarnSpan) minWarnSpan.style.display = (val <= minQty) ? "inline-block" : "none";
      if (maxWarnSpan) maxWarnSpan.style.display = (val >= maxQty) ? "inline-block" : "none";
    }

    recalcTotals();
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    if (!qtyInput) return;

    /* inject style for the badges once */
    if (!document.getElementById("qty-limits-style")) {
      const style = document.createElement("style");
      style.id = "qty-limits-style";
      style.textContent = `
        .min-qty-message,
        .max-qty-message {
          margin-left: 5px;
          font-size: 0.875rem;
          line-height: 1;
          vertical-align: middle;
          color: #c00; /* red */
        }
      `;
      document.head.appendChild(style);
    }

    qtyInput.style.display = "inline-block";

    // 1. Determine Effective Max Limit
    let effectiveMax = Infinity;
    
    // Start with Order Max
    if (orderMaxEl) {
      const val = parseInt(orderMaxEl.textContent.trim(), 10);
      if (!isNaN(val)) effectiveMax = val;
    }

    // Check Stock Level
    if (stockLevelEl) {
      const stock = parseInt(stockLevelEl.textContent.trim(), 10);
      // If stock is positive, it caps the limit (use smaller of stock vs orderMax)
      if (!isNaN(stock) && stock > 0) {
        if (stock < effectiveMax) {
          effectiveMax = stock;
        }
      }
    }

    // 2. Update Visible Display
    if (maxQtyEl && effectiveMax !== Infinity) {
      maxQtyEl.textContent = effectiveMax;
    }

    // 3. Determine Effective Min Limit
    let effectiveMin = 1;
    if (orderMinEl) {
      const val = parseInt(orderMinEl.textContent.trim(), 10);
      if (!isNaN(val)) effectiveMin = val;
    } else if (minQtyEl) {
      // Fallback to existing display value if hidden field missing
      const val = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(val)) effectiveMin = val;
    }

    // Update Visible Min Display
    if (minQtyEl && orderMinEl) {
      minQtyEl.textContent = effectiveMin;
    }

    // 4. Enforce Initial Values on Input
    let minQty = effectiveMin;
    if (!qtyInput.value || parseInt(qtyInput.value, 10) < minQty) {
      qtyInput.value = minQty;
    }

    // create (hidden) badges
    if (minQtyEl) {
      const minVal = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(minVal)) {
        qtyInput.setAttribute("min", minVal);
        minWarnSpan = createWarn(`min: ${minVal}`, "min-qty-message");
      }
    }
    if (maxQtyEl) {
      const maxVal = parseInt(maxQtyEl.textContent.trim(), 10);
      if (!isNaN(maxVal)) {
        qtyInput.setAttribute("max", maxVal);
        maxWarnSpan = createWarn(`max: ${maxVal}`, "max-qty-message");
      }
    }

    /* helper: mark interaction + enforce immediately */
    const touchAndEnforce = () => {
      userInteracted = true;
      enforceQtyLimits();
    };

    /* listeners */
    qtyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
      if (e.key === "ArrowUp" || e.key === "ArrowDown") touchAndEnforce();
    });
    qtyInput.addEventListener("focus",  touchAndEnforce);
    qtyInput.addEventListener("click",  touchAndEnforce);  // spinner arrows
    qtyInput.addEventListener("wheel",  touchAndEnforce);  // mouse wheel
    qtyInput.addEventListener("input",  touchAndEnforce);
    qtyInput.addEventListener("change", touchAndEnforce);

    document.addEventListener("price-refreshed", recalcTotals);

    /* initial clamp / totals (badges hidden) */
    enforceQtyLimits();
  });
})();
