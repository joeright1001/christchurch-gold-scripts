document.addEventListener('DOMContentLoaded', () => {
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('filter');

  if (filterParam) {
    // Expected format: "(data-stock-status=in-stock)"
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
        const isMobile = window.innerWidth <= 991;

        if (isMobile) {
          // Mobile-specific behavior
          if (window.searchManager && window.searchManager.scrollToPosition) {
            window.searchManager.scrollToPosition();
          }
          if (window.filterControls && window.filterControls.applyFilter) {
            window.filterControls.applyFilter(checkboxId, true);
          }
          if (window.customDropdown && window.customDropdown.selectOption) {
            // Find the option text and value from the dropdown config
            const option = window.DROPDOWN_CONFIG.options.find(opt => opt.value === 'in-stock-select');
            if(option) {
                window.customDropdown.selectOption(option.value, option.text.replace(/<[^>]*>/g, ''));
            }
          }
        } else {
          // Desktop behavior (existing functionality)
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.click();
          }
        }
      }
    }
  }
});
