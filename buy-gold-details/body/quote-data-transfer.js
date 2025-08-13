/**
 * Script Name: Quote Data Transfer Script
 *
 * Purpose:
 * This script captures product details from the page, including product name, quantity, total price, 
 * Zoho ID, price in NZD, image URL, website URL, product name, metal, and additional supplier data.
 * It then transfers this data via URL parameters when the user clicks the "Get Quote" button.
 *
 * Functionality:
 * 1. Retrieves data from fields: #product-name-full, #quantity, #total-price, #zoho-id, #price_nzd,
 *    #image-url, #website-url, #product-name, #metal, #shippingfee, #market-status, #market,
 *    #sku, #auto-supplier, and #supplier-item-id.
 * 2. Waits for CMS-rendered content to ensure all necessary data is loaded.
 * 3. Validates that all required fields are filled before proceeding.
 * 4. Constructs a URL with query parameters and redirects the user to the quote page.
 *
 * Usage:
 * - Ensure the relevant fields exist in the HTML.
 * - The button triggering this functionality must have the ID "get-quote".
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get field references
  const productNameField = document.getElementById("product-name-full"); // CMS-linked field
  const quantityField = document.getElementById("quantity"); // Number input
  const totalPriceField = document.getElementById("total-price"); // Calculated price
  const zohoIdField = document.getElementById("zoho-id"); // Zoho ID field
  const priceNZDField = document.getElementById("price_nzd"); // Price in NZD field
  
  // Additional fields
  const imageUrlField = document.getElementById("image-url"); // Image URL field
  const websiteUrlField = document.getElementById("website-url"); // Website URL field
  const productNameShortField = document.getElementById("product-name"); // Product name field
  const metalField = document.getElementById("metal"); // Metal field

  // New supplier data fields
  const shippingFeeField = document.getElementById("shippingfee"); // Shipping fee field
  const marketStatusField = document.getElementById("market-status"); // Market status field
  const marketField = document.getElementById("market"); // Market field
  const skuField = document.getElementById("sku"); // SKU field
  const autoSupplierField = document.getElementById("auto-supplier"); // Auto supplier field
  const supplierItemIdField = document.getElementById("supplier-item-id"); // Supplier item ID field

  const getQuoteButton = document.getElementById("get-quote");

  // Wait for CMS-rendered content (if necessary)
  function waitForCMSData(callback) {
    const maxRetries = 10; // Max attempts to find CMS data
    let retries = 0;

    function checkFields() {
      if (
        productNameField &&
        productNameField.textContent.trim() &&
        totalPriceField &&
        totalPriceField.textContent.trim()
      ) {
        callback(); // Fields are ready, execute callback
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(checkFields, 200); // Retry after 200ms
      } else {
        console.error("CMS data not loaded in time.");
        alert("Failed to load product details. Please try again.");
      }
    }

    checkFields();
  }

  // Event listener for button click
  getQuoteButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior

    // Ensure all fields are ready
    waitForCMSData(() => {
      const productName = productNameField.textContent.trim(); // Get CMS value
      const quantity = parseInt(quantityField.value, 10) || 1; // Validate quantity
      const totalPrice = totalPriceField.textContent.trim(); // Get calculated price
      const zohoId = zohoIdField ? zohoIdField.textContent.trim() : ""; // Get Zoho ID
      const priceNZD = priceNZDField ? priceNZDField.textContent.trim() : ""; // Get price in NZD
      
      // Get values from additional fields
      const imageUrl = imageUrlField ? imageUrlField.textContent.trim() : ""; // Get image URL
      const websiteUrl = websiteUrlField ? websiteUrlField.textContent.trim() : ""; // Get website URL
      const productNameShort = productNameShortField ? productNameShortField.textContent.trim() : ""; // Get product name
      const metal = metalField ? metalField.textContent.trim() : ""; // Get metal type

      // Get values from new supplier data fields
      const shippingFee = shippingFeeField ? shippingFeeField.textContent.trim() : ""; // Get shipping fee
      const marketStatus = marketStatusField ? marketStatusField.textContent.trim() : ""; // Get market status
      const market = marketField ? marketField.textContent.trim() : ""; // Get market
      const sku = skuField ? skuField.textContent.trim() : ""; // Get SKU
      const autoSupplier = autoSupplierField ? autoSupplierField.textContent.trim() : ""; // Get auto supplier
      const supplierItemId = supplierItemIdField ? supplierItemIdField.textContent.trim() : ""; // Get supplier item ID


      // Construct the target URL with query parameters
      const targetUrl = `/quote?product-name-full=${encodeURIComponent(
        productName
      )}&quantity=${encodeURIComponent(quantity)}&total-price=${encodeURIComponent(
        totalPrice
      )}&zoho-id=${encodeURIComponent(zohoId)}&price-nzd=${encodeURIComponent(priceNZD)}
      &image-url=${encodeURIComponent(imageUrl)}&website-url=${encodeURIComponent(websiteUrl)}
      &product-name=${encodeURIComponent(productNameShort)}&metal=${encodeURIComponent(metal)}
      &shippingfee=${encodeURIComponent(shippingFee)}&market-status=${encodeURIComponent(marketStatus)}
      &market=${encodeURIComponent(market)}&sku=${encodeURIComponent(sku)}
      &auto-supplier=${encodeURIComponent(autoSupplier)}&supplier-item-id=${encodeURIComponent(supplierItemId)}`;

      // Redirect to the target page
      window.location.href = targetUrl;
    });
  });
});
