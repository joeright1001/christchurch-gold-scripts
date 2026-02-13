/**
 * URL Filter Handler
 * 
 * Handles applying filters based on URL parameters.
 * 
 * Usage:
 * 1. Standard Filter: ?filter=(attribute=value)
 *    Example: ?filter=(data-stock-status=in-stock)
 * 
 * 2. Multiple Filters: ?filter=(attr1=val1)&filter=(attr2=val2)
 *    Example: ?filter=(data-stock-status=in-stock)&filter=(data-metal=gold)
 * 
 * 3. Shortcut: ?filter=all-live
 *    Applies both "In Stock" and "Live at Mint" filters.
 *    - On Mobile (<= 991px): Activates the mobile-specific "View All Hottest" button.
 *    - On Desktop: Directly checks the filter checkboxes.
 *
 * Triggers Webflow interaction (filter-icon-block2) after applying filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('URL Filter Handler: Initialized');
  
  // Setup mobile filter button (only on mobile)
  if (window.innerWidth <= 991) {
    setupMobileFilterButton();
  }

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  
  // Handle multiple filter parameters
  // Support both ?filter=... and ?filter=...&filter=...
  const filterParams = params.getAll('filter');
  console.log('URL Filter Handler: Found params', filterParams);

  if (filterParams.length > 0) {
    // Add a delay to ensure other scripts (like FilterManager) are initialized
    // Increased to 1000ms to be safe
    setTimeout(() => {
      let filtersApplied = false;

      filterParams.forEach(filterParam => {
        console.log(`URL Filter Handler: Processing param "${filterParam}"`);
        
        // Special shortcut: filter=all-live
        // Applies both "In Stock" and "Live at Mint" filters
        if (filterParam.trim() === 'all-live') {
          // Check if mobile (<= 991px)
          if (window.innerWidth <= 991) {
            const mobileButton = document.getElementById('buy-banner-product1-hottest-button');
            if (mobileButton) {
              console.log('URL Filter Handler: Clicking mobile filter button');
              mobileButton.click();
              filtersApplied = true;
              return; // Skip standard processing
            }
          }

          // Desktop behavior or fallback if button not found
          const inStockCheckbox = document.getElementById('checkbox_in_stock');
          const liveMintCheckbox = document.getElementById('checkbox_live_mint');
          
          if (inStockCheckbox) {
            console.log('URL Filter Handler: Clicking In Stock checkbox');
            inStockCheckbox.click();
            filtersApplied = true;
          } else {
            console.warn('URL Filter Handler: In Stock checkbox not found');
          }
          
          if (liveMintCheckbox) {
            console.log('URL Filter Handler: Clicking Live at Mint checkbox');
            liveMintCheckbox.click();
            filtersApplied = true;
          } else {
            console.warn('URL Filter Handler: Live at Mint checkbox not found');
          }
          return; // Skip standard processing for this param
        }

        // Standard format: "(data-stock-status=in-stock)"
        // Clean the parameter value by removing parentheses
        const cleanedParam = filterParam.replace(/[()]/g, '');
        
        // Split into attribute and value
        const [attribute, value] = cleanedParam.split('=');

        if (attribute && value && window.FILTER_CONFIG && window.FILTER_CONFIG.rules) {
          // Find the checkbox ID that corresponds to this attribute and value
          const checkboxId = Object.keys(window.FILTER_CONFIG.rules).find(key => {
            const rule = window.FILTER_CONFIG.rules[key];
            return rule.attribute === attribute && rule.values && rule.values.includes(value);
          });

          if (checkboxId) {
            // Get the checkbox element
            const checkbox = document.getElementById(checkboxId);
            
            if (checkbox) {
              // Click the checkbox to apply the filter
              console.log(`URL Filter Handler: Clicking checkbox ${checkboxId}`);
              checkbox.click();
              filtersApplied = true;
            } else {
              console.warn(`URL Filter Handler: Checkbox ${checkboxId} not found`);
            }
          } else {
            console.warn(`URL Filter Handler: No rule found for ${attribute}=${value}`);
          }
        }
      });

      // Trigger Webflow interaction if filters were applied
      if (filtersApplied) {
        // Find the filter icon block to trigger the visual interaction
        const filterIconBlock = document.getElementById('filter-icon-block2') || document.querySelector('.filter-icon-block2');
        
        if (filterIconBlock) {
          console.log('URL Filter Handler: Triggering Webflow interaction on filter-icon-block2');
          filterIconBlock.click();
        } else {
          console.warn('URL Filter Handler: filter-icon-block2 not found - could not trigger Webflow interaction');
        }
      }
    }, 1000); // 1000ms delay
  }
});

/**
 * Sets up the mobile filter button logic.
 *
 * This function handles the mobile-specific "View All Hottest In-Stock Products" button.
 * When clicked, it toggles both "In Stock" and "Live at Mint" filters simultaneously.
 * It also updates the button's visual state (border/text color) to indicate activation.
 *
 * Only runs on mobile devices (width <= 991px).
 */
function setupMobileFilterButton() {
  // Double check we are on mobile
  if (window.innerWidth > 991) return;

  const mobileButton = document.getElementById('buy-banner-product1-hottest-button');
  if (!mobileButton) {
    console.warn('URL Filter Handler: Mobile filter button not found');
    return;
  }

  console.log('URL Filter Handler: Setting up mobile filter button');

  // Store original text
  const textElement = mobileButton.querySelector('.buy-banner-title1-button');
  if (textElement && !mobileButton.dataset.originalText) {
    mobileButton.dataset.originalText = textElement.textContent;
  }

  mobileButton.addEventListener('click', () => {
    const inStockCheckbox = document.getElementById('checkbox_in_stock');
    const liveMintCheckbox = document.getElementById('checkbox_live_mint');
    
    if (!inStockCheckbox || !liveMintCheckbox) {
      console.warn('URL Filter Handler: Checkboxes not found for mobile button');
      return;
    }

    // Check current state using FilterManager's global controls if available
    // Fallback to DOM checked property if FilterManager is not ready (though it should be)
    let inStockActive = false;
    let liveMintActive = false;

    if (window.filterControls && typeof window.filterControls.getActiveFilters === 'function') {
      const activeFilters = window.filterControls.getActiveFilters();
      inStockActive = activeFilters.includes('checkbox_in_stock');
      liveMintActive = activeFilters.includes('checkbox_live_mint');
    } else {
      // Fallback (unlikely to be accurate if FilterManager is hijacking clicks)
      inStockActive = inStockCheckbox.checked;
      liveMintActive = liveMintCheckbox.checked;
    }

    const bothActive = inStockActive && liveMintActive;
    
    if (bothActive) {
      // If both are active, toggle them off
      // We click them to trigger FilterManager's toggle logic
      if (inStockActive) inStockCheckbox.click();
      if (liveMintActive) liveMintCheckbox.click();
      
      // Update visual state: Inactive (reset styles)
      mobileButton.style.border = '';
      
      // Restore original text
      if (textElement && mobileButton.dataset.originalText) {
        textElement.textContent = mobileButton.dataset.originalText;
      }
    } else {
      // If not both active, toggle them on
      if (!inStockActive) inStockCheckbox.click();
      if (!liveMintActive) liveMintCheckbox.click();
      
      // Update visual state: Active (Dark Gray border 4px)
      mobileButton.style.border = '4px solid #333';
      
      // Change text to "Show All Including Out-Stock"
      if (textElement) {
        textElement.textContent = "Show All Including Out-Stock";
      }
    }
  });
}
