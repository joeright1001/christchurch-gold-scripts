# Christchurch Gold - Webflow Scripts

This repository contains all the custom code for the Christchurch Gold Webflow site. The scripts are organized by page and by their location in the HTML (`head` or `body`) to make them easy to manage and debug.

## How to Use

1.  Find the page you want to add code to in the list below.
2.  For each file listed for that page, copy the corresponding CDN link.
3.  In the Webflow Designer, go to the settings for that page.
4.  Paste the CDN link into the correct Custom Code section (`Inside <head> tag` or `Before </body> tag`).

---

### CDN Link Prefix

All file paths below should be prefixed with the following jsDelivr CDN URL:

`https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@latest/`

---

### Buy Gold Page (`/buy-gold`)

| Script Purpose | File Path | Webflow Location | Implementation |
| :--- | :--- | :--- | :--- |
| Product Grid & Hover Styles | `buy-gold/head/product-grid.css` | Inside `<head>` tag | `<link rel="stylesheet" href="CDN_PREFIX/buy-gold/head/product-grid.css">` |
| Mobile Dropdown Styles | `buy-gold/head/mobile-dropdown.css` | Inside `<head>` tag | `<link rel="stylesheet" href="CDN_PREFIX/buy-gold/head/mobile-dropdown.css">` |
| Filter Configuration | `buy-gold/body/filter-config.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/filter-config.js"></script>` |
| Filter Manager | `buy-gold/body/filter-manager.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/filter-manager.js"></script>` |
| Product Visuals (Icons, Colors) | `buy-gold/body/product-visuals.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/product-visuals.js"></script>` |
| Navbar Controller | `buy-gold/body/navbar-controller.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/navbar-controller.js"></script>` |
| Dynamic Card Sizing | `buy-gold/body/dynamic-card-sizing.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/dynamic-card-sizing.js"></script>` |
| Mobile Dropdown Logic | `buy-gold/body/mobile-dropdown.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/mobile-dropdown.js"></script>` |
| Product Search | `buy-gold/body/product-search.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/product-search.js"></script>` |
| Promo Text Visibility | `buy-gold/body/promo-text-visibility.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/promo-text-visibility.js"></script>` |
| Product Sorter | `buy-gold/body/product-sorter.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold/body/product-sorter.js"></script>` |

---

### Buy Gold Details Page (`/buy-gold-details/*`)

| Script Purpose | File Path | Webflow Location | Implementation |
| :--- | :--- | :--- | :--- |
| Price Refresh Timer | `buy-gold-details/body/price-refresh-timer.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold-details/body/price-refresh-timer.js"></script>` |
| Quantity Manager | `buy-gold-details/body/quantity-manager.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold-details/body/quantity-manager.js"></script>` |
| Page Display Logic | `buy-gold-details/body/page-display-logic.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold-details/body/page-display-logic.js"></script>` |
| Order Data Transfer | `buy-gold-details/body/order-data-transfer.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold-details/body/order-data-transfer.js"></script>` |
| Hidden Field Updater | `buy-gold-details/body/hidden-field-updater.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/buy-gold-details/body/hidden-field-updater.js"></script>` |

---

### Complete Order Page (`/complete-order`)

| Script Purpose | File Path | Webflow Location | Implementation |
| :--- | :--- | :--- | :--- |
| Payment Button Styles | `complete-order/head/payment-buttons.css` | Inside `<head>` tag | `<link rel="stylesheet" href="CDN_PREFIX/complete-order/head/payment-buttons.css">` |
| Session Data Loader | `complete-order/body/session-data-loader.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/complete-order/body/session-data-loader.js"></script>` |
| Payment Checker | `complete-order/body/payment-checker.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/complete-order/body/payment-checker.js"></script>` |

---

### Place Order Page (`/place-order`)

| Script Purpose | File Path | Webflow Location | Implementation |
| :--- | :--- | :--- | :--- |
| Form Styles | `place-order/head/form-styles.css` | Inside `<head>` tag | `<link rel="stylesheet" href="CDN_PREFIX/place-order/head/form-styles.css">` |
| NZ Post Locations | `place-order/body/nz-post-locations.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/place-order/body/nz-post-locations.js"></script>` |
| URL Data Receiver | `place-order/body/url-data-receiver.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/place-order/body/url-data-receiver.js"></script>` |
| Middleware Submitter | `place-order/body/middleware-submitter.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/place-order/body/middleware-submitter.js"></script>` |
| Hidden Field Form Logic | `place-order/body/hidden-field-form-logic.js` | Before `</body>` tag | `<script defer src="CDN_PREFIX/place-order/body/hidden-field-form-logic.js"></script>` |
