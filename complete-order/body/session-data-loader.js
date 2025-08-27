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
     3. Standard order fields
  -------------------------------------------------------------*/
  update("First_Name_Order" , data.first_name_order);
  update("Last_Name_Order"  , data.last_name_order);
  update("Email_Order"      , data.email_order);
  update("token"            , getSessionDataWithExpiry("token"));
  update("Phone_Order"      , data.phone_order);
  update("product-name-full", data.product_name_full);
  update("total-price"      , data.total_price);
  update("quantity"         , data.quantity);
  update("price_nzd"        , data.price_nzd);
  update("zoho-id"          , data.zoho_id);
  update("delivery"         , data.delivery);
  update("pay-in-person"    , data.pay_in_person);
  update("checkbox-order"   , data.checkbox_order);
  update("address"          , data.address);
  update("message-order"    , data.message);
  update("poli_pay"         , data.poli_pay);
  update("date-picker-order", data.date_picker_order);
  update("time-picker-order", data.time_picker_order);
  update("trade-order"      , tradeOrder);
  update("order_creation_time", orderCreationTime);
  update("First_Name_Order2", data.first_name_order);
  update("Last_Name_Order2" , data.last_name_order);
  update("total-price2"     , data.total_price);
  update("total-amount"     , data.total_amount);

  /* -------------------------------------------------------------
     4. NEW GST & unit‑price fields
  -------------------------------------------------------------*/
  update("unit-gst"            , data.unit_gst);
  update("total-gst"           , data.total_gst);
  update("gst-total"           , data.total_gst);              // visible GST line
  update("unit-price-nzd"      , data.unit_price_nzd);
  update("total-unit-price-nzd", data.total_unit_price_nzd);

  /* -------------------------------------------------------------
     5. Shipping display (display only, no math)
  -------------------------------------------------------------*/
  update("shippingfee", data.shippingfee);  // keep for backwards compatibility
  update("shipping", data.shipping);        // new display field

  /* -------------------------------------------------------------
     6. Collect information
  -------------------------------------------------------------*/
  update("collect", data.collect);
});
