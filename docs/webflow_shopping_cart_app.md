# Webflow Shopping Cart App Migration

## 1. Webflow Cloud Overview & Architecture Review

### What is Webflow Cloud?
Webflow Cloud is a **full-stack hosting platform** that allows you to deploy dynamic applications (using frameworks like Next.js) directly alongside your static Webflow site.
*   **Old World**: You design in Webflow, export code, and host it elsewhere (Vercel, Netlify) or use disjointed scripts.
*   **New World**: You design in Webflow, write logic in Next.js, and host *both* on Webflow's unified infrastructure (powered by Cloudflare's edge network).

### Frameworks: Next.js vs. Astro
Webflow Cloud primarily supports two modern frameworks. For this project, **Next.js** is the clear winner.
*   **Next.js**: A robust React framework ideal for **dynamic, complex applications** like shopping carts, dashboards, and SaaS products. It excels at handling state (like a cart), API routes (backend logic), and real-time user interactions.
*   **Astro**: Optimized for **static, content-heavy sites** (blogs, portfolios). It ships less JavaScript but is less suited for complex, state-heavy interactive apps like a dynamic checkout system.

### What is DevLink?
**DevLink** is the bridge between Design and Code.
*   **The Problem**: Developers usually have to manually code UI components to match a designer's mockups.
*   **DevLink's Solution**: You design a component in Webflow (e.g., a "Product Card" or "Cart Dropdown"), and DevLink **exports it as a ready-to-use React component**.
*   **Workflow**: You import this component into your Next.js app. If you change the design in Webflow, the code in your app updates automatically (via synchronization).

### What are "Apps"?
In this context, an "App" is simply your custom Next.js application running on Webflow Cloud.
*   It is **not** a plugin you install from a store.
*   It is **custom software** you write (in VS Code) to handle specific business logic (cart, payments, API calls) that Webflow's native tools can't do.

### Architecture & Deployment Workflow
Here is how the pieces fit together:

1.  **Development (VS Code)**: You write your Next.js code here. This handles the *logic* (adding items to cart, calculating totals, talking to your payment server).
2.  **Design (Webflow Designer)**: You build the *visuals* here. You sync these to your local VS Code project using DevLink.
3.  **Version Control (GitHub)**: You push your code to a GitHub repository.
4.  **Deployment (Webflow Cloud)**: Webflow Cloud watches your GitHub repo. When you push changes, it automatically builds and deploys your App.
5.  **The Result**: Your "App" lives at a specific route (e.g., `yourdomain.com/checkout`) or is embedded into your site, appearing seamless to the user.

### Data Flow: The Cart Experience
*   **User Interaction**: A user on your static Webflow site clicks "Buy Now".
*   **Handover**: This click triggers an action in your Next.js App (which might be running as a full page or a mounted component).
*   **State**: The "Cart" is **not** part of the static Webflow site. It is a stateful object managed entirely by your Next.js App.
*   **Persistence**: The App stores this cart data (e.g., in a secure cookie or local storage managed by React) so it persists as the user navigates.

### Pricing: Usage vs. Fixed
*   **Note**: Webflow Cloud pricing is evolving. Historically, hosting dynamic apps involves **usage-based** costs (bandwidth, compute time) on top of a base tier.
*   **Recommendation**: Check the latest Webflow pricing for "Apps" or "Webflow Cloud" specifically. Since this app effectively proxies requests and handles a checkout flow, usage should be moderate compared to a high-traffic media site.

### Risks & Issues to Highlight
1.  **DevLink E-commerce Limitation**: **Critical.** DevLink cannot export Webflow's native Cart or Checkout forms. We must build the cart *logic* from scratch in React and only use DevLink for the *visual* container.
2.  **Complexity**: This moves you from "scripting" to "software engineering." You are maintaining a Next.js codebase.
3.  **Pricing Uncertainty**: Ensure you have clarity on Webflow Cloud's billing model for your expected transaction volume.

---

## 2. Project Requirements

The objective is to modernize the current "Buy Gold" checkout process, replacing manual scripts and external endpoints with a fully integrated solution using Webflow's latest capabilities.

*   **Integrated Hosting**: Replace the current external public endpoint and disparate scripts with a unified full-stack application hosted on **Webflow Cloud**.
*   **Checkout Management**: Transition from a script-based, single-item checkout to a robust shopping cart system.
*   **Cart UI**: Implement a "Complete Cart" component in the main navigation to display added items.
*   **Design Consistency**: Maintain the ability to design UI components (Cart, Checkout) directly in Webflow.
*   **Payment Processing**: Implement an on-demand payment flow where payment links are generated *after* the user selects a provider, integrating with the updated Payment Server API.
*   **Volatile Cart Management**: Implement a strict 10-minute expiry system for all cart items to mitigate market price volatility, including a "ghosting" mechanism for expired items.

---

## 3. Findings

### Current System Review (`buy-gold-details` & `complete-order`)
*   **Data Handling**: Currently relies on `sessionStorage` to persist product data between pages. This is fragile; data is lost if the tab is closed, and it limits the user to a single "active" product flow.
*   **Logic**: Business logic (calculations, routing) is exposed in client-side `main.js` files.
*   **Payment Integration**: Uses a combination of `bank-transfer-generator.js` for manual links and a polling mechanism against an external API (`/api/payment-status/`) for other methods.

### Payment Server API Analysis
The backend payment server provides specific endpoints that the Next.js app will consume:
1.  **Public Order Creation (`POST /create`)**: Creates a `Trade Order`. Returns a `token` and `trade_order` ID.
2.  **External Payment Link Generation (`POST /api/external/generate-link`)**: Generates a secure payment URL (Stripe, POLi, etc.) for an *existing* Trade Order.

---

## 4. Feature Spec: Volatile Cart Expiry System

Due to the volatile nature of gold/silver prices, the cart system requires a complex expiry logic that goes beyond standard e-commerce behavior.

### 4.1. The "Active" vs. "Ghost" State
The Shopping Cart State will track two lists:
1.  **Active Items**: Items currently valid for purchase.
2.  **Ghost Items**: Items that expired (>10 mins) but are retained for 6 hours to allow easy re-addition.

### 4.2. Logic Flow
1.  **Item Added**:
    *   Record `timestamp_added` (e.g., `1732930000`).
    *   Set `status` to `active`.
2.  **Global Tick (Every Second)**:
    *   The App runs a timer loop.
    *   For each Active Item: Calculate `elapsed = now - timestamp_added`.
    *   **If `elapsed > 10 minutes`**:
        *   Move item to **Ghost List**.
        *   Change UI to "Expired".
        *   Disable Checkout button if no active items remain.
3.  **Global Header Counter**:
    *   Find the Active Item with the *minimum* remaining time.
    *   Display "Expires in MM:SS" next to the Cart Icon.
    *   If Cart is empty or all items are ghosts, hide the counter.
4.  **Ghosting & Re-Adding**:
    *   Ghost items persist for 6 hours.
    *   **UI**: Show the item purely as a reference (grayed out) with a "Re-add at Current Rate" button.
    *   **Action**: When "Re-add" is clicked:
        *   **Fetch New Price**: You *cannot* use the old price. You must query the API or scrape the live site for the *current* price of that SKU.
        *   Create a *new* cart item with the new price and a *new* timestamp.
        *   Remove the old Ghost item.

### 4.3. UI Components (Webflow Designed)
You will need to design specific states in Webflow for DevLink export:
*   **Cart Row (Active)**: Standard view with a "09:59" countdown badge.
*   **Cart Row (Expired/Ghost)**: Visual style (opacity 50%) with a "Refresh Price" button.
*   **Header Badge**: A container that can display the global countdown.

### 4.4. Feasibility & Complexity Analysis
**Can Next.js handle this?**
**Short Answer: Yes, easily.**

While this feature logic is complex from a *business rule* perspective, it is a standard use case for a React application.
*   **Client-Side Logic**: Next.js supports "Client Components" (`'use client'`) which run entirely in the user's browser. This means the countdown timers and expiry checks happen instantly on the user's device without needing constant server communication.
*   **State Management**: React's core purpose is to keep the UI (the timers) in sync with the Data (the expiry timestamps). Handling a list of 10-20 items with individual timers is trivial for React's performance.
*   **No "Magic" Needed**: This does not require complex external services. It is standard JavaScript logic (`setInterval` and `Date.now()`) running inside the Next.js framework.

---

## 5. Suggested Approach

The recommended path is to build a **Next.js application hosted on Webflow Cloud** that handles the entire checkout experience.

### Phase 1: Application Setup
*   Initialize a new Next.js project using the Webflow CLI (`webflow-cli`).
*   Configure the project for Webflow Cloud deployment.

### Phase 2: Logic Migration (Backend Integration)
The Next.js app will act as a secure **BFF (Backend for Frontend)** that communicates with your existing Payment Server.
*   **Order Creation**: Create a Next.js API route (e.g., `/api/checkout/create`) that securely calls the Payment Server's `POST /create` endpoint.
*   **Payment Link Generation**: Create a Next.js API route (e.g., `/api/checkout/pay`) that securely calls the Payment Server's `POST /api/external/generate-link`.

### Phase 3: Custom Cart Implementation (Frontend & DB)
*   **Database Integration**: The Cart State must be managed in a database (e.g., Redis or Postgres on Railway) to support the "Ghosting" feature (persistence for 6 hours).
*   **State Management**: Implement a React Context that syncs with this database via Next.js API routes (`/api/cart`).
*   **Cart Logic**: Build the functions for `addToCart`, `removeFromCart`, `calculateTotal`, and the **Volatile Expiry Logic** defined in Section 4.

### Phase 4: UI Design & DevLink Integration
*   **Design in Webflow**: Design the "Cart Dropdown" and "Checkout Page" (including payment method buttons) in Webflow.
*   **Export via DevLink**: Export these visual components as React code.
*   **Hydrate**: Import them into Next.js and wire them to your custom cart logic.

### Phase 5: Payment Flow Implementation
1.  **Cart Review**: User reviews items in the custom React cart.
2.  **Checkout Form**: User enters details.
3.  **Submit Order**: Frontend calls Next.js `/api/checkout/create` -> Backend creates order -> Returns ID.
4.  **Select Payment**: User selects "Stripe".
5.  **Generate Link**: Frontend calls Next.js `/api/checkout/pay` with ID and "STRIPE" -> Backend gets link.
6.  **Redirect**: Frontend redirects user to the Stripe checkout page.

### Phase 6: Deployment
*   Deploy the unified application to Webflow Cloud.
*   Redirect the Webflow site's "Buy" buttons to interact with this integrated app.
