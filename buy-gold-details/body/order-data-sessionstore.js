/**
 * Order Data Session Storage Script
 *
 * Collects all product data from hidden divs, stores it in sessionStorage,
 * and redirects to the place-order page.
 */
document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Helper to get element text content by ID ---------- */
  const getText = (id) => document.getElementById(id)?.textContent.trim() || "";
  const getValue = (id) => document.getElementById(id)?.value.trim() || "";

  /* ---------- Element Handles ---------- */
  const placeOrderButton = document.getElementById("place-order");
  const getQuoteButton = document.getElementById("get-quote");
  const slugField = document.getElementById("slug");
  const productNameField = document.getElementById("product-name-full");
  const totalPriceField = document.getElementById("total-price");

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

  /* ---------- Core Logic to Save Data and Redirect ---------- */
  function saveDataAndRedirect(redirectUrl) {
    waitForCMSData(() => {
      const productData = {
        // Product Info
        productNameFull: getText("product-name-full"),
        productName: getText("product-name"),
        slug: getText("slug"),
        websiteUrl: getText("website-url"),
        imageUrl: getText("image-url"),
        metal: getText("metal"),
        collect: getText("collect"),
        cmsId: getText("cms-id"),
        year: getText("year"),
        mint: getText("mint"),
        size: getText("size"),
        zohoId: getText("zoho-id"),
        weightGrams: getText("weight-grams"),

        // Stock & Status
        stockLevel: getText("stock-level"),
        marketStatus: getText("market-status"),
        stockStatus: getText("stock-status"),
        productType: getText("product-type"),
        onlineOrder: getText("online-order"),

        // Supplier Data
        shippingFee: getText("shippingfee"),
        market: getText("market"),
        sku: getText("sku"),
        autoSupplier: getText("auto-supplier"),
        supplierItemId: getText("supplier-item-id"),
        supplierAvailability: getText("supplier-availability"),
        supplierIsActiveSell: getText("supplier-isactivesell"),

        // Pricing Data
        quantity: getValue("quantity"),
        unitPriceNzd: getText("unit-price-nzd"),
        unitTotalPriceNzd: getText("unit-total-price-nzd"),
        unitGst: getText("unit-gst"),
        unitTotalGst: getText("unit-total-gst"),
        gstTotal: getText("gst-total"),
        subTotal: getText("sub-total"),
        totalPrice: getText("total-price"),
        priceNzd: getText("price_nzd"),
        priceSigned: getText("price-signed"),
        markUp: getText("mark-up"),
        baseMetalPrice: getText("base-metal-price"),
      };

      // Store the data in sessionStorage
      sessionStorage.setItem("productData", JSON.stringify(productData));

      // Redirect to the specified page
      window.location.href = redirectUrl;
    });
  }

  /* ---------- Event Listeners ---------- */
  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", function (event) {
      event.preventDefault();
      saveDataAndRedirect("/place-order");
    });
  }

  if (getQuoteButton) {
    getQuoteButton.addEventListener("click", function (event) {
      event.preventDefault();
      saveDataAndRedirect("/quote");
    });
  }
});
