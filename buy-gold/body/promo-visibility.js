/**
 * High-performance script for getting-started-promo visibility
 * - Faster response time
 * - Immediate visibility when filter changes
 * - No hardcoded content - works with your existing CMS content
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Fast promo visibility script loaded');
  
  // Keep track of previous filter state
  let prevFilterState = null;
  
  // Cache DOM elements for faster access
  let cachedPromoDivs = null;
  let cachedStarterProducts = null;
  let promoProductMap = new Map();
  
  // Setup button click handler for testing
  const button = document.getElementById('test-button');
  if (button) {
    button.addEventListener('click', forceShowAllPromos);
    console.log('Test button found and handler attached');
  }
  
  // Initialize immediately
  init();
  
  function init() {
    // Pre-cache elements on init
    cacheElements();
    
    // Set up event listeners for the filter system
    setupFilterListeners();
    
    // Check state immediately
    checkStarterFilterState();
    
    // Also check again after a very short delay (for late-loading elements)
    setTimeout(checkStarterFilterState, 100);
  }
  
  function cacheElements() {
    // Find and cache all promo divs
    cachedPromoDivs = document.querySelectorAll('[id="getting-started-promo"]');
    
    // Find and cache all starter products
    cachedStarterProducts = document.querySelectorAll('.product-data[data-getting-started]');
    
    // Build a map of product containers to their promo divs for faster access
    cachedPromoDivs.forEach(promoDiv => {
      const productContainer = findParentProductContainer(promoDiv);
      if (productContainer) {
        const productData = productContainer.querySelector('.product-data');
        if (productData) {
          // Use data-product-id as a unique key
          const productId = productData.getAttribute('data-product-id');
          if (productId) {
            promoProductMap.set(productId, {
              promoDiv: promoDiv,
              productData: productData,
              container: productContainer,
              isStarter: productData.hasAttribute('data-getting-started') && 
                         productData.getAttribute('data-getting-started').trim() !== ''
            });
          }
        }
      }
    });
    
    console.log(`Cached ${cachedPromoDivs.length} promo divs and ${cachedStarterProducts.length} starter products`);
  }
  
  function setupFilterListeners() {
    // Listen for checkbox clicks directly for faster response
    const starterCheckbox = document.getElementById('checkbox_starter');
    if (starterCheckbox) {
      starterCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        console.log(`Starter checkbox directly changed to: ${isChecked}`);
        
        if (isChecked) {
          showStarterPromos();
        } else {
          hideAllPromos();
        }
      });
      console.log('Added direct listener to checkbox_starter');
    }
    
    // Also monitor filter state through the API (as backup)
    setInterval(checkStarterFilterState, 1000); // Reduced polling frequency to minimize console logs
    
    // Add mutation observer to detect DOM changes that might affect filter visibility
    setupMutationObserver();
  }
  
  function setupMutationObserver() {
    // Watch for changes to the filter-hidden class on product containers
    const observer = new MutationObserver(function(mutations) {
      // Use debouncing to prevent multiple rapid updates
      if (this.mutationTimeout) {
        clearTimeout(this.mutationTimeout);
      }
      
      this.mutationTimeout = setTimeout(() => {
        let needsUpdate = false;
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && 
              mutation.attributeName === 'class' && 
              mutation.target.classList.contains('w-dyn-item')) {
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          // Check filter state immediately when product visibility changes
          checkStarterFilterState();
        }
      }, 200);
    });
    
    // Observe class changes on all product containers
    const productContainers = document.querySelectorAll('.w-dyn-item');
    productContainers.forEach(container => {
      observer.observe(container, { attributes: true });
    });
    
    console.log(`Set up mutation observer for ${productContainers.length} product containers`);
  }
  
  function forceShowAllPromos() {
    console.log('Test button clicked - forcing all starter promos visible');
    showStarterPromos();
  }
  
  function checkStarterFilterState() {
    // Check if window.filterControls is available
    if (window.filterControls && window.filterControls.getActiveFilters) {
      const activeFilters = window.filterControls.getActiveFilters();
      const starterFilterActive = activeFilters.includes('checkbox_starter');
      
      // Only process if state changed
      if (prevFilterState !== starterFilterActive) {
        console.log(`Starter filter is now ${starterFilterActive ? 'ACTIVE' : 'INACTIVE'}`);
        prevFilterState = starterFilterActive;
        
        if (starterFilterActive) {
          showStarterPromos();
        } else {
          hideAllPromos();
        }
      }
    }
  }
  
  function showStarterPromos() {
    // Fast path using the map
    if (promoProductMap.size > 0) {
      promoProductMap.forEach((info, productId) => {
        if (info.isStarter) {
          applyStyles(info.promoDiv);
        }
      });
      return;
    }
    
    // Slower fallback path
    if (!cachedStarterProducts) {
      cachedStarterProducts = document.querySelectorAll('.product-data[data-getting-started]');
    }
    
    if (cachedStarterProducts.length === 0) {
      console.log('No starter products found');
      return;
    }
    
    cachedStarterProducts.forEach((productData) => {
      const productContainer = findParentProductContainer(productData);
      if (!productContainer) return;
      
      const promoDiv = productContainer.querySelector('[id="getting-started-promo"]');
      if (!promoDiv) return;
      
      applyStyles(promoDiv);
    });
  }
  
  function hideAllPromos() {
    // Fast path using the map
    if (promoProductMap.size > 0) {
      promoProductMap.forEach((info) => {
        info.promoDiv.style.display = 'none';
      });
      return;
    }
    
    // Slower fallback path
    if (!cachedPromoDivs) {
      cachedPromoDivs = document.querySelectorAll('[id="getting-started-promo"]');
    }
    
    cachedPromoDivs.forEach(promoDiv => {
      promoDiv.style.display = 'none';
    });
  }
  
  function findParentProductContainer(element) {
    // Find the closest product container (w-dyn-item)
    let parent = element.parentElement;
    let depth = 0;
    const maxDepth = 10;
    
    while (parent && depth < maxDepth) {
      if (parent.classList.contains('w-dyn-item')) {
        return parent;
      }
      parent = parent.parentElement;
      depth++;
    }
    return null;
  }
  
  function applyStyles(promoDiv) {
    // Apply all styles at once for better performance
    promoDiv.style.cssText = `
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      height: auto !important;
      overflow: visible !important;
      position: relative !important;
      width: 100% !important;
      margin: 15px 0 !important;
      padding: 20px !important;
      background: #f8f9fa !important;
      border: 1px solid #e0e0e0 !important;
      border-radius: 8px !important;
      z-index: 1 !important;
    `;
  }
});
