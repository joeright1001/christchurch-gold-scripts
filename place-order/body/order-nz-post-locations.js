// ========================================================================
//  order-nz-post-locations.js  –  Replace #post-collect with NZ Post list
// ========================================================================
document.addEventListener('DOMContentLoaded', function() {
    const postCollectInput = document.getElementById('post-collect');
    const addressInput     = document.getElementById('address');

    if (!postCollectInput || !addressInput) {
        console.error('Required inputs not found');
        return;
    }

    const select = document.createElement('select');
    select.id = 'form_field_deliveryLocation';
    select.className = 'form-select location-dropdown';

    const locations = { /* … huge locations object … */ };

    const def = document.createElement('option');
    def.textContent = '-- Please Select --';
    def.value = '';
    select.appendChild(def);

    Object.entries(locations).forEach(([region, shops]) => {
        const og = document.createElement('optgroup');
        og.label = region;
        shops.forEach(shop => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = shop;
            og.appendChild(opt);
        });
        select.appendChild(og);
    });

    select.addEventListener('change', function() {
        const v = this.value;
        postCollectInput.value = v;
        addressInput.value = v;
        postCollectInput.dispatchEvent(new Event('input',{bubbles:true}));
        addressInput.dispatchEvent(new Event('input',{bubbles:true}));
        postCollectInput.dispatchEvent(new Event('change',{bubbles:true}));
        addressInput.dispatchEvent(new Event('change',{bubbles:true}));
    });

    postCollectInput.parentNode.insertBefore(select, postCollectInput);
    postCollectInput.style.display = 'none';

    /* Inject dropdown styling */
    const style = document.createElement('style');
    style.textContent = `
      .location-dropdown {
        width:100%;padding:12px 16px;font-size:16px;color:#6b7280;
        background:#fff;border:1px solid #d1d5db;border-radius:8px;
        outline:none;transition:.2s;cursor:pointer;
        -webkit-appearance:none;-moz-appearance:none;appearance:none;
        background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat:no-repeat;background-position:right 12px center;
        background-size:20px;padding-right:40px;
      }
      .location-dropdown:hover{border-color:#9ca3af;box-shadow:0 1px 3px rgba(0,0,0,.1);}
      .location-dropdown:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1);color:#111827;}
      .location-dropdown option{padding:8px 12px;color:#374151;}
      .location-dropdown optgroup{font-weight:600;color:#111827;padding-top:8px;}
      .location-dropdown option:hover{background:#f3f4f6;}
      .location-dropdown:not(:invalid){color:#111827;}
    `;
    document.head.appendChild(style);
});
