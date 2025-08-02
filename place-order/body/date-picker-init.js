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
