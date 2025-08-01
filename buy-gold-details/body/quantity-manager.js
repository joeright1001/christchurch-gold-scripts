/* ------------------------------------------------------------------
   Elements
------------------------------------------------------------------- */
const qtyInput = document.getElementById("quantity");
const minQtyEl = document.getElementById("min-quantity-value");
const maxQtyEl = document.getElementById("max-quantity-value");

const priceNZDEl    = document.getElementById("price_nzd");       // optional
const totalPriceEl  = document.getElementById("total-price");     // optional

const unitPriceEl   = document.getElementById("unit-price-nzd");
const unitGstEl     = document.getElementById("unit-gst");
const totalUnitEl   = document.getElementById("total-unit-price-nzd");
const totalGstEl    = document.getElementById("total-gst");

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
const num = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

/* ------------------------------------------------------------------
   Totals
------------------------------------------------------------------- */
function recalcTotals() {
  const qty = parseInt(qtyInput?.value, 10) || 1;

  if (priceNZDEl && totalPriceEl) {
    totalPriceEl.textContent = (num(priceNZDEl.textContent) * qty).toFixed(2);
  }
  if (unitPriceEl && totalUnitEl) {
    totalUnitEl.textContent = (num(unitPriceEl.textContent) * qty).toFixed(2);
  }
  if (unitGstEl && totalGstEl) {
    totalGstEl.textContent  = (num(unitGstEl.textContent) * qty).toFixed(2);
  }
}

/* ------------------------------------------------------------------
   Warning badge creation
------------------------------------------------------------------- */
function createWarn(message, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = message;
  span.style.display = "none";
  qtyInput.parentNode.insertBefore(span, qtyInput.nextSibling);
  return span;
}

function enforceQtyLimits() {
  if (!qtyInput) return;

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

  let val = parseInt(qtyInput.value, 10) || minQty;
  if (val < minQty) val = minQty;
  if (val > maxQty) val = maxQty;
  qtyInput.value = val;

  if (minWarnSpan) minWarnSpan.style.display = (val < minQty) ? "inline-block" : "none";
  if (maxWarnSpan) maxWarnSpan.style.display = (val > maxQty) ? "inline-block" : "none";

  recalcTotals();
}

let minWarnSpan = null;
let maxWarnSpan = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!qtyInput) return;

  qtyInput.style.display = "inline-block";

  let minQty = 1;
  if (minQtyEl) {
    const parsed = parseInt(minQtyEl.textContent.trim(), 10);
    if (!isNaN(parsed)) minQty = parsed;
  }

  if (!qtyInput.value || parseInt(qtyInput.value, 10) < minQty) {
    qtyInput.value = minQty;
  }

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

  qtyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  qtyInput.addEventListener("input", enforceQtyLimits);
  document.addEventListener("price-refreshed", recalcTotals);

  enforceQtyLimits();
});
