# Shared Scripts

This folder contains scripts and styles that are shared across multiple Webflow pages.

## Structure
- `body/`: Contains JavaScript files bundled into `main.js`.
- `head/`: Contains CSS files bundled into `main.css`.

## How to use
1. Add your `.js` files to `body/` and `.css` files to `head/`.
2. Run `.\build.ps1` in the respective folder to bundle, minify, and publish to GitHub.
3. The build script will provide you with the CDN URL.

## Current Components
### Popular Products Carousel
**Webflow Implementation:**
- **Head (CSS)**: Use a `<link>` tag in the Webflow Page/Site Settings (Inside `<head>` tag):
  ```html

  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@v1.0.366/shared-scripts/head/main.css">



- **Body (JS)**: Use a `<script>` tag in the Webflow Page/Site Settings (Before `</body>` tag):
  ```html
  
  
  <script src="https://cdn.jsdelivr.net/gh/joeright1001/christchurch-gold-scripts@v1.0.365/shared-scripts/body/main.js" defer></script>

