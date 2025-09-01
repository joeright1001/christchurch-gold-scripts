/**
 * Product Selection Validation
 * Ensures product is selected before form submission
 * Extracted from code-missing-product-error-message.txt
 */

document.addEventListener("DOMContentLoaded", function () {
  let submitButton = document.getElementById("submit-order");
  let productName = document.getElementById("product-name-full");
  let noProductMessage = document.getElementById("no-product-selected");

  if (!submitButton || !productName || !noProductMessage) return; // Ensure elements exist

  submitButton.addEventListener("click", function (event) {
    if (!productName.value.trim()) { // Check if the field is empty
      event.preventDefault(); // Halt form submission
      noProductMessage.style.display = "block"; // Reveal the hidden div
      
      // Smoothly scroll to the "no-product-selected" div
      noProductMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
