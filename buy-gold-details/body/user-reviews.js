document.addEventListener('DOMContentLoaded', function () {
    // --- Feature 1: Smooth Scrolling for User Reviews Link ---
    const userReviewsLink = document.getElementById('user-reviews-link');
    const userReviewsSection = document.getElementById('user-reviews');

    if (userReviewsLink && userReviewsSection) {
        userReviewsLink.addEventListener('click', function (event) {
            event.preventDefault();
            userReviewsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // --- Feature 2: Dynamic Star Ratings for Each Review ---
    const reviewBlocks = document.querySelectorAll('.user-review-block');

    reviewBlocks.forEach(block => {
        const hiddenData = block.querySelector('.hidden-user-review-data');
        if (hiddenData) {
            const stars = parseInt(hiddenData.getAttribute('data-stars'), 10);
            const starsWrapper = block.querySelector('.stars-wrapper');
            if (starsWrapper) {
                for (let i = 1; i <= 5; i++) {
                    const starElement = starsWrapper.querySelector('#star' + i);
                    if (starElement) {
                        if (i <= stars) {
                            starElement.style.display = 'block';
                        } else {
                            starElement.style.display = 'none';
                        }
                    }
                }
            }
        }
    });

    // --- Feature 3: Update Average Rating and Total Reviews ---
    const firstHiddenData = document.querySelector('.hidden-user-review-data');

    if (firstHiddenData) {
        const averageRating = parseFloat(firstHiddenData.getAttribute('data-average'));
        const totalReviews = firstHiddenData.getAttribute('data-total-no-reviews');

        const averageEl = document.getElementById('stars-average');
        const totalEl = document.getElementById('total-no-reviews');

        if (averageEl) {
            averageEl.textContent = averageRating.toFixed(1);
        }
        if (totalEl) {
            totalEl.textContent = totalReviews;
        }

        // Update average stars display
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            const fullStarEl = document.getElementById('star-ave' + i);
            if (fullStarEl) {
                fullStarEl.style.display = i <= fullStars ? 'block' : 'none';
            }
        }

        const halfStarEl = document.getElementById('star-ave1-2'); // This is the half-star element
        if (halfStarEl) {
            halfStarEl.style.display = hasHalfStar ? 'block' : 'none';
            // Hide the next full star if a half star is shown
            if (hasHalfStar && fullStars < 5) {
                 const nextFullStar = document.getElementById('star-ave' + (fullStars + 1));
                 if(nextFullStar) {
                    nextFullStar.style.display = 'none';
                 }
            }
        }
    }
});
