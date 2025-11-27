import TissusClient from './TissusClient';

export default async function TissusPage({ params }: { params: Promise<{ id: string }> }) {
    // Simulation de chargement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { id } = await params;

    return <TissusClient id={id} />;
}
