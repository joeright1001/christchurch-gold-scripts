/**
 * Place-Order Metal Color Setter
 * Sets CSS variables based on the 'metal' URL parameter.
 * This script runs in the <head> to prevent a flash of unstyled content.
 */
(() => {
  const metal = new URLSearchParams(window.location.search).get("metal")?.toLowerCase();
  if (!metal) return;

  const root = document.documentElement;
  if (metal === "gold") {
    root.style.setProperty("--gold_silver", "#fff8e3");
    root.style.setProperty("--gold_silver_background", "#fffff5");
  } else if (metal === "silver") {
    root.style.setProperty("--gold_silver", "#e6e6e6");
    root.style.setProperty("--gold_silver_background", "#f6f9ff");
  }
})();
