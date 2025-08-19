// This function initializes the user reviews section on the All Reviews page.
function initUserReviews() {
    console.log("All Reviews page user reviews script started.");

    // Find all the review blocks on the page.
    const reviewBlocks = document.querySelectorAll('.user-review-block');
    console.log(`Found ${reviewBlocks.length} review blocks on the All Reviews page.`);

    // Loop through each review block to process its star rating.
    reviewBlocks.forEach((block, index) => {
        // Find the hidden div that stores the data for this review.
        const hiddenData = block.querySelector('.hidden-user-review-data');
        if (hiddenData) {
            // Get the star rating from the 'data-stars' attribute.
            const stars = parseInt(hiddenData.getAttribute('data-stars'), 10);
            
            // Find the container for the stars within this review block.
            const starsWrapper = block.querySelector('.stars-wrapper');
            if (starsWrapper) {
                // Get all the star elements within the wrapper.
                const starElements = starsWrapper.querySelectorAll('.icon-embed-xxsmall');
                
                // Show or hide stars based on the rating.
                starElements.forEach((star, i) => {
                    // The index 'i' is 0-based, so we show stars where i < rating.
                    // e.g., for a 4-star rating, it shows stars at index 0, 1, 2, 3.
                    star.style.display = (i < stars) ? 'block' : 'none';
                });
            }
        } else {
            console.log(`Hidden data not found for review block ${index}.`);
        }
    });
}

// Use a MutationObserver to wait for the reviews to be loaded onto the page,
// especially since they might be added dynamically by Webflow's CMS.
const observer = new MutationObserver((mutations, obs) => {
    // Check if the main review container is present.
    const reviewContainer = document.querySelector('.user-reviews-cms-all');
    // Also check if at least one review block has been loaded inside it.
    if (reviewContainer && reviewContainer.querySelector('.user-review-block')) {
        // Once the reviews are found, run the main function.
        initUserReviews();
        // Stop observing to save resources, as the job is done.
        obs.disconnect(); 
    }
});

// Start observing the entire document body for changes to its structure.
observer.observe(document.body, {
    childList: true, // Watch for added or removed child elements.
    subtree: true   // Watch descendants of the body as well.
});

// As a fallback, run the script when the initial HTML document has been completely loaded and parsed.
// This covers cases where the content is already present and the MutationObserver might miss it.
document.addEventListener('DOMContentLoaded', () => {
    const reviewContainer = document.querySelector('.user-reviews-cms-all');
    if (reviewContainer && reviewContainer.querySelector('.user-review-block')) {
        initUserReviews();
    }
});
