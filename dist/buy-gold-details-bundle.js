/* buy-gold-details Bundle - Generated 2025-08-02 14:04:55 */

/* === accordion-handler.js === */
document.addEventListener('DOMContentLoaded', function() {
  // First functionality (buy-back-product)
  const buyBackProduct = document.getElementById('buy-back-product');
  const certBuyBackHeading = document.getElementById('cert-buy-back-heading');
  
  if (buyBackProduct && certBuyBackHeading) {
    buyBackProduct.style.cursor = 'pointer';
    
    buyBackProduct.addEventListener('click', function(e) {
      e.preventDefault();
      
      // The header is directly the element with ID 'cert-buy-back-heading'
      certBuyBackHeading.click();
      
      // Keep the smooth scroll behavior
      const headerOffset = 100;
      const elementPosition = certBuyBackHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      $('html, body').animate({
        scrollTop: offsetPosition
      }, 1200, 'swing');
    });
  }
  
  // Second functionality (brands-we-sell-linkv2 and brands-we-sell-linkv3)
  const brandsWeSellLinks = [
    document.getElementById('brands-we-sell-linkv2'),
    document.getElementById('brands-we-sell-linkv4')
  ];
  const brandsWeSellHeader = document.getElementById('brands-we-sell');
  
  if (brandsWeSellHeader) {
    brandsWeSellLinks.forEach(function(link) {
      if (link) {
        link.style.cursor = 'pointer';
        
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Click the accordion header directly
          brandsWeSellHeader.click();
          
          // Keep the smooth scroll behavior
          const headerOffset = 100;
          const elementPosition = brandsWeSellHeader.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          $('html, body').animate({
            scrollTop: offsetPosition
          }, 1200, 'swing');
        });
      }
    });
  }
  
  // Third functionality (how-it-works-link)
  const howItWorksLink = document.getElementById('how-it-works-link');
  const howItWorksHeader = document.getElementById('how-it-works');
  
  if (howItWorksLink && howItWorksHeader) {
    howItWorksLink.style.cursor = 'pointer';
    
    howItWorksLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Click the accordion header directly
      howItWorksHeader.click();
      
      // Keep the smooth scroll behavior
      const headerOffset = 100;
      const elementPosition = howItWorksHeader.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      $('html, body').animate({
        scrollTop: offsetPosition
      }, 1200, 'swing');
    });
  }
});

/* === broker-data-transfer.js === */
/**
 * Script Name: Broker Data Transfer Script
 *
 * Purpose:
 * This script captures product details from the page, including product name, quantity, total price, 
 * Zoho ID, price in NZD, image URL, website URL, product name, metal, and product-type. It then transfers 
 * this data via URL parameters when the user clicks the "Broker" button.
 *
 * Functionality:
 * 1. Retrieves data from fields: #product-name-full, #quantity, #total-price, #zoho-id, #price_nzd,
 *    #image-url, #website-url, #product-name, #metal, and #product-type.
 * 2. Waits for CMS-rendered content to ensure all necessary data is loaded.
 * 3. Validates that all required fields are filled before proceeding.
 * 4. Constructs a URL with query parameters and redirects the user to the contact page.
 *
 * Usage:
 * - Ensure the relevant fields exist in the HTML.
 * - The button triggering this functionality must have the ID "broker".
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get field references
  const productNameField       = document.getElementById("product-name-full");
  const quantityField          = document.getElementById("quantity");
  const totalPriceField        = document.getElementById("total-price");
  const zohoIdField            = document.getElementById("zoho-id");
  const priceNZDField          = document.getElementById("price_nzd");

  // Additional fields
  const imageUrlField          = document.getElementById("image-url");
  const websiteUrlField        = document.getElementById("website-url");
  const productNameShortField  = document.getElementById("product-name");
  const metalField             = document.getElementById("metal");
  const productTypeField       = document.getElementById("product-type");

  /* ------------- BROKER BUTTON ------------- */
  const brokerButton       = document.getElementById("broker");

  // Wait for CMS-rendered content (if necessary)
  function waitForCMSData(cb, tries = 10) {
    if (
      productNameField?.textContent.trim() &&
      totalPriceField?.textContent.trim()
    ) {
      cb();
    } else if (tries) {
      setTimeout(() => waitForCMSData(cb, tries - 1), 200);
    } else {
      alert("Failed to load product details. Please try again.");
    }
  }

  // Event listener for button click
  brokerButton?.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behaviour

    waitForCMSData(() => {
      /* --------- gather values --------- */
      const productName = productNameField.textContent.trim();
      const quantity    = parseInt(quantityField.value, 10) || 1;
      const totalPrice  = totalPriceField.textContent.trim();
      const zohoId      = zohoIdField?.textContent.trim() || "";
      const priceNZD    = priceNZDField?.textContent.trim() || "";

      // Required-field check (price_nzd included)
      if (!productName || !quantity || !totalPrice || !zohoId || !priceNZD) {
        alert("Please ensure all fields are filled out before placing the order.");
        return;
      }

      const qp = new URLSearchParams({
        "product-name-full" : productName,
        quantity            : quantity,
        "total-price"       : totalPrice,
        "zoho-id"           : zohoId,
        "price_nzd"         : priceNZD,

        "image-url"         : imageUrlField?.textContent.trim() || "",
        "website-url"       : websiteUrlField?.textContent.trim() || "",
        "product-name"      : productNameShortField?.textContent.trim() || "",
        metal               : metalField?.textContent.trim() || "",
        "product-type"      : productTypeField?.textContent.trim() || ""
      });

      /* --------- redirect --------- */
      window.location.href = `/contact-us?${qp.toString()}`;
    });
  });
});

/* === hidden-field-updater.js === */
document.addEventListener("DOMContentLoaded", function () {
  /* helper to turn â€œ5,677.24â€ â†’ 5677.24 */
  const toNumber = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

  const qtyInput      = document.getElementById("quantity");
  const unitPriceEl   = document.getElementById("unit-price-nzd");
  const unitGstEl     = document.getElementById("unit-gst");
  const totalUnitEl   = document.getElementById("total-unit-price-nzd");
  const totalGstEl    = document.getElementById("total-gst");

  if (!qtyInput || !unitPriceEl || !unitGstEl || !totalUnitEl || !totalGstEl) return;

  function calcTotals() {
    const qty        = parseInt(qtyInput.value, 10) || 1;
    totalUnitEl.textContent = (toNumber(unitPriceEl.textContent) * qty).toFixed(2);
    totalGstEl.textContent  = (toNumber(unitGstEl.textContent)   * qty).toFixed(2);
  }

  qtyInput.addEventListener("input", calcTotals);  // run whenever qty changes
  calcTotals();                                    // run once on load
});

/* === lightbox-overlay.js === */
document.addEventListener('DOMContentLoaded', function() {
  // Function to get style settings based on viewport width
  function getResponsiveStyles() {
    const width = window.innerWidth;
    
    // Mobile (smaller than 480px)
    if (width < 480) {
      return {
        fontSize: '1rem',
        bottomPosition: '45%',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '10px'
      };
    }
    // Large mobile (480px - 767px)
    else if (width >= 480 && width < 768) {
      return {
        fontSize: '1.125rem',
        bottomPosition: '45%',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '15px'
      };
    }
    // Tablet (768px - 991px)
    else if (width >= 768 && width < 992) {
      return {
        fontSize: '1.5rem',
        bottomPosition: '45%',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '25px'
      };
    }
    // Desktop (992px and above)
    else {
      return {
        fontSize: '2rem',
        bottomPosition: '40%',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderRadius: '30px'
      };
    }
  }

  // Function to add text overlay to lightbox
  function addTextOverlayToLightbox() {
    // Check if the lightbox exists in the DOM
    const lightboxInterval = setInterval(function() {
      const lightbox = document.querySelector('.w-lightbox-container');
      
      if (lightbox && !document.querySelector('.lightbox-custom-text')) {
        clearInterval(lightboxInterval);
        
        // Get the responsive styles for current viewport
        const styles = getResponsiveStyles();
        
        // Create the container div for centering
        const containerDiv = document.createElement('div');
        containerDiv.style.position = 'absolute';
        containerDiv.style.bottom = styles.bottomPosition;
        containerDiv.style.left = '0';
        containerDiv.style.right = '0';
        containerDiv.style.textAlign = 'center';
        containerDiv.style.zIndex = '9999';
        containerDiv.style.pointerEvents = 'none'; // Make container transparent to mouse/touch events
        
        // Create the text overlay element
        const textOverlay = document.createElement('div');
        textOverlay.className = 'lightbox-custom-text';
        textOverlay.textContent = '1 Oz Silver Krugerrand 2025';
        
        // Style the text overlay
        textOverlay.style.display = 'inline-block';
        textOverlay.style.color = 'white';
        textOverlay.style.fontFamily = '"Times New Roman", Times, serif';
        textOverlay.style.fontSize = styles.fontSize;
        
        // Add text-shadow for better visibility
        textOverlay.style.textShadow = '1px 1px 3px rgba(0,0,0,0.7)';
        
        // Semi-transparent background with custom padding
        textOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        textOverlay.style.paddingTop = styles.paddingTop;
        textOverlay.style.paddingBottom = styles.paddingBottom;
        textOverlay.style.paddingLeft = styles.paddingLeft;
        textOverlay.style.paddingRight = styles.paddingRight;
        textOverlay.style.borderRadius = styles.borderRadius;
        textOverlay.style.maxWidth = '90%'; // Prevent too wide on small screens
        
        // Add the text overlay to the container, then to the lightbox
        containerDiv.appendChild(textOverlay);
        lightbox.appendChild(containerDiv);
      }
    }, 100);
  }

  // Function to update responsive elements on window resize
  function updateResponsiveElements() {
    const textOverlay = document.querySelector('.lightbox-custom-text');
    if (textOverlay) {
      const styles = getResponsiveStyles();
      
      // Update all responsive style properties
      textOverlay.style.fontSize = styles.fontSize;
      textOverlay.style.paddingTop = styles.paddingTop;
      textOverlay.style.paddingBottom = styles.paddingBottom;
      textOverlay.style.paddingLeft = styles.paddingLeft;
      textOverlay.style.paddingRight = styles.paddingRight;
      textOverlay.style.borderRadius = styles.borderRadius;
      
      const containerDiv = textOverlay.parentElement;
      if (containerDiv) {
        containerDiv.style.bottom = styles.bottomPosition;
      }
    }
  }

  // Listen for clicks on your specific lightbox elements
  const lightboxLinks = document.querySelectorAll('.product-header1_lightbox-link-2');
  lightboxLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Short delay to ensure lightbox is in the DOM
      setTimeout(addTextOverlayToLightbox, 300);
    });
  });
  
  // Also handle when users navigate between lightbox images
  document.addEventListener('click', function(e) {
    if (e.target.closest('.w-lightbox-control') && document.querySelector('.w-lightbox-container')) {
      // Remove existing text overlay if present
      const existingOverlay = document.querySelector('.lightbox-custom-text');
      if (existingOverlay) {
        const containerDiv = existingOverlay.parentElement;
        if (containerDiv) containerDiv.remove();
      }
      
      // Re-add the text overlay
      setTimeout(addTextOverlayToLightbox, 300);
    }
  });

  // Handle window resize to update all responsive elements
  window.addEventListener('resize', updateResponsiveElements);
});

/* === market-closed-modal.js === */
document.addEventListener('DOMContentLoaded', function() {
  // Create and inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 480px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      transform: translateY(30px) scale(0.95);
      transition: all 0.3s ease;
      position: relative;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0) scale(1);
    }

    .modal-header {
      padding: 24px 24px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 16px;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .modal-close:hover {
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .modal-body h2 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .modal-body p {
      font-size: 16px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 120px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .modal-content {
        margin: 20px;
        width: calc(100% - 40px);
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        flex: none;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Create and inject HTML
  const modalHTML = `
    <div id="market-closed-modal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
            </svg>
          </div>
          <button class="modal-close" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <h2>Market Currently Closed</h2>
          <p>The market is closed. You can wait until trading recommences or speak to a broker during business hours for more options.</p>
          <div class="modal-actions">
            <button class="btn-secondary" id="wait-btn">Wait for Market Open</button>
            <button class="btn-primary" id="contact-broker">Bullion Broker</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // JavaScript functionality
  const marketClosedButton = document.getElementById('button-closed');
  const modal = document.getElementById('market-closed-modal');
  const closeModal = document.getElementById('modal-close');
  const waitBtn = document.getElementById('wait-btn');
  const contactBrokerBtn = document.getElementById('contact-broker');

  // Show modal when market closed button is clicked
  if (marketClosedButton) {
    marketClosedButton.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close modal function
  function closeModalFunction() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal when X button is clicked
  closeModal.addEventListener('click', closeModalFunction);

  // Close modal when clicking outside of it
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalFunction();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModalFunction();
    }
  });

  // Wait button functionality
  waitBtn.addEventListener('click', function() {
    closeModalFunction();
    // Add your logic here for what happens when user chooses to wait
    console.log('User chose to wait for market open');
  });

  // Bullion Broker button functionality - redirects to /broker
  contactBrokerBtn.addEventListener('click', function() {
    window.location.href = '/contact-us';
  });
});

/* === mobile-dropdowns.js === */
//control four of the modile sub menu dropdown. to address buggy webflow interactions

document.addEventListener('DOMContentLoaded', function() {
  // Define all dropdown sets with their respective IDs
  const dropdowns = [
    {
      trigger: 'heading-menu-drop-mob-sub-jew',
      content: 'site-links-sub-mob-jew',
      icon: 'code-icon-58-jew'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-price',
      content: 'site-links-sub-mob-price',
      icon: 'code-icon-58-price'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-help',
      content: 'site-links-sub-mob-help',
      icon: 'code-icon-58-help'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-bul',
      content: 'site-links-sub-mob-bul',
      icon: 'code-icon-58-bul'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-jew2',
      content: 'site-links-sub-mob-jew2',
      icon: 'code-icon-58-jew2'
    }
  ];
  
  // Initialize each dropdown
  dropdowns.forEach(function(dropdown) {
    initializeDropdown(
      document.getElementById(dropdown.trigger),
      document.getElementById(dropdown.content),
      document.getElementById(dropdown.icon)
    );
  });
  
  // Function to initialize dropdown behavior
  function initializeDropdown(menuTrigger, submenu, icon) {
    // Skip if any element doesn't exist
    if (!menuTrigger || !submenu || !icon) {
      console.warn('Missing element for dropdown', menuTrigger, submenu, icon);
      return;
    }
    
    // Set initial state
    submenu.style.height = '0px';
    submenu.style.opacity = '0';
    submenu.style.overflow = 'hidden';
    submenu.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    icon.style.transition = 'transform 0.3s ease';
    
    // Track if submenu is open or closed
    let isOpen = false;
    
    // Function to toggle submenu
    function toggleSubmenu(event) {
      event.preventDefault();
      
      if (!isOpen) {
        // First set height to auto to calculate actual height
        submenu.style.height = 'auto';
        const height = submenu.offsetHeight + 'px';
        
        // Reset to closed state before animating
        submenu.style.height = '0px';
        
        // Force browser to recognize the change before animating
        setTimeout(function() {
          submenu.style.height = height;
          submenu.style.opacity = '1';
          icon.style.transform = 'rotateX(180deg)';
        }, 10);
        
        isOpen = true;
      } else {
        submenu.style.height = '0px';
        submenu.style.opacity = '0';
        icon.style.transform = 'rotateX(0deg)';
        isOpen = false;
      }
    }
    
    // Add click event listener
    menuTrigger.addEventListener('click', toggleSubmenu);
  }
});

/* === order-data-transfer.js === */
/**
 * Order Data Transfer Script  â€“ adds GST & unit-price params
 * (everything else unchanged)
 */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- field handles ---------- */
  const $ = (id) => document.getElementById(id);

  const productNameField        = $("product-name-full");
  const quantityField           = $("quantity");
  const totalPriceField         = $("total-price");
  const zohoIdField             = $("zoho-id");
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

/* === page-display-logic.js === */
/* =========================================================================
   Christchurch Gold â€“ Display Logic (template-only)
   Injects its own "hide by default" CSS so the rules are page-local.
   ========================================================================= */

(function () {
  const hideCSS = `
    #icon-in-stock,#icon-34-weeks,#icon-35-days,#icon-out-stock,
    #icon-market-closed,#icon-247,
    #state-today,#state-34-weeks,#state-35-days,#state-out-stock,
    #state-market-247,#state-market-nz-open,#state-market-nz-closed,
    #state-market-dg-open,#state-market-dg-closed,#state-market-out-stock,
    #place-order,#get-quote,#button-closed,#button-247,
    #market-button-text-nz-closed,#market-button-text-dg-closed,
    #market-button-text-closed,#investor-1-oz-gold,#investor-1-oz-silver,
    #offline-order-text,#broker-text{display:none;}
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = hideCSS;
  document.head.appendChild(styleTag);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* cache flags */
  const productType =
    document.getElementById('product-type')?.textContent.trim().toLowerCase() || '';
  const onlineOrderFlag =
    document.getElementById('online-order')?.textContent.trim().toLowerCase() || '';

  function showElement(id, display = 'block') {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  }

  function showInvestorButtons(metalValue) {
    if (metalValue === 'gold') {
      showElement('investor-1-oz-gold', 'inline-block');
    } else if (metalValue === 'silver') {
      showElement('investor-1-oz-silver', 'inline-block');
    } else if (metalValue === 'all') {
      showElement('investor-1-oz-gold', 'inline-block');
      showElement('investor-1-oz-silver', 'inline-block');
    }
  }

  /* ---------- 1. Hide investor-works for Supplier / Collectable ---------- */
  if (['supplier', 'collectable'].includes(productType)) {
    const block = document.getElementById('how-investor-works');
    if (block) block.style.display = 'none';
  }

  /* ---------- 2. GST inclusive notice ----------------------------------- */
  {
    const gstBlock = document.getElementById('gst-incl-block');
    if (gstBlock) gstBlock.style.display = 'none';
    const gstUnit = document.getElementById('unit-gst');
    if (gstUnit && gstBlock) {
      const v = parseFloat(gstUnit.value ?? gstUnit.textContent);
      if (!isNaN(v) && v > 1) gstBlock.style.display = 'flex';
    }
  }

  /* ---------- 3. Stock & market status logic (template guard) ------------ */
  if (window.location.pathname.startsWith('/buy-gold-details/')) {
    const stock = document.getElementById('stock-status')?.textContent.trim();
    const market = document.getElementById('market-status')?.textContent.trim();
    const onlineOrder = document.getElementById('online-order')?.textContent.trim().toLowerCase();
    const metal = document.getElementById('metal')?.textContent.trim().toLowerCase();

    // Override: online-order = false
    if (onlineOrder === 'false') {
      showElement('broker');
      showElement('offline-order-text');
      showElement('state-out-stock', 'flex');
      showElement('icon-out-stock');
      return; // Exit early, don't process other combinations
    }

    // Only process if we have both stock and market values
    if (stock && market) {
      // Handle specific combinations only
      if (market === 'dg-closed' && stock === 'live-at-the-mint') {
        showElement('state-market-dg-closed', 'block'); // FIXED: block not flex
        showInvestorButtons(metal);
        showElement('icon-market-closed');
        showElement('button-closed');
        showElement('broker-text');
        showElement('broker');
        showElement('market-button-text-dg-closed');
      }
      else if (market === 'dg-open' && stock === 'live-at-the-mint') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('icon-34-weeks');
        showElement('state-market-dg-open', 'flex');
        showElement('state-34-weeks', 'flex');
      }
      else if (market === 'dg-closed' && stock === 'out-stock') {
       
        showElement('broker');
        showElement('offline-order-text');
        showElement('state-market-out-stock', 'block'); // Correctly block
        showInvestorButtons(metal);
        showElement('icon-out-stock');
      }
      else if (market === 'dg-open' && stock === 'out-stock') {
       
        showElement('broker');
        showElement('offline-order-text');
        showElement('state-market-out-stock', 'block'); // Correctly block
        showInvestorButtons(metal);
        showElement('icon-out-stock');
      }
      else if (market === '247-open' && stock === 'in-stock') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('state-today', 'flex');
        showElement('state-market-247', 'flex');
        showElement('icon-in-stock');
        showElement('icon-247');
      }
      else if (market === '247-open' && stock === 'low-stock') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('state-35-days', 'flex');
        showElement('icon-35-days');
      }
      // All other combinations: hide all (default behavior)
    }
  }

  /* ---------- 4. OVERRIDE: show #button-247 for Collectable + online TRUE ---- */
  if (productType === 'collectable' && onlineOrderFlag === 'true') {
    showElement('button-247', 'inline-block');
  }
});

/* === price-refresh-timer.js === */
/* ------------------------------------------------------------------
   Configuration
------------------------------------------------------------------- */
const COUNTDOWN_SECONDS = 120;         /* 120 s = 2 min */

/* IDs updated from CMS on every refresh */
const FIELDS_TO_UPDATE = [
  "#price_nzd",
  "#unit-price-nzd",
  "#unit-gst"
];

/* ------------------------------------------------------------------
   Cached elements
------------------------------------------------------------------- */
const minCounterEl = document.getElementById("min-counter");   // optional
const secCounterEl = document.getElementById("sec-counter");   // optional

/* ------------------------------------------------------------------
   Utility
------------------------------------------------------------------- */
const text = (el) => (el ? el.textContent.trim() : null);

/* ------------------------------------------------------------------
   1. Price refresh via XHR
------------------------------------------------------------------- */
function fetchAndUpdatePrices() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", window.location.href, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;

    const tmp = document.createElement("html");
    tmp.innerHTML = xhr.responseText;
    const changes = {};

    FIELDS_TO_UPDATE.forEach((sel) => {
      const newEl = tmp.querySelector(sel);
      const curEl = document.querySelector(sel);
      if (!newEl || !curEl) return;

      const newVal = text(newEl);
      if (newVal !== text(curEl)) {
        curEl.textContent = newVal;
        changes[sel] = newVal;
      }
    });

    if (Object.keys(changes).length) {
      document.dispatchEvent(
        new CustomEvent("price-refreshed", { detail: changes })
      );
    }
  };

  xhr.send();
}

/* ------------------------------------------------------------------
   2. Front-end looping timer
------------------------------------------------------------------- */
function startCountdown() {
  if (!minCounterEl || !secCounterEl) {
    /* Even if no visible display, still trigger periodic refresh */
    setInterval(fetchAndUpdatePrices, COUNTDOWN_SECONDS * 1000);
    return;
  }

  let secs = COUNTDOWN_SECONDS;

  function tick() {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    minCounterEl.textContent = String(m).padStart(2, "0");
    secCounterEl.textContent = String(s).padStart(2, "0");

    if (--secs < 0) {             // reached 00:00
      fetchAndUpdatePrices();     // pull fresh prices
      secs = COUNTDOWN_SECONDS;   // reset timer
    }
  }

  tick();                         // paint immediately
  setInterval(tick, 1000);        // then every second
}

/* ------------------------------------------------------------------
   3. Initialise
------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  fetchAndUpdatePrices();   // first pull
  startCountdown();         // start visible (or headless) timer
});

/* === quantity-manager.js === */
/* qty-limits.js â€“ shows red min/max badges 5 px right of field */
(function () {

  /* ------------------------------------------------------------------
     Elements
  ------------------------------------------------------------------ */
  const qtyInput     = document.getElementById("quantity");
  const minQtyEl     = document.getElementById("min-quantity-value");
  const maxQtyEl     = document.getElementById("max-quantity-value");

  const priceNZDEl   = document.getElementById("price_nzd");       // optional
  const totalPriceEl = document.getElementById("total-price");     // optional

  const unitPriceEl  = document.getElementById("unit-price-nzd");
  const unitGstEl    = document.getElementById("unit-gst");
  const totalUnitEl  = document.getElementById("total-unit-price-nzd");
  const totalGstEl   = document.getElementById("total-gst");

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const num = (t) => parseFloat(String(t).replace(/[^0-9.\-]+/g, "")) || 0;

  /* ------------------------------------------------------------------
     Totals
  ------------------------------------------------------------------ */
  function recalcTotals() {
    const qty = parseInt(qtyInput?.value, 10) || 1;

    if (priceNZDEl && totalPriceEl) {
      totalPriceEl.textContent = (num(priceNZDEl.textContent) * qty).toFixed(2);
    }
    if (unitPriceEl && totalUnitEl) {
      totalUnitEl.textContent = (num(unitPriceEl.textContent) * qty).toFixed(2);
    }
    if (unitGstEl && totalGstEl) {
      totalGstEl.textContent  = (num(unitGstEl.textContent) * qty).toFixed(2);
    }
  }

  /* ------------------------------------------------------------------
     Warning badge creation
  ------------------------------------------------------------------ */
  function createWarn(message, className) {
    const span = document.createElement("span");
    span.className   = className;
    span.textContent = message;
    span.style.display = "none";
    qtyInput.parentNode.insertBefore(span, qtyInput.nextSibling);
    return span;
  }

  /* ------------------------------------------------------------------
     Limit enforcement
  ------------------------------------------------------------------ */
  let minWarnSpan = null;
  let maxWarnSpan = null;
  let userInteracted = false;

  function enforceQtyLimits() {
    if (!qtyInput) return;

    // read min / max values from DOM
    let minQty = 1;
    if (minQtyEl) {
      const parsed = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) minQty = parsed;
    }
    let maxQty = Infinity;
    if (maxQtyEl) {
      const parsed = parseInt(maxQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) maxQty = parsed;
    }

    // clamp value
    let val = parseInt(qtyInput.value, 10) || minQty;
    if (val < minQty) val = minQty;
    if (val > maxQty) val = maxQty;
    qtyInput.value = val;

    // show / hide badges once the shopper has interacted
    if (userInteracted) {
      if (minWarnSpan) minWarnSpan.style.display = (val <= minQty) ? "inline-block" : "none";
      if (maxWarnSpan) maxWarnSpan.style.display = (val >= maxQty) ? "inline-block" : "none";
    }

    recalcTotals();
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    if (!qtyInput) return;

    /* inject style for the badges once */
    if (!document.getElementById("qty-limits-style")) {
      const style = document.createElement("style");
      style.id = "qty-limits-style";
      style.textContent = `
        .min-qty-message,
        .max-qty-message {
          margin-left: 5px;
          font-size: 0.875rem;
          line-height: 1;
          vertical-align: middle;
          color: #c00; /* red */
        }
      `;
      document.head.appendChild(style);
    }

    qtyInput.style.display = "inline-block";

    // ensure starting value meets minimum
    let minQty = 1;
    if (minQtyEl) {
      const parsed = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(parsed)) minQty = parsed;
    }
    if (!qtyInput.value || parseInt(qtyInput.value, 10) < minQty) {
      qtyInput.value = minQty;
    }

    // create (hidden) badges
    if (minQtyEl) {
      const minVal = parseInt(minQtyEl.textContent.trim(), 10);
      if (!isNaN(minVal)) {
        qtyInput.setAttribute("min", minVal);
        minWarnSpan = createWarn(`min: ${minVal}`, "min-qty-message");
      }
    }
    if (maxQtyEl) {
      const maxVal = parseInt(maxQtyEl.textContent.trim(), 10);
      if (!isNaN(maxVal)) {
        qtyInput.setAttribute("max", maxVal);
        maxWarnSpan = createWarn(`max: ${maxVal}`, "max-qty-message");
      }
    }

    /* helper: mark interaction + enforce immediately */
    const touchAndEnforce = () => {
      userInteracted = true;
      enforceQtyLimits();
    };

    /* listeners */
    qtyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
      if (e.key === "ArrowUp" || e.key === "ArrowDown") touchAndEnforce();
    });
    qtyInput.addEventListener("focus",  touchAndEnforce);
    qtyInput.addEventListener("click",  touchAndEnforce);  // spinner arrows
    qtyInput.addEventListener("wheel",  touchAndEnforce);  // mouse wheel
    qtyInput.addEventListener("input",  touchAndEnforce);
    qtyInput.addEventListener("change", touchAndEnforce);

    document.addEventListener("price-refreshed", recalcTotals);

    /* initial clamp / totals (badges hidden) */
    enforceQtyLimits();
  });
})();

/* === quote-data-transfer.js === */
/**
 * Script Name: Quote Data Transfer Script
 *
 * Purpose:
 * This script captures product details from the page, including product name, quantity, total price, 
 * Zoho ID, price in NZD, image URL, website URL, product name, metal, and additional supplier data.
 * It then transfers this data via URL parameters when the user clicks the "Get Quote" button.
 *
 * Functionality:
 * 1. Retrieves data from fields: #product-name-full, #quantity, #total-price, #zoho-id, #price_nzd,
 *    #image-url, #website-url, #product-name, #metal, #shippingfee, #market-status, #market,
 *    #sku, #auto-supplier, and #supplier-item-id.
 * 2. Waits for CMS-rendered content to ensure all necessary data is loaded.
 * 3. Validates that all required fields are filled before proceeding.
 * 4. Constructs a URL with query parameters and redirects the user to the quote page.
 *
 * Usage:
 * - Ensure the relevant fields exist in the HTML.
 * - The button triggering this functionality must have the ID "get-quote".
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get field references
  const productNameField = document.getElementById("product-name-full"); // CMS-linked field
  const quantityField = document.getElementById("quantity"); // Number input
  const totalPriceField = document.getElementById("total-price"); // Calculated price
  const zohoIdField = document.getElementById("zoho-id"); // Zoho ID field
  const priceNZDField = document.getElementById("price_nzd"); // Price in NZD field
  
  // Additional fields
  const imageUrlField = document.getElementById("image-url"); // Image URL field
  const websiteUrlField = document.getElementById("website-url"); // Website URL field
  const productNameShortField = document.getElementById("product-name"); // Product name field
  const metalField = document.getElementById("metal"); // Metal field

  // New supplier data fields
  const shippingFeeField = document.getElementById("shippingfee"); // Shipping fee field
  const marketStatusField = document.getElementById("market-status"); // Market status field
  const marketField = document.getElementById("market"); // Market field
  const skuField = document.getElementById("sku"); // SKU field
  const autoSupplierField = document.getElementById("auto-supplier"); // Auto supplier field
  const supplierItemIdField = document.getElementById("supplier-item-id"); // Supplier item ID field

  const getQuoteButton = document.getElementById("get-quote");

  // Wait for CMS-rendered content (if necessary)
  function waitForCMSData(callback) {
    const maxRetries = 10; // Max attempts to find CMS data
    let retries = 0;

    function checkFields() {
      if (
        productNameField &&
        productNameField.textContent.trim() &&
        totalPriceField &&
        totalPriceField.textContent.trim()
      ) {
        callback(); // Fields are ready, execute callback
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(checkFields, 200); // Retry after 200ms
      } else {
        console.error("CMS data not loaded in time.");
        alert("Failed to load product details. Please try again.");
      }
    }

    checkFields();
  }

  // Event listener for button click
  getQuoteButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior

    // Ensure all fields are ready
    waitForCMSData(() => {
      const productName = productNameField.textContent.trim(); // Get CMS value
      const quantity = parseInt(quantityField.value, 10) || 1; // Validate quantity
      const totalPrice = totalPriceField.textContent.trim(); // Get calculated price
      const zohoId = zohoIdField ? zohoIdField.textContent.trim() : ""; // Get Zoho ID
      const priceNZD = priceNZDField ? priceNZDField.textContent.trim() : ""; // Get price in NZD
      
      // Get values from additional fields
      const imageUrl = imageUrlField ? imageUrlField.textContent.trim() : ""; // Get image URL
      const websiteUrl = websiteUrlField ? websiteUrlField.textContent.trim() : ""; // Get website URL
      const productNameShort = productNameShortField ? productNameShortField.textContent.trim() : ""; // Get product name
      const metal = metalField ? metalField.textContent.trim() : ""; // Get metal type

      // Get values from new supplier data fields
      const shippingFee = shippingFeeField ? shippingFeeField.textContent.trim() : ""; // Get shipping fee
      const marketStatus = marketStatusField ? marketStatusField.textContent.trim() : ""; // Get market status
      const market = marketField ? marketField.textContent.trim() : ""; // Get market
      const sku = skuField ? skuField.textContent.trim() : ""; // Get SKU
      const autoSupplier = autoSupplierField ? autoSupplierField.textContent.trim() : ""; // Get auto supplier
      const supplierItemId = supplierItemIdField ? supplierItemIdField.textContent.trim() : ""; // Get supplier item ID

      // Validation
      if (!productName || !quantity || !totalPrice || !zohoId || !priceNZD) {
        alert("Please ensure all fields are filled out before placing the order.");
        return;
      }

      // Construct the target URL with query parameters
      const targetUrl = `/quote?product-name-full=${encodeURIComponent(
        productName
      )}&quantity=${encodeURIComponent(quantity)}&total-price=${encodeURIComponent(
        totalPrice
      )}&zoho-id=${encodeURIComponent(zohoId)}&price-nzd=${encodeURIComponent(priceNZD)}
      &image-url=${encodeURIComponent(imageUrl)}&website-url=${encodeURIComponent(websiteUrl)}
      &product-name=${encodeURIComponent(productNameShort)}&metal=${encodeURIComponent(metal)}
      &shippingfee=${encodeURIComponent(shippingFee)}&market-status=${encodeURIComponent(marketStatus)}
      &market=${encodeURIComponent(market)}&sku=${encodeURIComponent(sku)}
      &auto-supplier=${encodeURIComponent(autoSupplier)}&supplier-item-id=${encodeURIComponent(supplierItemId)}`;

      // Redirect to the target page
      window.location.href = targetUrl;
    });
  });
});

/* === stock-status-display.js === */
/**
document.addEventListener('DOMContentLoaded', function() {
  // Define the items and their corresponding element IDs
  const stockItems = [
     { 
      stockLevelId: '1-oz-gold-stock-level',
      stockIconId: '1-oz-gold-stock-icon'
    }
  ];
  
  // Image URLs
  const backOrderImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/678cae03e2e40ea4a8171a44_Group%2051.png";
  const inStockImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6815937f9054179d6f1c5fcd_Group%2063%20(3).png";
  
  // Process each item
  stockItems.forEach(function(item) {
    const stockLevelElement = document.getElementById(item.stockLevelId);
    const stockIconElement = document.getElementById(item.stockIconId);
    
    if (stockLevelElement && stockIconElement) {
      const stockStatus = stockLevelElement.textContent.trim();
      
      // Update image based on stock status
      if (stockStatus === "Back Order") {
        stockIconElement.src = backOrderImage;
      } else {
        stockIconElement.src = inStockImage;
      }
    }
  });
});

*/
