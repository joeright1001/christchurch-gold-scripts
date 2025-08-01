// Define URLs
const DEV_URL = "https://cuddly-space-waddle-4jgr5gxqj6wg3q6jr-3000.app.github.dev";
const STAGING_FALLBACK_URL = "https://mware3-staging.up.railway.app";
const PROD_URL = "https://mware3-production.up.railway.app";

// Function to check if codespace is available
async function isCodespaceAvailable() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(DEV_URL + '/health', {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.log("Codespace not available:", error.message);
        return false;
    }
}

// Function to determine API URL based on environment
async function getApiBaseUrl() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('webflow.io')) {
        console.log("Staging environment detected - checking codespace availability");
        
        const codespaceAvailable = await isCodespaceAvailable();
        
        if (codespaceAvailable) {
            console.log("Using codespace DEV server");
            return DEV_URL;
        } else {
            console.log("Codespace unavailable - using railway staging server");
            return STAGING_FALLBACK_URL;
        }
    } else {
        console.log("Production environment detected - using PROD server");
        return PROD_URL;
    }
}



// Function to set session data with expiration
function setSessionDataWithExpiry(key, value, expiryMinutes) {
    const item = {
        value: value,
        expiry: new Date().getTime() + (expiryMinutes * 60 * 1000)
    };
    sessionStorage.setItem(key, JSON.stringify(item));
}

// Function to get session data and check expiry
function getSessionDataWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
    }
    return item.value;
}

document.addEventListener("DOMContentLoaded", async function () {
    // Store breadcrumb data for navigation
    const storeBreadcrumbData = () => {
        // Get data from specified elements
        const breadcrumbText = document.getElementById('breadcrumb-text')?.textContent || '';
        const breadcrumbUrl = document.getElementById('breadcrumb-url')?.getAttribute('href') || '';
        const metal = document.getElementById('metal')?.textContent || '';
        
        // Create data object
        const breadcrumbData = {
            name: breadcrumbText,
            url: breadcrumbUrl,
            metal: metal
        };
        
        // Store in session with 30-minute expiry
        setSessionDataWithExpiry("product_url", JSON.stringify(breadcrumbData), 30);
        console.log("Breadcrumb data stored:", breadcrumbData);
    };
    
    // Call function to store breadcrumb data
    storeBreadcrumbData();
    
    // Determine API_BASE_URL at startup
    const API_BASE_URL = await getApiBaseUrl();
    console.log(`Using API base URL: ${API_BASE_URL}`);
    
    // Get references to important form elements
    const orderButton = document.querySelector("#place-order-submit");
    const form = document.querySelector("#wf-form-bullion-order");
    
    // Exit if required elements aren't found
    if (!orderButton || !form) {
        console.error("Required elements not found");
        return;
    }

    // Function to show error message below a form field
    function showError(field, message) {
        // Remove any existing error message first
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Create and append new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '10px'; // Changed to 10px as requested
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
        field.style.borderColor = 'red';
    }

    // Function to clear error message from a field
    function clearError(field) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
        field.style.borderColor = '';
    }



    // Function to validate form before submission
    function validateForm(formData) {
        let isValid = true;
        let shouldScrollToDatePicker = false;
        let supplierCheckboxError = false; // Track supplier checkbox error separately

        // Define required fields and their error messages
        const requiredFields = {
            'first-name': 'First name is required',
            'last-name': 'Last name is required',
            'email': 'Email is required',
            'mobile': 'Phone number is required'
        };

        // Clear all existing errors first
        Object.keys(requiredFields).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) clearError(field);
        });

        // Check required fields
        Object.entries(requiredFields).forEach(([fieldName, message]) => {
            const value = formData.get(fieldName);
            const field = form.querySelector(`[name="${fieldName}"]`);

            if (!value || value.trim() === '') {
                showError(field, message);
                isValid = false;
            }
        });

        // Check supplier checkbox requirement
        const productTypeField = document.getElementById('product-type');
        const supplierCheckbox = document.getElementById('checkbox-supplier') || 
                                form.querySelector('[name="checkbox-supplier"]') || 
                                form.querySelector('#checkbox-supplier');
        const checkboxBlock = document.getElementById('checkbox-supplier-block');

        if (productTypeField && supplierCheckbox && checkboxBlock) {
            // Clear any existing error first
            clearError(checkboxBlock);

            // Get text content from div and trim whitespace
            const productTypeValue = productTypeField.textContent.toLowerCase().trim();

            if (productTypeValue === 'supplier' && !supplierCheckbox.checked) {
                showError(checkboxBlock, 'Please agree to supply ID if required');
                isValid = false;
                supplierCheckboxError = true; // Set flag for supplier checkbox error
            }
        }

        // Handle scrolling to error fields for better UX - but NOT for supplier checkbox
        if (!isValid && !supplierCheckboxError) {
            if (shouldScrollToDatePicker) {
                // Scroll to date-picker anchor if date/time validation failed
                const datePickerAnchor = document.querySelector('#date-picker');
                if (datePickerAnchor) {
                    datePickerAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Scroll to first-name-form anchor for other validation failures
                const firstNameAnchor = document.querySelector('#first-name-form');
                if (firstNameAnchor) {
                    firstNameAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }

        // Special check for product selection
        const productField = form.querySelector('[name="product-name-full"]');
        if (!formData.get('product-name-full')) {
            const noProductMessage = document.getElementById("no-product-selected");
            if (noProductMessage) {
                noProductMessage.style.display = "block";
                // Only scroll if this is the only error
                if (isValid || (!isValid && supplierCheckboxError)) {
                    noProductMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            isValid = false;
        }

        return isValid;
    }








    // Function to show processing state with spinner
    function showProcessingState(button) {
        const originalContent = button.innerHTML;
        button.innerHTML = 'Processing<span class="spinner"></span>';
        button.classList.add('button-processing');
        button.disabled = true;
        return originalContent;
    }

    // Function to restore button state
    function restoreButtonState(button, originalContent) {
        button.innerHTML = originalContent;
        button.classList.remove('button-processing');
        button.disabled = false;
    }

    // Handle order button click
    orderButton.addEventListener("click", async function(event) {
        event.preventDefault();
        
        // Get form data
        let formData = new FormData(form);

        // Validate form before proceeding
        if (!validateForm(formData)) {
            return;
        }

        // Get shipping fee from input element and set as constant
        const shippingFeeInput = document.querySelector("#shippingfee");
        const SHIPPING_FEE = shippingFeeInput ? parseFloat(shippingFeeInput.value) || 25.00 : 25.00;

        // Get total price and delivery method
        let totalPrice = formData.get("total-price");
        const deliveryMethod = formData.get("delivery");
        
        // Set shipping fee when shipping is selected
        let shippingFee = 0;
        if (deliveryMethod === "Shipping") {
            shippingFee = SHIPPING_FEE;
            totalPrice = (parseFloat(totalPrice) + shippingFee).toString();
        }

        // Prepare data for API submission
        let jsonData = {
            first_name_order: formData.get("first-name"),
            email_order: formData.get("email"),
            total_price: totalPrice, // Using modified total price
            last_name_order: formData.get("last-name") || "",
            phone_order: formData.get("mobile") || "",
            product_name_full: formData.get("product-name-full") || "",
            quantity: formData.get("quantity") || "",
            price_nzd: formData.get("price_nzd") || "",
            zoho_id: formData.get("zoho-id") || "",
            delivery: formData.get("delivery") || "",
            pay_in_person: formData.get("pay-in-person") || "",
            checkbox_order: formData.get("checkbox-order") || "",
            address: formData.get("address") || "",
            message: formData.get("message") || "",
            date_picker_order: formData.get("date-picker") || "",
            time_picker_order: formData.get("time-picker") || "",
            total_amount: formData.get("total-amount") || "",
            shippingfee: shippingFee.toString(), // Add shipping fee as separate field
            // GST related fields
            unit_gst: formData.get("unit-gst") || "",
            unit_price_nzd: formData.get("unit-price-nzd") || "",
            total_gst: formData.get("total-gst") || "",
            total_unit_price_nzd: formData.get("total-unit-price-nzd") || "",
            // New supplier data fields with name mapping
            supplier_status: formData.get("market-status") || "", // market-status → supplier_status
            supplier_name: formData.get("market") || "", // market → supplier_name
            sku: formData.get("sku") || "",
            auto_supplier: formData.get("auto-supplier") || "",
            supplier_item_id: formData.get("supplier-item-id") || ""
        };

        console.log("Collecting form data:", jsonData);

        // Store original button content and show processing state
        const originalButtonContent = showProcessingState(orderButton);

        try {
            // Submit order data to middleware API
            let response = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });

            let result = await response.json();
            console.log("Middleware response:", result);

            // If successful, store data and proceed with submission
            if (result.token && result.trade_order) {
                // Set session data with 30-minute expiry
                setSessionDataWithExpiry("orderData", JSON.stringify(jsonData), 30);
                setSessionDataWithExpiry("token", result.token, 30);
                setSessionDataWithExpiry("trade_order", result.trade_order, 30);
                setSessionDataWithExpiry("order_creation_time", result.order_creation_time, 30);

                // Update trade order fields on the form
                const tradeOrderField = document.querySelector("#trade-order");
                const tradeOrderDisplay = document.querySelector("#trade-order-display");

                if (tradeOrderField) tradeOrderField.value = result.trade_order;
                if (tradeOrderDisplay) tradeOrderDisplay.value = result.trade_order;

                console.log("Fields updated with trade-order:", result.trade_order);
                console.log("Token stored:", result.token);
                console.log("Order creation time stored:", result.order_creation_time);

                // Click the hidden submit button or submit the form
                const submitButton = document.querySelector("#submit-order");
                if (submitButton) {
                    submitButton.click();
                } else {
                    console.error("Submit button not found");
                    form.submit();
                }
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            // Handle errors during submission
            console.error("Error:", error);
            restoreButtonState(orderButton, originalButtonContent);
            orderButton.textContent = "Server-Error";
            
            // Display error message to user
            const serverErrorDiv = document.getElementById("server-error");
            if (serverErrorDiv) {
                serverErrorDiv.style.display = "block";
                serverErrorDiv.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
});
