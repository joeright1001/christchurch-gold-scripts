/**
 * Stock Collection Logic
 * Controls visibility of collection blocks based on stock status
 */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- element references ---------- */
  const stockStatusField = document.getElementById("stock-status");
  const inStockCollectionBlock = document.getElementById("in-stock-collection-block");
  const liveLowStockCollectionBlock = document.getElementById("live-low-stock-collection-block");

  /* ---------- helper function to update collection block visibility ---------- */
  function updateCollectionBlocks() {
    if (!stockStatusField || !inStockCollectionBlock || !liveLowStockCollectionBlock) {
      return;
    }

    const stockStatus = stockStatusField.textContent?.trim() || stockStatusField.value?.trim() || "";
    
    if (stockStatus === "in-stock") {
      // Show in-stock collection block, hide live/low-stock block
      inStockCollectionBlock.style.display = "block";
      liveLowStockCollectionBlock.style.display = "none";
    } else {
      // Show live/low-stock collection block, hide in-stock block
      inStockCollectionBlock.style.display = "none";
      liveLowStockCollectionBlock.style.display = "block";
    }
  }

  /* ---------- wait for stock status data to be populated ---------- */
  function waitForStockStatus(callback, tries = 10) {
    const stockStatus = stockStatusField?.textContent?.trim() || stockStatusField?.value?.trim() || "";
    
    if (stockStatus) {
      callback();
    } else if (tries > 0) {
      setTimeout(() => waitForStockStatus(callback, tries - 1), 200);
    } else {
      // Fallback: if no stock status found, show live/low-stock block (default behavior)
      if (inStockCollectionBlock && liveLowStockCollectionBlock) {
        inStockCollectionBlock.style.display = "none";
        liveLowStockCollectionBlock.style.display = "block";
      }
    }
  }

  /* ---------- initialize on page load ---------- */
  if (stockStatusField && inStockCollectionBlock && liveLowStockCollectionBlock) {
    // Set default state first
    inStockCollectionBlock.style.display = "block";
    liveLowStockCollectionBlock.style.display = "none";
    
    // Then wait for data and update accordingly
    waitForStockStatus(updateCollectionBlocks);
    
    // Also listen for changes in case stock status gets updated dynamically
    if (stockStatusField.tagName.toLowerCase() === 'input') {
      stockStatusField.addEventListener('input', updateCollectionBlocks);
      stockStatusField.addEventListener('change', updateCollectionBlocks);
    }
  }
});
