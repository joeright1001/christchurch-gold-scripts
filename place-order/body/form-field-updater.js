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

  /* ------------ Set initial shipping value ------------ */
  const shippingElement = $("shipping");
  if (shippingElement) {
    if ("value" in shippingElement) shippingElement.value = "0";
    shippingElement.textContent = "0";
  }

  const checkboxOrder        = $("checkbox-order");
  const payInPersonInput     = $("pay-in-person");
  const datePicker           = $("date-picker-order");
  const timePicker           = $("time-picker");
  const collectCheckbox      = $("checkbox-collect-live-low-stock");
  const postCollectInput     = $("post-collect");
  const deliveryInput        = $("delivery");
  const addressInput         = $("address");
  const shippingInput        = $("shipping");        // display value for shipping cost
  const existingOrderCheck   = $("existing-order");

  const totalPriceField      = $("total-price");
  const shippingFeeField     = $("shippingfee");

  const totalAmountField1    = $("total-amount");
  const totalAmountField2    = $("total-amount2");   // optional twin
  const totalAmountField3    = $("total-amount3");   // optional twin

  /* ------------ update shipping display and total‑amount ------------ */
  function updateTotalAmount() {
    const base = parseFloat(totalPriceField?.value || totalPriceField?.textContent) || 0;
    const fee = parseFloat(shippingFeeField?.value) || 0;
    
    // Update shipping display based on delivery method
    const isShipping = deliveryInput?.value === "Shipping";
    const shippingDisplay = isShipping ? fee : 0;
    
    if (shippingInput) {
      if ("value" in shippingInput) shippingInput.value = shippingDisplay.toFixed(2);
      shippingInput.textContent = shippingDisplay.toFixed(2);
    }
    
    // Calculate total amount
    const tot = isShipping ? base + fee : base;

    [totalAmountField1, totalAmountField2, totalAmountField3].forEach(el => {
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

  /* ------------ time picker change ------------ */
  function handleTimePickerUpdate() {
    if (timePicker?.value && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Collect";
    }
    checkForConflicts();
    updateTotalAmount();           // collect removes shipping fee
  }

  /* ------------ collection checkbox ------------ */
  function handleCollectCheckboxUpdate() {
    if (collectCheckbox?.checked && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Collect";
    }
    updateTotalAmount();           // collect removes shipping fee
  }

  /* ------------ post-collect dropdown ------------ */
  function handlePostCollectUpdate() {
    if (postCollectInput?.value.trim() && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Shipping";
    }
    updateTotalAmount();
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
  timePicker?.addEventListener("change", handleTimePickerUpdate);
  collectCheckbox?.addEventListener("change", handleCollectCheckboxUpdate);
  postCollectInput?.addEventListener("change", handlePostCollectUpdate);
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
    if (timePicker?.value)          handleTimePickerUpdate();
    if (collectCheckbox?.checked)   handleCollectCheckboxUpdate();
    if (postCollectInput?.value.trim()) handlePostCollectUpdate();
  }
  handlePayInPersonUpdate();
  updateTotalAmount();              // set initial shipping display and total
});
