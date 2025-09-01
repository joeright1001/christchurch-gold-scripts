/**
 * Session Data Loader
 * Loads order data from session storage and populates page elements
 * Extracted from code-load-order-data-from-session-onstartup.txt
 */

/* ---------------------------------------------------------------
   session‑storage helper with expiry
---------------------------------------------------------------*/
function getSessionDataWithExpiry(key) {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) return null;
  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) { sessionStorage.removeItem(key); return null; }
    return item.value;
  } catch (e) { console.error(`Error parsing ${key}:`, e); return null; }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script starting…");

  /* -------------------------------------------------------------
     1. Pull session data
  -------------------------------------------------------------*/
  const raw = getSessionDataWithExpiry("orderData");
  if (!raw) { console.log("Order data expired or not found"); return; }
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  console.log("Parsed orderData:", data);

  const tradeOrder        = getSessionDataWithExpiry("trade_order");
  const orderCreationTime = getSessionDataWithExpiry("order_creation_time");

  /* -------------------------------------------------------------
     2. Utility: write to div/input if present
  -------------------------------------------------------------*/
  const update = (id, val) => {
    const el = document.getElementById(id);
    if (el) {
      if ("value" in el) el.value = val || "";
      el.textContent = val || "";
      console.log(`Updated ${id} with ${val}`);
    } else {
      console.log(`Could not find div: ${id}`);
    }
  };

  /* -------------------------------------------------------------
     3. Get product data from nested structure
  -------------------------------------------------------------*/
  const product = (data.products && data.products[0]) || {};
  console.log("Product data:", product);

  /* -------------------------------------------------------------
     4. Populate page with data
  -------------------------------------------------------------*/
  // --- Customer and general order details
  update("First_Name_Order" , data.first_name_order);
  update("Last_Name_Order"  , data.last_name_order);
  update("Email_Order"      , data.email_order);
  update("Phone_Order"      , data.phone_order);
  update("delivery"         , data.delivery);
  update("pay-in-person"    , data.pay_in_person);
  update("checkbox-order"   , data.checkbox_order);
  update("address"          , data.address);
  update("message-order"    , data.message);
  update("date-picker-order", data.date_picker_order);
  update("time-picker-order", data.time_picker_order);
  update("collect"          , data.collect);

  // --- Trade order and time
  update("trade-order"      , tradeOrder);
  update("order_creation_time", orderCreationTime);
  update("token"            , getSessionDataWithExpiry("token"));

  // --- Product details
  update("product-name-full", product.name);
  update("quantity"         , product.quantity);
  update("zoho-id"          , product.zoho_id);
  update("unit-price-nzd"   , product.unit_price_nzd);
  update("unit-gst"         , product.unit_gst);
  update("unit-total-price-nzd", product.unit_total_price_nzd);
  update("total-price"      , product.total_price);

  // --- Totals and financials
  update("total-amount"     , data.total_amount);
  update("gst-total"        , data.gst_total);
  update("shipping"         , data.shipping);
  update("sub-total"        , data.sub_total);

  // --- Duplicate fields for other sections
  update("First_Name_Order2", data.first_name_order);
  update("Last_Name_Order2" , data.last_name_order);
  update("total-price2"     , product.total_price);
});
