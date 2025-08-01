// Function to get session data with expiry check
function getSessionDataWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        const now = new Date().getTime();

        if (now > item.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (error) {
        console.error(`Error parsing ${key}:`, error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script starting...");
    
    try {
        // Get and parse orderData with expiry check
        const orderData = getSessionDataWithExpiry("orderData");
        if (!orderData) {
            console.log("Order data expired or not found");
            return;
        }

        const tradeOrder = getSessionDataWithExpiry("trade_order");
        const orderCreationTime = getSessionDataWithExpiry("order_creation_time");
        
        console.log("Parsed orderData:", orderData);

        // Function to update div content
        const updateDiv = (id, value) => {
            const div = document.getElementById(id);
            if (div) {
                div.textContent = value || '';
                console.log(`Updated ${id} with ${value}`);
            } else {
                console.log(`Could not find div: ${id}`);
            }
        };

        // Parse orderData if it's a string
        const parsedOrderData = typeof orderData === 'string' ? JSON.parse(orderData) : orderData;

        // Update shipping fee div with value from session storage
        const updateShippingFee = () => {
            const shippingFeeDiv = document.getElementById('shippingfee');
            if (shippingFeeDiv) {
                // Get shipping fee directly from parsedOrderData
                const shippingFee = parsedOrderData.shippingfee || "0";
                shippingFeeDiv.textContent = shippingFee;
                console.log(`Set shipping fee to: ${shippingFee} from session storage`);
            } else {
                console.log("Shipping fee div not found");
            }
        };

        // Call the updated shipping fee function
        updateShippingFee();

        // Update all divs with exact IDs from the HTML
        updateDiv("First_Name_Order", parsedOrderData.first_name_order);
        updateDiv("Last_Name_Order", parsedOrderData.last_name_order);
        updateDiv("Email_Order", parsedOrderData.email_order);
        updateDiv("token", getSessionDataWithExpiry("token"));
        updateDiv("Phone_Order", parsedOrderData.phone_order);
        updateDiv("product-name-full", parsedOrderData.product_name_full);
        updateDiv("total-price", parsedOrderData.total_price);
        updateDiv("quantity", parsedOrderData.quantity);
        updateDiv("price_nzd", parsedOrderData.price_nzd);
        updateDiv("zoho-id", parsedOrderData.zoho_id);
        updateDiv("delivery", parsedOrderData.delivery);
        updateDiv("pay-in-person", parsedOrderData.pay_in_person);
        updateDiv("checkbox-order", parsedOrderData.checkbox_order);
        updateDiv("address", parsedOrderData.address);
        updateDiv("message-order", parsedOrderData.message);
        updateDiv("poli_pay", parsedOrderData.poli_pay);
        updateDiv("date-picker-order", parsedOrderData.date_picker_order);
        updateDiv("time-picker-order", parsedOrderData.time_picker_order);
        updateDiv("trade-order", tradeOrder);
        updateDiv("order_creation_time", orderCreationTime);
        updateDiv("First_Name_Order2", parsedOrderData.first_name_order);
        updateDiv("Last_Name_Order2", parsedOrderData.last_name_order);
        updateDiv("total-price2", parsedOrderData.total_price);
        updateDiv("total-amount", parsedOrderData.total_amount);

    } catch (error) {
        console.error("Error:", error);
    }
});
