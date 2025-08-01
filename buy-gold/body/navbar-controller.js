/**
 * Ultra-lightweight navbar controller - loads only when needed
 */

(function() {
  if (window.innerWidth < 768) return; // Skip mobile
  
  let navbar, heroSection, lastScrollY = window.scrollY, isFixed = true, heroBottom = 0, init = false;
  
  function scroll() {
    if (!init) {
      navbar = document.getElementById('home-navbar');
      heroSection = document.getElementById('hero-section');
      if (!navbar || !heroSection) return;
      heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      init = true;
    }
    
    const y = window.scrollY;
    const down = y > lastScrollY;
    
    if (down && y >= heroBottom && isFixed) {
      navbar.style.position = 'absolute';
      navbar.style.top = heroBottom + 'px';
      isFixed = false;
    } else if (!down && !isFixed) {
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      isFixed = true;
    }
    
    lastScrollY = y;
  }
  
  let tick = false;
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(() => { scroll(); tick = false; });
      tick = true;
    }
  }, { passive: true });
})();
