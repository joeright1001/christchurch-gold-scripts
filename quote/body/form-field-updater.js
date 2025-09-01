/**
 * Quote Form Logic - Simplified from Order Form
 * - Calculates total-amount based on total-price, with no shipping.
 * - Retains pay-in-person logic.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------ handles ------------ */
  const $ = (id) => document.getElementById(id);

  const checkboxOrder        = $("checkbox-order");
  const payInPersonInput     = $("pay-in-person");
  const totalPriceField      = $("total-price");
  const totalAmountField1    = $("total-amount");
  const totalAmountField2    = $("total-amount2");   // optional twin

  /* ------------ update total-amount ------------ */
  function updateTotalAmount() {
    const base = parseFloat(totalPriceField?.value || totalPriceField?.textContent) || 0;
    
    [totalAmountField1, totalAmountField2].forEach(el => {
      if (el) {
        if ("value" in el) el.value = base.toFixed(2);
        el.textContent = base.toFixed(2);
      }
    });
  }

  /* ------------ pay-in-person checkbox ------------ */
  function handlePayInPersonUpdate() {
    if (checkboxOrder && payInPersonInput) {
      payInPersonInput.value = checkboxOrder.checked ? "Selected" : "Not-Selected";
    }
  }

  /* ------------ bindings ------------ */
  checkboxOrder?.addEventListener("change", handlePayInPersonUpdate);

  /* React when the price itself changes */
  const observer = new MutationObserver(updateTotalAmount);
  if (totalPriceField) {
    observer.observe(totalPriceField, { childList: true, subtree: true });
  }


  /* ------------ initial state on load ------------ */
  handlePayInPersonUpdate();
  updateTotalAmount();              // set initial total
});
