// ==================== DYNAMIC CARD SIZING FIX ====================
document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const MIN_CARD_WIDTH = 300; // Minimum width in pixels for a card
  let resizeObserver = null;
  let mutationObserver = null;
  
  function calculateAndApplyWidth() {
    const container = document.querySelector('.w-dyn-items.w-row');
    if (!container) return;
    
    // Get all cards
    const cards = container.querySelectorAll('.w-dyn-item.w-col.w-col-4');
    if (cards.length === 0) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    if (containerWidth === 0) return; // Container not visible
    
    // Determine number of cards per row based on available space
    let cardsPerRow = Math.floor(containerWidth / MIN_CARD_WIDTH);
    
    // Constraints
    if (cardsPerRow < 1) cardsPerRow = 1;
    if (cardsPerRow > 3) cardsPerRow = 3; // Max 3 columns as per original design
    
    // Calculate width
    // Use floor to avoid sub-pixel wrapping issues
    const newWidth = Math.floor(containerWidth / cardsPerRow);
    
    // console.log(`🚀 SIZING: Container ${containerWidth}px | Cards per row: ${cardsPerRow} | Width: ${newWidth}px`);
    
    cards.forEach(card => {
      // Apply width and flex properties to ensure cards fill the space
      card.style.setProperty('width', `${newWidth}px`, 'important');
      card.style.setProperty('flex', `0 0 ${newWidth}px`, 'important');
      card.style.setProperty('min-width', `${newWidth}px`, 'important');
      card.style.setProperty('max-width', `${newWidth}px`, 'important');
    });
  }
  
  function initializeDynamicSizing() {
    console.log('🚀 SIZING: Initializing dynamic card sizing...');
    
    const container = document.querySelector('.w-dyn-items.w-row');
    if (!container) {
        console.warn('Card container not found for dynamic sizing');
        return;
    }

    // Initial calculation
    // setTimeout to ensure layout is settled after other scripts
    setTimeout(calculateAndApplyWidth, 100);
    
    // ResizeObserver for container width changes (window resize or filter toggle)
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(entries => {
            // Use requestAnimationFrame to throttle and sync with render cycle
            window.requestAnimationFrame(() => {
                calculateAndApplyWidth();
            });
        });
        resizeObserver.observe(container);
    } else {
        // Fallback for older browsers
        window.addEventListener('resize', () => {
             setTimeout(calculateAndApplyWidth, 100);
        });
    }
    
    // MutationObserver for when cards are added/removed (filtering)
    mutationObserver = new MutationObserver(mutations => {
         calculateAndApplyWidth();
    });
    mutationObserver.observe(container, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'] 
    });
  }
  
  // Initialize
  initializeDynamicSizing();
  
  // Expose global API
  window.dynamicCardSizing = {
    recalculate: calculateAndApplyWidth,
    reapplyOptimalWidth: calculateAndApplyWidth,
    getOptimalWidth: () => {
        const card = document.querySelector('.w-dyn-item.w-col.w-col-4');
        return card ? parseFloat(card.style.width) : 0;
    }
  };
});
