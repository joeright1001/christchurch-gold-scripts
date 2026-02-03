// ==================== DYNAMIC CARD SIZING FIX ====================
document.addEventListener('DOMContentLoaded', function() {
  let optimalCardWidth = null;
  let isWidthDetected = false;
  
  function detectOptimalCardWidth() {
    const container = document.querySelector('.w-dyn-items.w-row');
    const cards = container ? container.querySelectorAll('.w-dyn-item.w-col.w-col-4') : [];
    
    if (!container) {
      console.warn('Card container not found for width detection');
      return null;
    }
    
    let detectedWidth = null;
    
    if (cards.length >= 3) {
      // Use the actual rendered width when 3+ cards are present
      const firstCard = cards[0];
      const cardRect = firstCard.getBoundingClientRect();
      detectedWidth = cardRect.width;
      console.log(`🚀 SIZING: Detected width from 3+ cards: ${detectedWidth}px`);
    } else {
      // Fallback calculation based on container width
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      // Calculate: (container width - margins) / 3 cards
      // Assuming 1% total margin (0.5% left + 0.5% right per card)
      const availableWidth = containerWidth * 0.99; // Account for margins
      detectedWidth = availableWidth / 3;
      console.log(`🚀 SIZING: Calculated width from container (${containerWidth}px): ${detectedWidth}px`);
    }
    
    // Respect min/max bounds
    const boundedWidth = Math.max(320, Math.min(450, detectedWidth));
    console.log(`🚀 SIZING: Final optimal width (with bounds): ${boundedWidth}px`);
    
    return boundedWidth;
  }
  
  function applyOptimalWidth() {
    if (!optimalCardWidth || isWidthDetected) return;
    
    const cards = document.querySelectorAll('.w-dyn-item.w-col.w-col-4');
    
    if (cards.length === 0) {
      console.warn('No cards found to apply optimal width');
      return;
    }
    
    cards.forEach(card => {
      // Apply the optimal width directly
      card.style.setProperty('width', `${optimalCardWidth}px`, 'important');
      card.style.setProperty('flex', `0 0 ${optimalCardWidth}px`, 'important');
      card.style.setProperty('min-width', `${optimalCardWidth}px`, 'important');
      card.style.setProperty('max-width', `${optimalCardWidth}px`, 'important');
    });
    
    isWidthDetected = true;
    console.log(`🚀 SIZING: Applied optimal width ${optimalCardWidth}px to ${cards.length} cards`);
  }
  
  function initializeDynamicSizing() {
    // DISABLED: Returning early to allow CSS flexbox to handle layout
    console.log('🚀 SIZING: Dynamic JS sizing disabled in favor of CSS flexbox');
    return;

    // Wait for the page to fully render
    setTimeout(() => {
      optimalCardWidth = detectOptimalCardWidth();
      
      if (optimalCardWidth) {
        applyOptimalWidth();
        
        // Set up observer for dynamic content changes (filtering)
        observeCardChanges();
      } else {
        console.warn('Could not detect optimal card width');
      }
    }, 500); // Give time for CSS to apply
  }
  
  function observeCardChanges() {
    const container = document.querySelector('.w-dyn-items.w-row');
    
    if (!container) return;
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Check if cards were added/removed or visibility changed
          const visibleCards = container.querySelectorAll('.w-dyn-item.w-col.w-col-4:not(.filter-hidden)');
          
          if (visibleCards.length > 0 && optimalCardWidth) {
            // Reapply optimal width to any new or modified cards
            setTimeout(() => {
              visibleCards.forEach(card => {
                // Only apply if the card doesn't already have the optimal width
                const currentWidth = card.style.width;
                if (currentWidth !== `${optimalCardWidth}px`) {
                  card.style.setProperty('width', `${optimalCardWidth}px`, 'important');
                  card.style.setProperty('flex', `0 0 ${optimalCardWidth}px`, 'important');
                  card.style.setProperty('min-width', `${optimalCardWidth}px`, 'important');
                  card.style.setProperty('max-width', `${optimalCardWidth}px`, 'important');
                }
              });
            }, 100); // Small delay to ensure other scripts have finished
          }
        }
      });
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // Initialize the dynamic sizing system
  initializeDynamicSizing();
  
  // Also expose globally in case other scripts need to trigger it
  window.dynamicCardSizing = {
    reapplyOptimalWidth: applyOptimalWidth,
    getOptimalWidth: () => optimalCardWidth,
    recalculateWidth: () => {
      optimalCardWidth = detectOptimalCardWidth();
      applyOptimalWidth();
    }
  };
});
