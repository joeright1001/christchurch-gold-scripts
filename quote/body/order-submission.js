/**
 * Order Submission to Middleware
 * Handles form validation and API submission
 * Extracted from code-submit-to-middleware-current.txt
 */

/* ================================================================
   API host selection constants / helpers
   ================================================================*/
const DEV_URL              = "https://mware3-staging.up.railway.app";
const STAGING_FALLBACK_URL = "https://mware3-staging.up.railway.app";
const PROD_URL             = "https://mware3-production.up.railway.app";

async function isCodespaceAvailable(){
  try{
    const c=new AbortController();const t=setTimeout(()=>c.abort(),3000);
    const ok=(await fetch(DEV_URL+'/health',{signal:c.signal})).ok;
    clearTimeout(t);return ok;
  }catch{return false}
}

async function getApiBaseUrl(){
  if(location.hostname.includes('webflow.io')){
    return (await isCodespaceAvailable())?DEV_URL:STAGING_FALLBACK_URL;
  }
  return PROD_URL;
}

/* ================================================================
   session‑storage helpers with expiry
   ================================================================*/
function setSessionDataWithExpiry(key,val,min){
  sessionStorage.setItem(key,JSON.stringify({value:val,expiry:Date.now()+min*60000}));
}

function getSessionDataWithExpiry(key){
  const item=JSON.parse(sessionStorage.getItem(key)||"null");
  if(!item||Date.now()>item.expiry){sessionStorage.removeItem(key);return null;}
  return item.value;
}

/* ================================================================
   DOMContentLoaded - Order Submission Logic
   ================================================================*/
document.addEventListener('DOMContentLoaded',async()=>{

  /* --- breadcrumb cache (unchanged) --- */
  (function(){
    const data={
      name :document.getElementById('breadcrumb-text')?.textContent||"",
      url  :document.getElementById('breadcrumb-url') ?.href       ||"",
      metal:document.getElementById('metal')          ?.textContent||""
    };
    setSessionDataWithExpiry('product_url',JSON.stringify(data),30);
  })();

  const API_BASE_URL=await getApiBaseUrl();
  console.log('Using API base URL:',API_BASE_URL);

  const orderBtn=document.querySelector('#place-order-submit');
  const form    =document.querySelector('#wf-form-quote');
  if(!orderBtn||!form){console.error('Required elements not found');return;}

  /* ==========================================================
     UX helpers
  ==========================================================*/
  function showError(field,msg){
    const ex=field.parentElement.querySelector('.error-message');if(ex)ex.remove();
    const div=document.createElement('div');
    div.className='error-message';div.textContent=msg;
    div.style.color='red';div.style.fontSize='12px';div.style.marginTop='10px';
    field.parentElement.appendChild(div);field.style.borderColor='red';
  }

  function clearError(field){
    field.parentElement.querySelector('.error-message')?.remove();
    field.style.borderColor='';
  }

  function showProcessingState(btn){
    const html=btn.innerHTML;
    btn.innerHTML='Processing<span class="spinner"></span>';
    btn.classList.add('button-processing');btn.disabled=true;return html;
  }

  function restoreButtonState(btn,html){
    btn.innerHTML=html;btn.classList.remove('button-processing');btn.disabled=false;
  }

  /* ==========================================================
     validateForm (original logic untouched)
  ==========================================================*/
  function validateForm(fd){
    let ok=true,scrollDate=false,supplierErr=false;
    const required={
      'first-name':'First name is required',
      'last-name' :'Last name is required',
      'email'     :'Email is required',
      'mobile'    :'Phone number is required'
    };
    Object.keys(required).forEach(n=>{
      const f=form.querySelector(`[name="${n}"]`);if(f)clearError(f);
    });
    Object.entries(required).forEach(([n,msg])=>{
      const f=form.querySelector(`[name="${n}"]`);
      if(!fd.get(n)?.trim()){showError(f,msg);ok=false;}
    });

    /* supplier checkbox rule (unchanged) */
    /* Checkbox consent rule commented out as per request
    const prodType=document.getElementById('product-type');
    const supplierCb=document.getElementById('checkbox-supplier')||
                      form.querySelector('[name="checkbox-supplier"]');
    const cbBlock=document.getElementById('checkbox-supplier-block');
    if(prodType&&supplierCb&&cbBlock){
      clearError(cbBlock);
      if(prodType.textContent.toLowerCase().trim()==='supplier'&&!supplierCb.checked){
        showError(cbBlock,'Please agree to supply ID if required');
        ok=false;supplierErr=true;
      }
    }
    */

    /* special product selection */
    if(!fd.get('product-name-full')){
      const msg=document.getElementById('no-product-selected');
      if(msg){msg.style.display='block';msg.scrollIntoView({behavior:'smooth',block:'center'});}
      ok=false;
    }
    return ok;
  }

  /* ==========================================================
     order button click handler
  ==========================================================*/
  orderBtn.addEventListener('click',async(evt)=>{
    evt.preventDefault();
    const fd=new FormData(form);
    if(!validateForm(fd))return;

    /* --- collect values (no shipping arithmetic) --- */
    let shippingDisplay = document.querySelector('#shipping')?.value.trim() || "0";
    if (fd.get('delivery') !== 'Shipping') {
      shippingDisplay = "0";
    }

    const jsonData={
      first_name_order : fd.get('first-name'),
      last_name_order  : fd.get('last-name')||"",
      email_order      : fd.get('email'),
      phone_order      : fd.get('mobile')||"",
      delivery         : fd.get('delivery')||"",
      pay_in_person    : fd.get('pay-in-person')||"",
      checkbox_order   : fd.get('checkbox-order')||"",
      address          : fd.get('address')||"",
      message          : fd.get('message')||"",
      date_picker_order: fd.get('date-picker')||"",
      time_picker_order: document.getElementById('time-picker-24')?.value || fd.get('time-picker') ||"",
      total_amount     : parseFloat(fd.get('total-amount'))||0,
      gst_total        : parseFloat(fd.get('gst-total'))||0,
      sub_total        : parseFloat(fd.get('sub-total'))||0,
      shipping         : parseFloat(shippingDisplay)||0,
      collect          : fd.get('collect')||"",
      environment      : fd.get('environment')||"",
      products         : [
        {
          cms_id             : fd.get('cms-id')||"",
          name               : fd.get('product-name-full')||"",
          quantity           : parseInt(fd.get('quantity'),10)||0,
          unit_price_nzd     : parseFloat(fd.get('unit-price-nzd'))||0,
          unit_gst           : parseFloat(fd.get('unit-gst'))||0,
          unit_total_price_nzd: parseFloat(fd.get('unit-total-price-nzd'))||0,
          unit_total_gst     : parseFloat(fd.get('unit-total-gst'))||0,
          total_price        : parseFloat(fd.get('total-price'))||0,
          price_signed       : fd.get('price-signed')||"",
          market             : fd.get('market')||"",
          market_status      : fd.get('market-status')||"",
          sku                : fd.get('sku')||"",
          auto_supplier      : (fd.get('auto-supplier')||"").toLowerCase()==='true',
          supplier_item_id   : fd.get('supplier-item-id')||"",
          zoho_id            : fd.get('zoho-id')||"",
          stock_status       : fd.get('stock-status')||"",
          product_type       : fd.get('product-type')||"",
          supplier_availability: fd.get('supplier-availability')||"",
          isactivesell       : (fd.get('supplier-isactivesell')||"").toLowerCase()==='true',
          year               : fd.get('year')||"",
          size               : fd.get('size')||"",
          mint               : fd.get('mint')||"",
          stock_level        : fd.get('stock-level')||"",
          slug               : fd.get('slug')||""
        }
      ]
    };

    const originalHTML=showProcessingState(orderBtn);

    try{
      const res=await fetch(`${API_BASE_URL}/create`,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(jsonData)
      });
      const out=await res.json();
      if(out.token&&out.trade_order){
        /* store everything incl. new fields */
        setSessionDataWithExpiry('orderData',JSON.stringify(jsonData),30);
        setSessionDataWithExpiry('token',out.token,30);
        setSessionDataWithExpiry('trade_order',out.trade_order,30);
        setSessionDataWithExpiry('order_creation_time',out.order_creation_time,30);

        document.getElementById('trade-order')        ?.setAttribute('value',out.trade_order);
        document.getElementById('trade-order-display')?.setAttribute('value',out.trade_order);

        (document.getElementById('submit-order')||form).click();
      }else{
        throw new Error('Invalid response from server');
      }
    }catch(err){
      console.error('Error:',err);
      restoreButtonState(orderBtn,originalHTML);
      orderBtn.textContent='Server-Error';
      const div=document.getElementById('server-error');
      if(div){div.style.display='block';div.scrollIntoView({behavior:'smooth',block:'center'});}
    }
  });
});
