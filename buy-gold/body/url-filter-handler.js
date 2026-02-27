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
    
    // Ensure profile button is hidden by default
    const profileButton = document.getElementById('buy-banner-product1-filter-button');
    if (profileButton) {
        profileButton.style.display = 'none';
    }
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
        
        // Check for Profile
        const trimmedParam = filterParam.trim();
        if (window.FILTER_PROFILES && window.FILTER_PROFILES[trimmedParam]) {
            console.log(`URL Filter Handler: Applying profile "${trimmedParam}"`);
            const profile = window.FILTER_PROFILES[trimmedParam];
            
            // Apply Filters
            if (profile.filters) {
                profile.filters.forEach(checkboxId => {
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox) {
                        console.log(`URL Filter Handler: Clicking profile checkbox ${checkboxId}`);
                        checkbox.click();
                        filtersApplied = true;
                    } else {
                        console.warn(`URL Filter Handler: Profile checkbox ${checkboxId} not found`);
                    }
                });
              }
              
              /**
               * Activates the mobile profile button and hides the default button.
               *
               * @param {string} displayName - The text to display in the button
               */
              function activateMobileProfileButton(displayName) {
                if (window.innerWidth > 991) return;
              
                const defaultButton = document.getElementById('buy-banner-product1-hottest-button');
                const profileButton = document.getElementById('buy-banner-product1-filter-button');
                
                if (!profileButton) {
                    console.warn('URL Filter Handler: Profile button not found');
                    return;
                }
              
                console.log(`URL Filter Handler: Activating mobile profile button for "${displayName}"`);
              
                // Hide default button
                if (defaultButton) {
                    defaultButton.style.display = 'none';
                }
              
                // Show profile button
                profileButton.style.display = 'flex'; // Assuming flex layout
              
                // Update Text
                // Try ID first, then class fallback
                const textElement = document.getElementById('buy-banner-title1-filter');
                if (textElement) {
                  textElement.textContent = displayName;
                } else {
                    const textElementByClass = profileButton.querySelector('.buy-banner-title1-filter');
                    if (textElementByClass) {
                        textElementByClass.textContent = displayName;
                    } else {
                        console.warn('URL Filter Handler: Profile button text element not found');
                    }
                }
              
                // Add Click Listener to Clear Filter (Instant)
                profileButton.onclick = () => {
                    console.log('URL Filter Handler: Clearing profile instantly');
                    
                    // 1. Clear all filters using FilterManager
                    if (window.filterControls && window.filterControls.resetAllFilters) {
                        window.filterControls.resetAllFilters();
                    }
                    
                    // 2. Hide profile button, Show default button
                    profileButton.style.display = 'none';
                    if (defaultButton) {
                        defaultButton.style.display = 'flex'; // Restore default button
                        
                        // Reset default button visual state to "Show All" (Inactive)
                        const icon1 = document.getElementById('click-icon1');
                        const icon2 = document.getElementById('click-icon2');
                        const textElement = defaultButton.querySelector('.buy-banner-title1-button');
                        
                        if (icon1) icon1.style.display = 'block';
                        if (icon2) icon2.style.display = 'none';
                        defaultButton.style.backgroundColor = '';
                        defaultButton.style.opacity = '';
                        
                        if (textElement && defaultButton.dataset.originalText) {
                            textElement.textContent = defaultButton.dataset.originalText;
                        }
                    }
                    
                    // 3. Update URL without reload
                    const newUrl = window.location.pathname;
                    window.history.pushState({}, '', newUrl);
                };
              }
            
            // Apply Sort
            if (profile.sort && window.sortManager) {
                console.log(`URL Filter Handler: Applying profile sort "${profile.sort}"`);
                // Use a small timeout to ensure filters are processed first
                setTimeout(() => {
                    window.sortManager.handleSortSelection(profile.sort, false);
                }, 100);
            }
            
            // Activate mobile profile button if profile has display name
            if (profile.displayName) {
                activateMobileProfileButton(profile.displayName);
            }

            return; // Skip standard processing
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
    }, 500); // 1000ms delay
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
    const icon1 = document.getElementById('click-icon1'); // Default icon
    const icon2 = document.getElementById('click-icon2'); // Active/Grayed icon
    
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
      // If both are active, toggle them off (Show All)
      // We click them to trigger FilterManager's toggle logic
      if (inStockActive) inStockCheckbox.click();
      if (liveMintActive) liveMintCheckbox.click();
      
      // Update visual state: Inactive (Show All)
      // Show icon 1, Hide icon 2
      if (icon1) icon1.style.display = 'block';
      if (icon2) icon2.style.display = 'none';
      
      // Remove opacity
      mobileButton.style.backgroundColor = '';
      mobileButton.style.opacity = '';
      
      // Restore original text
      if (textElement && mobileButton.dataset.originalText) {
        textElement.textContent = mobileButton.dataset.originalText;
      }

      // Reset sort to default
      if (window.sortManager) {
        window.sortManager.handleSortSelection('default', false);
      }
    } else {
      // If not both active, toggle them on (Show In Stock)
      if (!inStockActive) inStockCheckbox.click();
      if (!liveMintActive) liveMintCheckbox.click();
      
      // Update visual state: Active (In Stock)
      // Hide icon 1, Show icon 2
      if (icon1) icon1.style.display = 'none';
      if (icon2) icon2.style.display = 'block';
      
      // Add 50% Black opacity to root button div
      // Using backgroundColor with rgba to create overlay effect
      mobileButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      
      // Ensure no border/outline shifts layout
      mobileButton.style.border = 'none';
      mobileButton.style.outline = 'none';
      
      // Change text to "Show All Including Out-Stock"
      if (textElement) {
        textElement.textContent = "Show All Including Out-Stock";
      }

      // Apply sort 'value'
      if (window.sortManager) {
        window.sortManager.handleSortSelection('value', false);
      }
    }
  });
}
