import React, { useEffect } from 'react';

const SEO = ({
  title = 'PromoteHub | India’s Premier Deals, Coupons & Cashback Platform',
  description = 'Discover verified promo codes, hot deals, exclusive coupons, and real cashback offers from Amazon, Flipkart, Myntra, Swiggy, and 500+ top Indian brands.',
  keywords = 'deals, coupons, promo codes, cashback, festival sale, indian discounts, shopping offers',
  ogImage = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
  canonicalUrl,
  schema
}) => {
  useEffect(() => {
    // Dynamic document title
    document.title = title.includes('PromoteHub') ? title : `${title} | PromoteHub`;

    // Dynamic meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Structured JSON-LD
    const scriptId = 'promotehub-structured-data';
    let scriptTag = document.getElementById(scriptId);

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PromoteHub',
      url: window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schema || defaultSchema);

    return () => {
      // Clean up script on unmount
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, schema]);

  return null;
};

export default SEO;
