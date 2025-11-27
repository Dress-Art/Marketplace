import type { Metadata } from 'next';
import { seoConfig, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
    title: 'Nos Modèles',
    description: 'Découvrez notre collection exclusive de modèles de vêtements sur mesure. Robes, chemises, pantalons et plus encore. Choisissez votre style et personnalisez-le avec vos tissus préférés.',
    keywords: [
        ...seoConfig.keywords,
        'collection',
        'modèles de vêtements',
        'catalogue mode',
        'robes sur mesure',
    ],
    openGraph: {
        title: 'Nos Modèles - DressArt',
        description: 'Explorez notre collection de modèles exclusifs et créez votre vêtement sur mesure.',
        url: getCanonicalUrl('/models'),
        type: 'website',
        images: seoConfig.openGraph.images,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nos Modèles - DressArt',
        description: 'Explorez notre collection de modèles exclusifs et créez votre vêtement sur mesure.',
        images: seoConfig.openGraph.images,
    },
    alternates: {
        canonical: getCanonicalUrl('/models'),
    },
};

export default function ModelsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
