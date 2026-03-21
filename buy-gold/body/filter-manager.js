/**
 * ============================================================================
 * FILTER MANAGER (PERFORMANCE OPTIMIZED)
 * ============================================================================
 * 
 * PURPOSE:
 * This script serves as the central engine for dynamically filtering products
 * on the product listing (Buy) pages. It intercepts user interactions with UI 
 * filter checkboxes, evaluates products against defined rules, and smoothly 
 * updates the visible product grid.
 * 
 * ARCHITECTURE & DESIGN:
 * - Data-Driven Rules: Uses `window.FILTER_CONFIG` to map UI checkboxes to HTML 
 *   data-attributes (e.g. `data-size`, `data-mint`, `data-stock-status`) on each product.
 * - State Management: Maintains a persistent internal record of which filters 
 *   are currently active, enabling additive (AND/OR) complex filtering scenarios.
 * - Non-Destructive Rendering: Instead of removing DOM elements, it utilizes a 
 *   performant CSS-based approach by simply toggling a `.filter-hidden` class.
 * - DOM Reordering: For special filters (Popular, Starter, Hot) that dictate 
 *   visual priority rather than strict inclusion, it safely plucks elements and 
 *   physically reorders them using `DocumentFragment`s for maximum rendering speed, 
 *   always capturing and restoring the original DOM load order when disabled.
 * 
 * INTEGRATION:
 * - Coordinates smoothly with the `SearchManager` (to ensure searched items are also filtered).
 * - Exposes a global `window.filterControls` API allowing external scripts 
 *   (like `url-filter-handler.js`) to programmatically trigger filter states on load.
 * ============================================================================
 */
// PERFORMANCE OPTIMIZED FILTERING SYSTEM
// ==================== INTEGRATED FILTERING SYSTEM ====================
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==================== FILTER MANAGER CLASS ====================
  class FilterManager {
    constructor(config) {
      this.config = config;
      this.buttons = {};
      this.parentWrappers = {}; // Cache parent wrappers for filters
      this.filterStates = {};
      this.specificProductSlugs = null; // Whitelist of specific product slugs to show
      this.productElements = [];
      this.gridContainer = null;
      this.originalOrder = []; // Store original DOM order
      this.needsOrderRestoration = false; // Flag to track if order needs restoration
      this.scrollTriggerFilters = [
        'checkbox_coin', 'checkbox_minted_bar', 'checkbox_cast_bar', // Type
        'checkbox_1g', 'checkbox_2_5g', 'checkbox_5g', 'checkbox_10g', 'checkbox_20g', 'checkbox_25g',
        'checkbox_1_20oz', 'checkbox_1_10oz', 'checkbox_1_4oz', 'checkbox_1_2oz', 'checkbox_1oz',
        'checkbox_2oz', 'checkbox_5oz', 'checkbox_10oz', 'checkbox_100oz', 'checkbox_100g', 'checkbox_250g', 'checkbox_500g', 'checkbox_1kg', // Weight
        'checkbox_asahi', 'checkbox_austrian', 'checkbox_gsm', 'checkbox_investment', 'checkbox_nzmint',
        'checkbox_pamp', 'checkbox_canada', 'checkbox_african', 'checkbox_highland', 'checkbox_perth',
        'checkbox_royal', 'checkbox_usa', 'checkbox_valcambi' // Mint
      ];
      
      // Cache special div elements for new filters
      this.specialDivs = {
        speakToDealer: null,
        personalDealerEndBlock: null,
        gettingStartedBlock: null,
        investmentBlock: null
      };
      this.originalDivStates = {}; // Store original visibility states
      
      // Initialize external filter evaluator logic
      if (window.FilterEvaluator) {
        this.evaluator = new window.FilterEvaluator(this.config);
      } else {
        console.error('🚀 FILTER ERROR: window.FilterEvaluator is not defined! Check script load order.');
      }
      
      this.init();
    }

    // =========================================================================
    // 1. CLASS SETUP & CACHING
    // Methods for initializing the manager, caching DOM elements, and setting up initial states.
    // =========================================================================

    init() {
      this.cacheElements();
      this.initializeStates();
      this.bindDesktopEvents();
      this.bindMobileEvents();
      this.cacheProducts();
      this.setupGlobalNamespace();
      
      console.log('🚀 PERFORMANCE OPTIMIZED Filter Manager initialized');
    }

    cacheElements() {
      // Cache desktop checkbox buttons and their parent wrappers
      Object.entries(this.config.buttons).forEach(([key, id]) => {
        this.buttons[key] = document.getElementById(id);
        
        // Cache parent wrapper if it exists
        const wrapper = document.querySelector(`[data-filter-parent-for="${key}"]`);
        if (wrapper) {
          this.parentWrappers[key] = wrapper;
        }
      });

      // Cache clear all filters button (both desktop and mobile)
      this.clearButton = document.getElementById(this.config.clearButton);
      this.clearButtonMobile = document.getElementById('clear-filter-mobile');

      // Cache "Make It Easy" button
      this.makeItEasyButton = document.getElementById('make-it-easy');

      // Cache special div elements for new filters
      this.specialDivs.speakToDealer = document.getElementById('speak-to-dealer');
      this.specialDivs.personalDealerEndBlock = document.getElementById('personal-dealer-end-block');
      this.specialDivs.gettingStartedBlock = document.getElementById('getting-started-block');
      this.specialDivs.investmentBlock = document.getElementById('investment-block');

      // Store original visibility states
      Object.entries(this.specialDivs).forEach(([key, element]) => {
        if (element) {
          this.originalDivStates[key] = window.getComputedStyle(element).display;
        }
      });
    }

    initializeStates() {
      Object.keys(this.config.rules).forEach(filterName => {
        this.filterStates[filterName] = false;
      });
    }

    cacheProducts() {
      this.productElements = Array.from(document.querySelectorAll('.product-data'));
      this.gridContainer = document.querySelector('.w-dyn-items.w-row');
      
      // Store original DOM order
      this.captureOriginalOrder();
      
      console.log(`🚀 PERFORMANCE: Cached ${this.productElements.length} product elements`);
    }

    // =========================================================================
    // 2. EVENT BINDING
    // Methods for attaching click listeners to desktop and mobile filter UI elements.
    // =========================================================================

    bindDesktopEvents() {
      // Bind all checkbox buttons
      Object.entries(this.buttons).forEach(([filterName, button]) => {
        if (!button) return;

        if (this.config.rules[filterName]) {
          button.style.cursor = 'pointer';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFilter(filterName);
          });
        }
      });

      // Bind parent wrappers for better UX (click anywhere on the filter item)
      Object.entries(this.parentWrappers).forEach(([filterName, wrapper]) => {
        if (!wrapper) return;

        if (this.config.rules[filterName]) {
          wrapper.style.cursor = 'pointer';
          wrapper.addEventListener('click', (e) => {
            // If the click target is the checkbox button itself, ignore (let the button handler handle it)
            // Note: button handler calls stopPropagation, so it shouldn't bubble here anyway.
            // But just in case, we prevent default behavior.
            e.preventDefault();
            e.stopPropagation();
            this.toggleFilter(filterName);
          });
        }
      });

      // Bind clear all filters button (desktop)
      if (this.clearButton) {
        this.clearButton.style.cursor = 'pointer';
        this.clearButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.clearAllFilters();
        });
      }

      // Bind clear all filters button (mobile)
      if (this.clearButtonMobile) {
        this.clearButtonMobile.style.cursor = 'pointer';
        this.clearButtonMobile.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.clearAllFilters();
        });
      }

      // Bind "Make It Easy" button to trigger starter filter
      if (this.makeItEasyButton) {
        this.makeItEasyButton.style.cursor = 'pointer';
        this.makeItEasyButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Always apply the starter filter
          this.toggleFilter('checkbox_starter');
          
          // On mobile/tablet, also scroll to the getting-started-block
          if (window.innerWidth <= 991) {
            const gettingStartedBlock = document.getElementById('getting-started-block');
            if (gettingStartedBlock) {
              // Calculate position with 6rem offset for navbar
              const elementPosition = gettingStartedBlock.offsetTop;
              const offsetPosition = elementPosition - (6 * 16); // 6rem = 96px (assuming 16px base font size)
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
              console.log('🚀 MOBILE/TABLET: Scrolled to getting-started-block with navbar offset');
            }
          }
        });
      }
    }

    bindMobileEvents() {
      const dropdown = document.getElementById('custom-filter');
      if (!dropdown) {
        setTimeout(() => this.bindMobileEvents(), 300);
        return;
      }

      dropdown.addEventListener('filterOperation', (event) => {
        const { operation, resetFirst } = event.detail;
        
        if (resetFirst) {
          this.resetFiltersOnly();
        }
        
        if (this.config.rules[operation]) {
          this.applyFilter(operation, true);
        }
      });
    }

    // =========================================================================
    // 3. STATE MANAGEMENT & TOGGLE LOGIC
    // Methods that update the internal active/inactive state of filters when clicked.
    // Includes logic for exclusive groups (turning off other options in the same group).
    // =========================================================================

    toggleFilter(filterName) {
      const newState = !this.filterStates[filterName];
      const group = Object.keys(this.config.exclusiveGroups).find(groupName =>
        this.config.exclusiveGroups[groupName].includes(filterName)
      );

      // If activating a filter in an exclusive group, deactivate others first
      if (newState && group) {
        this.config.exclusiveGroups[group].forEach(otherFilterName => {
          if (otherFilterName !== filterName && this.filterStates[otherFilterName]) {
            this.filterStates[otherFilterName] = false;
            this.updateButtonStyles(otherFilterName, false);
          }
        });
      }

      this.applyFilter(filterName, newState);

      // Update visual styles for the group
      if (group) {
        this.updateGroupStyles(group, newState ? filterName : null);
      }
    }

    applyFilter(filterName, isActive) {
      this.filterStates[filterName] = isActive;
      this.updateButtonStyles(filterName, isActive);

      // If a trigger filter is activated, scroll to the price ticker
      if (isActive && this.scrollTriggerFilters.includes(filterName)) {
        this.scrollToPriceTicker();
      }
      
      // Reduced logging - only log key filter changes
      if ((filterName.includes('checkbox_starter') || filterName.includes('checkbox_popular') || filterName.includes('checkbox_in_stock')) && 
          (!this._lastFilterChangeTime || Date.now() - this._lastFilterChangeTime > 500)) {
        console.log(`🚀 FILTER: ${filterName.replace('checkbox_', '')} ${isActive ? 'ON' : 'OFF'}`);
        this._lastFilterChangeTime = Date.now();
      }
      
      // 🚀 PERFORMANCE: Use optimized CSS-based filtering
      this.applyAllFiltersOptimized();
    }

    // =========================================================================
    // 4. SCROLL & CORE FILTERING ENGINE
    // The main logic that evaluates which products should be visible based on active states.
    // This loops through all products and adds/removes CSS classes for performance.
    // =========================================================================

    scrollToPriceTicker() {
      const priceTicker = document.getElementById('price-ticker');
      if (!priceTicker) return;

      const targetPosition = priceTicker.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // Scroll duration in milliseconds
      let startTime = null;

      // Easing function for smooth in-and-out effect
      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
      console.log('🚀 SCROLL: Initiated custom smooth scroll to price-ticker');
    }

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based filtering instead of DOM cloning
    applyAllFiltersOptimized() {
      if (!this.gridContainer) return;
      
      // Clear any "no results" message before filtering
      if (window.searchManager && window.searchManager.clearNoResultsMessage) {
        window.searchManager.clearNoResultsMessage();
      }
      
      let visibleCount = 0;
      const processedSlugs = new Set();
      
      // Check if any filters are active
      const activeFilters = Object.entries(this.filterStates).filter(([_, isActive]) => isActive);
      
      // Check if search is active (use the search manager's state)
      const hasActiveSearch = window.searchManager && window.searchManager.isActive && window.searchManager.isActive();

      // Check if specific products are set
      const hasSpecificProducts = this.specificProductSlugs && this.specificProductSlugs.length > 0;
      
      // If no filters active and no search and no specific products, show all items and restore original order
      if (activeFilters.length === 0 && !hasActiveSearch && !hasSpecificProducts) {
        this.showAllItemsCSS();
        this.restoreOriginalOrder();
        this.manageDivVisibility();
        return;
      }
      
      // Check if popular, starter, hot, or investor filters were just turned off and restore order
      const hasSortingFilter = this.filterStates.checkbox_popular || this.filterStates.checkbox_starter || this.filterStates.checkbox_hot || this.filterStates.checkbox_investor;
      if (!hasSortingFilter && this.needsOrderRestoration) {
        this.restoreOriginalOrder();
        this.needsOrderRestoration = false;
      }
      
      // If search is active, let the search manager handle the coordination
      if (hasActiveSearch) {
        const currentSearchTerm = window.searchManager.getCurrentTerm();
        if (currentSearchTerm) {
          // Trigger search to reprocess with current filters
          setTimeout(() => {
            if (window.searchManager.filterProductsWithCSS) {
              // Call the search manager's filtering method which now checks filters too
              const matchingCount = window.searchManager.filterProductsWithCSS(currentSearchTerm);
              console.log(`🚀 COORDINATION: Search + Filter working together - ${matchingCount} products visible`);
            }
          }, 10);
          this.manageDivVisibility();
          return;
        }
      }
      
      // Normal filter-only processing
      this.productElements.forEach(dataElement => {
        const slug = dataElement.getAttribute('data-slug');
        
        if (processedSlugs.has(slug)) return;
        
        const container = dataElement.closest('.w-dyn-item');
        if (!container) return;
        
        // Check if item passes filters
        const passesFilters = this.shouldShowAnyDataElementForSlug(slug);
        
        // 🚀 PERFORMANCE FIX: Use CSS class instead of DOM manipulation
        container.classList.toggle('filter-hidden', !passesFilters);
        
        if (passesFilters) visibleCount++;
        processedSlugs.add(slug);
      });

      // =========================================================================
      // CUSTOM SORTING LOGIC FOR SPECIAL FILTERS
      // The below section handles special filters (Popular, Starter, Hot) that 
      // require items to be REORDERED rather than just shown/hidden.
      // We apply sorting here (only on visible items) to bubble priority items up.
      // =========================================================================
      
      if (this.filterStates.checkbox_popular) {
        this.applyPopularSortCSS();
        this.needsOrderRestoration = true; // Flags that original order is broken and needs reset later
      }
      if (this.filterStates.checkbox_starter) {
        this.applyStarterSortCSS();
        this.needsOrderRestoration = true;
      }
      if (this.filterStates.checkbox_hot) {
        this.applyHotSortCSS();
        this.needsOrderRestoration = true;
      }
      if (this.filterStates.checkbox_investor) {
        this.applyInvestorSortCSS();
        this.needsOrderRestoration = true;
      }

      this.manageDivVisibility();
      
      // Reduce console logging frequency
      if (!this._lastFilterLogTime || Date.now() - this._lastFilterLogTime > 1000) {
        console.log(`🚀 PERFORMANCE: Filter-only processing - ${visibleCount} products visible`);
        this._lastFilterLogTime = Date.now();
      }
    }

    // 🚀 PERFORMANCE: CSS-based show all
    showAllItemsCSS() {
      this.productElements.forEach(dataElement => {
        const container = dataElement.closest('.w-dyn-item');
        if (container) {
          container.classList.remove('filter-hidden');
        }
      });
    }

    // =========================================================================
    // 5. DOM REORDERING & SORTING LOGIC
    // Methods that physically reorder the DOM nodes (using DocumentFragment for performance)
    // based on specific priority filters like Popular, Starter, and Hot.
    // =========================================================================

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based sorting with DocumentFragment
    // HARDCODED LOGIC FOR "POPULAR" FILTER:
    // This reads the 'data-popular' attribute from each product to determine its numeric rank.
    // Products with a valid 'data-popular' integer are extracted, sorted numerically,
    // and then appended back to the grid in their sorted order.
    applyPopularSortCSS() {
      if (!this.filterStates.checkbox_popular || !this.gridContainer) return;
      
      const visibleItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item:not(.filter-hidden)'));
      const sortedItems = [];
      
      visibleItems.forEach(item => {
        const dataElement = item.querySelector('.product-data');
        if (!dataElement) return;
        
        const popularValue = dataElement.getAttribute('data-popular');
        if (popularValue && !isNaN(parseInt(popularValue))) {
          sortedItems.push({
            element: item,
            value: parseInt(popularValue)
          });
        }
      });
      
      sortedItems.sort((a, b) => a.value - b.value);
      
      // 🚀 PERFORMANCE: Use DocumentFragment for efficient DOM reordering
      const fragment = document.createDocumentFragment();
      sortedItems.forEach(item => {
        fragment.appendChild(item.element);
      });
      this.gridContainer.appendChild(fragment);
      
      // Reduced logging frequency
      if (!this._lastPopularSortTime || Date.now() - this._lastPopularSortTime > 2000) {
        console.log(`🚀 SORT: ${sortedItems.length} items by popularity`);
        this._lastPopularSortTime = Date.now();
      }
    }

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based sorting with DocumentFragment
    // HARDCODED LOGIC FOR "GETTING STARTED" FILTER:
    // Similar to popular sorting, this reads the 'data-getting-started' attribute from each product.
    // Products with this numeric rank are sorted and placed at the top of the grid.
    applyStarterSortCSS() {
      if (!this.filterStates.checkbox_starter || !this.gridContainer) return;
      
      const visibleItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item:not(.filter-hidden)'));
      const sortedItems = [];
      
      visibleItems.forEach(item => {
        const dataElement = item.querySelector('.product-data');
        if (!dataElement) return;
        
        const starterValue = dataElement.getAttribute('data-getting-started');
        if (starterValue && !isNaN(parseInt(starterValue))) {
          sortedItems.push({
            element: item,
            value: parseInt(starterValue)
          });
        }
      });
      
      sortedItems.sort((a, b) => a.value - b.value);
      
      // 🚀 PERFORMANCE: Use DocumentFragment for efficient DOM reordering
      const fragment = document.createDocumentFragment();
      sortedItems.forEach(item => {
        fragment.appendChild(item.element);
      });
      this.gridContainer.appendChild(fragment);
      
      // Reduced logging frequency
      if (!this._lastStarterSortTime || Date.now() - this._lastStarterSortTime > 2000) {
        console.log(`🚀 SORT: ${sortedItems.length} items by starter order`);
        this._lastStarterSortTime = Date.now();
      }
    }

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based sorting with DocumentFragment for Hot filter
    // CUSTOM LOGIC FOR "HOT PRODUCTS" FILTER:
    // When the Hot filter is checked, we specifically want certain products 
    // to always appear at the very top of the grid in a defined sequence.
    // We locate the items by slug, ensure they are visible, and prepend them to the container.
    // Sequence is defined in window.CUSTOM_FILTER_PROFILES.hotFilterSequence.
    applyHotSortCSS() {
      if (!this.filterStates.checkbox_hot || !this.gridContainer) return;
      
      let hotSlugsSequence = [];
      if (window.CUSTOM_FILTER_PROFILES && window.CUSTOM_FILTER_PROFILES.hotFilterSequence) {
        hotSlugsSequence = window.CUSTOM_FILTER_PROFILES.hotFilterSequence;
      }
      
      // Reverse the array because prepend pushes elements to the top. 
      // To keep them in array order, the first element must be prepended last.
      const reversedSlugs = [...hotSlugsSequence].reverse();
      
      reversedSlugs.forEach(slug => {
        const itemToMove = this.gridContainer.querySelector(`[data-slug="${slug}"]`);
        if (itemToMove) {
          const container = itemToMove.closest('.w-dyn-item');
          if (container) {
            // Force it to be visible even if it didn't pass the hot filter criteria
            container.classList.remove('filter-hidden'); 
            
            // Prepend moves it to the very top of the grid container
            this.gridContainer.prepend(container);
          }
        }
      });
      
      // Reduced logging frequency
      if (!this._lastHotSortTime || Date.now() - this._lastHotSortTime > 2000) {
        console.log(`🚀 SORT: Prepended hot items: ${hotSlugsSequence.join(', ')}`);
        this._lastHotSortTime = Date.now();
      }
    }

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based sorting with DocumentFragment
    // HARDCODED LOGIC FOR "INVESTMENT" FILTER:
    // Reads the 'data-value' attribute from each product and sorts ascending (lowest value first).
    applyInvestorSortCSS() {
      if (!this.filterStates.checkbox_investor || !this.gridContainer) return;
      
      const visibleItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item:not(.filter-hidden)'));
      const sortedItems = [];
      const itemsWithoutValues = [];
      
      visibleItems.forEach(item => {
        const valueElement = item.querySelector('[data-value]');
        
        if (!valueElement) {
          itemsWithoutValues.push(item);
          return;
        }
        
        const rawValue = valueElement.getAttribute('data-value');
        if (rawValue) {
          const numValue = parseFloat(rawValue.replace(/,/g, ''));
          if (!isNaN(numValue)) {
            sortedItems.push({
              element: item,
              value: numValue
            });
          } else {
            itemsWithoutValues.push(item);
          }
        } else {
          itemsWithoutValues.push(item);
        }
      });
      
      // Sort ascending (lowest value first, which is best value per oz)
      sortedItems.sort((a, b) => a.value - b.value);
      
      // 🚀 PERFORMANCE: Use DocumentFragment for efficient DOM reordering
      const fragment = document.createDocumentFragment();
      
      // Append sorted items first
      sortedItems.forEach(item => {
        fragment.appendChild(item.element);
      });
      
      // Append items without values at the end to keep them visible
      itemsWithoutValues.forEach(item => {
        fragment.appendChild(item);
      });
      
      this.gridContainer.appendChild(fragment);
      
      // Reduced logging frequency
      if (!this._lastInvestorSortTime || Date.now() - this._lastInvestorSortTime > 2000) {
        console.log(`🚀 SORT: ${sortedItems.length} items by investment value`);
        this._lastInvestorSortTime = Date.now();
      }
    }

    // =========================================================================
    // 5. SPECIAL DIV VISIBILITY & PRODUCT EVALUATION
    // Methods for toggling promotional blocks and determining if a single product 
    // matches the currently active filter conditions.
    // =========================================================================

    manageDivVisibility() {
      // Handle dealer filter first
      if (this.filterStates.checkbox_dealer) {
        if (this.specialDivs.speakToDealer) {
          this.specialDivs.speakToDealer.style.display = 'block';
        }
        if (this.specialDivs.personalDealerEndBlock) {
          this.specialDivs.personalDealerEndBlock.style.display = 'none';
        }
        if (this.specialDivs.gettingStartedBlock) {
          this.specialDivs.gettingStartedBlock.style.display = 'none';
        }
      } else {
        // Restore dealer divs to original states
        if (this.specialDivs.speakToDealer && this.originalDivStates.speakToDealer) {
          this.specialDivs.speakToDealer.style.display = this.originalDivStates.speakToDealer;
        }
        if (this.specialDivs.personalDealerEndBlock && this.originalDivStates.personalDealerEndBlock) {
          this.specialDivs.personalDealerEndBlock.style.display = this.originalDivStates.personalDealerEndBlock;
        }
        
        // Handle starter filter
        if (this.filterStates.checkbox_starter) {
          if (this.specialDivs.gettingStartedBlock) {
            this.specialDivs.gettingStartedBlock.style.display = 'block';
          }
        } else {
          if (this.specialDivs.gettingStartedBlock) {
            this.specialDivs.gettingStartedBlock.style.display = 'none';
          }
        }

        // Handle investor filter
        if (this.filterStates.checkbox_investor) {
          if (this.specialDivs.investmentBlock) {
            this.specialDivs.investmentBlock.style.display = 'block';
          }
        } else {
          if (this.specialDivs.investmentBlock) {
            this.specialDivs.investmentBlock.style.display = 'none';
          }
        }
      }
    }

    shouldShowAnyDataElementForSlug(slug) {
      const elementsWithSlug = this.productElements.filter(el => 
        el.getAttribute('data-slug') === slug
      );
      
      return elementsWithSlug.some(element => this.shouldShowProduct(element));
    }

    shouldShowProduct(dataElement) {
      if (!this.evaluator) {
        console.error('FilterEvaluator not initialized');
        return true; // Fallback
      }
      return this.evaluator.evaluateProduct(dataElement, this.filterStates, this.specificProductSlugs);
    }

    // =========================================================================
    // 6. UI, STYLES & BUTTON MANAGERS
    // Methods that update the visual appearance of filter buttons, custom checkboxes,
    // and dynamic SVG icons (like the "Make It Easy" button).
    // =========================================================================

    updateButtonStyles(filterName, isActive) {
      this.updateCheckboxStyles(filterName, isActive);
      
      // Update "Make It Easy" button styling when starter filter changes
      if (filterName === 'checkbox_starter' && this.makeItEasyButton) {
        this.updateMakeItEasyButton(isActive);
      }
      
      // Handle SVG icon switching for getting started checkbox
      if (filterName === 'checkbox_starter') {
        this.updateStarterSVGIcons(isActive);
      }
    }

    updateCheckboxStyles(filterName, isActive) {
      const button = this.buttons[filterName];
      if (!button) return;
      
      // Remove any existing checkmark or fill
      const existingCheck = button.querySelector('.custom-center-fill, .custom-checkmark');
      if (existingCheck) {
        existingCheck.remove();
      }
      
      if (isActive) {
        // Create and add center fill
        const fill = document.createElement('div');
        fill.className = 'custom-center-fill';
        
        // Style as a centered square fill
        fill.style.position = 'absolute';
        fill.style.top = 'calc(50% + 0.25px)';
        fill.style.left = '50%';
        fill.style.transform = 'translate(-50%, -50%)';
        fill.style.width = '60%'; 
        fill.style.height = '60%';
        fill.style.backgroundColor = '#666';
        fill.style.borderRadius = '2.5px';
        fill.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.appendChild(fill);
      }
      
      button.style.backgroundColor = '';
    }

    updateMakeItEasyButton(isActive) {
      if (!this.makeItEasyButton) return;
      
      if (isActive) {
        // Add active class to invert colors
        this.makeItEasyButton.classList.add('active');
        console.log('🚀 MAKE IT EASY: Button activated - colors inverted');
      } else {
        // Remove active class to restore original colors
        this.makeItEasyButton.classList.remove('active');
        console.log('🚀 MAKE IT EASY: Button deactivated - colors restored');
      }
    }

    updateStarterSVGIcons(isActive) {
      // Get the SVG icons for getting started checkbox
      const loadingIcon = document.getElementById('svg-start-icon-buy-page-loading');
      const playIcon = document.getElementById('svg-start-icon-buy-page-play');
      
      if (!loadingIcon && !playIcon) {
        // If icons don't exist, create them dynamically
        this.createStarterSVGIcons();
        return this.updateStarterSVGIcons(isActive);
      }
      
      if (isActive) {
        // Show play icon, hide loading icon
        if (loadingIcon) loadingIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
        console.log('🚀 STARTER SVG: Switched to play icon (checkbox active)');
      } else {
        // Show loading icon, hide play icon
        if (loadingIcon) loadingIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        console.log('🚀 STARTER SVG: Switched to loading icon (checkbox inactive)');
      }
    }

    createStarterSVGIcons() {
      // Find the getting started checkbox container to place SVG icons
      const starterCheckbox = this.buttons.checkbox_starter;
      if (!starterCheckbox) {
        console.warn('🚀 STARTER SVG: Getting started checkbox not found');
        return;
      }
      
      // Find a suitable container (parent or nearby element)
      let container = starterCheckbox.parentElement;
      if (!container) {
        console.warn('🚀 STARTER SVG: No suitable container found for SVG icons');
        return;
      }
      
      // Create loading icon (default visible)
      const loadingIcon = document.createElement('div');
      loadingIcon.id = 'svg-start-icon-buy-page-loading';
      loadingIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#ccc" stroke-width="2"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#666" stroke-width="2" stroke-linecap="round">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" 
                            from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </path>
        </svg>
      `;
      loadingIcon.style.display = 'block';
      loadingIcon.style.marginLeft = '8px';
      
      // Create play icon (default hidden)
      const playIcon = document.createElement('div');
      playIcon.id = 'svg-start-icon-buy-page-play';
      playIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#28a745" stroke="#28a745" stroke-width="2"/>
          <polygon points="10,8 16,12 10,16" fill="white"/>
        </svg>
      `;
      playIcon.style.display = 'none';
      playIcon.style.marginLeft = '8px';
      
      // Add icons to container
      container.appendChild(loadingIcon);
      container.appendChild(playIcon);
      
      console.log('🚀 STARTER SVG: Created SVG icons dynamically');
    }

    // =========================================================================
    // 7. RESET & CLEAR LOGIC
    // Methods for safely clearing filter states, preserving search terms if needed,
    // and restoring the view to its default state.
    // =========================================================================

    resetAllFilters() {
      // Reset specific products
      this.specificProductSlugs = null;

      // Reset regular filters
      Object.keys(this.filterStates).forEach(filterName => {
        this.filterStates[filterName] = false;
        this.updateButtonStyles(filterName, false);
      });

      // Restore all special divs to their original states
      Object.entries(this.specialDivs).forEach(([key, element]) => {
        if (element && this.originalDivStates[key]) {
          element.style.display = this.originalDivStates[key];
        }
      });

      // 🚀 PERFORMANCE: CSS-based show all instead of DOM rebuild
      this.showAllItemsCSS();
      
      // Reset order restoration flag
      this.needsOrderRestoration = false;

      // Check if search input has text and reapply search if it does
      const searchInput = document.getElementById('search-product-list');
      if (searchInput && searchInput.value.trim().length > 0) {
        const searchTerm = searchInput.value.trim();
        this.performSearchOptimized(searchTerm);
        console.log(`🚀 PERFORMANCE: Filters reset but search reapplied: "${searchTerm}"`);
      } else {
        // Restore original order when no filters active
        this.restoreOriginalOrder();
        console.log('🚀 PERFORMANCE: All filters reset');
      }
    }

    clearAllFilters() {
      // Clear search input and search state FIRST
      if (window.searchManager && window.searchManager.clearSearch) {
        window.searchManager.clearSearch();
      }

      // Reset specific products
      this.specificProductSlugs = null;

      // Reset all group styles
      Object.keys(this.config.exclusiveGroups).forEach(groupName => {
        this.updateGroupStyles(groupName, null);
      });
      
      // Reset regular filters without checking search
      Object.keys(this.filterStates).forEach(filterName => {
        this.filterStates[filterName] = false;
        this.updateButtonStyles(filterName, false);
      });

      // Restore all special divs to their original states
      Object.entries(this.specialDivs).forEach(([key, element]) => {
        if (element && this.originalDivStates[key]) {
          element.style.display = this.originalDivStates[key];
        }
      });

      // Show all items and restore original order
      this.showAllItemsCSS();
      this.restoreOriginalOrder();
      
      // Reset order restoration flag
      this.needsOrderRestoration = false;
      
      // Also reset the dropdown to its default state
      if (window.customDropdown && window.customDropdown.reset) {
        window.customDropdown.reset();
      }
      
      console.log('🚀 PERFORMANCE: All filters and search cleared');
    }

    updateGroupStyles(groupName, activeFilterName) {
      const groupFilters = this.config.exclusiveGroups[groupName];
      if (!groupFilters) return;

      groupFilters.forEach(filterName => {
        // Use cached parent wrapper
        const parentWrapper = this.parentWrappers[filterName];
        
        if (parentWrapper) {
          if (activeFilterName) {
            if (filterName === activeFilterName) {
              parentWrapper.classList.add('filter-selected');
              parentWrapper.classList.remove('filter-disabled');
            } else {
              parentWrapper.classList.add('filter-disabled');
              parentWrapper.classList.remove('filter-selected');
            }
          } else {
            // No active filter, so remove all special classes
            parentWrapper.classList.remove('filter-selected');
            parentWrapper.classList.remove('filter-disabled');
          }
        }
      });
    }

    resetFiltersOnly() {
      // Reset specific products
      this.specificProductSlugs = null;

      // Reset regular filters
      Object.keys(this.filterStates).forEach(filterName => {
        this.filterStates[filterName] = false;
        this.updateButtonStyles(filterName, false);
      });

      // Restore all special divs to their original states
      Object.entries(this.specialDivs).forEach(([key, element]) => {
        if (element && this.originalDivStates[key]) {
          element.style.display = this.originalDivStates[key];
        }
      });

      // 🚀 PERFORMANCE: CSS-based show all
      this.showAllItemsCSS();
      
      // Reset order restoration flag
      this.needsOrderRestoration = false;

      console.log('🚀 PERFORMANCE: Filters reset (search input preserved)');
    }

    // =========================================================================
    // 8. SEARCH ENGINE
    // CSS-based search filtering that evaluates search strings against data attributes.
    // Coordinates smoothly with the filter engine.
    // =========================================================================

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based search filtering
    performSearchOptimized(searchTerm) {
      if (!searchTerm) {
        this.showAllItemsCSS();
        return;
      }
      
      const searchLower = searchTerm.toLowerCase();
      const processedSlugs = new Set();
      let matchCount = 0;

      this.productElements.forEach(dataElement => {
        const slug = dataElement.getAttribute('data-slug');
        
        if (processedSlugs.has(slug)) return;
        
        const isMatch = this.doesProductMatchSearch(dataElement, searchTerm);
        const container = dataElement.closest('.w-dyn-item');
        
        if (container) {
          // 🚀 PERFORMANCE: CSS class toggle instead of DOM manipulation
          container.classList.toggle('filter-hidden', !isMatch);
          if (isMatch) matchCount++;
        }
        
        processedSlugs.add(slug);
      });

      if (matchCount === 0) {
        this.showNoResultsMessage();
      }

      console.log(`🚀 PERFORMANCE: Search complete - ${matchCount} products found`);
    }

    doesProductMatchSearch(dataElement, searchTerm) {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const searchableAttributes = ['data-name2', 'data-mint', 'data-metal', 'data-size', 'data-year', 'data-product-id'];
      
      for (const attribute of searchableAttributes) {
        const value = dataElement.getAttribute(attribute);
        if (value && value.toLowerCase().includes(searchLower)) {
          return true;
        }
      }
      return false;
    }

    showNoResultsMessage() {
      if (!this.gridContainer) return;
      
      const noResultsDiv = document.createElement('div');
      noResultsDiv.style.width = '100%';
      noResultsDiv.style.textAlign = 'center';
      noResultsDiv.style.padding = '40px 20px';
      noResultsDiv.style.color = '#666';
      noResultsDiv.style.fontSize = '18px';
      noResultsDiv.innerHTML = 'No products found matching your search.';
      noResultsDiv.className = 'no-results-message';
      
      this.gridContainer.appendChild(noResultsDiv);
    }

    // =========================================================================
    // 9. DOM RESTORATION
    // Methods for capturing the initial page load order of products so they can be
    // correctly restored when sorting filters are turned off.
    // =========================================================================

    captureOriginalOrder() {
      if (!this.gridContainer) return;
      
      const items = this.gridContainer.querySelectorAll('.w-dyn-item');
      items.forEach(item => {
        const productData = item.querySelector('.product-data');
        if (productData) {
          const slug = productData.getAttribute('data-slug');
          if (slug && !this.originalOrder.includes(slug)) {
            this.originalOrder.push(slug);
          }
        }
      });
      
      console.log(`🚀 PERFORMANCE: Captured original order for ${this.originalOrder.length} products`);
    }

    restoreOriginalOrder() {
      if (!this.gridContainer || this.originalOrder.length === 0) return;
      
      const fragment = document.createDocumentFragment();
      
      // Reorder items based on original order
      this.originalOrder.forEach(slug => {
        const item = this.gridContainer.querySelector(`[data-slug="${slug}"]`);
        if (item) {
          const container = item.closest('.w-dyn-item');
          if (container) {
            fragment.appendChild(container);
          }
        }
      });
      
      // Append all items in original order
      this.gridContainer.appendChild(fragment);
      
      // Reduce frequency of logs
      if (!this._lastLogTime || Date.now() - this._lastLogTime > 2000) {
        console.log(`🚀 PERFORMANCE: Restored ${this.originalOrder.length} items to original order`);
        this._lastLogTime = Date.now();
      }
    }

    // =========================================================================
    // 10. GLOBAL EXPORTS & API
    // Methods that expose internal filter functionality to the global window object,
    // allowing other scripts (like search or custom dropdowns) to interact with it.
    // =========================================================================

    setupGlobalNamespace() {
      window.filterControls = window.filterControls || {};
      window.filterControls.resetAllFilters = () => this.resetAllFilters();
      window.filterControls.clearAllFilters = () => this.clearAllFilters(); // Expose clearAllFilters (clears search too)
      window.filterControls.resetFiltersOnly = () => this.resetFiltersOnly();
      window.filterControls.getActiveFilters = () => {
        return Object.entries(this.filterStates)
          .filter(([_, isActive]) => isActive)
          .map(([filterName, _]) => filterName);
      };
      // NEW: Method for search manager to check if a product passes current filters
      window.filterControls.checkProductPassesFilters = (productData) => {
        const slug = productData.getAttribute('data-slug');
        return this.shouldShowAnyDataElementForSlug(slug);
      };
      // NEW: Method to check if any filters are currently active
      window.filterControls.hasActiveFilters = () => {
        const hasSpecific = this.specificProductSlugs && this.specificProductSlugs.length > 0;
        return hasSpecific || Object.values(this.filterStates).some(isActive => isActive);
      };
      // NEW: Method to set specific products (whitelist)
      window.filterControls.setSpecificProducts = (slugs) => this.setSpecificProducts(slugs);
    }

    setSpecificProducts(slugs) {
      this.specificProductSlugs = slugs;
      this.applyAllFiltersOptimized();
      console.log(`🚀 FILTER: Set specific products list: ${slugs ? slugs.length : 0} items`);
    }
  }

  // ==================== INITIALIZATION ====================
  new FilterManager(window.FILTER_CONFIG);
});
