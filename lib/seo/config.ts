/**
 * Centralized SEO Configuration for DressArt
 * Contains all default SEO values, site information, and metadata constants
 */

export const seoConfig = {
    // Site Information
    siteName: 'DressArt',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dressart.com',

    // Default Metadata
    defaultTitle: 'DressArt - Marketplace de Mode Sur Mesure',
    defaultDescription: 'Découvrez DressArt, votre marketplace pour créer des vêtements sur mesure. Choisissez parmi nos modèles exclusifs, sélectionnez vos tissus préférés et commandez votre création unique.',

    // Social Media
    social: {
        twitter: '@DressArt',
        facebook: 'https://facebook.com/dressart',
        instagram: 'https://instagram.com/dressart',
    },

    // Open Graph Defaults
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: 'DressArt',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'DressArt - Mode Sur Mesure',
            },
        ],
    },

    // Twitter Card Defaults
    twitter: {
        card: 'summary_large_image',
        site: '@DressArt',
        creator: '@DressArt',
    },

    // Keywords
    keywords: [
        'mode sur mesure',
        'vêtements personnalisés',
        'marketplace mode',
        'tissus premium',
        'création vêtements',
        'couture sur mesure',
        'fashion marketplace',
    ],
};

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${seoConfig.siteUrl}${cleanPath}`;
}

/**
 * Generate page title with site name
 */
export function generateTitle(pageTitle: string): string {
    return `${pageTitle} | ${seoConfig.siteName}`;
}
