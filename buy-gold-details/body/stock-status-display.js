/**
document.addEventListener('DOMContentLoaded', function() {
  // Define the items and their corresponding element IDs
  const stockItems = [
     { 
      stockLevelId: '1-oz-gold-stock-level',
      stockIconId: '1-oz-gold-stock-icon'
    }
  ];
  
  // Image URLs
  const backOrderImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/678cae03e2e40ea4a8171a44_Group%2051.png";
  const inStockImage = "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/6815937f9054179d6f1c5fcd_Group%2063%20(3).png";
  
  // Process each item
  stockItems.forEach(function(item) {
    const stockLevelElement = document.getElementById(item.stockLevelId);
    const stockIconElement = document.getElementById(item.stockIconId);
    
    if (stockLevelElement && stockIconElement) {
      const stockStatus = stockLevelElement.textContent.trim();
      
      // Update image based on stock status
      if (stockStatus === "Back Order") {
        stockIconElement.src = backOrderImage;
      } else {
        stockIconElement.src = inStockImage;
      }
    }
  });
});

*/
