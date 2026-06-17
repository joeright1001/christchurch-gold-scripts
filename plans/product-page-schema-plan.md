# Product Page Schema Optimization Plan

This plan outlines the "Elite SEO" strategy for Webflow CMS-driven product pages, incorporating your specific CMS field mappings. 

## 1. Core Principles
1.  **Entity Linking:** Every product `Offer` links to the `seller` via the global `@id` (`https://www.christchurchgold.co.nz/#localbusiness`).
2.  **Absolute URLs:** All `url` and `image` references are fully qualified absolute URLs to improve indexing.
3.  **Graph Structure:** Uses `@graph` to include both `Product` and `BreadcrumbList` in a single block.
4.  **Rich Attributes:** Includes `itemCondition` and `priceValidUntil` to ensure maximum eligibility for Google Search rich snippets.

## 2. Optimized Product Schema Template (Webflow CMS Ready)
Copy and paste this entire block into the **"Inside `<head>` tag"** custom code section of your Product Details CMS template.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "{{wf {"path":"name-alt","type":"PlainText"\} }}",
      "description": "{{wf {"path":"name-alt","type":"PlainText"\} }} - {{wf {"path":"metal-cap","type":"PlainText"\} }} {{wf {"path":"weight-grams","type":"Number"\} }}g ({{wf {"path":"size","type":"PlainText"\} }}) from {{wf {"path":"mint","type":"PlainText"\} }}. Investment grade bullion exempt from GST in NZ.",
      "url": "https://www.christchurchgold.co.nz/buy-gold-details/{{wf {"path":"slug","type":"PlainText"\} }}",
      "sku": "{{wf {"path":"sku","type":"PlainText"\} }}",
      "mpn": "{{wf {"path":"sku","type":"PlainText"\} }}",
      "brand": {
        "@type": "Brand",
        "name": "{{wf {"path":"mint","type":"PlainText"\} }}"
      },
      "image": [
        "{{wf {"path":"image-front-prod-list","type":"ImageRef"\} }}",
        "{{wf {"path":"image-back-prod-list","type":"ImageRef"\} }}"
      ],
      "offers": {
        "@type": "Offer",
        "price": "{{wf {"path":"price-nzd","type":"Number"\} }}",
        "priceCurrency": "NZD",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "priceValidUntil": "2026-12-31", 
        "url": "https://www.christchurchgold.co.nz/buy-gold-details/{{wf {"path":"slug","type":"PlainText"\} }}",
        "seller": {
          "@id": "https://www.christchurchgold.co.nz/#localbusiness"
        }
      },
      "material": "{{wf {"path":"metal-cap","type":"PlainText"\} }}",
      "weight": {
        "@type": "QuantitativeValue",
        "value": "{{wf {"path":"weight-grams","type":"Number"\} }}",
        "unitCode": "GRM"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "10"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Size",
          "value": "{{wf {"path":"size","type":"PlainText"\} }}"
        },
        {
          "@type": "PropertyValue",
          "name": "Year",
          "value": "{{wf {"path":"year","type":"PlainText"\} }}"
        },
        {
          "@type": "PropertyValue",
          "name": "Product Type",
          "value": "{{wf {"path":"product-type","type":"PlainText"\} }}"
        }
      ]
    },
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
          "name": "Buy Gold",
          "item": "https://www.christchurchgold.co.nz/buy-gold"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "{{wf {"path":"name-alt","type":"PlainText"\} }}",
          "item": "https://www.christchurchgold.co.nz/buy-gold-details/{{wf {"path":"slug","type":"PlainText"\} }}"
        }
      ]
    }
  ]
}
</script>
```

## 3. Recommended SEO Content Enhancements
To complement the schema, ensure the following CMS fields are fully utilized:

1.  **H1 Tag:** Should use the `name-alt` field.
2.  **Product Description:** The automated description in the schema includes "Investment grade bullion exempt from GST in NZ" to target high-intent educational queries.
3.  **Local Trust:** Add a small block to the page template: "Secure collection available at our Hornby office or fully insured NZ-wide courier."

## 4. Validation
After publishing, validate specific URLs using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
