import type { Metadata } from 'next';
import MesureClient from './MesureClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string; tissuId: string }> }): Promise<Metadata> {
    const { id, tissuId } = await params;

    return {
        title: `Choix de prise de mesure - ${decodeURIComponent(id)}`,
        description: `Choisissez entre la prise de mesures en ligne et la prise de rendez-vous pour votre ${decodeURIComponent(id)} en ${decodeURIComponent(tissuId)}.`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function MesurePage({ params }: { params: Promise<{ id: string; tissuId: string }> }) {
    const { id, tissuId } = await params;

    return <MesureClient id={id} tissuId={tissuId} />;
}
