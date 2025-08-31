/**
 * Update From CMS
 *
 * This script runs on the place-order page after the page loads.
 * It takes data from the visible CMS product panel and uses it to
 * populate other elements on the page, such as the main product image
 * and hidden input fields.
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // --- Task 1: Update the main product image ---
  try {
    // Find the source element containing the image URL within the visible CMS item
    const imageUrlElement = document.querySelector('.cms-product-image-url');
    if (imageUrlElement) {
      const imageUrl = imageUrlElement.textContent.trim();
      
      // Find the destination image element
      const productImage = document.getElementById('product-image');
      
      // Update the image src if both elements are found and the URL is not empty
      if (productImage && imageUrl) {
        productImage.src = imageUrl;
      }
    }
  } catch (e) {
    console.error("Error updating product image:", e);
  }

  // --- Task 2: Update the hidden stock status input field ---
  try {
    // Find the source element containing the stock status from the CMS
    const stockStatusElement = document.querySelector('.cms-product-stock-status');
    if (stockStatusElement) {
      const stockStatusValue = stockStatusElement.textContent.trim();
      
      // Find the destination input field
      const stockLevelInput = document.getElementById('stock-level');
      
      // Update the input field's value if both elements are found
      if (stockLevelInput) {
        stockLevelInput.value = stockStatusValue;
      }
    }
  } catch (e) {
    console.error("Error updating stock level input:", e);
  }

});
