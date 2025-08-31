/**
 * Place-Order URL Data Receiver (Combined)
 *
 * Handles filtering the CMS collection based on a 'slug' query parameter,
 * populating form fields from other URL query parameters, and updating
 * page elements (like the product image) from the visible CMS item.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get all query parameters from the URL
  const qs = new URLSearchParams(window.location.search);
  const val = key => qs.get(key) || "";

  /* ------------------------------------------------------------------
     Part 1: Filter CMS Collection and Update from its Content
  ------------------------------------------------------------------ */
  
  const productSlug = val('slug');

  if (productSlug) {
    const allItems = document.querySelectorAll('.w-dyn-item');
    allItems.forEach(item => {
      item.style.display = 'none';
    });

    const targetProductPanel = document.getElementById(productSlug);
    if (targetProductPanel) {
      const targetItem = targetProductPanel.closest('.w-dyn-item');
      if (targetItem) {
        // Make the correct CMS item visible
        targetItem.style.display = 'block';

        // --- Logic from update-from-cms.js is now here ---
        // Now that the correct item is visible, update the page from its content.
        
        // 1. Update Product Image
        const imageUrlElement = targetItem.querySelector('.cms-product-image-url');
        if (imageUrlElement) {
          const imageUrl = imageUrlElement.textContent.trim();
          const productImage = document.getElementById('product-image');
          if (productImage && imageUrl) {
            productImage.src = imageUrl;
          }
        }

        // 2. Update Stock Status Input
        const stockStatusElement = targetItem.querySelector('.cms-product-stock-status');
        if (stockStatusElement) {
          const stockStatusValue = stockStatusElement.textContent.trim();
          const stockLevelInput = document.getElementById('stock-level');
          if (stockLevelInput) {
            stockLevelInput.value = stockStatusValue;
          }
        }
      }
    }
  }

  /* ------------------------------------------------------------------
     Part 2: Populate Form Fields from URL Query Parameters
  ------------------------------------------------------------------ */

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

  const paramIds = [
    "quantity", "unit-price-nzd", "unit-total-price-nzd", "unit-gst",
    "unit-total-gst", "gst-total", "sub-total", "total-price",
    "price_nzd", "price-signed", "product-name-full",
  ];

  paramIds.forEach(id => {
    setPair(id, val(id));
  });
  
  setPair("gst-total", val("gst-total"));
  setPair("total-amount", val("total-price"));

  /* ------------------------------------------------------------------
     Part 3: Clean the URL
  ------------------------------------------------------------------ */
  if (window.location.search) {
    window.history.replaceState({}, "", window.location.pathname);
  }
});
