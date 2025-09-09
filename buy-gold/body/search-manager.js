// PERFORMANCE OPTIMIZED: Product Search System
// ==================== PRODUCT SEARCH FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==================== SEARCH CONFIGURATION ====================
  const SEARCH_CONFIG = {
    inputId: 'search-product-list',     // Input field ID
    iconId: 'svg-icon-search',          // Search icon ID
    debounceDelay: 300,                 // Delay before search executes (milliseconds)
    
    // Data attributes to search through
    searchableAttributes: [
      'data-name2',          // Product name (e.g., "1 oz Silver")
      'data-mint',           // Mint name (e.g., "Royal Canadian Mint")
      'data-metal',          // Metal type (e.g., "gold", "silver")
      'data-size',           // Size (e.g., "1oz", "10g")
      'data-year',           // Year (e.g., "2025", "Various")
      'data-product-id',     // Product ID (e.g., "1 oz Silver")
      'data-type'            // Product type (e.g., "coin", "minted-bar", "cast-bar")
    ]
  };

  // ==================== SEARCH MANAGER CLASS ====================
  class SearchManager {
    constructor(config) {
      this.config = config;
      this.searchInput = null;
      this.searchIcon = null;
      this.searchTimeout = null;
      this.isSearchActive = false;
      this.originalProducts = [];
      this.gridContainer = null;
      
      // Mobile positioning state
      this.hasMovedToTop = false;
      this.scrollReleased = false;
      this.isPositioning = false;
      
      this.init();
    }

    init() {
      this.cacheElements();
      this.cacheOriginalProducts();
      this.bindEvents();
      this.setupVirtualKeyboard();
      this.setupScrollRelease();
      this.setupGlobalAccess();
      
      console.log('🚀 PERFORMANCE OPTIMIZED Search Manager initialized');
    }

    /**
     * Cache DOM elements for search functionality
     */
    cacheElements() {
      this.searchInput = document.getElementById(this.config.inputId);
      this.searchIcon = document.getElementById(this.config.iconId);
      this.gridContainer = document.querySelector('.w-dyn-items.w-row');
      
      if (!this.searchInput) {
        console.error(`Search input with ID '${this.config.inputId}' not found`);
      }
      if (!this.searchIcon) {
        console.error(`Search icon with ID '${this.config.iconId}' not found`);
      }
    }

    /**
     * Store original product data for search operations
     */
    cacheOriginalProducts() {
      this.originalProducts = Array.from(document.querySelectorAll('.product-data'));
      console.log(`🚀 PERFORMANCE: Cached ${this.originalProducts.length} products for search`);
    }

    /**
     * Bind search events to input field and icon
     */
    bindEvents() {
      // Input field events
      if (this.searchInput) {
        // Search as user types (with debouncing)
        this.searchInput.addEventListener('input', (e) => {
          this.handleSearchInput(e.target.value);
        });

        // Handle special keys
        this.searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.clearSearch();
          }
          // Prevent form submission on Enter key
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            // Optionally blur the input to remove focus
            this.searchInput.blur();
            console.log('Enter key pressed - form submission prevented');
          }
        });
      }

      // Search icon click event
      if (this.searchIcon) {
        this.searchIcon.style.cursor = 'pointer';
        this.searchIcon.addEventListener('click', () => {
          this.handleIconClick();
        });
      }
    }

    /**
     * Handle search input with debouncing
     * @param {string} searchTerm - The search term entered by user
     */
    handleSearchInput(searchTerm) {
      // Clear any existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Debounce the search to avoid excessive filtering
      this.searchTimeout = setTimeout(() => {
        this.performSearchOptimized(searchTerm.trim());
      }, this.config.debounceDelay);
    }

    /**
     * Handle search icon click
     */
    handleIconClick() {
      if (this.searchInput) {
        const searchTerm = this.searchInput.value.trim();
        this.performSearchOptimized(searchTerm);
        
        // Hide mobile keyboard to show search results
        this.searchInput.blur();
      }
    }

    /**
     * Setup VirtualKeyboard API to prevent automatic viewport adjustments
     * Keeps search input in exact same position when keyboard appears
     */
    setupVirtualKeyboard() {
      // Modern VirtualKeyboard API - prevents browser from moving content
      if ('virtualKeyboard' in navigator) {
        try {
          // Prevent browser from automatically adjusting viewport for keyboard
          navigator.virtualKeyboard.overlaysContent = true;
          console.log('🚀 MOBILE: VirtualKeyboard API enabled - search input position locked');
          
          // Listen for keyboard geometry changes and manually position input
          navigator.virtualKeyboard.addEventListener('geometrychange', () => {
            const keyboardHeight = navigator.virtualKeyboard.boundingRect.height;
            
            if (keyboardHeight > 0) {
              // Keyboard appeared - move input to top
              this.moveInputToTop();
              console.log('🚀 MOBILE: Keyboard appeared - moving input to top');
            }
            // Note: Input stays at top when keyboard disappears (per requirement)
          });
        } catch (error) {
          console.log('VirtualKeyboard API failed to initialize:', error);
        }
      } else {
        console.log('VirtualKeyboard API not supported - using browser default behavior');
      }
    }

    /**
     * Move search input to 12% from top of viewport
     * Input stays at this position permanently once moved
     */
    moveInputToTop() {
      if (!this.searchInput || this.isPositioning) return;

      this.isPositioning = true;

      // Small delay to ensure keyboard animation doesn't interfere
      setTimeout(() => {
        // Calculate 12% from top of viewport
        const targetPosition = window.innerHeight * 0.12;
        const inputRect = this.searchInput.getBoundingClientRect();
        const scrollTarget = window.pageYOffset + inputRect.top - targetPosition;

        // Smooth scroll to position input at 12% from top
        window.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });

        // Set positioning state flags
        setTimeout(() => {
          this.hasMovedToTop = true;
          this.scrollReleased = false;
          this.isPositioning = false;
          console.log('🚀 MOBILE: Search input positioned at 12% from top');
        }, 500); // Wait for smooth scroll to complete

      }, 100);
    }

    /**
     * Setup scroll release functionality to allow users to scroll away from top position
     * when they manually scroll to browse search results
     */
    setupScrollRelease() {
      let scrollTimeout;
      let lastScrollY = window.pageYOffset;

      const handleScroll = () => {
        // Only track scrolling if input has been moved to top and not already released
        if (!this.hasMovedToTop || this.scrollReleased || this.isPositioning) return;

        const currentScrollY = window.pageYOffset;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);

        // If user scrolls more than 50px in any direction, release the positioning
        if (scrollDelta > 50) {
          this.releasePositioning();
        }

        lastScrollY = currentScrollY;
      };

      // Add scroll event listener with passive option for better performance
      window.addEventListener('scroll', handleScroll, { passive: true });

      console.log('🚀 MOBILE: Scroll release functionality initialized');
    }

    /**
     * Release the positioning constraint and allow normal scrolling
     */
    releasePositioning() {
      if (this.scrollReleased) return;

      this.scrollReleased = true;
      console.log('🚀 MOBILE: Positioning released - user can now scroll freely');

      // Optional: Add visual feedback that positioning is released
      if (this.searchInput) {
        this.searchInput.classList.add('positioning-released');
        
        // Remove the class after a short time
        setTimeout(() => {
          this.searchInput.classList.remove('positioning-released');
        }, 2000);
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: CSS-based search instead of DOM cloning
     * @param {string} searchTerm - The search term to filter by
     */
    performSearchOptimized(searchTerm) {
      // Reduce console logging frequency
      if (!this._lastSearchLogTime || Date.now() - this._lastSearchLogTime > 1000) {
        console.log(`🚀 SEARCH: "${searchTerm}"`);
        this._lastSearchLogTime = Date.now();
      }

      // If search term is empty, clear search
      if (!searchTerm) {
        this.clearSearch();
        return;
      }

      // DON'T clear filters - let them work together
      // this.clearExistingFilters(); // REMOVED

      // Set search as active
      this.isSearchActive = true;

      // 🚀 PERFORMANCE: CSS-based filtering that works with existing filters
      const matchingCount = this.filterProductsWithCSS(searchTerm);
      
      // Show "no results" message if no matches found
      if (matchingCount === 0) {
        this.showNoResultsMessage();
      }

      // Only log when significant results or no results
      if (matchingCount === 0 || matchingCount >= 5) {
        console.log(`🚀 SEARCH: ${matchingCount} products found for "${searchTerm}"`);
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Filter products using CSS classes
     * @param {string} searchTerm - The search term to match against
     * @returns {number} Number of matching products
     */
    filterProductsWithCSS(searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const processedSlugs = new Set();
      let matchingCount = 0;

      this.originalProducts.forEach(productData => {
        const slug = productData.getAttribute('data-slug');
        
        // Avoid duplicate slugs
        if (processedSlugs.has(slug)) return;
        
        // Check if this product matches the search term
        const matchesSearch = this.doesProductMatch(productData, searchLower);
        
        // Check if product passes current filters (if any filters are active)
        let passesFilters = true;
        if (window.filterControls && window.filterControls.checkProductPassesFilters) {
          passesFilters = window.filterControls.checkProductPassesFilters(productData);
        }
        
        // Product must pass BOTH search and filter criteria
        const shouldShow = matchesSearch && passesFilters;
        
        // Find the parent w-dyn-item container
        const container = productData.closest('.w-dyn-item');
        if (container) {
          // 🚀 PERFORMANCE FIX: Use CSS class to hide/show
          container.classList.toggle('filter-hidden', !shouldShow);
          if (shouldShow) matchingCount++;
        }
        
        processedSlugs.add(slug);
      });

      return matchingCount;
    }

    /**
     * Check if a product matches the search term
     * @param {Element} productData - The product data element
     * @param {string} searchLower - The search term in lowercase
     * @returns {boolean} True if product matches search term
     */
    doesProductMatch(productData, searchLower) {
      // Split search term into individual words for multi-word search
      const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
      
      // For each word, check if ANY attribute contains it
      for (const word of searchWords) {
        let wordFound = false;
        
        // Check all attributes for this word
        for (const attribute of this.config.searchableAttributes) {
          const value = productData.getAttribute(attribute);
          if (value && value.toLowerCase().includes(word)) {
            wordFound = true;
            break; // This word was found in at least one attribute
          }
        }
        
        // If any word is not found in ANY attribute, the product doesn't match
        if (!wordFound) {
          return false;
        }
      }
      
      // All words were found in at least one attribute each
      return searchWords.length > 0;
    }

    /**
     * Clear all existing filters before performing search
     * NO LONGER USED - filters and search now work together
     */
    clearExistingFilters() {
      // DISABLED - let search and filters work together
      // if (window.filterControls && window.filterControls.resetAllFilters) {
      //   window.filterControls.resetAllFilters();
      //   console.log('🚀 PERFORMANCE: Existing filters cleared for search');
      // }
    }

    /**
     * Clear only filters without clearing search (for Default option)
     */
    clearFiltersOnly() {
      if (window.filterControls && window.filterControls.resetFiltersOnly) {
        window.filterControls.resetFiltersOnly();
        console.log('🚀 PERFORMANCE: Filters cleared but search preserved');
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Show all items using CSS classes
     */
    showAllItemsCSS() {
      this.originalProducts.forEach(productData => {
        const container = productData.closest('.w-dyn-item');
        if (container) {
          container.classList.remove('filter-hidden');
        }
      });
    }

    /**
     * Show a "no results found" message
     */
    showNoResultsMessage() {
      if (!this.gridContainer) return;
      
      // Remove any existing no results message
      this.clearNoResultsMessage();
      
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

    /**
     * Clear the "no results" message from the DOM
     */
    clearNoResultsMessage() {
      if (this.gridContainer) {
        const existingMessage = this.gridContainer.querySelector('.no-results-message');
        if (existingMessage) {
          existingMessage.remove();
        }
      }
    }

    /**
     * Clear the search and restore all products
     */
    clearSearch() {
      this.clearSearchInput();
      this.isSearchActive = false;

      // Clear any pending search timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }

      // Remove any no results message
      this.clearNoResultsMessage();

      // 🚀 PERFORMANCE FIX: Explicitly remove filter-hidden class from search
      this.showAllItemsCSS();

      // Reset filters to restore original grid
      this.clearExistingFilters();

      console.log('🚀 PERFORMANCE: Search cleared - showing all products');
    }

    /**
     * Clear only the search input field (visual clearing)
     */
    clearSearchInput() {
      if (this.searchInput) {
        this.searchInput.value = '';
        // Reduced logging frequency
      }
    }

    /**
     * Clear search state without clearing input (for external filter resets)
     */
    clearSearchState() {
      this.isSearchActive = false;
      
      // Clear any pending search timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }
      
      // Remove any no results message
      this.clearNoResultsMessage();
      
      // 🚀 PERFORMANCE FIX: Explicitly remove filter-hidden class from search
      this.showAllItemsCSS();
      
      // Reduced logging frequency
    }

    /**
     * Check if search is currently active
     * @returns {boolean} True if search is active
     */
    isActive() {
      return this.isSearchActive;
    }

    /**
     * Get current search term
     * @returns {string} Current search term
     */
    getCurrentSearchTerm() {
      return this.searchInput ? this.searchInput.value.trim() : '';
    }

    /**
     * Setup global access for other scripts
     */
    setupGlobalAccess() {
      window.searchManager = window.searchManager || {};
      window.searchManager.clearSearch = () => this.clearSearch();
      window.searchManager.clearSearchInput = () => this.clearSearchInput();
      window.searchManager.clearSearchState = () => this.clearSearchState();
      window.searchManager.isActive = () => this.isActive();
      window.searchManager.getCurrentTerm = () => this.getCurrentSearchTerm();
      // NEW: Expose the filter method for coordination with filter manager
      window.searchManager.filterProductsWithCSS = (searchTerm) => this.filterProductsWithCSS(searchTerm);
      // NEW: Expose the clear no results message function
      window.searchManager.clearNoResultsMessage = () => this.clearNoResultsMessage();
    }
  }

  // ==================== INITIALIZATION ====================
  new SearchManager(SEARCH_CONFIG);
});
