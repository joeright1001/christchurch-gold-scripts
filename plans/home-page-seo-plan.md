# Home Page SEO Optimization Plan

Based on a review of `source-html-christchurchgold-co-nz.txt`, here is a targeted SEO plan to improve rankings for **"gold christchurch"**, **"buy gold"**, **"buy silver"**, and **"gold price nz"**.

## 1. Meta Tags (Title & Description)

The current tags are good, but we can make them slightly more focused on the exact match phrases.

**Current Title:**
`<title>Gold & Silver Christchurch | Buy & Sell Bullion | Christchurch Gold</title>`
**Recommended Title:**
`<title>Buy Gold & Silver in Christchurch | Live Gold Price NZ | Christchurch Gold</title>`
*(Hits: "buy gold", "buy silver", "gold christchurch" via proximity, "gold price nz")*

**Current Meta Description:**
`<meta content="Looking to buy or sell gold and silver in Christchurch? Visit our secure Hornby office for live market rates, private viewings, and premium bullion." name="description"/>`
**Recommended Meta Description:**
`<meta content="Looking to buy gold or buy silver in Christchurch? Visit our secure Hornby office. Check the live gold price NZ and shop premium bullion online today." name="description"/>`
*(Hits all exact match keywords natively within conversational text)*

## 2. Heading Structure (H1, H2, H3)

Search engines heavily weight H1 and H2 tags. 

**Current H1:**
`<h1 class="heading-style-h1-home">Trusted Gold & Silver Dealer in Christchurch</h1>`
**Recommended H1:**
`<h1 class="heading-style-h1-home">Buy Gold & Silver in Christchurch</h1>`
*(Directly targets the primary intent: "buy gold", "buy silver", "gold christchurch")*

### Complete H2 Analysis

You currently have several H2 tags scattered throughout the page, including within dynamic elements like the Hero Slider.

1.  **Current (Hero Slider):** `<h2>Buy Pure 1oz Silver</h2>` / `<h2>Buy Pure 1kg Silver</h2>`
    *   *Analysis:* These are great for targeting "buy silver". Because they exist in the initial HTML DOM (not loaded via JS later), Google will crawl and index them perfectly fine.
    *   *Recommendation:* Ensure gold slides in this collection naturally say `<h2>Buy Pure 1oz Gold</h2>` to target "buy gold".

2.  **Current (Live Prices Section):** `<h2 class="gold-price-nz-heading2">Live Gold & Silver Prices in NZD and USD Per Ounce</h2>`
    *   **Recommended H2:** `<h2 class="gold-price-nz-heading2">Live Gold Price NZ & Silver Prices</h2>`
    *   *(Hits "gold price nz" exactly)*

3.  **Current (Private Viewing Section):** `<h2 class="view-in-person">Arrange a Private Viewing</h2>`
    *   **Recommended H2:** `<h2 class="view-in-person">Private Viewings to Buy Gold in Christchurch</h2>`
    *   *(Adds context and targets "buy gold" and "gold christchurch")*

4.  **Current (Popular Products Section):** `<h2>Popular</h2>`
    *   **Recommended H2:** `<h2>Popular Gold & Silver to Buy</h2>`

5.  **Current (Footer/CTA Sections):** 
    *   `<h2 class="heading-29">Early access to Deals & Promotions</h2>`
    *   `<h2 id="custom-testimonials" class="heading-31">Customer Testimonials</h2>`
    *   `<h2 class="heading-style-h2-copy-copy">Get in Touch</h2>`
    *   *Analysis:* These are fine to leave as they are. They provide standard page structure and user experience.

## 3. Schema Markup (JSON-LD) Strategy

Having a Global schema and Page-Level schema is exactly the right approach, but we need to prevent them from conflicting. 

Currently on the homepage, there are **two** full `Store`/`JewelryStore` definitions loading. Google gets confused when it sees the same business defined twice with different descriptions on the same page.

**The Strategy:**

1.  **Global Schema (Project Settings):** 
    Keep the global schema in the site-wide settings, but replace it with this updated version. This version integrates the keyword-rich description and the `hasOfferCatalog` services from your old homepage schema, projecting those signals across your entire site.

**Updated Global Store Schema (Put this in Webflow Project Settings -> Global Custom Code):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Store", "FinancialService", "JewelryStore"],
  "@id": "https://www.christchurchgold.co.nz/#localbusiness",
  "additionalType": "https://en.wikipedia.org/wiki/Gold_as_an_investment",
  "name": "Christchurch Gold",
  "url": "https://www.christchurchgold.co.nz/",
  "logo": "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/69fee5cd48d6eac10c86385a_christchurch-gold-logo-black.svg",
  "image": "https://cdn.prod.website-files.com/676bc93dc0d75728455c893b/69ffafae0804ede72fc99e7b_christchurch-gold-inside-office.jpg",
  "description": "Christchurch's leading gold and silver dealer. Buy gold Christchurch, buy silver Christchurch, and get live gold price NZ and silver price NZ updates. We offer private viewings and instant quotes for bullion and jewellery. Visits are by appointment only.",
  "priceRange": "$300 - $100,000+",
  "telephone": [
    "+64-3-925-7715",
    "+64-21-245-1178"
  ],
  "email": "sales@christchurchgold.co.nz",
  "publicAccess": false,
  "paymentAccepted": "Cash, Credit Card, Union Pay, AliPay, Blink Pay, Poli Pay, Account to Account",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3b/37 Shands Road",
    "addressLocality": "Hornby",
    "addressRegion": "Christchurch",
    "postalCode": "8042",
    "addressCountry": "NZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -43.5461957184395,
    "longitude": 172.5236652687334
  },
  "areaServed": {
    "@type": "City",
    "name": "Christchurch"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    ],
    "opens": "09:30",
    "closes": "17:30"
  }],
  "potentialAction": [
    {
      "@type": "ViewAction",
      "name": "View Live Gold Price",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz"
      }
    },
    {
      "@type": "BuyAction",
      "name": "Buy Gold Online",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.christchurchgold.co.nz/buy-gold"
      }
    },
    {
      "@type": "SellAction",
      "name": "Get Instant Sell Quote",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.christchurchgold.co.nz/jewellery-calculator"
      }
    },
    {
      "@type": "ReserveAction",
      "name": "Book an Appointment",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.christchurchgold.co.nz/contact-us"
      }
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Gold and Silver Bullion Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Buy Gold Christchurch",
          "description": "Premium gold bullion bars and coins for sale in Christchurch."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Buy Silver Christchurch",
          "description": "High-quality silver bullion bars and coins for sale in Christchurch."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Live Gold Price NZ",
          "description": "Real-time gold spot prices in NZD, refreshed every minute."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Silver Price NZ Today",
          "description": "Current silver market rates in New Zealand Dollars."
        }
      }
    ]
  }
}
</script>
```

2.  **Homepage Schema (Page Settings):**
    Remove the massive, duplicate `Store` schema from the Homepage settings. Instead, the Homepage should *only* add schemas for the specific things on that page that aren't on every other page. Specifically, we will add an isolated `FAQPage` schema to the Homepage to get those rich snippet questions in Google Search.

**New Homepage-Only Schema to replace the current bloated one:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I buy gold in Christchurch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can buy gold and silver bullion at Christchurch Gold. Our secure office is located in Hornby and we offer private viewings by appointment."
      }
    },
    {
      "@type": "Question",
      "name": "What is the current gold price in NZ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The gold price in NZ changes every minute based on live market rates. You can view our real-time gold price NZ updates directly on our website."
      }
    },
    {
      "@type": "Question",
      "name": "How can I check the silver price in NZ today?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Christchurch Gold provides live updates for the silver price NZ today. Visit our live prices page for the latest spot rates in NZD."
      }
    }
  ]
}
</script>
```

## 4. On-Page Content Adjustments

Small tweaks to the body copy to reinforce the keywords:

*   **Hero Subtitle:** Change "Fast buy-back at live rates..." to "Fast buy-back at the current **gold price nz**..."
*   **Invest Slider Text:** Where it says "Pure 1oz Silver", ensure the supporting text says something like "The easiest way to **buy silver** in Christchurch..."

## Implementation Notes
Since this is a Webflow site, these changes need to be made in the Webflow Designer:
1. Meta tags in the Page Settings.
2. Headings and text directly on the canvas (some H2s are inside CMS collections/sliders).
3. Schema: Update the global custom code schema with the one provided above. Replace the Homepage custom code schema with the streamlined `FAQPage` schema above.

## 5. Jewellery Calculator Page Schema

This version improves the Webflow default by linking the tool to your business entity and adding FAQs to capture more search real estate.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": "https://www.christchurchgold.co.nz/sell-gold-jewellery-calculator/#service",
      "name": "Gold & Silver Buying Service",
      "description": "Professional bullion and jewellery buying service in Christchurch. We buy 9ct to 24ct gold and sterling silver at competitive market rates.",
      "provider": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "areaServed": { "@type": "City", "name": "Christchurch" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Jewellery Buying",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cash for Gold Jewellery" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sterling Silver Buying" } }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Live Gold Jewellery Calculator",
      "operatingSystem": "Web",
      "applicationCategory": "FinanceApplication",
      "description": "Instant online tool to calculate the value of gold jewellery based on current NZ gold prices.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NZD",
        "description": "Free to use"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is the value of my gold jewellery calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your quote is calculated based on the current live gold spot price, the purity (carat) of the item, and its total weight in grams."
          }
        },
        {
          "@type": "Question",
          "name": "Do you buy broken gold jewellery?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we buy gold in any condition, including broken chains, single earrings, and scrap gold, as the value is based on the gold content."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I sell gold in Christchurch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can sell gold at our secure Hornby office. Simply use our online calculator for an estimate and book an appointment for a private viewing."
          }
        }
      ]
    }
  ]
}
</script>
```

## 6. Sell Your Bullion Page Schema

This version transforms the generic `WebPage` into a structured `Service` with a clear `SellAction`, making it much easier for Google to categorize the page as a commercial "buying" hub.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.christchurchgold.co.nz/sell-gold/#service",
      "name": "Bullion Buying Service",
      "description": "Sell your gold and silver bullion at premium rates. We provide fast quotes for all major mint bars and coins with secure settlement.",
      "provider": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "serviceType": "Bullion Trading",
      "areaServed": { "@type": "Country", "name": "New Zealand" },
      "potentialAction": {
        "@type": "SellAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.christchurchgold.co.nz/sell-gold",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "description": "Get a quote to sell your gold or silver bullion."
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does it take to get a quote for my bullion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "During business hours, our dealers typically review and respond to bullion sell requests within 1-2 hours."
          }
        },
        {
          "@type": "Question",
          "name": "What types of bullion do you buy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We buy all major gold and silver bullion bars and coins, including Perth Mint, NZ Mint, PAMP, and ABC Bullion."
          }
        },
        {
          "@type": "Question",
          "name": "How do I receive payment when I sell my gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Once the bullion is verified at our Hornby office, we provide immediate settlement via bank transfer or other agreed methods."
          }
        }
      ]
    }
  ]
}
</script>
```

## 7. Buy Gold & Silver (Catalog) Page Schema

This version enhances the `CollectionPage` by adding an `OfferCatalog` structure and high-intent FAQs to target common buyer concerns.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://www.christchurchgold.co.nz/buy-gold/#collection",
      "name": "Buy Gold & Silver Bullion Christchurch",
      "description": "Shop our extensive range of pure gold and silver bullion. Secure online ordering and private viewings in Christchurch. NZ Mint, Perth Mint & PAMP authorized products.",
      "url": "https://www.christchurchgold.co.nz/buy-gold",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": {
        "@type": "OfferCatalog",
        "name": "Bullion Catalog",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Gold Bullion",
            "description": "Pure gold bars and coins including 1oz, 10oz, and fractional sizes."
          },
          {
            "@type": "OfferCatalog",
            "name": "Silver Bullion",
            "description": "Investment grade silver bars and coins from world-renowned mints."
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is gold bullion GST-free in New Zealand?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, 'investment grade' gold and silver bullion (purity of 99.5% or higher for gold and 99.9% or higher for silver) is generally exempt from GST in NZ."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer secure shipping for gold purchases?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer fully insured, discreet courier shipping throughout New Zealand for all gold and silver bullion orders."
          }
        },
        {
          "@type": "Question",
          "name": "Can I buy gold in person at your Christchurch office?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can arrange a private viewing at our secure Hornby office to inspect and purchase bullion in person by appointment."
          }
        }
      ]
    }
  ]
}
</script>
```

## 8. About Page Schema

This version takes the basic `AboutPage` and adds a layer of "Trust and Authority" by integrating team members, customer reviews, and company FAQs. 

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://www.christchurchgold.co.nz/about/#aboutpage",
      "name": "About Christchurch Gold",
      "url": "https://www.christchurchgold.co.nz/about",
      "mainEntity": {
        "@type": ["LocalBusiness", "Store", "FinancialService"],
        "@id": "https://www.christchurchgold.co.nz/#localbusiness",
        "name": "Christchurch Gold",
        "description": "Family-owned New Zealand business offering gold and silver bullion with sharp pricing, secure transactions, and expert guidance. Sourcing from reputable mints and refineries worldwide.",
        "member": [
          {
            "@type": "Person",
            "name": "Estelle",
            "jobTitle": "COO",
            "description": "Co-founder of Christchurch Gold leading day-to-day operations and customer experience."
          },
          {
            "@type": "Person",
            "name": "Gary",
            "jobTitle": "CEO",
            "description": "Co-founder with extensive precious-metals experience and background in trading systems development."
          },
          {
            "@type": "Person",
            "name": "Brian",
            "jobTitle": "Operations",
            "description": "Skilled in process discipline, systems improvement, and inventory control."
          },
          {
            "@type": "Person",
            "name": "Gwen",
            "jobTitle": "Support",
            "description": "Dedicated support team member delivering professional client service."
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": "5"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Aisha Morgan" },
            "reviewBody": "I couldn't be happier with my order from Christchurch Gold. Communication was clear and updates came through promptly.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Oliver Grant" },
            "reviewBody": "Christchurch Gold made my first online bullion purchase stress-free. The prices were sharp and delivery was faster than expected.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who owns Christchurch Gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Christchurch Gold is a family-owned New Zealand business co-founded by Gary and Estelle. We are dedicated to providing a secure and professional bullion trading experience."
          }
        },
        {
          "@type": "Question",
          "name": "Is Christchurch Gold a registered New Zealand company?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we are a registered New Zealand business operating from our secure office in Hornby, Christchurch, specializing in investment-grade precious metals."
          }
        }
      ]
    }
  ]
}
</script>
```

## 9. How to Buy (FAQ/Education) Page Schema

This complete version organizes your extensive educational content into a structured `FAQPage` and adds a `BreadcrumbList` for improved search engine navigation.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "How to Buy",
          "item": "https://www.christchurchgold.co.nz/how-to-buy"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/how-to-buy/#faq",
      "name": "Gold & Silver Buying Guide NZ",
      "description": "Educational guide on spot prices, market movements, and how to buy bullion in New Zealand.",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does 'spot price' mean for gold/silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The gold spot price is the live market rate for one troy ounce of gold at a given instant. It moves with global trading, major news, interest rates, currency shifts, and investor sentiment. Dealers use spot as the reference point to set buy and sell prices for bars and coins."
          }
        },
        {
          "@type": "Question",
          "name": "The retail price % above spot keeps changing, what's happening?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While the baseline price of gold and silver is largely determined by the spot price, the final price depends heavily on physical availability and supply chain pressures. Given high demand, wholesale refineries experience increased costs to secure raw materials and produce products, which increases retail premiums independent of the daily spot price."
          }
        },
        {
          "@type": "Question",
          "name": "What unit is the gold price shown in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most live charts display gold per troy ounce in US dollars (USD). Many platforms also offer alternative views such as per kilogram or per gram."
          }
        },
        {
          "@type": "Question",
          "name": "Where does the spot price come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gold is traded worldwide across major markets, and the spot rate reflects this combined global activity. Futures trading is a key driver, with COMEX (part of CME Group) often used as a widely referenced benchmark."
          }
        },
        {
          "@type": "Question",
          "name": "Why retail prices aren't the same as spot",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot is the metal's base value only. It doesn't include fabrication, minting, freight, insurance, secure handling, verification, or operating costs. Bullion products are typically sold at a premium above spot to cover these costs."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the gold/silver price move so much—what drives it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gold is a globally traded commodity with constant price discovery. Main drivers include supply and demand, inflation expectations, interest rates, currency movements, and major geopolitical or economic events."
          }
        },
        {
          "@type": "Question",
          "name": "How many grams are in one troy ounce?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1 troy ounce = 31.103 grams."
          }
        },
        {
          "@type": "Question",
          "name": "How many troy ounces are in 1 kilogram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1 kilogram = 32.151 troy ounces."
          }
        },
        {
          "@type": "Question",
          "name": "Do I pay GST on physical gold in New Zealand?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In New Zealand, investment-grade fine gold and pure silver bullion are generally treated as zero-rated for GST when supplied by a registered dealer, meaning GST is not added at checkout."
          }
        },
        {
          "@type": "Question",
          "name": "Is it smarter to buy from a New Zealand gold dealer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Buying locally reduces risk and simplifies shipping and insurance compared to overseas orders. You can deal face-to-face, take direct delivery, and benefit from the NZ Consumer Guarantees Act (CGA) and Fair Trading Act (FTA)."
          }
        }
      ]
    }
  ]
}
</script>
```

## 10. How to Sell (Process) Page Schema

This comprehensive schema defines your "Buying" service, provides navigational breadcrumbs, and addresses common seller questions via an integrated `FAQPage`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "How to Sell",
          "item": "https://www.christchurchgold.co.nz/how-to-sell"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://www.christchurchgold.co.nz/how-to-sell/#service",
      "name": "Precious Metals Buying Service",
      "description": "Sell your gold and silver bullion or jewellery for competitive market rates. We offer instant quotes and fast payment options for sellers across New Zealand.",
      "provider": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "areaServed": { "@type": "Country", "name": "New Zealand" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Buying Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sell Gold Bullion" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sell Gold Jewellery" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sell Silver Bullion" } }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I sell gold to you if I'm not in Christchurch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can sell to us by post from anywhere in New Zealand. We recommend using a tracked and insured courier service. Once we receive and verify your items, we provide a final quote and immediate payment."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to get paid after I sell my gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Once the gold has been verified in person or received by post, we typically process payments via bank transfer immediately. Most customers receive their funds the same day or next business day."
          }
        },
        {
          "@type": "Question",
          "name": "What types of jewellery do you buy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We buy all gold jewellery from 9ct to 24ct, including broken pieces, chains, rings, and coins. We also buy sterling silver jewellery and flatware."
          }
        }
      ]
    }
  ]
}
</script>
```

## 11. Trusted Brands Page Schema

This version transforms the simple `WebPage` into a `CollectionPage` that uses a structured `ItemList` for your 21 stocked brands, adds breadcrumbs for navigation, and includes FAQs to reinforce the "Certified" and "LBMA" authority of your inventory.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Trusted Brands",
          "item": "https://www.christchurchgold.co.nz/trusted-brands"
        }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": "https://www.christchurchgold.co.nz/trusted-brands/#collection",
      "name": "Trusted Bullion Brands | Christchurch Gold",
      "description": "Explore the certified gold and silver bullion brands we stock, including LBMA-accredited refineries and sovereign mints like Perth Mint and PAMP Suisse.",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Certified Precious Metals Brands",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "item": { "@type": "Organization", "name": "Royal Canadian Mint", "url": "https://www.mint.ca/en" } },
          { "@type": "ListItem", "position": 2, "item": { "@type": "Organization", "name": "The Royal Mint", "url": "https://www.royalmint.com/" } },
          { "@type": "ListItem", "position": 3, "item": { "@type": "Organization", "name": "PAMP Suisse", "url": "https://www.pamp.com/" } },
          { "@type": "ListItem", "position": 4, "item": { "@type": "Organization", "name": "Austrian Mint", "url": "https://www.muenzeoesterreich.at/eng" } },
          { "@type": "ListItem", "position": 5, "item": { "@type": "Organization", "name": "The Perth Mint", "url": "https://www.perthmint.com/" } },
          { "@type": "ListItem", "position": 6, "item": { "@type": "Organization", "name": "Degussa", "url": "https://www.degussa-goldhandel.ch/en" } },
          { "@type": "ListItem", "position": 7, "item": { "@type": "Organization", "name": "South African Mint" } },
          { "@type": "ListItem", "position": 8, "item": { "@type": "Organization", "name": "Valcambi", "url": "https://valcambi.com/" } },
          { "@type": "ListItem", "position": 9, "item": { "@type": "Organization", "name": "Asahi Refining", "url": "https://www.asahirefining.com/" } },
          { "@type": "ListItem", "position": 10, "item": { "@type": "Organization", "name": "United States Mint", "url": "https://www.usmint.gov/" } },
          { "@type": "ListItem", "position": 11, "item": { "@type": "Organization", "name": "ABC Bullion", "url": "https://www.abcbullion.com.au/" } },
          { "@type": "ListItem", "position": 12, "item": { "@type": "Organization", "name": "Ainslie Bullion", "url": "https://ainsliebullion.com.au/" } },
          { "@type": "ListItem", "position": 13, "item": { "@type": "Organization", "name": "Argor-Heraeus", "url": "https://argor-heraeus.com/" } },
          { "@type": "ListItem", "position": 14, "item": { "@type": "Organization", "name": "Golden State Mint", "url": "https://www.goldenstatemint.com/" } },
          { "@type": "ListItem", "position": 15, "item": { "@type": "Organization", "name": "The Highland Mint", "url": "https://www.highlandmint.com/" } },
          { "@type": "ListItem", "position": 16, "item": { "@type": "Organization", "name": "Scottsdale Mint", "url": "https://www.scottsdalemint.com/" } },
          { "@type": "ListItem", "position": 17, "item": { "@type": "Organization", "name": "St. Joseph Mint" } },
          { "@type": "ListItem", "position": 18, "item": { "@type": "Organization", "name": "Emirates Gold" } },
          { "@type": "ListItem", "position": 19, "item": { "@type": "Organization", "name": "Sunshine Minting", "url": "https://www.sunshinemint.com/" } },
          { "@type": "ListItem", "position": 20, "item": { "@type": "Organization", "name": "Germania Mint", "url": "https://germaniamint.com/" } },
          { "@type": "ListItem", "position": 21, "item": { "@type": "Organization", "name": "Silver Towne Mint", "url": "https://silvertownemint.com/" } }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are the bullion brands you stock LBMA certified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we prioritize stocking bullion from refineries on the LBMA Good Delivery List, such as PAMP Suisse and Argor-Heraeus, ensuring global liquidity for your investment."
          }
        },
        {
          "@type": "Question",
          "name": "Do you buy back these trusted brands?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Christchurch Gold offers a fast buy-back service for all certified brands we stock, providing you with a reliable exit strategy for your bullion investment."
          }
        }
      ]
    }
  ]
}
</script>
```

## 12. Blog Index (All Articles) Page Schema

This version upgrades the `CollectionPage` to a formal `Blog` entity with an `ItemList` of articles. This structure is more efficient for Google's mobile "Article" carousels and adds credibility via breadcrumbs and publisher linking.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://www.christchurchgold.co.nz/all-blog-articles"
        }
      ]
    },
    {
      "@type": "Blog",
      "@id": "https://www.christchurchgold.co.nz/all-blog-articles/#blog",
      "name": "Christchurch Gold Bullion Insights",
      "description": "Practical guides, market insights, and how-tos on buying and selling gold & silver in New Zealand.",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "blogPost": [
        {
          "@type": "BlogPosting",
          "headline": "Sell Gold Jewellery Calculator",
          "url": "https://www.christchurchgold.co.nz/blog/sell-gold-jewellery-calculator",
          "datePublished": "2025-08-23",
          "description": "Without a clear idea of its worth, many sellers risk undervaluing their jewellery. This tool helps you estimate the value of rings, chains, and broken gold pieces based on live NZ market rates."
        },
        {
          "@type": "BlogPosting",
          "headline": "Is Gold a Good Investment?",
          "url": "https://www.christchurchgold.co.nz/blog/is-gold-a-good-investment",
          "datePublished": "2025-08-23",
          "description": "In today's fast-moving financial markets, many ask: 'Is gold still a good investment?' Explore how gold fits into your investment goals and risk tolerance in New Zealand."
        },
        {
          "@type": "BlogPosting",
          "headline": "Gold Coins vs Bars",
          "url": "https://www.christchurchgold.co.nz/blog/gold-coins-vs-bars-whats-the-best-way-to-buy-gold-in-new-zealand",
          "datePublished": "2025-08-23",
          "description": "Discover the pros and cons of gold coins vs bars for NZ investors. We compare liquidity, premiums, and storage factors to help you decide the best way to buy gold."
        },
        {
          "@type": "BlogPosting",
          "headline": "How to Sell Gold Jewellery at a High Price?",
          "url": "https://www.christchurchgold.co.nz/blog/how-to-sell-gold-jewellery-at-a-high-price",
          "datePublished": "2025-08-23",
          "description": "Learn how to get the best price for your second-hand gold jewellery. We explain how purity and weight drive value and how to avoid undervaluing your items."
        },
        {
          "@type": "BlogPosting",
          "headline": "Avoiding Common Gold Investment Mistakes",
          "url": "https://www.christchurchgold.co.nz/blog/gold-investment-mistakes",
          "datePublished": "2023-10-20",
          "description": "How to avoid common mistakes when buying gold in New Zealand. This article highlights pitfalls like ignoring premiums or storage and offers tips for successful bullion investing."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How often is the Christchurch Gold blog updated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We regularly publish new guides and market analysis to help New Zealanders make informed decisions about buying and selling precious metals."
          }
        }
      ]
    }
  ]
}
</script>
```

## 13. Customer Testimonials Page Schema

This version organizes your 10 reviews into a structured `LocalBusiness` entity, adds breadcrumbs, and uses an `FAQPage` block to transparently host your legal disclaimer regarding the history and sourcing of the feedback.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Testimonials",
          "item": "https://www.christchurchgold.co.nz/testimonials"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/testimonials/#webpage",
      "name": "Customer Testimonials | Christchurch Gold Reviews",
      "description": "Read genuine customer reviews. Disclaimer: Testimonials include feedback across Christchurch Gold and related sister companies/prior trading names.",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": {
        "@type": ["LocalBusiness", "Store", "FinancialService"],
        "@id": "https://www.christchurchgold.co.nz/#localbusiness",
        "name": "Christchurch Gold",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": "10"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Mitchell Carver" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Outstanding experience with Christchurch Gold. Prices were sharp, communication was excellent, and shipping was faster than expected."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Oliver Grant" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Very happy with my order. The process was simple, delivery was quick, and everything went smoothly."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Nathan Douglas" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Professional all the way through—highly recommended. The price was spot on and the tracking link was very helpful."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Harvey Kent" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Superb prices and quality. Delivery was quick and communication throughout was reassuring."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Cole Baxter" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Great service, solid prices. No complaints at all."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Amira Shah" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Communication was excellent and professional. Prices were competitive and the response time was fast."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Leonard Pike" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Excellent company to deal with. Clear communication and smooth transactions. A+ service."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Diego Moretti" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Fantastic experience from start to finish. Ordering was straightforward, service was great, and prices were very competitive."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Daniel Fraser" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Helpful, polite service from Christchurch Gold. Shipping was quick and easy. Would definitely recommend."
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Rohan Singh" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": "Fast replies, reasonable prices, and good service overall. Highly recommend."
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How are these testimonials collected?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Customer testimonials shown on this page include genuine feedback received across Christchurch Gold, related sister companies, and prior trading or brand names. Feedback may have been provided through reviews, emails, written messages, verbal comments, in-person conversations, or other customer communications."
          }
        },
        {
          "@type": "Question",
          "name": "Are these reviews from a past business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, some of the reviews shown here reflect feedback from our past trading history and related entities, highlighting our consistent commitment to quality service in the bullion industry."
          }
        }
      ]
    }
  ]
}
</script>
```

## 14. Live Price FAQs Page Schema

This version is aggressively optimized for high-volume search intent. It targets the primary keywords from your SEO report (totaling 200k+ monthly search potential) by using exact-match phrasing in the questions while providing deep, authoritative answers that reinforce your E-E-A-T signals.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.christchurchgold.co.nz/" },
        { "@type": "ListItem", "position": 2, "name": "Live Price FAQs", "item": "https://www.christchurchgold.co.nz/live-price-faqs" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-price-faqs/#faq",
      "name": "Gold Price NZ & Silver Price NZ FAQs",
      "description": "Comprehensive guide to the gold price NZ, silver price NZ, and the factors influencing the New Zealand gold rate and value.",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the current gold price nz today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The gold price nz is the live market rate for one troy ounce of 24 carat gold. Our charts update every minute to show the current nzd gold price, reflecting global spot market movements and the latest NZD/USD exchange rates."
          }
        },
        {
          "@type": "Question",
          "name": "How is the gold nz price calculated for retail buyers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The final gold nz price you pay includes the global spot price plus a 'premium.' This premium covers the costs of refining (by mints like Perth Mint or PAMP), insured shipping to New Zealand, secure handling, and dealer margins."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best way to track the gold rate in nz?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can track the live gold rate in nz using our interactive real-time charts. We provide data for gold price nz per gram, per ounce, and per kilogram to help New Zealand investors make informed decisions."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the nzd gold price move independently of the USD price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The nzd gold price is influenced by both the global metal value and the strength of the New Zealand Dollar. If the global gold price stays flat but the NZD weakens against the USD, the local gold price nz will actually increase."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I see a new zealand gold price chart with history?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our new zealand gold price chart provides historical data spanning back to 2015. This allows you to identify long-term trends and 'dips' in the gold rate in nz before making a purchase."
          }
        },
        {
          "@type": "Question",
          "name": "How can I determine the gold value nz of my old jewellery?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To find the gold value nz of jewellery, you must identify the purity (carat) and the weight in grams. Use our live gold price in nz data or our jewellery calculator to get an instant quote based on today's market rates."
          }
        },
        {
          "@type": "Question",
          "name": "What is the current silver price nz for bullion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The silver price nz is also tracked live on our platform. Like gold, the nz silver price reflects the global spot rate for 99.9% pure silver and is updated continuously during market trading hours."
          }
        },
        {
          "@type": "Question",
          "name": "Is there GST on the silver prices nz shown on your site?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In New Zealand, investment-grade silver (99.9% purity or higher) is typically zero-rated for GST. The silver prices nz listed for our bullion products reflect this tax-exempt status for qualifying New Zealand investors."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to buy gold nz?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to buy gold nz is often during market corrections or when the NZD is strong against the USD. Monitoring the gold price nz chart today can help you identify these strategic entry points."
          }
        },
        {
          "@type": "Question",
          "name": "Does Christchurch Gold provide a 24 carat gold price nz today?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide the live 24 carat gold price nz today for all our investment-grade bullion bars and coins, ensuring you get the most competitive rates in the Christchurch and wider NZ market."
          }
        }
      ]
    }
  ]
}
</script>
```

## 15. Contact Page Schema

This comprehensive version transforms your `ContactPage` into a high-intent "Action" hub. It links to your core business identity, defines a `ReserveAction` for private viewings, and includes FAQs addressing location and appointment security.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.christchurchgold.co.nz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact Us",
          "item": "https://www.christchurchgold.co.nz/contact-us"
        }
      ]
    },
    {
      "@type": "ContactPage",
      "@id": "https://www.christchurchgold.co.nz/contact-us/#contactpage",
      "name": "Contact Christchurch Gold | Private Viewing & Consultation",
      "description": "Get in touch with Christchurch's leading bullion dealer. Book a private viewing or consultation for buying and selling gold and silver in Christchurch.",
      "url": "https://www.christchurchgold.co.nz/contact-us",
      "publisher": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "mainEntity": {
        "@type": ["LocalBusiness", "Store"],
        "@id": "https://www.christchurchgold.co.nz/#localbusiness",
        "potentialAction": {
          "@type": "ReserveAction",
          "name": "Book a Private Viewing",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.christchurchgold.co.nz/contact-us",
            "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
          },
          "result": {
            "@type": "Event",
            "name": "Bullion Consultation"
          }
        }
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need an appointment to visit your Christchurch office?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, for security and privacy, all visits to our Hornby office are by appointment only. This ensures we can provide you with dedicated time for your bullion consultation."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Christchurch Gold located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our secure office is located at 3b/37 Shands Road, Hornby, Christchurch. We are situated upstairs next to the Ideal Building."
          }
        },
        {
          "@type": "Question",
          "name": "What are your business hours for consultations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our standard office hours are Monday to Friday, 9:30 am to 5:30 pm. However, we can often arrange private after-hours viewings by prior arrangement."
          }
        }
      ]
    }
  ]
}
</script>
```
```
