/**
 * Order Details Modal Close Handler
 * Moves page to product table when close icon in details is selected
 * Extracted from code-close-order-details-icon.txt
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find the close icon element
  const closeIcon = document.getElementById('close-order-details-icon');
  
  // Check if the element exists to avoid errors
  if (closeIcon) {
    // Add click event listener
    closeIcon.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Find the target anchor element
      const targetElement = document.getElementById('product-summary-table');
      
      if (targetElement) {
        // Get the target position
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 700; // 0.7 seconds in milliseconds
        let startTime = null;
        
        // Animation function for smooth scrolling
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, scrollY);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
        
        // Easing function for smooth motion
        function easeInOutQuad(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        // Start the animation
        requestAnimationFrame(animation);
      }
    });
  }
});
