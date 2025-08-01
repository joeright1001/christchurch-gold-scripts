document.addEventListener("DOMContentLoaded", function () {
  /* helper to turn “5,677.24” → 5677.24 */
  const toNumber = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

  const qtyInput      = document.getElementById("quantity");
  const unitPriceEl   = document.getElementById("unit-price-nzd");
  const unitGstEl     = document.getElementById("unit-gst");
  const totalUnitEl   = document.getElementById("total-unit-price-nzd");
  const totalGstEl    = document.getElementById("total-gst");

  if (!qtyInput || !unitPriceEl || !unitGstEl || !totalUnitEl || !totalGstEl) return;

  function calcTotals() {
    const qty        = parseInt(qtyInput.value, 10) || 1;
    totalUnitEl.textContent = (toNumber(unitPriceEl.textContent) * qty).toFixed(2);
    totalGstEl.textContent  = (toNumber(unitGstEl.textContent)   * qty).toFixed(2);
  }

  qtyInput.addEventListener("input", calcTotals);  // run whenever qty changes
  calcTotals();                                    // run once on load
});
