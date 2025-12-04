# Execution Plan: Webflow Cloud Custom Cart

## Phase 0: Environment Setup
**Goal**: Initialize the Next.js project and link it to Webflow Cloud.

**Decision**: Create a **NEW** separate repository/folder. Do not mix this with your existing scripts repo.
*   **Why?** The new app is a full-stack Next.js application with its own build system. Keeping it separate prevents conflicts with your legacy scripts and ensures a clean deployment pipeline to Webflow Cloud.

1.  **Create Project Directory**
    *   **Action**: Create a new folder outside your current repo.
    *   **Name**: `christchurch-gold-shopping-cart-app`
    ```bash
    # Run this in your main Projects folder (NOT inside scripts-repo)
    mkdir christchurch-gold-shopping-cart-app
    cd christchurch-gold-shopping-cart-app
    git init
    ```
2.  **Initialize Webflow App**
    *   Install CLI: `npm install -g @webflow/cli`
    *   Login: `webflow login`
    *   Init: `webflow app init` (Select "Next.js")
3.  **Install Dependencies**
    ```bash
    npm install pg redis @upstash/redis canvas-confetti
    # (Install other specific libs as needed later)
    ```
4.  **GitHub Setup**
    *   Create a new private repo on GitHub.
    *   `git remote add origin <your-repo-url>`
    *   `git add . && git commit -m "Initial commit"`
    *   `git push -u origin main`

## Phase 1: Infrastructure (Database)
**Goal**: Set up the persistent storage for the Cart State.

1.  **Railway Setup**
    *   Create a new Project in Railway.
    *   Add a **Redis** service (for high-speed active/ghost cart state).
    *   Add a **Postgres** service (optional, if you want long-term order history storage, otherwise relying on your existing Payment Server is fine).
2.  **Environment Variables**
    *   Get `REDIS_URL` from Railway.
    *   Create `.env.local` in your Next.js project.
    *   Add: `REDIS_URL=...`
    *   Add: `WEBFLOW_API_TOKEN=...` (from Webflow Dashboard).

## Phase 2: Core Cart Logic (Backend)
**Goal**: Build the API routes that manage the cart state and expiry.

1.  **API Route: Get/Create Cart**
    *   File: `app/api/cart/route.js`
    *   Logic: Check for a `cartId` cookie. If missing, generate UUID and return it. Fetch cart data from Redis.
2.  **API Route: Add Item**
    *   File: `app/api/cart/add/route.js`
    *   Logic: Receive `{ productId, price, name }`. Add to Redis with `timestamp_added`. Set Redis TTL (Time To Live) to 6 hours (for Ghosting).
3.  **Expiry Logic Implementation**
    *   Create a utility function `getCartStatus(cart)` that iterates items.
    *   Logic: `if (now - item.addedAt > 10 mins) item.status = 'ghost'`.
    *   *Note*: We don't need a background worker; we calculate status *on read* (when the user loads the cart or adds an item).

## Phase 3: Webflow Design & DevLink
**Goal**: Create the visual components in Webflow and sync them.

1.  **Design "Cart Overlay"**
    *   In Webflow Designer, create a component `CartOverlay`.
    *   Include: List wrapper, Item Row (Active), Item Row (Ghost), Total, Checkout Button.
2.  **Design "Navbar Cart Badge"**
    *   Create `CartBadge` component.
    *   Bind a text element to a prop `cartCount`.
3.  **Sync to Next.js**
    *   Run `npm run devlink:sync`.
    *   Verify `src/devlink/CartOverlay.js` exists.

## Phase 4: Frontend Integration
**Goal**: Wire the React logic to the DevLink components.

1.  **Create React Context**
    *   File: `context/CartContext.js`
    *   Logic: Fetches cart from `/api/cart`. Provides `addToCart`, `cartItems`, `isLoading` to the app.
2.  **Implement "Add to Cart" Button**
    *   Create `components/AddToCartButton.js`.
    *   Logic: `onClick` -> Read DOM price -> Call `context.addToCart`.
3.  **Mount "Add to Cart" on Product Pages**
    *   In `app/layout.js` (or a specific script): Search for the `#add-to-cart-root` div on the static page and mount the React button using `createRoot`.
4.  **Integrate Navbar**
    *   In `app/layout.js`: Import `CartBadge` from DevLink. Pass `context.cartCount`.

## Phase 5: Checkout & Payment
**Goal**: Handle the final transaction via your Payment Server.

1.  **Checkout Page**
    *   File: `app/checkout/page.js`
    *   Use DevLink `CheckoutForm` component.
2.  **Submit Order**
    *   On submit, call your Next.js API `/api/checkout/create`.
    *   That API calls your backend `POST /create`.
3.  **Payment Link**
    *   User selects Stripe.
    *   Call `/api/checkout/pay` -> Calls your backend -> Returns URL.
    *   `window.location.href = paymentUrl`.

## Phase 6: Testing & Deployment
1.  **Local Testing**: Run `npm run dev`. Test the 10-minute expiry (set it to 10 seconds for testing). Test Ghost re-add (mock price change).
2.  **Deploy**:
    *   Push to GitHub.
    *   Check Webflow Cloud dashboard for build success.
    *   Verify live URL.
