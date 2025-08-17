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
        // Get the checkbox element
        const checkbox = document.getElementById(checkboxId);
        
        if (checkbox) {
          // Click the checkbox to apply the filter
          checkbox.click();
        }
      }
    }
  }
});
