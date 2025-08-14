document.addEventListener('DOMContentLoaded', function() {
  // Function to get style settings based on viewport width
  function getResponsiveStyles() {
    const width = window.innerWidth;
    
    // Mobile (smaller than 480px)
    if (width < 480) {
      return {
        fontSize: '1rem',
        bottomPosition: '45%',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '10px'
      };
    }
    // Large mobile (480px - 767px)
    else if (width >= 480 && width < 768) {
      return {
        fontSize: '1.125rem',
        bottomPosition: '45%',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '15px'
      };
    }
    // Tablet (768px - 991px)
    else if (width >= 768 && width < 992) {
      return {
        fontSize: '1.5rem',
        bottomPosition: '45%',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '25px'
      };
    }
    // Desktop (992px and above)
    else {
      return {
        fontSize: '2rem',
        bottomPosition: '40%',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderRadius: '30px'
      };
    }
  }

  // Function to add text overlay to lightbox
  function addTextOverlayToLightbox() {
    // Check if the lightbox exists in the DOM
    const lightboxInterval = setInterval(function() {
      const lightbox = document.querySelector('.w-lightbox-container');
      
      if (lightbox && !document.querySelector('.lightbox-custom-text')) {
        clearInterval(lightboxInterval);
        
        // Get the responsive styles for current viewport
        const styles = getResponsiveStyles();
        
        // Create the container div for centering
        const containerDiv = document.createElement('div');
        containerDiv.style.position = 'absolute';
        containerDiv.style.bottom = styles.bottomPosition;
        containerDiv.style.left = '0';
        containerDiv.style.right = '0';
        containerDiv.style.textAlign = 'center';
        containerDiv.style.zIndex = '9999';
        containerDiv.style.pointerEvents = 'none'; // Make container transparent to mouse/touch events
        
        // Get product name from the DOM
        const productNameEl = document.getElementById('product-name');
        const productName = productNameEl ? productNameEl.textContent : 'Product Name';
        
        // Create the text overlay element
        const textOverlay = document.createElement('div');
        textOverlay.className = 'lightbox-custom-text';
        textOverlay.textContent = productName;
        
        // Style the text overlay
        textOverlay.style.display = 'inline-block';
        textOverlay.style.color = 'white';
        textOverlay.style.fontFamily = '"Times New Roman", Times, serif';
        textOverlay.style.fontSize = styles.fontSize;
        
        // Add text-shadow for better visibility
        textOverlay.style.textShadow = '1px 1px 3px rgba(0,0,0,0.7)';
        
        // Semi-transparent background with custom padding
        textOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        textOverlay.style.paddingTop = styles.paddingTop;
        textOverlay.style.paddingBottom = styles.paddingBottom;
        textOverlay.style.paddingLeft = styles.paddingLeft;
        textOverlay.style.paddingRight = styles.paddingRight;
        textOverlay.style.borderRadius = styles.borderRadius;
        textOverlay.style.maxWidth = '90%'; // Prevent too wide on small screens
        
        // Add the text overlay to the container, then to the lightbox
        containerDiv.appendChild(textOverlay);
        lightbox.appendChild(containerDiv);
      }
    }, 100);
  }

  // Function to update responsive elements on window resize
  function updateResponsiveElements() {
    const textOverlay = document.querySelector('.lightbox-custom-text');
    if (textOverlay) {
      const styles = getResponsiveStyles();
      
      // Update all responsive style properties
      textOverlay.style.fontSize = styles.fontSize;
      textOverlay.style.paddingTop = styles.paddingTop;
      textOverlay.style.paddingBottom = styles.paddingBottom;
      textOverlay.style.paddingLeft = styles.paddingLeft;
      textOverlay.style.paddingRight = styles.paddingRight;
      textOverlay.style.borderRadius = styles.borderRadius;
      
      const containerDiv = textOverlay.parentElement;
      if (containerDiv) {
        containerDiv.style.bottom = styles.bottomPosition;
      }
    }
  }

  // Listen for clicks on your specific lightbox elements
  const lightboxLinks = document.querySelectorAll('.product-header1_lightbox-link-2');
  lightboxLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Short delay to ensure lightbox is in the DOM
      setTimeout(addTextOverlayToLightbox, 300);
    });
  });
  
  // Also handle when users navigate between lightbox images
  document.addEventListener('click', function(e) {
    if (e.target.closest('.w-lightbox-control') && document.querySelector('.w-lightbox-container')) {
      // Remove existing text overlay if present
      const existingOverlay = document.querySelector('.lightbox-custom-text');
      if (existingOverlay) {
        const containerDiv = existingOverlay.parentElement;
        if (containerDiv) containerDiv.remove();
      }
      
      // Re-add the text overlay
      setTimeout(addTextOverlayToLightbox, 300);
    }
  });

  // Handle window resize to update all responsive elements
  window.addEventListener('resize', updateResponsiveElements);
});
