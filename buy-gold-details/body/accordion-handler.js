document.addEventListener('DOMContentLoaded', function() {
  // First functionality (buy-back-product)
  const buyBackProduct = document.getElementById('buy-back-product');
  const certBuyBackHeading = document.getElementById('cert-buy-back-heading');
  
  if (buyBackProduct && certBuyBackHeading) {
    buyBackProduct.style.cursor = 'pointer';
    
    buyBackProduct.addEventListener('click', function(e) {
      e.preventDefault();
      
      // The header is directly the element with ID 'cert-buy-back-heading'
      certBuyBackHeading.click();
      
      // Keep the smooth scroll behavior
      const headerOffset = 100;
      const elementPosition = certBuyBackHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      $('html, body').animate({
        scrollTop: offsetPosition
      }, 1200, 'swing');
    });
  }
  
  // Second functionality (brands-we-sell-linkv2 and brands-we-sell-linkv3)
  const brandsWeSellLinks = [
    document.getElementById('brands-we-sell-linkv2'),
    document.getElementById('brands-we-sell-linkv4')
  ];
  const brandsWeSellHeader = document.getElementById('brands-we-sell');
  
  if (brandsWeSellHeader) {
    brandsWeSellLinks.forEach(function(link) {
      if (link) {
        link.style.cursor = 'pointer';
        
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Click the accordion header directly
          brandsWeSellHeader.click();
          
          // Keep the smooth scroll behavior
          const headerOffset = 100;
          const elementPosition = brandsWeSellHeader.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          $('html, body').animate({
            scrollTop: offsetPosition
          }, 1200, 'swing');
        });
      }
    });
  }
  
  // Third functionality (how-it-works-link)
  const howItWorksLink = document.getElementById('how-it-works-link');
  const howItWorksHeader = document.getElementById('how-it-works');
  
  if (howItWorksLink && howItWorksHeader) {
    howItWorksLink.style.cursor = 'pointer';
    
    howItWorksLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Click the accordion header directly
      howItWorksHeader.click();
      
      // Keep the smooth scroll behavior
      const headerOffset = 100;
      const elementPosition = howItWorksHeader.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      $('html, body').animate({
        scrollTop: offsetPosition
      }, 1200, 'swing');
    });
  }
});
