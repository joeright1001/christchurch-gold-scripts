// updates hidden pricing data as use inputs qty. 

document.addEventListener("DOMContentLoaded", function () {
  /* helper to turn “5,677.24” → 5677.24 */
  const toNumber = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

  const qtyInput = document.getElementById("quantity");
  const unitPriceEl = document.getElementById("unit-price-nzd");
  const unitGstEl = document.getElementById("unit-gst");
  const unitTotalPriceEl = document.getElementById("unit-total-price-nzd");
  const unitTotalGstEl = document.getElementById("unit-total-gst");
  const gstTotalEl = document.getElementById("gst-total");
  const subTotalEl = document.getElementById("sub-total");

  if (
    !qtyInput ||
    !unitPriceEl ||
    !unitGstEl ||
    !unitTotalPriceEl ||
    !unitTotalGstEl ||
    !gstTotalEl ||
    !subTotalEl
  )
    return;

  function calcTotals() {
    const qty = parseInt(qtyInput.value, 10) || 1;
    const unitPrice = toNumber(unitPriceEl.textContent);
    const unitGst = toNumber(unitGstEl.textContent);

    const unitTotalPrice = unitPrice * qty;
    const unitTotalGst = unitGst * qty;

    unitTotalPriceEl.textContent = unitTotalPrice.toFixed(2);
    subTotalEl.textContent = unitTotalPrice.toFixed(2);
    unitTotalGstEl.textContent = unitTotalGst.toFixed(2);
    gstTotalEl.textContent = unitTotalGst.toFixed(2);
  }

  qtyInput.addEventListener("input", calcTotals); // run whenever qty changes
  calcTotals(); // run once on load
});
