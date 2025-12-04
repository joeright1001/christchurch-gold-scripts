//control four of the modile sub menu dropdown. to address buggy webflow interactions

document.addEventListener('DOMContentLoaded', function() {
  // Define all dropdown sets with their respective IDs
  const dropdowns = [
    {
      trigger: 'heading-menu-drop-mob-sub-jew',
      content: 'site-links-sub-mob-jew',
      icon: 'code-icon-58-jew'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-price',
      content: 'site-links-sub-mob-price',
      icon: 'code-icon-58-price'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-help',
      content: 'site-links-sub-mob-help',
      icon: 'code-icon-58-help'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-bul',
      content: 'site-links-sub-mob-bul',
      icon: 'code-icon-58-bul'
    },
    {
      trigger: 'heading-menu-drop-mob-sub-jew2',
      content: 'site-links-sub-mob-jew2',
      icon: 'code-icon-58-jew2'
    }
  ];
  
  // Initialize each dropdown
  dropdowns.forEach(function(dropdown) {
    initializeDropdown(
      document.getElementById(dropdown.trigger),
      document.getElementById(dropdown.content),
      document.getElementById(dropdown.icon)
    );
  });
  
  // Function to initialize dropdown behavior
  function initializeDropdown(menuTrigger, submenu, icon) {
    // Skip if any element doesn't exist
    if (!menuTrigger || !submenu || !icon) {
      console.warn('Missing element for dropdown', menuTrigger, submenu, icon);
      return;
    }
    
    // Set initial state
    submenu.style.height = '0px';
    submenu.style.opacity = '0';
    submenu.style.overflow = 'hidden';
    submenu.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    icon.style.transition = 'transform 0.3s ease';
    
    // Track if submenu is open or closed
    let isOpen = false;
    
    // Function to toggle submenu
    function toggleSubmenu(event) {
      event.preventDefault();
      
      if (!isOpen) {
        // First set height to auto to calculate actual height
        submenu.style.height = 'auto';
        const height = submenu.offsetHeight + 'px';
        
        // Reset to closed state before animating
        submenu.style.height = '0px';
        
        // Force browser to recognize the change before animating
        setTimeout(function() {
          submenu.style.height = height;
          submenu.style.opacity = '1';
          icon.style.transform = 'rotateX(180deg)';
        }, 10);
        
        isOpen = true;
      } else {
        submenu.style.height = '0px';
        submenu.style.opacity = '0';
        icon.style.transform = 'rotateX(0deg)';
        isOpen = false;
      }
    }
    
    // Add click event listener
    menuTrigger.addEventListener('click', toggleSubmenu);
  }
});
