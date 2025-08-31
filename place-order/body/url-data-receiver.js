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

        // --- Logic to update page from the now-visible CMS panel ---

        // 1. Update return links to point back to the product page
        const returnUrl = `/buy-gold-details/${productSlug}`;
        
        const breadcrumbLink = document.getElementById('breadcrumb-url');
        if (breadcrumbLink) {
          breadcrumbLink.href = returnUrl;
        }

        const returnLink = document.getElementById('product-url-return');
        if (returnLink) {
          returnLink.href = returnUrl;
        }

        // 2. Dynamically populate all inputs from CMS data
        const cmsDataElements = targetItem.querySelectorAll('div[class^="cms-product-"]');
        cmsDataElements.forEach(element => {
          const classParts = element.className.split('-');
          if (classParts.length >= 3) {
            // Create target ID from class, e.g., "cms-product-stock-level" -> "stock-level"
            const targetId = classParts.slice(2).join('-');
            const value = element.textContent.trim();
            const targetInput = document.getElementById(targetId);

            if (targetInput) {
              targetInput.value = value;
            }
          }
        });

        // 3. Manually update the main product image (as it's not an input)
        const imageUrlElement = targetItem.querySelector('.cms-product-image-url');
        if (imageUrlElement) {
          const imageUrl = imageUrlElement.textContent.trim();
          const productImage = document.getElementById('product-image');
          if (productImage && imageUrl) {
            productImage.src = imageUrl;
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
