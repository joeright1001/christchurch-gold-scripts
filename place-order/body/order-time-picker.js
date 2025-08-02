/* =========================================================================
   order-time-picker.js  –  12‑hour dropdown with hidden 24‑hour value
   ========================================================================= */
const styleTimePicker = document.createElement('style');
styleTimePicker.textContent = `
  #time-picker-jewe { color:#2b2b2b !important; }
  #time-picker-jewe option { color:#2b2b2b !important; }
  select#time-picker-jewe,
  select#time-picker-jewe option,
  select#time-picker-jewe:focus-visible {
    color:#2b2b2b !important;
  }
`;
document.head.appendChild(styleTimePicker);

document.addEventListener("DOMContentLoaded", function() {
  let selectField = document.getElementById("time-picker"); // Dropdown (12‑hour)
  let outputField = document.getElementById("time-picker-24"); // Hidden 24‑hour
  let startTime = 9 * 60;             // 9:00 AM
  let endTime   = 17 * 60 + 30;       // 5:30 PM
  let interval  = 30;                 // 30‑minute steps

  if (!selectField || !outputField) {
    console.error("Dropdown (#time-picker) or hidden field (#time-picker-24) not found.");
    return;
  }

  selectField.style.color = "#2b2b2b";
  selectField.innerHTML = '<option value="">Select a time</option>';

  // Before work option
  const before = document.createElement("option");
  before.value = before.textContent = "Before Work (TBC)";
  selectField.appendChild(before);

  // Generate slots
  for (let t = startTime; t <= endTime; t += interval) {
    const hrs = Math.floor(t / 60);
    const mins = t % 60;
    const ampm = hrs >= 12 ? "PM" : "AM";
    const h12  = hrs > 12 ? hrs - 12 : hrs;
    const mm   = mins === 0 ? "00" : mins;
    const label = `${h12}:${mm} ${ampm}`;
    const value24 = `${hrs.toString().padStart(2,"0")}${mm}`;

    const opt = document.createElement("option");
    opt.value = opt.textContent = label;
    selectField.appendChild(opt);
  }

  // After work option
  const after = document.createElement("option");
  after.value = after.textContent = "After Work (TBC)";
  selectField.appendChild(after);

  // Sync hidden input
  selectField.addEventListener("change", () => {
    const val = selectField.value;
    if (val === "Before Work (TBC)") {
      outputField.value = "0600";
    } else if (val === "After Work (TBC)") {
      outputField.value = "1800";
    } else {
      const m = val.match(/(\d+):(\d+) (AM|PM)/);
      if (m) {
        let [ , h, mnt, pd ] = m;
        h = parseInt(h,10);
        if (pd === "PM" && h !== 12) h += 12;
        if (pd === "AM" && h === 12) h = 0;
        outputField.value = `${h.toString().padStart(2,"0")}${mnt}`;
      } else {
        outputField.value = "";
      }
    }
    console.log(`Selected: ${val} -> 24hr: ${outputField.value}`);
  });
});
