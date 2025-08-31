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

    waitForCMSData(() => {
      const slug = slugField.textContent.trim();
      if (!slug) {
        alert("Product slug is missing. Cannot proceed.");
        return;
      }

      const params = new URLSearchParams();
      // Add the slug as the first parameter
      params.set("slug", slug);

      // Add all other data parameters
      paramIds.forEach((id) => {
        const element = $(id);
        let value = "";
        if (element) {
          value = "value" in element ? element.value : element.textContent;
        }
        params.set(id, value.trim());
      });

      // Construct the new URL: /place-order?[parameters]
      const newUrl = `/place-order?${params.toString()}`;

      // Redirect to the place-order page
      window.location.href = newUrl;
    });
  });
});
