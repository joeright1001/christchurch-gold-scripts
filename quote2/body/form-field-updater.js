/**
 * Minimal Quote Form Logic
 * Only handles basic total amount calculation for quote page
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------ handles ------------ */
  const $ = (id) => document.getElementById(id);

  const totalPriceField      = $("total-price");
  const shippingFeeField     = $("shippingfee");
  const totalAmountField1    = $("total-amount");
  const totalAmountField2    = $("total-amount2");

  /* ------------ update total‑amount ------------ */
  function updateTotalAmount() {
    const base = parseFloat(totalPriceField?.value || totalPriceField?.textContent) || 0;
    const fee  = parseFloat(shippingFeeField?.value) || 0;
    
    // For quotes, shipping is optional via checkbox
    const shippingCheckbox = $("#shippingfee");
    const includeShipping = shippingCheckbox?.checked || false;
    
    const tot = includeShipping ? base + fee : base;

    [totalAmountField1, totalAmountField2].forEach(el => {
      if (el) {
        if ("value" in el) el.value = tot.toFixed(2);
        el.textContent = tot.toFixed(2);
      }
    });
  }

  /* ------------ bindings ------------ */
  // Update total when shipping checkbox is toggled
  $("#shippingfee")?.addEventListener("change", updateTotalAmount);
  
  // Update if shipping fee amount changes
  shippingFeeField?.addEventListener("input", updateTotalAmount);

  /* ------------ initial state on load ------------ */
  updateTotalAmount();
});
