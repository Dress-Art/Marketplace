import type { Metadata } from 'next';
import MesureClient from './MesureClient';
import { seoConfig } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ id: string; tissuId: string }> }): Promise<Metadata> {
    const { id, tissuId } = await params;

    return {
        title: `Prendre mes mesures - ${decodeURIComponent(id)}`,
        description: `Page de prise de mesures personnalisées pour votre ${decodeURIComponent(id)} en ${decodeURIComponent(tissuId)}.`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function MesurePage({ params }: { params: Promise<{ id: string; tissuId: string }> }) {
    // Simulation de chargement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { id, tissuId } = await params;

    return <MesureClient id={id} tissuId={tissuId} />;
}
