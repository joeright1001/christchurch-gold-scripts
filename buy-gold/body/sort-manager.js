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
      
      if (this.gridContainer) {
        const items = this.gridContainer.querySelectorAll('.w-dyn-item');
        items.forEach(item => {
          const productData = item.querySelector('.product-data');
          if (productData) {
            this.originalOrder.push(productData.getAttribute('data-slug'));
          }
        });
        
        console.log(`🚀 PERFORMANCE: Found products container with ${this.originalOrder.length} products`);
      } else {
        console.error('Could not find products container');
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
      // SIMPLIFIED: Always clear search and filters when returning to default
      // This provides a clean "reset to default state" experience
      
      // Clear search input and state completely
      if (window.searchManager && window.searchManager.clearSearch) {
        window.searchManager.clearSearch();
        console.log('🚀 PERFORMANCE: Search cleared for Default option');
      }
      
      // Clear all filters
      if (window.filterControls && window.filterControls.resetAllFilters) {
        window.filterControls.resetAllFilters();
        console.log('🚀 PERFORMANCE: Filters reset by sort operation');
      }
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZED: Use DocumentFragment for efficient DOM reordering
     */
    applySortRuleOptimized(sortType) {
      const rule = this.config.rules[sortType];
      
      if (!this.gridContainer) {
        console.error('Grid container not found');
        return;
      }

      // 🚀 PERFORMANCE: Only process visible items (not hidden by filters)
      const currentItems = Array.from(this.gridContainer.querySelectorAll('.w-dyn-item:not(.filter-hidden)'));
      const itemsWithValues = [];
      
      currentItems.forEach(item => {
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
      
      // 🚀 PERFORMANCE FIX: Actually restore DOM elements to original order
      if (this.gridContainer && this.originalOrder.length > 0) {
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
