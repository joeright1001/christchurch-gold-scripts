/**
 * TIME PICKER WITH 12-HOUR & 24-HOUR FORMAT OUTPUT
 * This script generates a dropdown with time slots in 12-hour format (9:00 AM - 5:30 PM).
 * Extracted from code-time-picker-dropdown.txt
 */

// Add CSS to change dropdown text color
const style = document.createElement('style');
style.textContent = `
  #time-picker-jewe {
    color: #2b2b2b !important;
  }
  #time-picker-jewe option {
    color: #2b2b2b !important;
  }
  /* For some browsers that need extra styling */
  select#time-picker-jewe, 
  select#time-picker-jewe option,
  select#time-picker-jewe:focus-visible {
    color: #2b2b2b !important;
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", function() {
    let selectField = document.getElementById("time-picker"); // Dropdown (12-hour format)
    let outputField = document.getElementById("time-picker-24"); // Hidden input (24-hour format)
    let startTime = 9 * 60; // 9:00 AM in minutes
    let endTime = 17 * 60 + 30; // 5:30 PM in minutes
    let interval = 30; // 30-minute intervals

    if (!selectField || !outputField) {
        console.error("Dropdown (#time-picker-jewe) or input field (#time-jewe-24hr) not found.");
        return;
    }

    // Apply inline style directly to the select element
    selectField.style.color = "#2b2b2b";

    // Clear existing options and set the default placeholder
    selectField.innerHTML = '<option value="">Select a time</option>';

    // Add "Before Work (TBC)" option
    let beforeWorkOption = document.createElement("option");
    beforeWorkOption.value = "Before Work (TBC)";
    beforeWorkOption.textContent = "Before Work (TBC)";
    beforeWorkOption.style.color = "#2b2b2b";
    selectField.appendChild(beforeWorkOption);

    // Generate time slots in 12-hour format
    for (let time = startTime; time <= endTime; time += interval) {
        let hours = Math.floor(time / 60);
        let minutes = time % 60;
        let ampm = hours >= 12 ? "PM" : "AM";
        let formattedHours = hours > 12 ? hours - 12 : hours;
        let formattedMinutes = minutes === 0 ? "00" : minutes;
        let timeString = `${formattedHours}:${formattedMinutes} ${ampm}`; // 12-hour format
        let timeValue = `${hours.toString().padStart(2, "0")}${formattedMinutes}`; // 24-hour format

        let option = document.createElement("option");
        option.value = timeString; // Store in 12-hour format for form submission
        option.textContent = timeString; // Display in dropdown
        option.style.color = "#2b2b2b"; // Set the color for each option

        selectField.appendChild(option);
    }

    // Add "After Work (TBC)" option
    let afterWorkOption = document.createElement("option");
    afterWorkOption.value = "After Work (TBC)";
    afterWorkOption.textContent = "After Work (TBC)";
    afterWorkOption.style.color = "#2b2b2b";
    selectField.appendChild(afterWorkOption);

    // Event listener to update the 24hr format field when selection changes
    selectField.addEventListener("change", function() {
        let selectedTime = selectField.value;

        // Convert special cases
        if (selectedTime === "Before Work (TBC)") {
            outputField.value = "0600";
        } else if (selectedTime === "After Work (TBC)") {
            outputField.value = "1800";
        } else {
            // Convert standard 12-hour format to 24-hour format
            let match = selectedTime.match(/(\d+):(\d+) (AM|PM)/);
            if (match) {
                let hours = parseInt(match[1], 10);
                let minutes = match[2];
                let period = match[3];

                if (period === "PM" && hours !== 12) hours += 12;
                if (period === "AM" && hours === 12) hours = 0;

                outputField.value = `${hours.toString().padStart(2, "0")}${minutes}`;
            } else {
                outputField.value = ""; // Default empty if no match
            }
        }

        console.log(`Selected Time: ${selectedTime} | Converted: ${outputField.value}`);
    });
});
