// Function to load Flatpickr CSS and JS
function loadFlatpickr() {
  // Load Flatpickr CSS
  const flatpickrCss = document.createElement('link');
  flatpickrCss.rel = 'stylesheet';
  flatpickrCss.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(flatpickrCss);

  // Load Flatpickr JS
  const flatpickrScript = document.createElement('script');
  flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  document.head.appendChild(flatpickrScript);
}

// Load Flatpickr when the DOM is ready
document.addEventListener('DOMContentLoaded', loadFlatpickr);

/**
 * Date Picker Initialization
 * Initializes Flatpickr with business day restrictions
 * Extracted from body.txt
 */

document.addEventListener('DOMContentLoaded', function () {
  // Date Picker for #date-picker
  flatpickr("#date-picker", {
    dateFormat: "d-m-Y", // Format: Day-Month-Year
    minDate: "today", // Disable all past dates
    disable: [
      function (date) {
        // Disable Saturdays and Sundays (0 represents Sunday, 6 represents Saturday)
        return date.getDay() === 0 || date.getDay() === 6;
      }
    ]
  });
});
