/* qty-limits.js – shows red min/max badges 5 px right of field, plus custom controls */
(function () {

  /* ------------------------------------------------------------------
     Elements
  ------------------------------------------------------------------ */
  const qtyInput     = document.getElementById("quantity");
  const minQtyEl     = document.getElementById("min-quantity-value");
  const maxQtyEl     = document.getElementById("max-quantity-value");

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
    if (!qtyInput) return;
    
    // Parse quantity - if invalid/empty while typing, default to 1 for calculation or ignore
    let qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) {
       // While typing, we don't want to show $0.00 if they've just deleted the number
       // We'll use 1 as a fallback for the text display
       qty = 1;
    }

    const unitPrice = num(unitPriceEl?.textContent);
    const unitGst = num(unitGstEl?.textContent);

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
    
    // Insert after the input (or the container we'll create)
    if (qtyInput.parentNode.classList.contains('qty-container')) {
        qtyInput.parentNode.parentNode.insertBefore(span, qtyInput.parentNode.nextSibling);
    } else {
        qtyInput.parentNode.insertBefore(span, qtyInput.nextSibling);
    }
    return span;
  }

  /* ------------------------------------------------------------------
     Limit enforcement
  ------------------------------------------------------------------ */
  let minWarnSpan = null;
  let maxWarnSpan = null;
  let userInteracted = false;

  function enforceQtyLimits(hardClamp = true) {
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

    let currentVal = parseInt(qtyInput.value, 10);
    
    if (hardClamp) {
        // Force value into range
        let val = currentVal || minQty;
        if (val < minQty) val = minQty;
        if (val > maxQty) val = maxQty;
        qtyInput.value = val;
        currentVal = val;
    }

    // show / hide badges once the shopper has interacted
    if (userInteracted || hardClamp) {
      if (minWarnSpan) {
          minWarnSpan.style.display = (isNaN(currentVal) || currentVal <= minQty) ? "inline-block" : "none";
      }
      if (maxWarnSpan) {
          maxWarnSpan.style.display = (!isNaN(currentVal) && currentVal >= maxQty) ? "inline-block" : "none";
      }
    }

    recalcTotals();
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    if (!qtyInput) return;

    /* inject style for the badges and buttons once */
    if (!document.getElementById("qty-limits-style")) {
      const style = document.createElement("style");
      style.id = "qty-limits-style";
      style.textContent = `
        .qty-container {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
          background: #fff;
        }
        .qty-container input {
          border: none !important;
          margin: 0 !important;
          text-align: center;
          width: 50px !important;
          height: 40px !important;
          -moz-appearance: textfield;
        }
        .qty-container input::-webkit-outer-spin-button,
        .qty-container input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .qty-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #f8f8f8;
          user-select: none;
          font-weight: bold;
          font-size: 1.2rem;
          color: #333;
          transition: background 0.2s;
          border: none;
          outline: none;
        }
        .qty-btn:hover { background: #eee; }
        .qty-btn:active { background: #ddd; }
        
        .min-qty-message,
        .max-qty-message {
          margin-left: 8px;
          font-size: 0.875rem;
          line-height: 1;
          vertical-align: middle;
          color: #c00; /* red */
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    }

    // --- DG Supplier Stock Level Capping Logic ---
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
           if (isNaN(currentMax) || stockLevel < currentMax) {
               maxQtyEl.textContent = stockLevel.toString();
           }
        }
      }
    }
    // ---------------------------------------------

    // Wrap input and add buttons
    const container = document.createElement('div');
    container.className = 'qty-container';
    qtyInput.parentNode.insertBefore(container, qtyInput);
    
    const btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.className = 'qty-btn minus';
    btnMinus.textContent = '−';
    
    const btnPlus = document.createElement('button');
    btnPlus.type = 'button';
    btnPlus.className = 'qty-btn plus';
    btnPlus.textContent = '+';
    
    container.appendChild(btnMinus);
    container.appendChild(qtyInput);
    container.appendChild(btnPlus);

    qtyInput.style.display = "inline-block";

    // ensure starting value meets minimum
    let minQty = 1;
    if (minQtyEl) {
      const parsed = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) minQty = parsed;
    }
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

    /* listeners */
    const softUpdate = () => {
        userInteracted = true;
        enforceQtyLimits(false);
    };
    
    const hardUpdate = () => {
        userInteracted = true;
        enforceQtyLimits(true);
    };

    qtyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          hardUpdate();
      }
    });
    
    qtyInput.addEventListener("focus",  softUpdate);
    qtyInput.addEventListener("input",  softUpdate);
    qtyInput.addEventListener("blur",   hardUpdate);
    qtyInput.addEventListener("change", hardUpdate);

    /* Repeat Functionality */
    let repeatTimer = null;
    let repeatInterval = null;

    const startRepeat = (change) => {
        userInteracted = true;
        const applyChange = () => {
            const val = parseInt(qtyInput.value, 10) || 0;
            qtyInput.value = val + change;
            enforceQtyLimits(true);
        };
        
        applyChange(); // First tick
        
        repeatTimer = setTimeout(() => {
            repeatInterval = setInterval(applyChange, 80); // Fast repeat
        }, 500); // Wait 0.5s before repeating
    };

    const stopRepeat = () => {
        clearTimeout(repeatTimer);
        clearInterval(repeatInterval);
    };

    btnMinus.addEventListener("mousedown", () => startRepeat(-1));
    btnPlus.addEventListener("mousedown", () => startRepeat(1));
    
    btnMinus.addEventListener("touchstart", (e) => { e.preventDefault(); startRepeat(-1); });
    btnPlus.addEventListener("touchstart", (e) => { e.preventDefault(); startRepeat(1); });

    window.addEventListener("mouseup", stopRepeat);
    window.addEventListener("touchend", stopRepeat);
    window.addEventListener("touchcancel", stopRepeat);
    btnMinus.addEventListener("mouseleave", stopRepeat);
    btnPlus.addEventListener("mouseleave", stopRepeat);

    document.addEventListener("price-refreshed", recalcTotals);

    /* initial clamp / totals (badges hidden) */
    enforceQtyLimits(true);
  });
})();
