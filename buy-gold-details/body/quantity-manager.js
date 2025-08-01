/* ------------------------------------------------------------------
   Elements
------------------------------------------------------------------- */
const qtyInput      = document.getElementById("quantity");
const maxQtyEl      = document.getElementById("max-quantity-value");

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
function createWarn(maxQty) {
  const span = document.createElement("span");
  span.className = "max-qty-message";
  span.textContent = `max: ${maxQty}`;
  span.style.display = "none";           // hidden by default
  qtyInput.parentNode.insertBefore(span, qtyInput.nextSibling); // right of input
  return span;
}

/* ------------------------------------------------------------------
   Enforce limits + toggle badge
------------------------------------------------------------------- */
function enforceMaxQty() {
  if (!qtyInput) return;

  let maxQty = Infinity;
  if (maxQtyEl) {
    const parsed = parseInt(maxQtyEl.textContent.trim(), 10);
    if (!isNaN(parsed)) maxQty = parsed;
  }

  let val = parseInt(qtyInput.value, 10) || 1;
  if (val < 1) val = 1;
  if (val > maxQty) val = maxQty;
  qtyInput.value = val;

  warnSpan.style.display = (val >= maxQty) ? "inline-block" : "none";
  recalcTotals();
}

/* ------------------------------------------------------------------
   Initialise
------------------------------------------------------------------- */
let warnSpan = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!qtyInput) return;
  
    /* make the input inline so the badge sits on same line */
  qtyInput.style.display = "inline-block";     // ← add THIS line

  /* default ≥1 */
  if (!qtyInput.value || parseInt(qtyInput.value, 10) < 1) qtyInput.value = 1;

  /* max-qty badge */
  if (maxQtyEl) {
    const maxVal = parseInt(maxQtyEl.textContent.trim(), 10);
    if (!isNaN(maxVal)) {
      qtyInput.setAttribute("max", maxVal);
      warnSpan = document.querySelector(".max-qty-message") || createWarn(maxVal);
    }
  }
  if (!warnSpan) warnSpan = createWarn("n/a");   // fallback

  /* block ENTER from submitting */
  qtyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  qtyInput.addEventListener("input", enforceMaxQty);
  document.addEventListener("price-refreshed", recalcTotals);  // from Script 1

  enforceMaxQty();   // initial calculation & badge state
});
