/**
 * Script Name: Persistent Countdown Timer with Tab Suspension Handling & Page Refresh Reset
 * 
 * Purpose:
 * - Ensures the countdown **ALWAYS starts at 30 minutes on page reload**.
 * - Prevents browser tab suspension from affecting the countdown.
 * - Uses timestamps (`Date.now()`) stored in `localStorage` to track time reliably.
 * - Ensures tabs refresh when time expires, even if inactive.
 * - Forces all "place-bullion-order" tabs to refresh when any reaches 00:02.
 */

function startLocalTimer() {
  // Original counter elements
  const minCounter = document.getElementById("min-counter");
  const secCounter = document.getElementById("sec-counter");
  
  // Second counter elements
  const minCounterV2 = document.getElementById("min-counterv2");
  const secCounterV2 = document.getElementById("sec-counterv2");
  
  // Third counter elements
  const minCounterV3 = document.getElementById("min-counterv3");
  const secCounterV3 = document.getElementById("sec-counterv3");
  
  // Apply bold styling to v3 counters
  if (minCounterV3) minCounterV3.style.fontWeight = "bold";
  if (secCounterV3) secCounterV3.style.fontWeight = "bold";
  
  const countdownDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  const warningThreshold = 2000; // 2 seconds left in milliseconds

  // Always reset timer to 30 minutes on page reload
  const startTime = Date.now();
  localStorage.setItem("bullionTimerStart", startTime);

  function updateDisplay() {
    const elapsed = Date.now() - startTime;
    const remaining = countdownDuration - elapsed;

    if (remaining <= 0) {
      location.reload(true); // Force refresh when time expires
      return;
    }

    const minutes = Math.floor((remaining / 1000) / 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    // Format the time values
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    // Update original counters if they exist
    if (minCounter) minCounter.textContent = formattedMinutes;
    if (secCounter) secCounter.textContent = formattedSeconds;
    
    // Update v2 counters if they exist
    if (minCounterV2) minCounterV2.textContent = formattedMinutes;
    if (secCounterV2) secCounterV2.textContent = formattedSeconds;
    
    // Update v3 counters if they exist
    if (minCounterV3) minCounterV3.textContent = formattedMinutes;
    if (secCounterV3) secCounterV3.textContent = formattedSeconds;

    // Notify other tabs when reaching the warning threshold (2 seconds left)
    if (remaining <= warningThreshold) {
      localStorage.setItem("refreshTabs", Date.now());
    }
  }

  // Listen for refresh trigger from another tab
  window.addEventListener("storage", function (event) {
    if (event.key === "refreshTabs") {
      location.reload(true);
    }
  });

  // Update the display and ensure accurate timing
  updateDisplay();
  setInterval(updateDisplay, 1000);
}

// Start the timer only if on the correct page
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("place-order")) {
    startLocalTimer();
  }
});
