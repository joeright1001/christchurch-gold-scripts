/**
 * Order Data Transfer Script  – adds GST & unit-price params
 * (everything else unchanged)
 */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- field handles ---------- */
  const $ = (id) => document.getElementById(id);

  const productNameField        = $("product-name-full");
  const quantityField           = $("quantity");
  const totalPriceField         = $("total-price");
  const zohoIdField             = $("zoho-id");
  const collectField            = $("collect");
  const priceNZDField           = $("price_nzd");

  /* NEW fields */
  const unitGstField            = $("unit-gst");
  const totalGstField           = $("total-gst");
  const unitPriceNzdField       = $("unit-price-nzd");
  const totalUnitPriceNzdField  = $("total-unit-price-nzd");

  /* existing extras */
  const imageUrlField           = $("image-url");
  const websiteUrlField         = $("website-url");
  const productNameShortField   = $("product-name");
  const metalField              = $("metal");
  const productTypeField        = $("product-type");

  /* supplier data */
  const shippingFeeField        = $("shippingfee");
  const marketStatusField       = $("market-status");
  const marketField             = $("market");
  const skuField                = $("sku");
  const autoSupplierField       = $("auto-supplier");
  const supplierItemIdField     = $("supplier-item-id");

  const placeOrderButton        = $("place-order");

  /* ---------- CMS wait helper ---------- */
  function waitForCMSData(cb, tries = 10) {
    if (productNameField.textContent.trim() && totalPriceField.textContent.trim()) {
      cb();
    } else if (tries) {
      setTimeout(() => waitForCMSData(cb, tries - 1), 200);
    } else {
      alert("Failed to load product details. Please try again.");
    }
  }

  /* ---------- click handler ---------- */
  placeOrderButton.addEventListener("click", function (event) {
    event.preventDefault();

    waitForCMSData(() => {
      const qp = new URLSearchParams({
        "product-name-full"      : productNameField.textContent.trim(),
        quantity                 : parseInt(quantityField.value, 10) || 1,
        "total-price"            : totalPriceField.textContent.trim(),
        "zoho-id"                : zohoIdField?.textContent.trim() || "",
        collect                  : collectField?.textContent.trim() || "",
        "price-nzd"              : priceNZDField?.textContent.trim() || "",

        /* NEW params */
        "unit-gst"               : unitGstField?.textContent.trim() || "",
        "total-gst"              : totalGstField?.textContent.trim() || "",
        "unit-price-nzd"         : unitPriceNzdField?.textContent.trim() || "",
        "total-unit-price-nzd"   : totalUnitPriceNzdField?.textContent.trim() || "",

        /* extras */
        "image-url"              : imageUrlField?.textContent.trim() || "",
        "website-url"            : websiteUrlField?.textContent.trim() || "",
        "product-name"           : productNameShortField?.textContent.trim() || "",
        metal                    : metalField?.textContent.trim() || "",
        "product-type"           : productTypeField?.textContent.trim() || "",

        /* supplier */
        shippingfee              : shippingFeeField?.textContent.trim() || "",
        "market-status"          : marketStatusField?.textContent.trim() || "",
        market                   : marketField?.textContent.trim() || "",
        sku                      : skuField?.textContent.trim() || "",
        "auto-supplier"          : autoSupplierField?.textContent.trim() || "",
        "supplier-item-id"       : supplierItemIdField?.textContent.trim() || ""
      });

      /* redirect to place-order page */
      window.location.href = `/place-order?${qp.toString()}`;
    });
  });
});
