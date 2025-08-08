/**
 * Order Submission to Middleware
 * Handles form validation and API submission
 * Extracted from code-submit-to-middleware-current.txt
 */

/* ================================================================
   API host selection constants / helpers
   ================================================================*/
const DEV_URL              = "https://cuddly-space-waddle-4jgr5gxqj6wg3q6jr-3000.app.github.dev";
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
  const form    =document.querySelector('#wf-form-bullion-order');
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
    let shippingFee = document.querySelector('#shippingfee')?.value.trim() || "";
    if (fd.get('delivery') !== 'true') {
      shippingFee = "0";
    }
    const jsonData={
      /* customer */
      first_name_order :fd.get('first-name'),
      last_name_order  :fd.get('last-name')||"",
      email_order      :fd.get('email'),
      phone_order      :fd.get('mobile')||"",

      /* product */
      product_name_full:fd.get('product-name-full')||"",
      quantity         :fd.get('quantity')||"",
      price_nzd        :fd.get('price_nzd')||"",
      zoho_id          :fd.get('zoho-id')||"",

      /* delivery / payment */
      delivery         :fd.get('delivery')||"",
      pay_in_person    :fd.get('pay-in-person')||"",
      checkbox_order   :fd.get('checkbox-order')||"",
      address          :fd.get('address')||"",
      message          :fd.get('message')||"",
      date_picker_order:fd.get('date-picker')||"",
      time_picker_order:fd.get('time-picker')||"",

      /* totals (shippingfee untouched) */
      total_price      :fd.get('total-price')||"",
      total_amount     :fd.get('total-amount')||"",
      shippingfee      :shippingFee,

      /* GST + unit prices */
      unit_gst             :fd.get('unit-gst')||"",
      total_gst            :fd.get('total-gst')||"",
      unit_price_nzd       :fd.get('unit-price-nzd')||"",
      total_unit_price_nzd :fd.get('total-unit-price-nzd')||"",

      /* supplier meta */
      supplier_status  :fd.get('market-status')||"",
      supplier_name    :fd.get('market')||"",
      sku              :fd.get('sku')||"",
      auto_supplier    :fd.get('auto-supplier')||"",
      supplier_item_id :fd.get('supplier-item-id')||"",

      /* collect info */
      collect          :document.getElementById('collect')?.textContent||""
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
