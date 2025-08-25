/**
 * Place-Order URL Data Receiver
 * Handles incoming URL parameters and populates form fields
 * Extracted from code-recieve-data-viaURL.txt
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------------
     helper: write to #id and #id2
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

  /* ------------------------------------------------------------------
     get query parameters
  ------------------------------------------------------------------ */
  const qs = new URLSearchParams(window.location.search);
  const val = key => qs.get(key) || "";

  /* standard fields */
  setPair("product-name-full", val("product-name-full"));
  setPair("quantity",          val("quantity"));
  setPair("total-price",       val("total-price"));
  setPair("zoho-id",           val("zoho-id"));
  setPair("collect",           val("collect"));
  setPair("price_nzd",         val("price-nzd"));

  /* GST / unit price fields */
  setPair("unit-gst",              val("unit-gst"));
  setPair("total-gst",             val("total-gst"));
  setPair("gst-total",             val("total-gst"));          // populates #gst-total & #gst-total2
  setPair("unit-price-nzd",        val("unit-price-nzd"));
  setPair("total-unit-price-nzd",  val("total-unit-price-nzd"));

  /* supplier extras */
  setPair("shippingfee",       val("shippingfee"));
  setPair("market-status",     val("market-status"));
  setPair("market",            val("market"));
  setPair("sku",               val("sku"));
  setPair("auto-supplier",     val("auto-supplier"));
  setPair("supplier-item-id",  val("supplier-item-id"));
  setPair("stock-status",      val("stock-status"));

  /* collection display field */
  setPair("collect2",          val("collect"));

  /* ------------------------------------------------------------------
     image & breadcrumb URLs
  ------------------------------------------------------------------ */
  const imgUrl = val("image-url");
  if (imgUrl) {
    const img = document.getElementById("product-image");
    if (img) img.src = imgUrl;
  }

  const slug = val("website-url");
  if (slug) {
    const fullURL = new URL(`/buy-gold-details/${slug}`, window.location.origin).href;
    ["product-url-return","breadcrumb-url","breadcrumb-url2"].forEach(id => {
      const a = document.getElementById(id);
      if (a) a.href = fullURL;
    });
  }
  setPair("breadcrumb-text", val("product-name"));

  /* ------------------------------------------------------------------
     business logic based on product-type
  ------------------------------------------------------------------ */
  const pType = val("product-type").toLowerCase();
  if (pType === "supplier") {
    document.getElementById("in-stock-place-order-text")?.style.setProperty("display","none");
  }
  if (pType === "investor") {
    document.getElementById("live-at-mint-order-text")?.style.setProperty("display","none");
    document.getElementById("checkbox-supplier-block")?.style.setProperty("display","none");
  }

  /* ------------------------------------------------------------------
     total-amount = total-price  (NO shipping added here)
  ------------------------------------------------------------------ */
  setPair("total-amount", val("total-price"));

  /* ------------------------------------------------------------------
     clean URL
  ------------------------------------------------------------------ */
  window.history.replaceState({}, "", window.location.pathname);
});
