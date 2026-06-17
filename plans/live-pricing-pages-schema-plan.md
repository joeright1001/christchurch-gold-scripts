# Live Pricing Pages Schema Optimization Plan (Final SEO Version)

Based on your feedback, this plan relies on the **Global Header** to handle the `LocalBusiness/Store` schema. To ensure we don't lose the critical SEO value of your "Why Choose Us" propositions, contact details, and operating hours on these high-traffic pages, that information has been naturally woven directly into the highly targeted `FAQPage` schema on every page.

**New Addition:** To capitalize on the interactive nature of the TradingView charts, a `WebApplication` schema (a more specific, browser-based type of `SoftwareApplication`) has been added to the `@graph`. This properly identifies the interactive tools to search engines, potentially triggering "Software App" rich snippets and explicitly defining the charts as a `FinanceApplication`. 

This strategy prevents duplicate business entities while creating a massive, keyword-rich footprint for each pricing variant across `WebPage`, `Dataset`, `WebApplication`, and `FAQPage` entities.

---

## 1. Gold Price NZD Page
**URL:** `/live-prices/gold-price-nz`
**Primary Keywords Handled:** `gold price nz`, `gold nz price`, `gold rate in nz`, `nzd gold price`, `new zealand gold price`, `gold price in nz`, `gold value nz`, `gold prices today`, `gold price nzd`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz",
      "name": "Live Gold Price NZ | Gold Rate in NZ | Christchurch Gold",
      "description": "Track the real-time gold price nz, gold nz price, and gold rate in nz. View our live nzd gold price charts. We offer certified purity, secure collection, and competitive pricing for buying and selling bullion.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz/#dataset",
      "name": "Live and Historical Gold Price in NZD",
      "description": "Interactive financial dataset featuring real-time spot prices of gold denominated in New Zealand Dollars (NZD). This data is essential for determining the current gold rate in nz, understanding the gold value nz for jewellery, and tracking the new zealand gold price for bullion investment.",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz",
      "keywords": [
        "gold price nz", 
        "gold nz price", 
        "gold rate in nz", 
        "nzd gold price", 
        "new zealand gold price", 
        "gold price in nz", 
        "gold value nz", 
        "gold prices today", 
        "gold price nzd",
        "gold rates chart",
        "price of gold"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Gold Spot Price (XAU) in NZD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz/#application",
      "name": "Interactive Gold Price Chart NZD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NZD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical gold prices in New Zealand Dollars (NZD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time gold price updates",
        "Historical gold price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-nz/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the current gold price nz today?",
          "acceptedAnswer": { "@type": "Answer", "text": "The gold price nz is the live market rate for one troy ounce of 24 carat gold. Our interactive charts update every minute during market hours to show the exact nzd gold price, giving you accurate data to make investment decisions." }
        },
        {
          "@type": "Question",
          "name": "How is the gold rate in nz calculated?",
          "acceptedAnswer": { "@type": "Answer", "text": "The gold rate in nz is calculated by taking the international gold spot price (usually priced in USD) and applying the real-time NZD/USD exchange rate. This gives you the new zealand gold price for raw metal." }
        },
        {
          "@type": "Question",
          "name": "How can I check the gold value nz of my jewellery?",
          "acceptedAnswer": { "@type": "Answer", "text": "To find the gold value nz of scrap or broken jewellery, you need to know the purity (e.g., 9ct or 18ct) and the weight in grams. You can then use our live gold price in nz data to calculate its intrinsic worth, or simply use our online calculator." }
        },
        {
          "@type": "Question",
          "name": "Why choose Christchurch Gold when trading based on the new zealand gold price?",
          "acceptedAnswer": { "@type": "Answer", "text": "When you track the gold price nz with us, you get absolute transparency. We guarantee Certified Purity & Authenticity from reputable global mints and offer Convenient & Secure Collection. Our Hornby office is open Mon-Fri 09:30 to 17:30 (By Appointment Only). For expert guidance, contact us at (03) 925 7715 or sales@christchurchgold.co.nz." }
        }
      ]
    }
  ]
}
</script>
```

---

## 2. Gold Price USD Page
**URL:** `/live-prices/gold-price-today-usd`
**Primary Keywords Handled:** `gold price usd`, `gold price us dollar`, `gold price today`, `gold price chart`, `price of gold`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd",
      "name": "Live Gold Price USD | Gold Price US Dollar Chart | Christchurch Gold",
      "description": "View the live gold price usd and gold price us dollar charts. Track global benchmark spot prices with absolute transparency and expert guidance from Christchurch Gold.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd/#dataset",
      "name": "Live and Historical Gold Price in USD",
      "description": "Interactive financial dataset featuring real-time spot prices of gold denominated in US Dollars (USD). This is the global benchmark for the price of gold and the international gold price us dollar rate.",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd",
      "keywords": [
        "gold price usd", 
        "gold price us dollar", 
        "gold price today", 
        "gold price chart", 
        "price of gold", 
        "global gold price"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Gold Spot Price (XAU) in USD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd/#application",
      "name": "Interactive Gold Price Chart USD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical gold prices in US Dollars (USD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time gold price updates",
        "Historical gold price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-usd/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the gold price USD today?",
          "acceptedAnswer": { "@type": "Answer", "text": "The gold price USD today reflects the global benchmark spot price for one troy ounce of fine gold, traded primarily on international commodity exchanges." }
        },
        {
          "@type": "Question",
          "name": "Why is the gold price usually quoted in US dollars?",
          "acceptedAnswer": { "@type": "Answer", "text": "Gold is a globally traded commodity, and the US dollar is the world's primary reserve currency. International markets standardize on the gold price us dollar metric before it is converted to local currencies like the NZD." }
        },
        {
          "@type": "Question",
          "name": "How do I purchase bullion securely using live gold prices?",
          "acceptedAnswer": { "@type": "Answer", "text": "Christchurch Gold offers Competitive Pricing and Absolute Transparency tied to live market rates. We provide Global Supply with Local Service, and guarantee Certified Purity & Authenticity. Contact us at (03) 925 7715 or sales@christchurchgold.co.nz. Our secure Hornby office operates Mon-Fri 09:30 to 17:30 (By Appointment Only)." }
        }
      ]
    }
  ]
}
</script>
```

---

## 3. Gold Price 1 Gram Page
**URL:** `/live-prices/gold-price-today-per-gram`
**Primary Keywords Handled:** `gold price in nz per 10-gram`, `gold price per gram`, `gold price nz per gram`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram",
      "name": "Live Gold Price Per Gram | Gold Price NZ Per Gram | Christchurch Gold",
      "description": "Calculate jewellery and bullion values with our live gold price nz per gram charts. Secure collection, certified purity, and competitive local pricing.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram/#dataset",
      "name": "Live Gold Price NZ Per Gram",
      "description": "Interactive dataset featuring the real-time spot price of gold per gram denominated in New Zealand Dollars (NZD). Highly useful for tracking the gold price in nz per 10-gram and single grams.",
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram",
      "keywords": [
        "gold price per gram", 
        "gold price nz per gram", 
        "1 gram gold price nz", 
        "gold price in nz per 10-gram",
        "gram of gold price"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Gold Spot Price (XAU) per Gram in NZD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram/#application",
      "name": "Interactive Gold Price Per Gram Chart NZD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NZD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical gold prices per gram in New Zealand Dollars (NZD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time gold price updates",
        "Historical gold price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/gold-price-today-per-gram/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the gold price nz per gram today?",
          "acceptedAnswer": { "@type": "Answer", "text": "Our chart displays the live gold price nz per gram, which is calculated accurately by dividing the standard troy ounce spot price by 31.103 grams." }
        },
        {
          "@type": "Question",
          "name": "How do I calculate the gold price in nz per 10-gram bar?",
          "acceptedAnswer": { "@type": "Answer", "text": "To find the raw metal value of a 10-gram bar, you simply multiply the live gold price per gram by 10. Note that retail bullion bars will carry a small manufacturing premium on top of this raw price." }
        },
        {
          "@type": "Question",
          "name": "Where can I buy gold securely using the live price per gram?",
          "acceptedAnswer": { "@type": "Answer", "text": "Christchurch Gold offers Competitive Pricing and Absolute Transparency based on live market rates. We guarantee Certified Purity & Authenticity from global mints. Our Hornby office is open for Secure Collection Mon-Fri 09:30 to 17:30 (By Appointment Only). Reach out via sales@christchurchgold.co.nz or (03) 925 7715." }
        }
      ]
    }
  ]
}
</script>
```

---

## 4. Silver Price NZD Page
**URL:** `/live-prices/silver-price-today`
**Primary Keywords Handled:** `silver price nz`, `silver prices nz`, `nz silver price`, `silver nz price`, `silver price`, `silver prices`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today",
      "name": "Live Silver Price NZ | NZ Silver Price Charts | Christchurch Gold",
      "description": "Track the real-time silver price nz and silver nz price. We provide accurate spot silver prices in NZD. Enjoy competitive pricing, certified purity, and secure local collection.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today/#dataset",
      "name": "Live and Historical Silver Price in NZD",
      "description": "Interactive dataset featuring real-time and historical spot prices of silver (1 troy ounce) denominated in New Zealand Dollars (NZD).",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today",
      "keywords": [
        "silver price nz", 
        "silver prices nz", 
        "nz silver price", 
        "silver nz price", 
        "silver price", 
        "silver prices"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Silver Spot Price (XAG) in NZD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today/#application",
      "name": "Interactive Silver Price Chart NZD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NZD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical silver prices in New Zealand Dollars (NZD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time silver price updates",
        "Historical silver price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the current silver price nz?",
          "acceptedAnswer": { "@type": "Answer", "text": "The silver price nz is the live market spot rate for one troy ounce of 99.9% pure silver, updated continuously in New Zealand Dollars on our live charts." }
        },
        {
          "@type": "Question",
          "name": "How does the nz silver price compare to the global price?",
          "acceptedAnswer": { "@type": "Answer", "text": "The nz silver price is directly linked to the global spot price (which is priced in USD), but is adjusted in real-time based on the current NZD to USD currency exchange rate." }
        },
        {
          "@type": "Question",
          "name": "Why buy silver locally based on the silver nz price?",
          "acceptedAnswer": { "@type": "Answer", "text": "By trading locally with Christchurch Gold, you secure Certified Purity, avoid international shipping delays, and benefit from Convenient & Secure Collection at our Hornby office (Open Mon-Fri 09:30 to 17:30, By Appointment Only). Our pricing is transparent and highly competitive. Contact us on (03) 925 7715 or sales@christchurchgold.co.nz." }
        }
      ]
    }
  ]
}
</script>
```

---

## 5. Silver Price USD Page
**URL:** `/live-prices/silver-price-today-usd`
**Primary Keywords Handled:** `silver price usd`, `silver price us dollar`, `silver price chart`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd",
      "name": "Live Silver Price USD | Silver Price Chart | Christchurch Gold",
      "description": "View the live silver price usd and track global benchmark spot prices. Enjoy transparent pricing, certified purity, and secure local collection from Christchurch Gold.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd/#dataset",
      "name": "Live and Historical Silver Price in USD",
      "description": "Interactive dataset featuring real-time and historical spot prices of silver (1 troy ounce) denominated in US Dollars (USD).",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd",
      "keywords": [
        "silver price usd", 
        "silver price us dollar", 
        "silver price chart",
        "global silver price"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Silver Spot Price (XAG) in USD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd/#application",
      "name": "Interactive Silver Price Chart USD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical silver prices in US Dollars (USD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time silver price updates",
        "Historical silver price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-usd/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the silver price USD today?",
          "acceptedAnswer": { "@type": "Answer", "text": "The silver price USD represents the international benchmark spot price for an ounce of fine silver, traded on global commodity exchanges." }
        },
        {
          "@type": "Question",
          "name": "How can I invest in silver with confidence?",
          "acceptedAnswer": { "@type": "Answer", "text": "Christchurch Gold guarantees Certified Purity & Authenticity from reputable global mints. We offer Global Supply with Local Service and Absolute Transparency. Connect with us at sales@christchurchgold.co.nz or (03) 925 7715. Secure collection is available at our Hornby office (Mon-Fri 09:30 to 17:30, By Appointment Only)." }
        }
      ]
    }
  ]
}
</script>
```

---

## 6. Silver Price 1 Gram Page
**URL:** `/live-prices/silver-price-today-per-gram`
**Primary Keywords Handled:** `silver price per gram`, `silver price nz per gram`.

**Schema Block:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram/#webpage",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram",
      "name": "Live Silver Price Per Gram | Silver Price NZ Per Gram | Christchurch Gold",
      "description": "Calculate valuations with our live silver price nz per gram charts. Christchurch Gold offers certified purity, secure collection, and absolute pricing transparency.",
      "inLanguage": "en-NZ",
      "isPartOf": { "@id": "https://www.christchurchgold.co.nz/#website" },
      "about": { "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram/#dataset" }
    },
    {
      "@type": "Dataset",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram/#dataset",
      "name": "Live Silver Price NZ Per Gram",
      "description": "Interactive dataset featuring the real-time spot price of silver per gram denominated in New Zealand Dollars (NZD).",
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram",
      "keywords": [
        "silver price per gram", 
        "silver price nz per gram", 
        "1 gram silver price nz"
      ],
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "temporalCoverage": "2015-01-01/..",
      "variableMeasured": "Silver Spot Price (XAG) per Gram in NZD"
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram/#application",
      "name": "Interactive Silver Price Per Gram Chart NZD",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NZD"
      },
      "softwareVersion": "1.0",
      "about": {
        "@type": "Thing",
        "name": "Live and historical silver prices per gram in New Zealand Dollars (NZD)."
      },
      "author": { "@id": "https://www.christchurchgold.co.nz/#localbusiness" },
      "featureList": [
        "Real-time silver price updates",
        "Historical silver price data",
        "Interactive price chart powered by TradingView"
      ],
      "url": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.christchurchgold.co.nz/live-prices/silver-price-today-per-gram/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the silver price nz per gram?",
          "acceptedAnswer": { "@type": "Answer", "text": "The silver price nz per gram is derived by dividing the standard troy ounce spot price by 31.103. It's highly useful for calculating the value of smaller silver items, sterling silver flatware, or fractional bullion." }
        },
        {
          "@type": "Question",
          "name": "Why choose Christchurch Gold for silver bullion?",
          "acceptedAnswer": { "@type": "Answer", "text": "We provide Absolute Transparency on our pricing based on live global charts. We guarantee Certified Purity & Authenticity and offer Convenient & Secure Collection at our Hornby office (Open Mon-Fri 09:30 to 17:30, By Appointment Only). Reach out via sales@christchurchgold.co.nz or (03) 925 7715." }
        }
      ]
    }
  ]
}
</script>

## Implementation Instructions for Webflow

1. The core Business identity (`Store` / `LocalBusiness`) will live in the Global "Custom Code" section in Webflow project settings.
2. Navigate to the Page Settings for each of the 6 individual Live Pricing pages.
3. In the "Inside `<head>` tag" custom code section, **delete the current existing schema code entirely**.
4. **Paste the comprehensive code block** provided above into each specific page. (The `creator: {@id: "#localbusiness"}` and `author: {@id: "#localbusiness"}` ensures these pages link directly back to your globally defined entity).
5. Publish the site and validate the URLs using the [Google Rich Results Test Tool](https://search.google.com/test/rich-results).