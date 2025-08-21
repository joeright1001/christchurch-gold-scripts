// This script dynamically loads all assets and HTML for the Flatpickr date picker.

(function() {
  // 1. Create a container for the date picker elements
  const container = document.createElement('div');
  container.innerHTML = `
    <!-- Include Flatpickr CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

    <!-- Style for the Date Picker Input -->
    <style>
      #date-picker {
        width: 100%;
        padding: 12px; /* Extra padding for a slightly taller input box */
        font-size: 1rem; /* Changed to 1rem as requested */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; /* System UI font */
        font-weight: normal; /* Remove bold */
        border: 1px solid #797979; /* Updated border color */
        border-radius: 4px; /* Rounded corners */
        background: #fff;
        color: black !important; /* Ensuring text is black with !important to override */
      }

      #date-picker:hover {
        background-color: rgba(0, 0, 0, 0.1); /* Immediate color change on hover */
      }

      #date-picker-jewe:focus {
        background-color: rgba(0, 0, 0, 0.1); /* Immediate color change on focus */
        border-color: #797979; /* Keep consistent border color on focus */
        outline: none; /* Remove the blue outline */
      }

      /* Style for placeholder text specifically */
      #date-picker::placeholder {
        color: black !important;
        opacity: 1;
        font-size: 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: normal;
      }
      
      /* For different browsers that handle placeholders differently */
      #date-picker::-webkit-input-placeholder { color: black !important; }
      #date-picker::-moz-placeholder { color: black !important; }
      #date-picker:-ms-input-placeholder { color: black !important; }
      #date-picker:-moz-placeholder { color: black !important; }
    </style>

    <!-- Input Field for Date Picker -->
    <input type="text" id="date-picker" placeholder="Pick a Date" />
  `;

  // 2. Inject the container's content into the document.
  // We'll find the currently executing script and insert the date picker right before it.
  const currentScript = document.currentScript;
  if (currentScript) {
    // Move all children from the container to the document
    while (container.firstChild) {
      currentScript.parentNode.insertBefore(container.firstChild, currentScript);
    }
  } else {
    // Fallback for older browsers or different script loading scenarios
    document.body.appendChild(container);
  }

  // 3. Load the Flatpickr JavaScript library and initialize it
  const flatpickrScript = document.createElement('script');
  flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  flatpickrScript.onload = function() {
    // Ensure the DOM is fully loaded before initializing
    document.addEventListener('DOMContentLoaded', function () {
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
  };
  document.body.appendChild(flatpickrScript);

})();
