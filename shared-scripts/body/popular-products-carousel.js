document.addEventListener('DOMContentLoaded', () => {

  /* ────── 1. NORMALISE & CONFIG ────── */
  document.querySelectorAll('[id$="-prod-panel"]').forEach(p => {
    p.classList.add('product-panel-background');
  });

  const STOCK_ICONS = {
    'out-of-stock':     "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833dfd9e5b4f43962a44755_Group%2090.png",
    'out-stock':        "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833dfd9e5b4f43962a44755_Group%2090.png",
    'live-at-the-mint': "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833f6f1cbdf61f307806b20_Group%2092.png",
    'live-at-mint':     "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833f6f1cbdf61f307806b20_Group%2092.png",
    'in-stock':         "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/68144f88ffb54e3575002b66_Group%2061%20(3).png",
    'low-stock':        "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/68144f88ffb54e3575002b66_Group%2061%20(3).png"
  };

  const METAL_COLOURS = {
    gold: "#fff7e0",
    silver: "#e6e6e6",
    "gold-silver": "#fff7e0",
    "all": "#fff7e0"
  };

  /* ────── 2. PROCESS PRODUCTS (COLOURS & ICONS) ────── */
  document.querySelectorAll('.product-data').forEach(d => {
    const slug = d.dataset.slug;
    const stock = d.dataset.stockStatus;
    const metal = d.dataset.metal?.toLowerCase();

    const iconEl = document.getElementById(`${slug}-stock-icon`);
    if(iconEl && STOCK_ICONS[stock]) {
      iconEl.src = STOCK_ICONS[stock];
      iconEl.alt = stock.replace(/-/g, ' ');
    }

    const panelEl = document.getElementById(`${slug}-prod-panel`);
    if(panelEl && metal) {
      if(metal === 'all') {
        const overlay = panelEl.querySelector('#gold-overlay-block');
        if(overlay) {
          panelEl.style.position = panelEl.style.position || 'relative';
          Object.assign(overlay.style, {
            display: 'block', position: 'absolute', top: '0', left: '0',
            width: '50%', height: '100%', background: '#fff7e0',
            zIndex: '1', pointerEvents: 'none'
          });
        }
      } else if (METAL_COLOURS[metal]) {
        const colour = METAL_COLOURS[metal];
        panelEl.style.setProperty('background-color', colour, 'important');
        panelEl.querySelectorAll('a, .product-panel-link-pop, .w-inline-block').forEach(n => {
          n.style.setProperty('background-color', colour, 'important');
        });
      }
    }
  });

  /* ────── 3. ADD TO CART HANDLER ────── */
  document.querySelectorAll('.add-cart-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault(); 
      e.stopPropagation(); 
      const cmsID = this.getAttribute('data-value-cms');
      if (cmsID) {
        window.location.href = '/app/cart?data-value-cms=' + cmsID;
      }
    });
  });

  /* ────── 4. CUSTOM GENTLE SCROLL & LOGIC ────── */
  const scrollContainer = document.querySelector('.cms-popular-products-lists');
  const leftArrow = document.getElementById('left-arrow');
  const rightArrow = document.getElementById('right-arrow-pop');
  
  if (scrollContainer) {
    const leftArrowIcon = document.getElementById('left-arrow-icon') || leftArrow?.querySelector('.w-embed, svg, img');
    const rightArrowIcon = document.getElementById('right-arrow-icon') || rightArrow?.querySelector('.w-embed, svg, img');

    // Arrow Visibilities
    const updateArrows = () => {
      const isStart = scrollContainer.scrollLeft <= 10;
      const isEnd = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;

      if(leftArrowIcon) {
        leftArrowIcon.style.opacity = isStart ? '0' : '1';
        leftArrowIcon.style.visibility = isStart ? 'hidden' : 'visible';
        leftArrow.style.pointerEvents = isStart ? 'none' : 'auto';
      }
      if(rightArrowIcon) {
        rightArrowIcon.style.opacity = isEnd ? '0' : '1';
        rightArrowIcon.style.visibility = isEnd ? 'hidden' : 'visible';
        rightArrow.style.pointerEvents = isEnd ? 'none' : 'auto';
      }
    };

    let ticking = false;
    scrollContainer.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateArrows();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // --- High-Performance Gentle Easing Function ---
    // Cubic easing curve for smooth start and long gentle finish
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let isAnimating = false;
    function gentleScroll(container, distance, duration = 800) {
      if (isAnimating) return; // Prevent double-clicking from skipping
      isAnimating = true;

      const startPosition = container.scrollLeft;
      const startTime = performance.now();

      function animationStep(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        container.scrollLeft = startPosition + (distance * easeOutCubic(progress));

        if (progress < 1) {
          window.requestAnimationFrame(animationStep);
        } else {
          isAnimating = false;
          updateArrows();
        }
      }
      window.requestAnimationFrame(animationStep);
    }

    // Scroll roughly 80% of the visible container width for context, up to 1000px max
    leftArrow?.addEventListener('click', () => {
      const distance = Math.min(scrollContainer.clientWidth * 0.8, 1000);
      gentleScroll(scrollContainer, -distance, 800);
    });
    
    rightArrow?.addEventListener('click', () => {
      const distance = Math.min(scrollContainer.clientWidth * 0.8, 1000);
      gentleScroll(scrollContainer, distance, 800);
    });

    updateArrows(); // Init setup

    /* ────── DESKTOP MOUSE DRAGGING ────── */
    let isDown = false;
    let startX;
    let scrollLeft;
    let wasDragged = false;

    scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      wasDragged = false;
      scrollContainer.classList.add('is-dragging');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      scrollContainer.classList.remove('is-dragging');
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      scrollContainer.classList.remove('is-dragging');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault(); 
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.2; // Drag speed 

      if (Math.abs(walk) > 10) { 
        wasDragged = true; // Flag to prevent accidental click on release
      }
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Intercept clicks on products ONLY IF the user was dragging the slider
    scrollContainer.addEventListener('click', (e) => {
      if (wasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Stop native image dragging from breaking our JS drag
    scrollContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }
});