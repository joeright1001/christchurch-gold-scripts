/**
 * Place-Order URL Data Receiver (Corrected for Webflow Routing)
 *
 * Handles both filtering the CMS collection based on a 'slug' query parameter
 * and populating form fields from other URL query parameters.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get all query parameters from the URL
  const qs = new URLSearchParams(window.location.search);
  const val = key => qs.get(key) || "";

  /* ------------------------------------------------------------------
     Part 1: Filter CMS Collection based on 'slug' in Query String
  ------------------------------------------------------------------ */
  
  // 1. Get the slug from the 'slug' query parameter
  const productSlug = val('slug');

  // 2. If a slug is present, filter the CMS list
  if (productSlug) {
    // 3. Get all the CMS items on the page.
    const allItems = document.querySelectorAll('.w-dyn-item');

    // 4. Loop through every item and hide it by default.
    allItems.forEach(item => {
      item.style.display = 'none';
    });

    // 5. Find the one specific product panel that matches the slug's ID.
    const targetProductPanel = document.getElementById(productSlug);

    // 6. If that product panel exists, find its parent CMS item and make it visible.
    if (targetProductPanel) {
      const targetItem = targetProductPanel.closest('.w-dyn-item');
      if (targetItem) {
        targetItem.style.display = 'block';
      }
    }
  }

  /* ------------------------------------------------------------------
     Part 2: Populate Form Fields from URL Query Parameters
  ------------------------------------------------------------------ */

  // Helper to write a value to an element and its duplicate (e.g., #id and #id2)
  function setPair(idBase, value) {
    if (!value) return;
    ["", "2"].forEach(suffix => {
      const el = document.getElementById(idBase + suffix);
      if (el) {
        if ("value" in el) el.value = value;
        el.textContent = value;
      }
    });
  }

  // List of fields to populate from the URL
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

  // Populate each field
  paramIds.forEach(id => {
    setPair(id, val(id));
  });
  
  // Also handle gst-total alias and total-amount
  setPair("gst-total", val("gst-total"));
  setPair("total-amount", val("total-price"));

  /* ------------------------------------------------------------------
     Part 3: Clean the URL
  ------------------------------------------------------------------ */
  // Remove the query string from the URL bar after processing
  if (window.location.search) {
    window.history.replaceState({}, "", window.location.pathname);
  }
});
