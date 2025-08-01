// PERFORMANCE OPTIMIZED FILTERING SYSTEM
// ==================== INTEGRATED FILTERING SYSTEM ====================
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==================== FILTER MANAGER CLASS ====================
  class FilterManager {
    constructor(config) {
      this.config = config;
      this.buttons = {};
      this.filterStates = {};
      this.productElements = [];
      this.gridContainer = null;
      this.originalOrder = []; // Store original DOM order
      this.needsOrderRestoration = false; // Flag to track if order needs restoration
      
      // Cache special div elements for new filters
      this.specialDivs = {
        speakToDealer: null,
        personalDealerEndBlock: null,
        gettingStartedBlock: null
      };
      this.originalDivStates = {}; // Store original visibility states
      
      this.init();
    }

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
      // Cache desktop checkbox buttons
      Object.entries(this.config.buttons).forEach(([key, id]) => {
        this.buttons[key] = document.getElementById(id);
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
          this.resetAllFilters();
        }
        
        if (this.config.rules[operation]) {
          this.applyFilter(operation, true);
        }
      });
    }

    toggleFilter(filterName) {
      const newState = !this.filterStates[filterName];
      this.applyFilter(filterName, newState);
    }

    applyFilter(filterName, isActive) {
      this.filterStates[filterName] = isActive;
      this.updateButtonStyles(filterName, isActive);
      
      // Reduced logging - only log key filter changes
      if ((filterName.includes('checkbox_starter') || filterName.includes('checkbox_popular') || filterName.includes('checkbox_in_stock')) && 
          (!this._lastFilterChangeTime || Date.now() - this._lastFilterChangeTime > 500)) {
        console.log(`🚀 FILTER: ${filterName.replace('checkbox_', '')} ${isActive ? 'ON' : 'OFF'}`);
        this._lastFilterChangeTime = Date.now();
      }
      
      // 🚀 PERFORMANCE: Use optimized CSS-based filtering
      this.applyAllFiltersOptimized();
    }

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based filtering instead of DOM cloning
    applyAllFiltersOptimized() {
      if (!this.gridContainer) return;
      
      let visibleCount = 0;
      const processedSlugs = new Set();
      
      // Check if any filters are active
      const activeFilters = Object.entries(this.filterStates).filter(([_, isActive]) => isActive);
      
      // Check if search is active (use the search manager's state)
      const hasActiveSearch = window.searchManager && window.searchManager.isActive && window.searchManager.isActive();
      
      // If no filters active and no search, show all items and restore original order
      if (activeFilters.length === 0 && !hasActiveSearch) {
        this.showAllItemsCSS();
        this.restoreOriginalOrder();
        this.manageDivVisibility();
        return;
      }
      
      // Check if popular or starter filters were just turned off and restore order
      const hasPopularOrStarter = this.filterStates.checkbox_popular || this.filterStates.checkbox_starter;
      if (!hasPopularOrStarter && this.needsOrderRestoration) {
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

      // Apply sorting if needed (only on visible items)
      if (this.filterStates.checkbox_popular) {
        this.applyPopularSortCSS();
        this.needsOrderRestoration = true;
      }
      if (this.filterStates.checkbox_starter) {
        this.applyStarterSortCSS();
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

    // 🚀 PERFORMANCE OPTIMIZED: CSS-based sorting with DocumentFragment
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
      }
    }

    shouldShowAnyDataElementForSlug(slug) {
      const elementsWithSlug = this.productElements.filter(el => 
        el.getAttribute('data-slug') === slug
      );
      
      return elementsWithSlug.some(element => this.shouldShowProduct(element));
    }

    shouldShowProduct(dataElement) {
      const activeFilters = Object.entries(this.filterStates).filter(([_, isActive]) => isActive);
      if (activeFilters.length === 0) return true;

      // Special handling for dealer filter
      if (this.filterStates.checkbox_dealer) {
        return false;
      }

      // Check ALL active filters - product must match EVERY filter
      for (const [filterName, isActive] of activeFilters) {
        if (!isActive) continue;

        // Special handling for popular filter
        if (filterName === 'checkbox_popular') {
          const popularValue = dataElement.getAttribute('data-popular');
          if (!popularValue || isNaN(parseInt(popularValue))) {
            return false;
          }
          continue;
        }

        // Special handling for starter filter
        if (filterName === 'checkbox_starter') {
          const starterValue = dataElement.getAttribute('data-getting-started');
          if (!starterValue || isNaN(parseInt(starterValue))) {
            return false;
          }
          continue;
        }
        
        // Special handling for in-stock filter
        if (filterName === 'checkbox_in_stock') {
          const stockStatus = dataElement.getAttribute('data-stock-status');
          if (stockStatus !== 'in-stock') {
            return false;
          }
          continue;
        }
        
        // Special handling for live-mint filter
        if (filterName === 'checkbox_live_mint') {
          const stockStatus = dataElement.getAttribute('data-stock-status');
          if (stockStatus !== 'live-at-the-mint') {
            return false;
          }
          continue;
        }
        
        // Get the rule for standard filters
        const rule = this.config.rules[filterName];
        if (!rule) continue;
        
        // Standard attribute filtering
        const productValue = dataElement.getAttribute(rule.attribute);
        
        if (!productValue) {
          return false;
        }
        
        if (!rule.values.includes(productValue)) {
          return false;
        }
      }

      return true;
    }

    updateButtonStyles(filterName, isActive) {
      this.updateCheckboxStyles(filterName, isActive);
      
      // Update "Make It Easy" button styling when starter filter changes
      if (filterName === 'checkbox_starter' && this.makeItEasyButton) {
        this.updateMakeItEasyButton(isActive);
      }
    }

    updateCheckboxStyles(filterName, isActive) {
      const button = this.buttons[filterName];
      if (!button) return;
      
      // Remove any existing checkmark
      const existingCheck = button.querySelector('.custom-checkmark');
      if (existingCheck) {
        existingCheck.remove();
      }
      
      if (isActive) {
        // Create and add checkmark SVG
        const checkmark = document.createElement('div');
        checkmark.className = 'custom-checkmark';
        checkmark.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" style="position: absolute; top: -5px; left: -2px; pointer-events: none;">
            <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        `;
        checkmark.style.position = 'absolute';
        checkmark.style.top = '0';
        checkmark.style.left = '0';
        checkmark.style.width = '100%';
        checkmark.style.height = '100%';
        checkmark.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.appendChild(checkmark);
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

    resetAllFilters() {
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
      if (window.searchManager && window.searchManager.clearSearchInput) {
        window.searchManager.clearSearchInput();
        window.searchManager.clearSearchState();
      }
      
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
      
      console.log('🚀 PERFORMANCE: All filters and search cleared');
    }

    resetFiltersOnly() {
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


    setupGlobalNamespace() {
      window.filterControls = window.filterControls || {};
      window.filterControls.resetAllFilters = () => this.resetAllFilters();
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
        return Object.values(this.filterStates).some(isActive => isActive);
      };
    }
  }

  // ==================== INITIALIZATION ====================
  new FilterManager(window.FILTER_CONFIG);
});
