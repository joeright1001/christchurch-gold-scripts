document.addEventListener('DOMContentLoaded', function () {
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
});
