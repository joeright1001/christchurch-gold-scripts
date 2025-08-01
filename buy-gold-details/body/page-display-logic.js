/* =========================================================================
   Christchurch Gold – Display Logic (template-only)
   Injects its own "hide by default" CSS so the rules are page-local.
   ========================================================================= */

(function () {
  const hideCSS = `
    #icon-in-stock,#icon-34-weeks,#icon-35-days,#icon-out-stock,
    #icon-market-closed,#icon-247,
    #state-today,#state-34-weeks,#state-35-days,#state-out-stock,
    #state-market-247,#state-market-nz-open,#state-market-nz-closed,
    #state-market-dg-open,#state-market-dg-closed,#state-market-out-stock,
    #place-order,#get-quote,#button-closed,#button-247,
    #market-button-text-nz-closed,#market-button-text-dg-closed,
    #market-button-text-closed,#investor-1-oz-gold,#investor-1-oz-silver,
    #offline-order-text,#broker-text{display:none;}
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = hideCSS;
  document.head.appendChild(styleTag);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* cache flags */
  const productType =
    document.getElementById('product-type')?.textContent.trim().toLowerCase() || '';
  const onlineOrderFlag =
    document.getElementById('online-order')?.textContent.trim().toLowerCase() || '';

  function showElement(id, display = 'block') {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
  }

  function showInvestorButtons(metalValue) {
    if (metalValue === 'gold') {
      showElement('investor-1-oz-gold', 'inline-block');
    } else if (metalValue === 'silver') {
      showElement('investor-1-oz-silver', 'inline-block');
    } else if (metalValue === 'all') {
      showElement('investor-1-oz-gold', 'inline-block');
      showElement('investor-1-oz-silver', 'inline-block');
    }
  }

  /* ---------- 1. Hide investor-works for Supplier / Collectable ---------- */
  if (['supplier', 'collectable'].includes(productType)) {
    const block = document.getElementById('how-investor-works');
    if (block) block.style.display = 'none';
  }

  /* ---------- 2. GST inclusive notice ----------------------------------- */
  {
    const gstBlock = document.getElementById('gst-incl-block');
    if (gstBlock) gstBlock.style.display = 'none';
    const gstUnit = document.getElementById('unit-gst');
    if (gstUnit && gstBlock) {
      const v = parseFloat(gstUnit.value ?? gstUnit.textContent);
      if (!isNaN(v) && v > 1) gstBlock.style.display = 'flex';
    }
  }

  /* ---------- 3. Stock & market status logic (template guard) ------------ */
  if (window.location.pathname.startsWith('/buy-gold-details/')) {
    const stock = document.getElementById('stock-status')?.textContent.trim();
    const market = document.getElementById('market-status')?.textContent.trim();
    const onlineOrder = document.getElementById('online-order')?.textContent.trim().toLowerCase();
    const metal = document.getElementById('metal')?.textContent.trim().toLowerCase();

    // Override: online-order = false
    if (onlineOrder === 'false') {
      showElement('broker');
      showElement('offline-order-text');
      showElement('state-out-stock', 'flex');
      showElement('icon-out-stock');
      return; // Exit early, don't process other combinations
    }

    // Only process if we have both stock and market values
    if (stock && market) {
      // Handle specific combinations only
      if (market === 'dg-closed' && stock === 'live-at-the-mint') {
        showElement('state-market-dg-closed', 'block'); // FIXED: block not flex
        showInvestorButtons(metal);
        showElement('icon-market-closed');
        showElement('button-closed');
        showElement('broker-text');
        showElement('broker');
        showElement('market-button-text-dg-closed');
      }
      else if (market === 'dg-open' && stock === 'live-at-the-mint') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('icon-34-weeks');
        showElement('state-market-dg-open', 'flex');
        showElement('state-34-weeks', 'flex');
      }
      else if (market === 'dg-closed' && stock === 'out-stock') {
       
        showElement('broker');
        showElement('offline-order-text');
        showElement('state-market-out-stock', 'block'); // Correctly block
        showInvestorButtons(metal);
        showElement('icon-out-stock');
      }
      else if (market === 'dg-open' && stock === 'out-stock') {
       
        showElement('broker');
        showElement('offline-order-text');
        showElement('state-market-out-stock', 'block'); // Correctly block
        showInvestorButtons(metal);
        showElement('icon-out-stock');
      }
      else if (market === '247-open' && stock === 'in-stock') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('state-today', 'flex');
        showElement('state-market-247', 'flex');
        showElement('icon-in-stock');
        showElement('icon-247');
      }
      else if (market === '247-open' && stock === 'low-stock') {
        showElement('place-order', 'inline-block');
        showElement('get-quote', 'inline-block');
        showElement('broker-text');
        showElement('broker');
        showElement('state-35-days', 'flex');
        showElement('icon-35-days');
      }
      // All other combinations: hide all (default behavior)
    }
  }

  /* ---------- 4. OVERRIDE: show #button-247 for Collectable + online TRUE ---- */
  if (productType === 'collectable' && onlineOrderFlag === 'true') {
    showElement('button-247', 'inline-block');
  }
});
