/**
 * Enhanced Order Form Logic  (with dynamic total‑amount update)
 * - Keeps original delivery/collect/business rules
 * - total‑amount = total‑price  (no shipping)
 *   or total‑price + shippingfee  (when shippingInput.value === "true")
 * Extracted from code-update-hidden-feilds.txt
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------ handles ------------ */
  const $ = (id) => document.getElementById(id);

  const checkboxOrder        = $("checkbox-order");
  const payInPersonInput     = $("pay-in-person");
  const datePicker           = $("date-picker-order");
  const deliveryInput        = $("delivery");
  const addressInput         = $("address");
  const shippingInput        = $("shipping");        // "true"/"false"
  const existingOrderCheck   = $("existing-order");

  const totalPriceField      = $("total-price");
  const shippingFeeField     = $("shippingfee");

  const totalAmountField1    = $("total-amount");
  const totalAmountField2    = $("total-amount2");   // optional twin

  /* ------------ update total‑amount ------------ */
  function updateTotalAmount() {
    const base = parseFloat(totalPriceField?.value || totalPriceField?.textContent) || 0;
    const fee  = parseFloat(shippingFeeField?.value) || 0;
    const useFee = shippingInput && shippingInput.value === "true";
    const tot = useFee ? base + fee : base;

    [totalAmountField1, totalAmountField2].forEach(el => {
      if (el) {
        if ("value" in el) el.value = tot.toFixed(2);
        el.textContent = tot.toFixed(2);
      }
    });
  }

  /* ------------ conflict checker ------------ */
  function checkForConflicts() {
    if (addressInput?.value.trim() && datePicker?.value &&
        deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Error_both";
    }
  }

  /* ------------ address blur/change ------------ */
  function handleAddressUpdate() {
    if (addressInput?.value.trim()) {
      if (shippingInput) shippingInput.value = "true";
      if (deliveryInput && !(existingOrderCheck?.checked)) deliveryInput.value = "Shipping";
    } else {
      if (shippingInput) shippingInput.value = "false";
      if (deliveryInput && !(existingOrderCheck?.checked)) deliveryInput.value = "";
    }
    checkForConflicts();
    updateTotalAmount();
  }

  /* ------------ existing order checkbox ------------ */
  function handleExistingOrderUpdate() {
    if (!existingOrderCheck || !deliveryInput) return;

    if (existingOrderCheck.checked) {
      deliveryInput.value = "Existing_order";
    } else {
      if (addressInput?.value.trim()) {
        deliveryInput.value = "Shipping";
      } else {
        deliveryInput.value = "";
      }
    }
    updateTotalAmount();           // collect vs. shipping may have flipped
  }

  /* ------------ date picker blur ------------ */
  function handleDatePickerUpdate() {
    if (datePicker?.value && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Collect";
    }
    checkForConflicts();
    updateTotalAmount();           // collect removes shipping fee
  }

  /* ------------ pay‑in‑person checkbox ------------ */
  function handlePayInPersonUpdate() {
    if (checkboxOrder && payInPersonInput) {
      payInPersonInput.value = checkboxOrder.checked ? "Selected" : "Not-Selected";
    }
  }

  /* ------------ bindings ------------ */
  addressInput?.addEventListener("blur", handleAddressUpdate);
  addressInput?.addEventListener("change", handleAddressUpdate);  // dropdown fires change
  datePicker?.addEventListener("blur", handleDatePickerUpdate);
  checkboxOrder?.addEventListener("change", handlePayInPersonUpdate);
  existingOrderCheck?.addEventListener("change", () => {
    handleExistingOrderUpdate();
    checkForConflicts();
  });

  /* React when shipping fee itself changes (e.g., user picks courier option) */
  shippingFeeField?.addEventListener("input", updateTotalAmount);
  shippingInput   ?.addEventListener("change", updateTotalAmount);

  /* ------------ initial state on load ------------ */
  if (existingOrderCheck?.checked) {
    handleExistingOrderUpdate();
  } else {
    if (addressInput?.value.trim()) handleAddressUpdate();
    if (datePicker?.value)          handleDatePickerUpdate();
  }
  handlePayInPersonUpdate();
  updateTotalAmount();              // base value with no shipping
});
