// ===============================================================
//  order-timer.js  –  Persistent 30‑minute countdown & auto‑refresh
// ===============================================================
function startLocalTimer() {
  const min   = document.getElementById("min-counter");
  const sec   = document.getElementById("sec-counter");
  const min2  = document.getElementById("min-counterv2");
  const sec2  = document.getElementById("sec-counterv2");
  const min3  = document.getElementById("min-counterv3");
  const sec3  = document.getElementById("sec-counterv3");

  if (min3) min3.style.fontWeight = "bold";
  if (sec3) sec3.style.fontWeight = "bold";

  const duration   = 30 * 60 * 1000;   // 30 minutes
  const warnThresh = 2000;             // 2 seconds

  const startTime = Date.now();        // always reset on load
  localStorage.setItem("bullionTimerStart", startTime);

  function update() {
    const remaining = duration - (Date.now() - startTime);
    if (remaining <= 0) { location.reload(true); return; }

    const mm = String(Math.floor(remaining/1000/60)).padStart(2,"0");
    const ss = String(Math.floor(remaining/1000)%60).padStart(2,"0");

    if (min)  min.textContent = mm;
    if (sec)  sec.textContent = ss;
    if (min2) min2.textContent = mm;
    if (sec2) sec2.textContent = ss;
    if (min3) min3.textContent = mm;
    if (sec3) sec3.textContent = ss;

    if (remaining <= warnThresh) localStorage.setItem("refreshTabs", Date.now());
  }

  window.addEventListener("storage", e => {
    if (e.key === "refreshTabs") location.reload(true);
  });

  update();
  setInterval(update, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("place-order")) startLocalTimer();
});
