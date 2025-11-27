import MesureClient from './MesureClient';

export default async function MesurePage({ params }: { params: Promise<{ id: string; tissuId: string }> }) {
    // Simulation de chargement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { id, tissuId } = await params;

    return <MesureClient id={id} tissuId={tissuId} />;
}
