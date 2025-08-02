// ===============================================================
//  order-missing-product-error.js  –  Require product selection
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn  = document.getElementById("submit-order");
  const prod = document.getElementById("product-name-full");
  const msg  = document.getElementById("no-product-selected");
  if (!btn || !prod || !msg) return;

  btn.addEventListener("click", e => {
    if (!prod.value.trim()) {
      e.preventDefault();
      msg.style.display = "block";
      msg.scrollIntoView({behavior:"smooth",block:"center"});
    }
  });
});
