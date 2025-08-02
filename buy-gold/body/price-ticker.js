// Minimal price ticker setup that preserves existing styling and adds link wrapper
document.addEventListener("DOMContentLoaded", function () {
  const tickerContainer = document.querySelector('#price-ticker.price-ticker-buy');
  if (!tickerContainer) return;

  // Get all price items from the original CMS structure
  const priceItems = tickerContainer.querySelectorAll('.our-prices-ticker');
  if (!priceItems.length) return;

  // Only proceed if we haven't already transformed this
  if (tickerContainer.querySelector('.price-ticker-wrapper')) return;

  // Create the link wrapper
  const linkWrapper = document.createElement('a');
  linkWrapper.href = '/live-prices/gold-price-nz';
  linkWrapper.className = 'price-ticker-link';

  // One-time setup
  const wrapper = document.createElement('div');
  wrapper.className = 'price-ticker-wrapper';
  
  // Move all price items to the wrapper
  priceItems.forEach(item => {
    wrapper.appendChild(item.cloneNode(true));
  });
  
  // Create a clone for seamless scrolling
  const clone = wrapper.cloneNode(true);
  clone.className += ' price-ticker-clone';
  
  // Add wrappers to link
  linkWrapper.appendChild(wrapper);
  linkWrapper.appendChild(clone);
  
  // Clear the original content and add our new structure
  tickerContainer.innerHTML = '';
  tickerContainer.appendChild(linkWrapper);

  // Start the animation immediately
  tickerContainer.classList.add('price-ticker-running');

  // Visibility observer for performance
  const observer = new IntersectionObserver((entries) => {
    tickerContainer.classList.toggle('price-ticker-running', entries[0].isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(tickerContainer);
});
