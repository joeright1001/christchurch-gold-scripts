document.addEventListener('DOMContentLoaded', () => {
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  
  // Handle multiple filter parameters
  // Support both ?filter=... and ?filter=...&filter=...
  const filterParams = params.getAll('filter');

  if (filterParams.length > 0) {
    // Add a small delay to ensure other scripts (like FilterManager) are initialized
    setTimeout(() => {
      let filtersApplied = false;

      filterParams.forEach(filterParam => {
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
              filtersApplied = true;
              console.log(`Applied filter from URL: ${checkboxId}`);
            }
          }
        }
      });

      // Trigger Webflow interaction if filters were applied
      if (filtersApplied) {
        // Find the filter icon block to trigger the visual interaction
        const filterIconBlock = document.getElementById('filter-icon-block2') || document.querySelector('.filter-icon-block2');
        
        if (filterIconBlock) {
          console.log('Triggering Webflow interaction on filter-icon-block2');
          filterIconBlock.click();
        } else {
          console.warn('filter-icon-block2 not found - could not trigger Webflow interaction');
        }
      }
    }, 500); // 500ms delay
  }
});
