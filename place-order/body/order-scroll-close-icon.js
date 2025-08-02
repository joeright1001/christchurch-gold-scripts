// ===============================================================
//  order-scroll-close-icon.js  –  Smooth scroll from details panel
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
  const closeIcon = document.getElementById('close-order-details-icon');
  if (!closeIcon) return;

  closeIcon.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById('product-summary-table');
    if (!target) return;

    const start = window.pageYOffset;
    const end   = target.getBoundingClientRect().top + start;
    const dist  = end - start;
    const dur   = 700;
    let startT  = null;

    function ease(t,b,c,d){
      t /= d/2;
      if(t<1) return c/2*t*t + b;
      t--;return -c/2*(t*(t-2)-1)+b;
    }
    function anim(ts){
      if(startT===null) startT = ts;
      const elapsed = ts - startT;
      window.scrollTo(0, ease(elapsed,start,dist,dur));
      if(elapsed < dur) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  });
});
