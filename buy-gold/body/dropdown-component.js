(function() {
  'use strict';
  
  // ==================== DROPDOWN CONFIGURATION ====================
  const DROPDOWN_CONFIG = {
    elementId: 'custom-filter',
    defaultText: 'Sort...',
    defaultValue: 'default',
    retryDelay: 300,
    options: [
      { text: 'Default (Popular)', value: 'default' },
    //  { text: 'Started Options', value: 'getting-started-select' },
    //  { text: 'Investment Options', value: 'investor-select' },
      { text: 'In-Stock to Collect Today', value: 'in-stock-select' },
      { text: 'Latest / 2025', value: 'latest' },
      { text: 'Price: Best per Oz', value: 'value' },
      { text: 'Price: Low to High', value: 'lowest-price' },
      { text: 'Weight: Low to High', value: 'lowest-weight' },
      { text: 'Weight: High to Low', value: 'highest-weight' },
      { text: 'All Gold', value: 'all-gold-select' },
      { text: 'All Silver', value: 'all-silver-select' }
    ]
  };

  // ==================== OPERATION MAPPING ====================
  const OPERATION_MAPPING = {
    'default': { type: 'sort', operation: 'default' },
    'getting-started-select': { type: 'filter', operation: 'checkbox_starter' },
    'popular-select': { type: 'filter', operation: 'checkbox_popular' },
    'investor-select': { type: 'filter', operation: 'checkbox_investor' },
    'all-gold-select': { type: 'filter', operation: 'checkbox_gold' },
    'all-silver-select': { type: 'filter', operation: 'checkbox_silver' },
    'in-stock-select': { type: 'filter', operation: 'checkbox_in_stock' },
    'latest': { type: 'sort', operation: 'latest' },
    'value': { type: 'sort', operation: 'value' },
    'lowest-price': { type: 'sort', operation: 'lowest-price' },
    'lowest-weight': { type: 'sort', operation: 'lowest-weight' },
    'highest-weight': { type: 'sort', operation: 'highest-weight' }
  };

  // ==================== DROPDOWN CLASS ====================
  class CustomDropdown {
    constructor(config) {
      this.config = config;
      this.element = null;
      this.selectedElement = null;
      this.optionsElement = null;
      this.selectedText = null;
      this.caret = null;
      this.isOpen = false;
      
      this.init();
    }

    init() {
      this.element = document.getElementById(this.config.elementId);
      
      if (!this.element) {
        console.log(`Waiting for '${this.config.elementId}' element to be available...`);
        setTimeout(() => this.init(), this.config.retryDelay);
        return;
      }

      this.buildDropdown();
      this.bindEvents();
      console.log('Custom dropdown initialized successfully');
    }

    buildDropdown() {
      this.element.innerHTML = '';
      this.element.className = 'custom-dropdown';

      this.selectedElement = this.createElement('div', 'filter-selected');
      this.selectedText = this.createElement('span', 'selected-text', this.config.defaultText);
      this.caret = this.createElement('span', 'dropdown-caret');
      
      this.selectedElement.appendChild(this.selectedText);
      this.selectedElement.appendChild(this.caret);

      this.optionsElement = this.createElement('div', 'filter-options');
      this.buildOptions();

      this.element.appendChild(this.selectedElement);
      this.element.appendChild(this.optionsElement);

      this.element.setAttribute('data-selected', this.config.defaultValue);
    }

    createElement(tag, className, text = '') {
      const element = document.createElement(tag);
      element.className = className;
      if (text) element.textContent = text;
      return element;
    }

    buildOptions() {
      this.config.options.forEach(option => {
        const optionElement = this.createElement('div', 'filter-option', option.text);
        optionElement.setAttribute('data-value', option.value);
        this.optionsElement.appendChild(optionElement);
      });
    }

    bindEvents() {
      this.selectedElement.addEventListener('click', (e) => this.toggleDropdown(e));
      this.optionsElement.addEventListener('click', (e) => this.handleOptionClick(e));
      document.addEventListener('click', (e) => this.handleOutsideClick(e));
      this.element.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    toggleDropdown(e) {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      this.element.classList.toggle('active', this.isOpen);
      this.optionsElement.style.display = this.isOpen ? 'block' : 'none';
    }

    closeDropdown() {
      this.isOpen = false;
      this.element.classList.remove('active');
      this.optionsElement.style.display = 'none';
    }

    handleOptionClick(e) {
      if (!e.target.classList.contains('filter-option')) return;
      const value = e.target.getAttribute('data-value');
      const text = e.target.textContent;
      this.selectOption(value, text);
    }

    selectOption(value, text) {
      this.selectedText.textContent = text;
      this.selectedElement.setAttribute('data-value', value);
      this.element.setAttribute('data-selected', value);
      this.closeDropdown();
      this.dispatchOperationEvent(value, text);
      console.log(`Dropdown selection: ${value} (${text})`);
    }

    dispatchOperationEvent(value, text) {
      const mapping = OPERATION_MAPPING[value];
      if (!mapping) {
        console.warn(`No operation mapping found for: ${value}`);
        return;
      }

      const eventType = mapping.type === 'filter' ? 'filterOperation' : 'sortOperation';
      const isMobile = window.innerWidth <= 1023;
      
      const operationEvent = new CustomEvent(eventType, {
        detail: {
          operation: mapping.operation,
          originalValue: value,
          text: text,
          resetFirst: isMobile
        },
        bubbles: true
      });
      
      this.element.dispatchEvent(operationEvent);
      console.log(`Dispatched ${eventType} for: ${mapping.operation}`);
    }

    handleOutsideClick(e) {
      if (!this.element.contains(e.target) && this.isOpen) {
        this.closeDropdown();
      }
    }

    handleKeyboard(e) {
      if (!this.isOpen) return;
      switch(e.key) {
        case 'Escape':
          this.closeDropdown();
          break;
      }
    }

    reset() {
      this.selectOption(this.config.defaultValue, this.config.defaultText);
    }
  }

  function initializeDropdown() {
    window.customDropdown = new CustomDropdown(DROPDOWN_CONFIG);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDropdown);
  } else {
    initializeDropdown();
  }
})();
