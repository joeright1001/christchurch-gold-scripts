/**
 * Enhanced Countdown Timer for Webflow with Dual Timers
 * - Standard timer: 30 minutes
 * - BlinkPay timer: 15 minutes (standard timer - 15 minutes)
 * - Works with both ID selectors and data attributes
 * - Updates all timer elements across the page
 * Extracted from body.txt
 */

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    continueTimer();
  }, 300); // Small delay to ensure Webflow has fully loaded
});

function continueTimer() {
  // Original ID-based counters
  const minCounter = document.getElementById("min-counter");
  const secCounter = document.getElementById("sec-counter");
  const minCounter2 = document.getElementById("min-counterv2");
  const secCounter2 = document.getElementById("sec-counterv2");
  
  const countdownDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  const blinkPayOffset = 15 * 60 * 1000; // 15 minutes offset for BlinkPay
  const warningThreshold = 2000; // 2 seconds left in milliseconds

  // Get the existing start time from localStorage
  const startTime = parseInt(localStorage.getItem("bullionTimerStart"));

  // If no timer exists in localStorage or if it's invalid, set default display
  if (!startTime || isNaN(startTime)) {
    updateAllTimers(0, 0);
    updateBlinkTimers(0, 0);
    return;
  }

  let intervalId; // Define intervalId for cleanup

  function updateAllTimers(minutes, seconds) {
    // Format with leading zeros
    const minText = String(minutes).padStart(2, "0");
    const secText = String(seconds).padStart(2, "0");

    // Update original ID-based counters
    if (minCounter) minCounter.textContent = minText;
    if (secCounter) secCounter.textContent = secText;
    if (minCounter2) minCounter2.textContent = minText;
    if (secCounter2) secCounter2.textContent = secText;
    
    // Update all standard data-attribute elements
    document.querySelectorAll("[data-timer='minutes']").forEach(el => {
      el.textContent = minText;
    });
    
    document.querySelectorAll("[data-timer='seconds']").forEach(el => {
      el.textContent = secText;
    });
  }

  function updateBlinkTimers(minutes, seconds) {
    // Format with leading zeros
    const minText = String(minutes).padStart(2, "0");
    const secText = String(seconds).padStart(2, "0");
    
    // Update all BlinkPay timer elements
    document.querySelectorAll("[data-timer-blink='minutes']").forEach(el => {
      el.textContent = minText;
    });
    
    document.querySelectorAll("[data-timer-blink='seconds']").forEach(el => {
      el.textContent = secText;
    });
  }

  function updateDisplay() {
    const elapsed = Date.now() - startTime;
    const remaining = countdownDuration - elapsed;

    // If standard timer is at or below zero, display 00:00 for both timers
    if (remaining <= 0) {
      updateAllTimers(0, 0);
      updateBlinkTimers(0, 0);
      clearInterval(intervalId);
      return;
    }

    // Calculate standard timer
    const minutes = Math.floor((remaining / 1000) / 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    // Update standard timer elements
    updateAllTimers(minutes, seconds);

    // Calculate BlinkPay timer (15 minutes less than standard)
    const blinkRemaining = remaining - blinkPayOffset;
    
    if (blinkRemaining <= 0) {
      // If BlinkPay timer is at or below zero, just show 00:00
      updateBlinkTimers(0, 0);
    } else {
      // Calculate and update BlinkPay timer
      const blinkMinutes = Math.floor((blinkRemaining / 1000) / 60);
      const blinkSeconds = Math.floor((blinkRemaining / 1000) % 60);
      updateBlinkTimers(blinkMinutes, blinkSeconds);
    }

    // Check if standard timer is at 0:00 and refresh the page
    if (minutes === 0 && seconds === 0) {
      location.reload(true);
    }

    if (remaining <= warningThreshold) {
      localStorage.setItem("refreshTabs", Date.now());
    }
  }

  // Listen for refresh trigger from another tab
  window.addEventListener("storage", function (event) {
    if (event.key === "refreshTabs") {
      clearInterval(intervalId);
      location.reload(true);
    }
  });

  // Update the display and ensure accurate timing
  updateDisplay();
  intervalId = setInterval(updateDisplay, 1000);

  // Cleanup function
  return function cleanup() {
    clearInterval(intervalId);
  };
}

// Use this function to check if we're on the right page
function isOnCorrectPage() {
  return window.location.pathname.includes("complete-order");
}
