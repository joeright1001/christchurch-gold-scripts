document.addEventListener('DOMContentLoaded', function() {
  console.log('Quote script loaded');

  // API Configuration
  const DEV_URL = "https://mware3-staging.up.railway.app";
  const STAGING_FALLBACK_URL = "https://mware3-staging.up.railway.app";  
  const PROD_URL = "https://mware3-production.up.railway.app";

  async function getApiBaseUrl() {
    if (location.hostname.includes('webflow.io')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000);
        const ok = (await fetch(DEV_URL + '/health', { signal: controller.signal })).ok;
        clearTimeout(timeout);
        return ok ? DEV_URL : STAGING_FALLBACK_URL;
      } catch {
        return STAGING_FALLBACK_URL;
      }
    }
    return PROD_URL;
  }

  // Populate form from URL parameters
  function populateFormFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    function setField(fieldId, value) {
      if (!value) return;
      
      // Try both regular field and field with "2" suffix
      ["", "2"].forEach(suffix => {
        const element = document.getElementById(fieldId + suffix);
        if (element) {
          if ("value" in element) element.value = value;
          element.textContent = value;
        }
      });
    }

    // Populate all fields
    setField("product-name-full", urlParams.get("product-name-full"));
    setField("quantity", urlParams.get("quantity"));  
    setField("total-price", urlParams.get("total-price"));
    setField("zoho-id", urlParams.get("zoho-id"));
    setField("collect", urlParams.get("collect"));
    setField("price_nzd", urlParams.get("price-nzd"));
    setField("unit-gst", urlParams.get("unit-gst"));
    setField("total-gst", urlParams.get("total-gst"));
    setField("gst-total", urlParams.get("total-gst"));
    setField("unit-price-nzd", urlParams.get("unit-price-nzd"));
    setField("total-unit-price-nzd", urlParams.get("total-unit-price-nzd"));
    setField("shippingfee", urlParams.get("shippingfee"));
    setField("market-status", urlParams.get("market-status"));
    setField("market", urlParams.get("market"));
    setField("sku", urlParams.get("sku"));
    setField("auto-supplier", urlParams.get("auto-supplier"));
    setField("supplier-item-id", urlParams.get("supplier-item-id"));
    setField("total-amount", urlParams.get("total-price"));

    // Handle image
    const imageUrl = urlParams.get("image-url");
    if (imageUrl) {
      const img = document.getElementById("product-image");
      if (img) img.src = imageUrl;
    }

    // Handle product URL
    const websiteUrl = urlParams.get("website-url");
    if (websiteUrl) {
      const returnUrl = new URL(`/buy-gold-details/${websiteUrl}`, window.location.origin).href;
      ["product-url-return", "breadcrumb-url"].forEach(id => {
        const link = document.getElementById(id);
        if (link) link.href = returnUrl;
      });
    }

    setField("breadcrumb-text", urlParams.get("product-name"));

    // Clean URL
    window.history.replaceState({}, "", window.location.pathname);
  }

  // Form validation
  function validateForm(formData) {
    let isValid = true;
    const form = document.querySelector('#wf-form-bullion-quote');
    
    const required = {
      'first-name': 'First name is required',
      'last-name': 'Last name is required', 
      'email': 'Email is required',
      'mobile': 'Phone number is required'
    };

    // Clear existing errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Validate required fields
    Object.entries(required).forEach(([fieldName, message]) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.style.borderColor = '';
        if (!formData.get(fieldName)?.trim()) {
          // Show error
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = message;
          field.parentElement.appendChild(errorDiv);
          field.style.borderColor = 'red';
          isValid = false;
        }
      }
    });

    // Check product selection
    if (!formData.get('product-name-full')) {
      const noProductMsg = document.getElementById('no-product-selected');
      if (noProductMsg) {
        noProductMsg.style.display = 'block';
        noProductMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      isValid = false;
    }

    return isValid;
  }

  // Session storage helper
  function setSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify({
      value: value,
      expiry: Date.now() + 30 * 60000
    }));
  }

  // Initialize the quote system
  async function initQuoteSystem() {
    const API_BASE_URL = await getApiBaseUrl();
    console.log('Using API base URL:', API_BASE_URL);

    const submitBtn = document.querySelector('#place-quote-submit');
    const form = document.querySelector('#wf-form-bullion-quote');

    if (!submitBtn || !form) {
      console.error('Required elements not found - Button:', !!submitBtn, 'Form:', !!form);
      return;
    }

    console.log('Quote system initialized successfully');

    submitBtn.addEventListener('click', async function(event) {
      event.preventDefault();
      console.log('Submit button clicked');

      const formData = new FormData(form);
      
      if (!validateForm(formData)) {
        console.log('Form validation failed');
        return;
      }

      // Show processing state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Processing<span class="spinner"></span>';
      submitBtn.classList.add('button-processing');
      submitBtn.disabled = true;

      // Prepare data for API
      const jsonData = {
        first_name_order: formData.get('first-name'),
        last_name_order: formData.get('last-name') || "",
        email_order: formData.get('email'),
        phone_order: formData.get('mobile') || "",
        product_name_full: formData.get('product-name-full') || "",
        quantity: formData.get('quantity') || "",
        price_nzd: formData.get('price_nzd') || "",
        zoho_id: formData.get('zoho-id') || "",
        collect: formData.get('collect') || "",
        message: formData.get('message') || "",
        total_price: formData.get('total-price') || "",
        total_amount: formData.get('total-amount') || "",
        shippingfee: "0", // Default for quotes
        unit_gst: formData.get('unit-gst') || "",
        total_gst: formData.get('total-gst') || "",
        unit_price_nzd: formData.get('unit-price-nzd') || "",
        total_unit_price_nzd: formData.get('total-unit-price-nzd') || "",
        supplier_status: formData.get('market-status') || "",
        supplier_name: formData.get('market') || "",
        sku: formData.get('sku') || "",
        auto_supplier: formData.get('auto-supplier') || "",
        supplier_item_id: formData.get('supplier-item-id') || ""
      };

      console.log('Submitting data to API:', jsonData);

      try {
        const response = await fetch(`${API_BASE_URL}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData)
        });

        const result = await response.json();
        console.log('API response:', result);

        if (result.token && result.trade_order) {
          // Store session data
          setSessionData('orderData', JSON.stringify(jsonData));
          setSessionData('token', result.token);
          setSessionData('trade_order', result.trade_order);
          
          // Set trade order in form
          const tradeOrderField = document.getElementById('trade-order');
          if (tradeOrderField) {
            tradeOrderField.value = result.trade_order;
          }

          // Submit the Webflow form
          const webflowSubmit = document.getElementById('submit-quote');
          if (webflowSubmit) {
            webflowSubmit.click();
          } else {
            form.submit();
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error:', error);
        
        // Restore button state
        submitBtn.innerHTML = originalHTML;
        submitBtn.classList.remove('button-processing');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Server Error';
        
        // Show error message
        const serverError = document.getElementById('server-error');
        if (serverError) {
          serverError.style.display = 'block';
          serverError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Start the system
  populateFormFromURL();
  initQuoteSystem();
});
