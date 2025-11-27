import type { Metadata } from 'next';
import TissusClient from './TissusClient';
import { seoConfig, getCanonicalUrl } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    return {
        title: `Tissus pour ${decodeURIComponent(id)}`,
        description: `Sélectionnez le tissu parfait pour votre ${decodeURIComponent(id)}. Large choix de tissus premium: coton, soie, lin et plus encore.`,
        openGraph: {
            title: `Tissus pour ${decodeURIComponent(id)} - DressArt`,
            description: `Choisissez le tissu idéal pour votre ${decodeURIComponent(id)} sur mesure.`,
            url: getCanonicalUrl(`/models/${id}/tissus`),
            type: 'website',
            images: seoConfig.openGraph.images,
        },
        twitter: {
            card: 'summary_large_image',
            title: `Tissus pour ${decodeURIComponent(id)} - DressArt`,
            description: `Choisissez le tissu idéal pour votre ${decodeURIComponent(id)} sur mesure.`,
            images: seoConfig.openGraph.images,
        },
        alternates: {
            canonical: getCanonicalUrl(`/models/${id}/tissus`),
        },
    };
}

export default async function TissusPage({ params }: { params: Promise<{ id: string }> }) {
    // Simulation de chargement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { id } = await params;

    return <TissusClient id={id} />;
}
