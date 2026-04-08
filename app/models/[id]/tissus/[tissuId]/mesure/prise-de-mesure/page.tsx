import type { Metadata } from 'next';
import PriseDeMesureClient from './PriseDeMesureClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string; tissuId: string }> }): Promise<Metadata> {
    const { id, tissuId } = await params;

    return {
        title: `Prise de mesure en ligne - ${decodeURIComponent(id)}`,
        description: `Renseignez vos mesures sur une page dediee pour votre ${decodeURIComponent(id)} en ${decodeURIComponent(tissuId)}.`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function PriseDeMesurePage({ params }: { params: Promise<{ id: string; tissuId: string }> }) {
    const { id, tissuId } = await params;

    return <PriseDeMesureClient id={id} tissuId={tissuId} />;
}
