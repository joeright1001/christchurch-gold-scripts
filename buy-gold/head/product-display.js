//---------------------------------------------------------------------------
//----------------Combined Stock Icons, Metal Colours, and Hover Interactions------------------
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- CONSTANTS ---------- */
  // Stock-status icons
  const outOfStockImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833dfd9e5b4f43962a44755_Group%2090.png";
  const liveAtMintImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6833f6f1cbdf61f307806b20_Group%2092.png";
  const inStockImage   = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/68144f88ffb54e3575002b66_Group%2061%20(3).png";

  // Metal colours
  const goldBackground  = "#fff7e0";
  const silverBackground = "#e6e6e6";

  /* ---------- PROCESS EACH PRODUCT ---------- */
  document.querySelectorAll('.product-data').forEach(dataEl => {
    const slug       = dataEl.getAttribute('data-slug');
    const stockStatus = dataEl.getAttribute('data-stock-status');
    const metalType   = (dataEl.getAttribute('data-metal') || "").toLowerCase();
    const isPopular   = dataEl.getAttribute('data-popular');

    const stockIcon  = document.getElementById(`${slug}-stock-icon`);
    const panel      = document.getElementById(`${slug}-prod-panel`);

    /* ---- STOCK ICON HANDLING ---- */
    if (stockIcon && stockStatus) {
      let imgSrc, altText;
      switch (stockStatus) {
        case 'out-of-stock':
        case 'out-stock':
          imgSrc = outOfStockImage;  altText = "Out of Stock";           break;
        case 'live-at-the-mint':
        case 'live-at-mint':
          imgSrc = liveAtMintImage;  altText = "Live at the Mint";       break;
        case 'in-stock':
        case 'low-stock':
          imgSrc = inStockImage;     altText = stockStatus === 'in-stock' ? "In Stock" : "Low Stock";
          break;
        default:
          console.warn(`Unknown stock status: ${stockStatus} for ${slug}`);
      }
      if (imgSrc) { stockIcon.src = imgSrc; stockIcon.alt = altText; }
    }

    /* ---- POPULAR ICON HANDLING ---- */
    if (isPopular) {
      const popularIcon = document.getElementById(`${slug}-popular`);
      if (popularIcon) {
        popularIcon.style.display = 'block';
      }
    }

    /* ---- METAL-TYPE STYLING ---- */
    if (panel && metalType) {
      let tintColour = null;   // Only applied when NOT 'all'
      switch (metalType) {
        case 'gold':   tintColour = goldBackground;  break;
        case 'silver': tintColour = silverBackground; break;
        case 'gold-silver':      // existing mixed flag
          tintColour = goldBackground;               break;
        case 'all':              // **NEW 50/50 HANDLING**
          // 1. Leave panel colour unchanged.
          // 2. Activate the hidden overlay for a 50/50 gold split.
          const overlay = panel.querySelector('#gold-overlay-block');
          if (overlay) {
            panel.style.position = panel.style.position || 'relative'; // ensure positioning context
            Object.assign(overlay.style, {
              display:      'block',
              position:     'absolute',
              top:          '0',
              left:         '0',
              width:        '50%',
              height:       '100%',
              background:   goldBackground,
              zIndex:       '0',
              pointerEvents:'none'           // overlay stays non-interactive
            });
          } else {
            console.warn(`gold-overlay-block not found in ${slug}`);
          }
          break;
        default:
          console.warn(`Unknown metal type: ${metalType} for ${slug}`);
      }

      // Apply tint only when we have one (i.e. NOT for 'all')
      if (tintColour) {
        panel.style.setProperty('background-color', tintColour, 'important');
        // Also tint internal link & covering blocks
        panel.querySelectorAll('a, .link-block-8, .w-inline-block').forEach(el => {
          el.style.setProperty('background-color', tintColour, 'important');
        });
      }
    }
  });

  /* ---------- HOVER INTERACTIONS (unchanged) ---------- */
  function handleHover(card, hovering) {
    const front = card.querySelector('.image-bullion-productlist-front');
    const back  = card.querySelector('.image-bullion-productlist-back');
    const text  = card.querySelector('.click-to-view-box');
    if (!front || !back) return;
    front.style.opacity = hovering ? '0' : '1';
    back .style.opacity = hovering ? '1' : '0';
    if (text) {
      text.style.opacity   = hovering ? '1' : '0';
      text.style.transform = hovering ? 'translateY(0)' : 'translateY(10px)';
    }
  }

  // Event delegation for hover
  document.body.addEventListener('mouseenter', e => {
    if (e.target.classList.contains('product-panel-background')) handleHover(e.target, true);
  }, true);
  document.body.addEventListener('mouseleave', e => {
    if (e.target.classList.contains('product-panel-background')) handleHover(e.target, false);
  }, true);

  /* ---------- OBSERVE FILTERING CHANGES (unchanged) ---------- */
  const grid = document.querySelector('.w-dyn-items.w-row');
  if (grid) {
    new MutationObserver(muts => {
      // event delegation already covers new cards; observer kept for future hooks
    }).observe(grid, {childList:true, subtree:true});
  }
});
