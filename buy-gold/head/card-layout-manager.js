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

    // DESKTOP VIEW RESTORATION (> 991px)
    // If we are on desktop, we want to rely on the CSS grid/flex layout (3 columns)
    // and NOT apply dynamic inline sizing. We must remove any inline styles
    // that might have been applied if the user resized from tablet.
    if (window.innerWidth > 991) {
        cards.forEach(card => {
            card.style.removeProperty('width');
            card.style.removeProperty('flex');
            card.style.removeProperty('min-width');
            card.style.removeProperty('max-width');
        });
        return;
    }
    
    // TABLET/MOBILE VIEW DYNAMIC SIZING (<= 991px)
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    if (containerWidth === 0) return; // Container not visible
    
    // Get margin from first card to account for it in width calculation
    const firstCardStyle = window.getComputedStyle(cards[0]);
    const marginLeft = parseFloat(firstCardStyle.marginLeft) || 0;
    const marginRight = parseFloat(firstCardStyle.marginRight) || 0;
    const marginPerCard = marginLeft + marginRight;

    // Determine number of cards per row based on available space
    // We need to account for the margin in the space required for a card
    let cardsPerRow = Math.floor(containerWidth / (MIN_CARD_WIDTH + marginPerCard));
    
    // Constraints
    if (cardsPerRow < 1) cardsPerRow = 1;
    // On tablet, we might want 2 or 3 columns depending on width, but usually 2.
    // The original code capped at 3. Let's keep that cap or adjust if needed.
    if (cardsPerRow > 3) cardsPerRow = 3;
    
    // Calculate width
    // Use floor to avoid sub-pixel wrapping issues and subtract margins
    const newWidth = Math.floor((containerWidth / cardsPerRow) - marginPerCard);
    
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
