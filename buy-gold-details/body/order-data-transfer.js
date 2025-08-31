/**
 * Order Data Transfer Script (Corrected for Webflow Routing)
 *
 * Constructs a URL with all data, including the slug, in the query string.
 * This is required to work with Webflow's static routing.
 */
document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Helper to get element by ID ---------- */
  const $ = (id) => document.getElementById(id);

  /* ---------- Element Handles ---------- */
  const slugField = $("slug");
  const placeOrderButton = $("place-order");
  const productNameField = $("product-name-full"); // For CMS wait check
  const totalPriceField = $("total-price"); // For CMS wait check

  // List of element IDs to be included as URL parameters
  const paramIds = [
    "quantity",
    "unit-price-nzd",
    "unit-total-price-nzd",
    "unit-gst",
    "unit-total-gst",
    "gst-total",
    "sub-total",
    "total-price",
    "price_nzd",
    "price-signed",
    "product-name-full",
  ];

  /* ---------- CMS Wait Helper ---------- */
  function waitForCMSData(callback, retries = 10) {
    const slugReady = slugField?.textContent.trim();
    const nameReady = productNameField?.textContent.trim();
    const priceReady = totalPriceField?.textContent.trim();

    if (slugReady && nameReady && priceReady) {
      callback();
    } else if (retries > 0) {
      setTimeout(() => waitForCMSData(callback, retries - 1), 200);
    } else {
      alert("Failed to load product details. Please refresh and try again.");
    }
  }

  /* ---------- Click Handler ---------- */
  placeOrderButton.addEventListener("click", function (event) {
    event.preventDefault();
    
    // Helper to safely convert text to a number, defaulting to 0
    const toNumber = (t) => parseFloat(String(t).replace(/[^0-9.-]+/g, "")) || 0;

    waitForCMSData(() => {
      const slug = slugField.textContent.trim();
      if (!slug) {
        alert("Product slug is missing. Cannot proceed.");
        return;
      }

      const params = new URLSearchParams();
      // Add the slug as the first parameter
      params.set("slug", slug);

      // Add all other data parameters, cleaning them as we go
      paramIds.forEach((id) => {
        const element = $(id);
        let value;
        if (element) {
          // Handle specific field types
          if (id === "product-name-full" || id === "price-signed") {
            value = element.textContent.trim(); // These are strings
          } else if (id === "quantity") {
            value = parseInt(element.value, 10) || 1; // This is an integer
          } else {
            value = toNumber(element.textContent); // All others are numbers
          }
        } else {
          value = (id === "product-name-full" || id === "price-signed") ? "" : 0;
        }
        params.set(id, value);
      });

      // Construct the new URL: /place-order?[parameters]
      const newUrl = `/place-order?${params.toString()}`;

      // Redirect to the place-order page
      window.location.href = newUrl;
    });
  });
});
