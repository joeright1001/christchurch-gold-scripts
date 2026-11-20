

<script>
// Minimal setup with visibility detection
document.addEventListener("DOMContentLoaded", function () {
  const tickerContainer = document.querySelector('.mint-logos-ticker');
  if (!tickerContainer) return;

  const images = tickerContainer.querySelectorAll('.logo-image, .logo-image-long, .logo-image-large');
  if (!images.length) return;

  // One-time setup
  const wrapper = document.createElement('div');
  wrapper.className = 'ticker-wrapper';
  images.forEach(image => wrapper.appendChild(image));
  
  const clone = wrapper.cloneNode(true);
  clone.className += ' ticker-clone';
  
  tickerContainer.innerHTML = '';
  tickerContainer.appendChild(wrapper);
  tickerContainer.appendChild(clone);

  // Visibility observer (lightweight)
  const observer = new IntersectionObserver((entries) => {
    tickerContainer.classList.toggle('ticker-running', entries[0].isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(tickerContainer);
});
</script>

<style>
.mint-logos-ticker {
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}

.ticker-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  width: max-content;
  will-change: transform;
}

.ticker-running .ticker-wrapper {
  animation: ticker-scroll 240s linear infinite;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.logo-image, .logo-image-long, .logo-image-large {
  flex-shrink: 0;
  max-height: 80px;
}
</style>

