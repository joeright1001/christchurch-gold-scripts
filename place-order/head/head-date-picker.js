// =============================================================================
//  head-date-picker.js  –  Initialise Flatpickr on #date-picker
//  Requires: 1) flatpickr JS loaded, 2) flatpickr CSS linked
// =============================================================================
document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#date-picker", {
    dateFormat: "d-m-Y", // Format: Day-Month-Year
    minDate: "today",    // Disable all past dates
    disable: [
      function (date) {
        // Disable Saturdays and Sundays (0 = Sunday, 6 = Saturday)
        return date.getDay() === 0 || date.getDay() === 6;
      }
    ]
  });
});
