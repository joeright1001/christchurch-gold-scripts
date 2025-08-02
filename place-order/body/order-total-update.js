// ==================================================================
//  order-total-update.js  –  Dynamic total-amount & delivery logic
// ==================================================================
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const checkboxOrder      = $("checkbox-order");
  const payInPersonInput   = $("pay-in-person");
  const datePicker         = $("date-picker-order");
  const deliveryInput      = $("delivery");
  const addressInput       = $("address");
  const shippingInput      = $("shipping");
  const existingOrderCheck = $("existing-order");

  const totalPriceField    = $("total-price");
  const shippingFeeField   = $("shippingfee");
  const totalAmount1       = $("total-amount");
  const totalAmount2       = $("total-amount2");

  function updateTotalAmount() {
    const base = parseFloat(totalPriceField?.value || totalPriceField?.textContent) || 0;
    const fee  = parseFloat(shippingFeeField?.value) || 0;
    const tot  = (shippingInput && shippingInput.value === "true") ? base + fee : base;
    [totalAmount1,totalAmount2].forEach(el=>{
      if(!el) return;
      if("value" in el) el.value = tot.toFixed(2);
      el.textContent = tot.toFixed(2);
    });
  }

  function checkConflicts() {
    if (addressInput?.value.trim() && datePicker?.value && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Error_both";
    }
  }

  function handleAddress() {
    if (addressInput?.value.trim()) {
      if (shippingInput) shippingInput.value = "true";
      if (deliveryInput && !(existingOrderCheck?.checked)) deliveryInput.value = "Shipping";
    } else {
      if (shippingInput) shippingInput.value = "false";
      if (deliveryInput && !(existingOrderCheck?.checked)) deliveryInput.value = "";
    }
    checkConflicts();
    updateTotalAmount();
  }

  function handleExistingOrder() {
    if (!existingOrderCheck || !deliveryInput) return;
    if (existingOrderCheck.checked) {
      deliveryInput.value = "Existing_order";
    } else {
      if (addressInput?.value.trim()) deliveryInput.value = "Shipping";
      else deliveryInput.value = "";
    }
    updateTotalAmount();
  }

  function handleDatePicker() {
    if (datePicker?.value && deliveryInput && !(existingOrderCheck?.checked)) {
      deliveryInput.value = "Collect";
    }
    checkConflicts();
    updateTotalAmount();
  }

  function syncPayInPerson() {
    if (checkboxOrder && payInPersonInput) {
      payInPersonInput.value = checkboxOrder.checked ? "Selected" : "Not-Selected";
    }
  }

  addressInput?.addEventListener("blur", handleAddress);
  addressInput?.addEventListener("change", handleAddress);
  datePicker?.addEventListener("blur", handleDatePicker);
  checkboxOrder?.addEventListener("change", syncPayInPerson);
  existingOrderCheck?.addEventListener("change", () => {
    handleExistingOrder();
    checkConflicts();
  });
  shippingFeeField?.addEventListener("input", updateTotalAmount);
  shippingInput?.addEventListener("change", updateTotalAmount);

  if (existingOrderCheck?.checked) handleExistingOrder();
  else {
    if (addressInput?.value.trim()) handleAddress();
    if (datePicker?.value)          handleDatePicker();
  }
  syncPayInPerson();
  updateTotalAmount();
});
