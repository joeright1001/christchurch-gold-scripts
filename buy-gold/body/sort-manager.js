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
      // Cache the grid container(s)
      // Webflow uses .w-dyn-items for collection lists. 
      // We look for all instances to ensure popular and main lists are both covered.
      this.gridContainers = Array.from(document.querySelectorAll('.w-dyn-items'));
      
      if (this.gridContainers.length > 0) {
        this.gridContainers.forEach(container => {
          const items = container.querySelectorAll('.w-dyn-item');
          items.forEach(item => {
            const productData = item.querySelector('.product-data');
            if (productData) {
              const slug = productData.getAttribute('data-slug');
              if (slug) {
                this.originalOrder.push(slug);
              }
            }
          });
        });
        
        // For backwards compatibility with older methods, keep a reference to the first container
        this.gridContainer = this.gridContainers[0];
        
        console.log(`🚀 PERFORMANCE: Found ${this.gridContainers.length} products container(s) with ${this.originalOrder.length} products total`);
      } else {
        console.error('Could not find products container (.w-dyn-items)');
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
      
      if (!this.gridContainers || this.gridContainers.length === 0) {
        console.error('Grid containers not found');
        return;
      }

      // 🚀 PERFORMANCE: Only process visible items (not hidden by filters) from ALL containers
      const currentItems = [];
      this.gridContainers.forEach(container => {
        currentItems.push(...Array.from(container.querySelectorAll('.w-dyn-item:not(.filter-hidden)')));
      });

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
      
      // Append all sorted items to the main container (effectively merging lists during sort)
      this.gridContainers[0].appendChild(fragment);
      
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
      
      // 🚀 PERFORMANCE FIX: Actually restore DOM elements to original order
      if (this.gridContainers && this.gridContainers.length > 0 && this.originalOrder.length > 0) {
        const fragment = document.createDocumentFragment();
        
        // Reorder items based on original order
        this.originalOrder.forEach(slug => {
          // Search in all containers for the item
          let foundItem = null;
          for (const container of this.gridContainers) {
            const item = container.querySelector(`[data-slug="${slug}"]`);
            if (item) {
              foundItem = item.closest('.w-dyn-item');
              if (foundItem) break;
            }
          }
          
          if (foundItem) {
            fragment.appendChild(foundItem);
          }
        });
        
        // Append all items in original order to the first container
        this.gridContainers[0].appendChild(fragment);
        
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
        console.log(`🚀 SORT: Refreshing active sort: ${this.activeSortType}`);
        this.applySortRuleOptimized(this.activeSortType);
      } else {
        // If no active sort (Default), restore original order to ensure popular-first
        console.log('🚀 SORT: No active sort rule, restoring original order (popular-first)');
        this.restoreOriginalOrder();
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
