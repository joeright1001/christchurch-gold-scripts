// PERFORMANCE OPTIMIZED: Product Sorting System
// ==================== PRODUCT SORTING SYSTEM ====================
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==================== SORT CONFIGURATION ====================
  const SORT_CONFIG = {
    dropdownId: 'custom-filter',
    retryDelay: 300,
    
    // Sort rules - defines how each sort operation works
    rules: {
      'value': {
        attribute: 'data-value',
        type: 'number',
        direction: 'asc',
        name: 'Value (Best per Oz)'
      },
      'latest': {
        attribute: 'data-year', 
        type: 'number',
        direction: 'desc',
        name: 'Latest/2025 Coins'
      },
      'lowest-price': {
        attribute: 'data-price-nzd',
        type: 'number', 
        direction: 'asc',
        name: 'Price: Low to High'
      },
      'highest-price': {
        attribute: 'data-price-nzd',
        type: 'number',
        direction: 'desc', 
        name: 'Price: High to Low'
      },
      'lowest-weight': {
        attribute: 'data-weight-grams',
        type: 'number',
        direction: 'asc',
        name: 'Weight: Low to High'
      },
      'highest-weight': {
        attribute: 'data-weight-grams', 
        type: 'number',
        direction: 'desc',
        name: 'Weight: High to Low'
      }
    }
  };

  // ==================== SORT MANAGER CLASS ====================
  class SortManager {
    constructor(config) {
      this.config = config;
      this.dropdown = null;
      this.gridContainer = null;
      this.originalOrder = [];
      this.activeSortType = null;
      
      this.init();
    }

    init() {
      this.findDropdown();
    }

    findDropdown() {
      this.dropdown = document.getElementById(this.config.dropdownId);
      
      if (!this.dropdown) {
        console.log('Waiting for sort dropdown to be ready...');
        setTimeout(() => this.findDropdown(), this.config.retryDelay);
        return;
      }

      this.captureOriginalOrder();
      this.bindEvents();
      console.log('🚀 PERFORMANCE OPTIMIZED Sort Manager initialized');
    }

    captureOriginalOrder() {
      // Cache the grid container
      this.gridContainer = document.querySelector('.w-dyn-items.w-row');

      // Use .product-data elements (the hidden data layer) to discover slugs — same as filter-manager.
      // These are reliably populated even when .w-dyn-item querys inside the grid return empty
      // at DOMContentLoaded because Webflow CMS rendering may not be complete yet.
      const dataElements = Array.from(document.querySelectorAll('.product-data'));
      dataElements.forEach(el => {
        const slug = el.getAttribute('data-slug');
        if (slug && !this.originalOrder.includes(slug)) {
          this.originalOrder.push(slug);
        }
      });
      
      console.log(`🚀 PERFORMANCE: Found ${this.originalOrder.length} products via .product-data`);
      if (!this.gridContainer) {
        console.error('Could not find .w-dyn-items.w-row grid container');
      }
    }

    // Refresh gridContainer reference and originalOrder at sort time — guards against
    // Webflow CMS rendering after DOMContentLoaded leaving the init-time snapshot stale.
    ensureOriginalOrder() {
      const liveContainer = document.querySelector('.w-dyn-items.w-row');
      if (liveContainer) {
        this.gridContainer = liveContainer;
      }

      if (this.originalOrder.length === 0) {
        const dataElements = Array.from(document.querySelectorAll('.product-data'));
        dataElements.forEach(el => {
          const slug = el.getAttribute('data-slug');
          if (slug && !this.originalOrder.includes(slug)) {
            this.originalOrder.push(slug);
          }
        });
        console.log(`🚀 SORT: Lazy-captured ${this.originalOrder.length} products`);
      }
    }

    bindEvents() {
      // Listen to sortOperation events
      this.dropdown.addEventListener('sortOperation', (event) => {
        const { operation, resetFirst } = event.detail;
        this.handleSortSelection(operation, resetFirst);
      });
    }

    handleSortSelection(sortType, resetFirst) {
      console.log(`🚀 PERFORMANCE: Sort selected: ${sortType}, resetFirst: ${resetFirst}`);

      // Ensure we have the live container + original order before any sort/restore
      this.ensureOriginalOrder();

      // Reset filters if requested (mobile always resets)
      if (resetFirst) {
        this.resetFilters();
      }

      // Apply the selected sort
      if (sortType === 'default') {
        this.restoreOriginalOrder();
      } else if (this.config.rules[sortType]) {
        this.applySortRuleOptimized(sortType);
      } else {
        console.warn(`Unknown sort type: ${sortType}`);
      }
    }

    resetFilters() {
      // This provides a clean "reset to default state" experience
      
      // Clear filters only, preserving search input
      if (window.filterControls && window.filterControls.resetFiltersOnly) {
        window.filterControls.resetFiltersOnly();
        console.log('🚀 PERFORMANCE: Filters reset by sort operation (search preserved)');
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Use DocumentFragment for efficient DOM reordering
     */
    applySortRuleOptimized(sortType) {
      const rule = this.config.rules[sortType];
      
      // Clear any "no results" message before sorting
      if (window.searchManager && window.searchManager.clearNoResultsMessage) {
        window.searchManager.clearNoResultsMessage();
      }
      
      // If search is active, re-apply it first to ensure we're sorting the correct subset
      if (window.searchManager && window.searchManager.isActive()) {
        const searchTerm = window.searchManager.getCurrentTerm();
        if (searchTerm) {
          window.searchManager.filterProductsWithCSS(searchTerm);
        }
      }
      
      if (!this.gridContainer) {
        console.error('Grid container not found');
        return;
      }

      // 🚀 PERFORMANCE: Use .product-data elements (the hidden data layer) to read sort attributes,
      // then locate their parent .w-dyn-item containers — same pattern as filter-manager.
      // Direct query of [data-attribute] inside .w-dyn-item fails because those attributes live
      // on the hidden .product-data elements, not on the visible card DOM.
      const processedSlugs = new Set();
      const itemsWithValues = [];

      const allDataElements = Array.from(document.querySelectorAll('.product-data'));
      
      allDataElements.forEach(dataElement => {
        const slug = dataElement.getAttribute('data-slug');
        if (!slug || processedSlugs.has(slug)) return;

        const container = dataElement.closest('.w-dyn-item');
        if (!container) return;

        // Skip items hidden by filters
        if (container.classList.contains('filter-hidden')) return;

        const rawValue = dataElement.getAttribute(rule.attribute);
        if (rawValue === null) return;

        const sortValue = this.parseSortValue(rawValue, rule);
        
        if (sortValue !== null) {
          itemsWithValues.push({
            element: container,
            value: sortValue,
            rawValue: rawValue
          });
          processedSlugs.add(slug);
        }
      });
      
      // Sort the items
      this.sortItems(itemsWithValues, rule);
      
      // 🚀 PERFORMANCE OPTIMIZED: Use DocumentFragment for efficient DOM reordering
      const fragment = document.createDocumentFragment();
      itemsWithValues.forEach(item => {
        fragment.appendChild(item.element);
      });
      
      // Append all sorted items at once
      this.gridContainer.appendChild(fragment);
      
      this.activeSortType = sortType;
      console.log(`🚀 PERFORMANCE: Sorted ${itemsWithValues.length} items by ${rule.name}`);
    }

    parseSortValue(rawValue, rule) {
      if (rule.type === 'number') {
        const numValue = parseFloat(rawValue.replace(/,/g, ''));
        
        // If it's a valid number, return it
        if (!isNaN(numValue)) {
          return numValue;
        }
        
        // For latest sort, any non-numeric value (Various, etc.) comes last
        if (rule.attribute === 'data-year') {
          return -999; // Very low value to ensure it comes last in descending sort
        }
        
        return null;
      }

      // For string sorting (if needed in future)
      return rawValue;
    }

    sortItems(items, rule) {
      items.sort((a, b) => {
        if (rule.direction === 'asc') {
          return a.value - b.value;
        } else {
          return b.value - a.value;
        }
      });
    }

    restoreOriginalOrder() {
      // Reset filters first to get all items back
      
      // Clear any "no results" message before restoring order
      if (window.searchManager && window.searchManager.clearNoResultsMessage) {
        window.searchManager.clearNoResultsMessage();
      }
      
      // If search is active, re-apply it to restore the search results in default order
      if (window.searchManager && window.searchManager.isActive()) {
        const searchTerm = window.searchManager.getCurrentTerm();
        if (searchTerm) {
          window.searchManager.filterProductsWithCSS(searchTerm);
        }
      }
      
      // 🚀 PERFORMANCE FIX: Restore DOM elements to original order.
      // Use document.querySelector('.product-data') to find items — the data-slug attribute
      // lives on the hidden .product-data element, not directly on .w-dyn-item children.
      if (this.gridContainer && this.originalOrder.length > 0) {
        const fragment = document.createDocumentFragment();
        
        this.originalOrder.forEach(slug => {
          const dataEl = document.querySelector(`.product-data[data-slug="${slug}"]`);
          if (dataEl) {
            const container = dataEl.closest('.w-dyn-item');
            if (container) {
              fragment.appendChild(container);
            }
          }
        });
        
        this.gridContainer.appendChild(fragment);
        console.log(`🚀 PERFORMANCE: Restored ${this.originalOrder.length} items to original order`);
      }
      
      this.activeSortType = null;
      console.log('🚀 PERFORMANCE: Default order restored');
    }

    getCurrentSort() {
      return this.activeSortType;
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Refresh sort with DocumentFragment
     */
    refreshSort() {
      if (this.activeSortType && this.config.rules[this.activeSortType]) {
        this.applySortRuleOptimized(this.activeSortType);
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Sort visible items only
     */
    sortVisibleItems(sortType) {
      const rule = this.config.rules[sortType];
      if (!rule || !this.gridContainer) return;

      // Only sort visible items (not hidden by filters)
      const visibleItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item:not(.filter-hidden)'));
      const itemsWithValues = [];
      
      visibleItems.forEach(item => {
        const dataElement = item.querySelector(`[${rule.attribute}]`);
        if (!dataElement) return;
        
        const rawValue = dataElement.getAttribute(rule.attribute);
        const sortValue = this.parseSortValue(rawValue, rule);
        
        if (sortValue !== null) {
          itemsWithValues.push({
            element: item,
            value: sortValue,
            rawValue: rawValue
          });
        }
      });
      
      this.sortItems(itemsWithValues, rule);
      
      // Use DocumentFragment for efficient reordering
      const fragment = document.createDocumentFragment();
      itemsWithValues.forEach(item => {
        fragment.appendChild(item.element);
      });
      
      this.gridContainer.appendChild(fragment);
      
      console.log(`🚀 PERFORMANCE: Sorted ${itemsWithValues.length} visible items by ${rule.name}`);
    }
  }

  // ==================== INITIALIZATION ====================
  const sortManager = new SortManager(SORT_CONFIG);
  
  // Make sort manager globally accessible
  window.sortManager = sortManager;
});
