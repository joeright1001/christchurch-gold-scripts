document.addEventListener('DOMContentLoaded', function() {
  const userReviewsLink = document.getElementById('user-reviews-link');
  const userReviewHeading = document.getElementById('user-review-heading');
  
  if (userReviewsLink && userReviewHeading) {
    userReviewsLink.style.cursor = 'pointer';
    
    userReviewsLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Click the accordion header directly to trigger Webflow interaction
      userReviewHeading.click();
      
      // Keep the smooth scroll behavior
      const headerOffset = 100;
      const elementPosition = userReviewHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      $('html, body').animate({
        scrollTop: offsetPosition
      }, 1200, 'swing');
    });
  }
});
