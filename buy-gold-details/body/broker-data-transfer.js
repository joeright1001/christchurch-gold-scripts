/**
 * Script Name: DEALER DIRECT Transfer Script. Picks up the current product data from the cms and takes it to the /connect-dealer page.
 * 
 * the button is called DEALER DIRECT but the ID is "broker"
 *
 * Purpose:
 * This script captures product details from the page, including product name, quantity, total price, 
 * Zoho ID, price in NZD, image URL, website URL, product name, metal, and product-type. It then transfers 
 * this data via URL parameters when the user clicks the "Broker" button.
 *
 * Functionality:
 * 1. Retrieves data from fields: #product-name-full, #quantity, #total-price, #zoho-id, #price_nzd,
 *    #image-url, #website-url, #product-name, #metal, and #product-type.
 * 2. Waits for CMS-rendered content to ensure all necessary data is loaded.
 * 3. Validates that all required fields are filled before proceeding.
 * 4. Constructs a URL with query parameters and redirects the user to the contact page.
 *
 * Usage:
 * - Ensure the relevant fields exist in the HTML.
 * - The button triggering this functionality must have the ID "broker".
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get field references
  const productNameField       = document.getElementById("product-name-full");
  const quantityField          = document.getElementById("quantity");
  const totalPriceField        = document.getElementById("total-price");
  const zohoIdField            = document.getElementById("zoho-id");
  const priceNZDField          = document.getElementById("price_nzd");

  // Additional fields
  const imageUrlField          = document.getElementById("image-url");
  const websiteUrlField        = document.getElementById("website-url");
  const productNameShortField  = document.getElementById("product-name");
  const metalField             = document.getElementById("metal");
  const productTypeField       = document.getElementById("product-type");

  /* ------------- BROKER BUTTON ------------- */
  const brokerButton       = document.getElementById("broker");

  // Wait for CMS-rendered content (if necessary)
  function waitForCMSData(cb, tries = 10) {
    if (
      productNameField?.textContent.trim() &&
      totalPriceField?.textContent.trim()
    ) {
      cb();
    } else if (tries) {
      setTimeout(() => waitForCMSData(cb, tries - 1), 200);
    } else {
      alert("Failed to load product details. Please try again.");
    }
  }

  // Event listener for button click
  brokerButton?.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behaviour

    waitForCMSData(() => {
      /* --------- gather values --------- */
      const productName = productNameField.textContent.trim();
      const quantity    = parseInt(quantityField.value, 10) || 1;
      const totalPrice  = totalPriceField.textContent.trim();
      const zohoId      = zohoIdField?.textContent.trim() || "";
      const priceNZD    = priceNZDField?.textContent.trim() || "";


      const qp = new URLSearchParams({
        "product-name-full" : productName,
        quantity            : quantity,
        "total-price"       : totalPrice,
        "zoho-id"           : zohoId,
        "price_nzd"         : priceNZD,

        "image-url"         : imageUrlField?.textContent.trim() || "",
        "website-url"       : websiteUrlField?.textContent.trim() || "",
        "product-name"      : productNameShortField?.textContent.trim() || "",
        metal               : metalField?.textContent.trim() || "",
        "product-type"      : productTypeField?.textContent.trim() || ""
      });

      /* --------- redirect --------- */
      window.location.href = `/connect-dealer?${qp.toString()}`;
    });
  });
});
