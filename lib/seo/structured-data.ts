/**
 * JSON-LD Structured Data Utilities
 * Generate structured data for better SEO and rich snippets
 */

import { seoConfig } from './config';

/**
 * Organization schema for the site
 */
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}/logo.png`,
        sameAs: [
            seoConfig.social.facebook,
            seoConfig.social.instagram,
            seoConfig.social.twitter,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['French'],
        },
    };
}

/**
 * Website schema
 */
export function getWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description: seoConfig.defaultDescription,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Product schema for individual models
 */
export function getProductSchema(product: {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: `${seoConfig.siteUrl}${product.image}`,
        url: `${seoConfig.siteUrl}${product.url}`,
        brand: {
            '@type': 'Brand',
            name: seoConfig.siteName,
        },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
        },
    };
}

/**
 * Breadcrumb schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${seoConfig.siteUrl}${item.url}`,
        })),
    };
}

/**
 * Helper to render JSON-LD script tag
 */
export function renderJsonLd(data: object) {
    return {
        __html: JSON.stringify(data),
    };
}
