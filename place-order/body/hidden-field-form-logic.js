/**
   * Script: Enhanced Order Form Logic with Priority Handling
   * 
   * Description:
   * - Uses blur/focusout events to process changes only when users complete their input
   * - Prioritizes existing-order checkbox over address input for delivery status
   * - Maintains state based on actual content and priority rules
   */

  document.addEventListener('DOMContentLoaded', function () {
    // Get references to all required elements
    const checkboxOrder = document.getElementById("checkbox-order");
    const payInPersonInput = document.getElementById("pay-in-person");
    const datePicker = document.getElementById("date-picker-order");
    const deliveryInput = document.getElementById("delivery");
    const addressInput = document.getElementById("address");
    const shippingInput = document.getElementById("shipping");
    const existingOrderCheckbox = document.getElementById("existing-order");

    /**
     * Updates delivery and shipping status based on address
     * Only triggers when address field loses focus
     * Checks for existing-order priority before setting delivery
     */
    function handleAddressUpdate() {
      if (addressInput && addressInput.value.trim()) {
        if (shippingInput) {
          shippingInput.value = "true";
        }
        // Only set delivery to Shipping if existing-order is not checked
        if (deliveryInput && (!existingOrderCheckbox || !existingOrderCheckbox.checked)) {
          deliveryInput.value = "Shipping";
        }
      } else {
        // Reset to defaults if address is empty
        if (shippingInput) {
          shippingInput.value = "false";
        }
        // Only reset delivery if existing-order is not checked
        if (deliveryInput && (!existingOrderCheckbox || !existingOrderCheckbox.checked)) {
          deliveryInput.value = ""; // or your default value
        }
      }
      checkForConflicts();
    }

    /**
     * Updates delivery status based on existing order selection
     * Takes priority over address-based delivery setting
     */
    function handleExistingOrderUpdate() {
      if (existingOrderCheckbox && deliveryInput) {
        if (existingOrderCheckbox.checked) {
          deliveryInput.value = "Existing_order";
        } else {
          // If unchecked, revert to address-based delivery if address exists
          if (addressInput && addressInput.value.trim()) {
            deliveryInput.value = "Shipping";
          } else {
            deliveryInput.value = ""; // or your default value
          }
        }
      }
    }

    /**
     * Checks for conflicting inputs and updates delivery status
     */
    function checkForConflicts() {
      if (addressInput && 
          datePicker && 
          addressInput.value.trim() && 
          datePicker.value) {
        if (deliveryInput && (!existingOrderCheckbox || !existingOrderCheckbox.checked)) {
          deliveryInput.value = "Error_both";
        }
      }
    }

    /**
     * Handles date picker updates when user leaves the field
     */
    function handleDatePickerUpdate() {
      if (datePicker && datePicker.value && deliveryInput) {
        // Only set to Collect if existing-order is not checked
        if (!existingOrderCheckbox || !existingOrderCheckbox.checked) {
          deliveryInput.value = "Collect";
        }
        checkForConflicts();
      }
    }

    /**
     * Updates the pay-in-person input based on checkbox state
     */
    function handlePayInPersonUpdate() {
      if (checkboxOrder && payInPersonInput) {
        payInPersonInput.value = checkboxOrder.checked ? "Selected" : "Not-Selected";
      }
    }

    // Attach blur event listeners for text inputs
    if (addressInput) {
      addressInput.addEventListener("blur", handleAddressUpdate);
    }

    if (datePicker) {
      datePicker.addEventListener("blur", handleDatePickerUpdate);
    }

    // Attach change event listeners for checkboxes
    if (checkboxOrder) {
      checkboxOrder.addEventListener("change", handlePayInPersonUpdate);
    }

    if (existingOrderCheckbox) {
      existingOrderCheckbox.addEventListener("change", () => {
        handleExistingOrderUpdate();
        checkForConflicts();
      });
    }

    // Initial check of all conditions on page load
    if (existingOrderCheckbox && existingOrderCheckbox.checked) {
      handleExistingOrderUpdate();
    } else {
      if (addressInput && addressInput.value.trim()) {
        handleAddressUpdate();
      }
      if (datePicker && datePicker.value) {
        handleDatePickerUpdate();
      }
    }
    handlePayInPersonUpdate();
  });
