function initUserReviews() {
    console.log("User reviews script started.");

    // --- Feature 1: Smooth Scrolling for User Reviews Link ---
    const userReviewsLink = document.getElementById('user-reviews-link');
    const userReviewHeading = document.getElementById('user-review-heading'); // Corrected target for the accordion header

    if (userReviewsLink && userReviewHeading) {
        userReviewsLink.style.cursor = 'pointer';
        userReviewsLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Programmatically click the accordion header to ensure it opens
            userReviewHeading.click();

            // Use jQuery for smooth scrolling to the header, matching other site links
            const headerOffset = 100;
            const elementPosition = userReviewHeading.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            $('html, body').animate({
                scrollTop: offsetPosition
            }, 1200, 'swing');
        });
    } else {
        console.log("Scroll elements (user-reviews-link or user-review-heading) not found.");
    }

    // --- Feature 2: Dynamic Star Ratings for Each Review ---
    const reviewBlocks = document.querySelectorAll('.user-review-block');
    console.log(`Found ${reviewBlocks.length} review blocks.`);

    reviewBlocks.forEach((block, index) => {
        const hiddenData = block.querySelector('.hidden-user-review-data');
        if (hiddenData) {
            const stars = parseInt(hiddenData.getAttribute('data-stars'), 10);
            const starsWrapper = block.querySelector('.stars-wrapper');
            if (starsWrapper) {
                for (let i = 1; i <= 5; i++) {
                    // IDs should be unique, so we find stars within the specific block
                    const starElement = starsWrapper.querySelector('#star' + i);
                    if (starElement) {
                        starElement.style.display = (i <= stars) ? 'block' : 'none';
                    }
                }
            }
        } else {
            console.log(`Hidden data not found for review block ${index}.`);
        }
    });

    // --- Feature 3: Update Average Rating and Total Reviews ---
    const firstHiddenData = document.querySelector('.hidden-user-review-data');

    if (firstHiddenData) {
        const averageRating = parseFloat(firstHiddenData.getAttribute('data-average'));
        const totalReviews = firstHiddenData.getAttribute('data-total-no-reviews');

        const averageEl = document.getElementById('stars-average');
        const totalEl = document.getElementById('total-no-reviews');

        if (averageEl) averageEl.textContent = averageRating.toFixed(1);
        if (totalEl) totalEl.textContent = totalReviews;

        // Update average stars display
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = (averageRating % 1) >= 0.5;

        for (let i = 1; i <= 5; i++) {
            const fullStarEl = document.getElementById('star-ave' + i);
            if (fullStarEl) {
                fullStarEl.style.display = 'none'; // Reset all first
            }
        }
        
        for (let i = 1; i <= fullStars; i++) {
            const fullStarEl = document.getElementById('star-ave' + i);
            if (fullStarEl) {
                 fullStarEl.style.display = 'block';
            }
        }

        const halfStarEl = document.getElementById('star-ave1-2'); // This is the half-star element
        if (halfStarEl) {
            halfStarEl.style.display = hasHalfStar ? 'block' : 'none';
        }
        
    } else {
        console.log("First hidden data for average rating not found.");
    }
}

// Wait for the main review container to be loaded before running the script
const observer = new MutationObserver((mutations, obs) => {
    const reviewContainer = document.getElementById('user-reviews');
    if (reviewContainer && reviewContainer.querySelector('.user-review-block')) {
        initUserReviews();
        obs.disconnect(); // Stop observing once the elements are found
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Fallback in case MutationObserver fails or content is already there
document.addEventListener('DOMContentLoaded', () => {
    const reviewContainer = document.getElementById('user-reviews');
    if (reviewContainer && reviewContainer.querySelector('.user-review-block')) {
        initUserReviews();
    }
});
