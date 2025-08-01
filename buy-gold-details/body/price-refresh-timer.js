/* ------------------------------------------------------------------
   Configuration
------------------------------------------------------------------- */
const COUNTDOWN_SECONDS = 120;         /* 120 s = 2 min */

/* IDs updated from CMS on every refresh */
const FIELDS_TO_UPDATE = [
  "#price_nzd",
  "#unit-price-nzd",
  "#unit-gst"
];

/* ------------------------------------------------------------------
   Cached elements
------------------------------------------------------------------- */
const minCounterEl = document.getElementById("min-counter");   // optional
const secCounterEl = document.getElementById("sec-counter");   // optional

/* ------------------------------------------------------------------
   Utility
------------------------------------------------------------------- */
const text = (el) => (el ? el.textContent.trim() : null);

/* ------------------------------------------------------------------
   1. Price refresh via XHR
------------------------------------------------------------------- */
function fetchAndUpdatePrices() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", window.location.href, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;

    const tmp = document.createElement("html");
    tmp.innerHTML = xhr.responseText;
    const changes = {};

    FIELDS_TO_UPDATE.forEach((sel) => {
      const newEl = tmp.querySelector(sel);
      const curEl = document.querySelector(sel);
      if (!newEl || !curEl) return;

      const newVal = text(newEl);
      if (newVal !== text(curEl)) {
        curEl.textContent = newVal;
        changes[sel] = newVal;
      }
    });

    if (Object.keys(changes).length) {
      document.dispatchEvent(
        new CustomEvent("price-refreshed", { detail: changes })
      );
    }
  };

  xhr.send();
}

/* ------------------------------------------------------------------
   2. Front-end looping timer
------------------------------------------------------------------- */
function startCountdown() {
  if (!minCounterEl || !secCounterEl) {
    /* Even if no visible display, still trigger periodic refresh */
    setInterval(fetchAndUpdatePrices, COUNTDOWN_SECONDS * 1000);
    return;
  }

  let secs = COUNTDOWN_SECONDS;

  function tick() {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    minCounterEl.textContent = String(m).padStart(2, "0");
    secCounterEl.textContent = String(s).padStart(2, "0");

    if (--secs < 0) {             // reached 00:00
      fetchAndUpdatePrices();     // pull fresh prices
      secs = COUNTDOWN_SECONDS;   // reset timer
    }
  }

  tick();                         // paint immediately
  setInterval(tick, 1000);        // then every second
}

/* ------------------------------------------------------------------
   3. Initialise
------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  fetchAndUpdatePrices();   // first pull
  startCountdown();         // start visible (or headless) timer
});
