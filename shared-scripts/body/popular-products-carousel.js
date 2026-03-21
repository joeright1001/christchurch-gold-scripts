document.addEventListener('DOMContentLoaded', () => {

  /* ────── A. INSTANT UI UPDATES (Runs immediately, zero delay) ────── */
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

  document.querySelectorAll('.add-cart-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault(); 
      e.stopPropagation(); 
      const cmsID = this.getAttribute('data-value-cms');
      if (cmsID) window.location.href = '/app/cart?data-value-cms=' + cmsID;
    });
  });

  /* ────── B. ASYNC LOAD SWIPER.JS (Bypasses Webflow warnings) ────── */
  const loadSwiper = () => {
    // 1. Inject CSS safely
    const swiperCSS = document.createElement('link');
    swiperCSS.rel = 'stylesheet';
    swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(swiperCSS);

    // 2. Inject JS safely
    const swiperJS = document.createElement('script');
    swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperJS.defer = true; // Tells browser not to block rendering
    
    // 3. Initialize ONLY when script finishes downloading
    swiperJS.onload = () => {
      new Swiper('.cms-popular-products-wrapper', {
        wrapperClass: 'cms-popular-products-lists',
        slideClass: 'cms-popular-products-items',
        
        slidesPerView: 'auto',
        spaceBetween: 16,
        speed: 800, // Luxurious 800ms glide duration
        grabCursor: true,
        
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
        },
        
        navigation: {
          nextEl: '#right-arrow-pop',
          prevEl: '#left-arrow',
          disabledClass: 'swiper-button-disabled',
        },
        
        freeMode: {
          enabled: true,
          sticky: false, 
          momentumBounce: false,
        }
      });
    };
    
    document.body.appendChild(swiperJS);
  };

  // Trigger the loading
  loadSwiper();

});