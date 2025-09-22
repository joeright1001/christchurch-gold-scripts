/**
 * Load Session Storage Data Script
 *
 * Retrieves product data from sessionStorage and populates the order form
 * and other page elements.
 */
document.addEventListener("DOMContentLoaded", () => {
  const productDataString = sessionStorage.getItem("productData");

  if (!productDataString) {
    // Optional: Handle cases where the data is missing, e.g., redirect back
    // console.error("Product data not found in session storage.");
    // window.location.href = "/buy-gold"; // Or some other appropriate page
    return;
  }

  const data = JSON.parse(productDataString);

  /* ---------- Helper to set value for an element by ID ---------- */
  const setVal = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
      if ("value" in el) {
        el.value = value;
      }
      el.textContent = value;
    }
  };

  /* ---------- Helper to set value for multiple elements with same base ID ---------- */
  function setPair(idBase, value) {
    if (value === undefined || value === null) return;
    ["", "2", "3"].forEach(suffix => {
      const el = document.getElementById(idBase + suffix);
      if (el) {
        if ("value" in el) el.value = value;
        el.textContent = value;
      }
    });
  }

  // --- Part 1: Update Page Elements (like images and links) ---

  // 1. Update return links
  if (data.slug) {
    const returnUrl = `/buy-gold-details/${data.slug}`;
    const breadcrumbLink = document.getElementById("breadcrumb-url");
    if (breadcrumbLink) breadcrumbLink.href = returnUrl;

    const returnLink1 = document.getElementById("product-url-return");
    if (returnLink1) returnLink1.href = returnUrl;
    
    const returnLink2 = document.getElementById("product-url-return2");
    if (returnLink2) returnLink2.href = returnUrl;
  }

  // 2. Update product images
  if (data.imageUrl) {
    const productImage1 = document.getElementById("product-image");
    if (productImage1) productImage1.src = data.imageUrl;

    const productImage2 = document.getElementById("product-image2");
    if (productImage2) productImage2.src = data.imageUrl;
  }

  // 3. Set metal colors
  if (data.metal) {
    const root = document.documentElement;
    if (data.metal.toLowerCase() === "gold") {
      root.style.setProperty("--gold_silver", "#fff8e3");
      root.style.setProperty("--gold_silver_background", "#fffff5");
    } else if (data.metal.toLowerCase() === "silver") {
      root.style.setProperty("--gold_silver", "#e6e6e6");
      root.style.setProperty("--gold_silver_background", "#f6f9ff");
    }
  }

  // --- Part 2: Populate Hidden Form Fields ---
  
  // Direct mapping from data object to element ID
  const fieldMapping = {
    "product-name": data.productName,
    "slug": data.slug,
    "website-url": data.websiteUrl,
    "image-url": data.imageUrl,
    "metal": data.metal,
    "collect": data.collect,
    "cms-id": data.cmsId,
    "year": data.year,
    "mint": data.mint,
    "size": data.size,
    "zoho-id": data.zohoId,
    "1-oz-gold-stock-level": data.stockLevelText,
    "market-status": data.marketStatus,
    "stock-status": data.stockStatus,
    "product-type": data.productType,
    "online-order": data.onlineOrder,
    "shippingfee": data.shippingFee,
    "market": data.market,
    "sku": data.sku,
    "auto-supplier": data.autoSupplier,
    "supplier-item-id": data.supplierItemId,
    "supplier-availability": data.supplierAvailability,
    "supplier-isactivesell": data.supplierIsActiveSell,
    "price_nzd": data.priceNzd,
    "mark-up": data.markUp,
    "base-metal-price": data.baseMetalPrice,
  };

  for (const [id, value] of Object.entries(fieldMapping)) {
    setVal(id, value);
  }

  // --- Part 3: Populate Pricing and Total Fields (using setPair) ---
  setPair("product-name-full", data.productNameFull);
  setPair("quantity", data.quantity);
  setPair("unit-price-nzd", data.unitPriceNzd);
  setPair("unit-total-price-nzd", data.unitTotalPriceNzd);
  setPair("unit-gst", data.unitGst);
  setPair("unit-total-gst", data.unitTotalGst);
  setPair("gst-total", data.gstTotal);
  setPair("sub-total", data.subTotal);
  setPair("total-price", data.totalPrice);
  setPair("price-signed", data.priceSigned);
  setPair("total-amount", data.totalPrice); // Initial total amount

  // Clean the session storage after use to prevent stale data
  sessionStorage.removeItem("productData");
});
