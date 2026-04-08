'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import { useModels } from '@/lib/hooks/useModels';
import { useFabrics } from '@/lib/hooks/useFabrics';
import { slugify } from '@/lib/utils/slugify';
import TissuCard from '@/components/models/TissuCard';
import FabricIcon from '@/components/icons/FabricIcon';

interface TissusClientProps {
    id: string;
}

export default function TissusClient({ id }: TissusClientProps) {
    const router = useRouter();
    const [selectedTissuId, setSelectedTissuId] = useState<string | null>(null);
    const [selectedTissuSlug, setSelectedTissuSlug] = useState<string | null>(null);

    // Fetch models from API
    const { models, loading: modelsLoading } = useModels({
        page: 1,
        per_page: 100,
    });

    const model = useMemo(() => models.find(m => slugify(m.nom) === id), [models, id]);

    // Fetch fabrics from API
    const { fabrics, loading: fabricsLoading, error } = useFabrics({
        page: 1,
        per_page: 50, // Get more for selection
    });

    const loading = modelsLoading || fabricsLoading;

    const handleSelectTissu = (tissuId: string) => {
        if (selectedTissuId === tissuId) {
            setSelectedTissuId(null);
            setSelectedTissuSlug(null);
        } else {
            const fabric = fabrics.find(f => f.id === tissuId);
            setSelectedTissuId(tissuId);
            setSelectedTissuSlug(fabric ? slugify(fabric.nom) : tissuId);
        }
    };

    const handleConfirm = () => {
        if (selectedTissuSlug) {
            router.push(`/models/${id}/tissus/${selectedTissuSlug}/mesure`);
        }
    };

    if (!model) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    {loading ? (
                        <>
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement...</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl text-gray-600">Modèle non trouvé</p>
                            <button
                                onClick={() => router.push('/models')}
                                className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all"
                            >
                                Retour aux modèles
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const tissusData = fabrics.map(fabric => ({
        id: fabric.id,
        nom: fabric.nom,
        texture: fabric.texture || '',
        prix: fabric.prix_metre,
        image: fabric.image_url || '/models/placeholder.svg',
        width: 400,
        height: 300,
    }));

    return (
        <div className="min-h-screen relative">
            {/* Bouton retour */}
            <div className="fixed top-14 left-6 z-[60]">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer bg-white shadow-sm"
                    aria-label="Retour"
                >
                    <ArrowLeftIcon size={24} className="text-gray-700" />
                </button>
            </div>

            {/* Main content */}
            <main className="min-h-screen pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 lg:p-8">
                    {/* Colonne modèle */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="lg:sticky lg:top-20 p-4 border border-gray-300 rounded-3xl">
                            <div className="relative w-full rounded-2xl overflow-hidden">
                                <Image
                                    src={model.image_url || '/models/placeholder.svg'}
                                    alt={model.nom}
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold mb-2">{model.nom}</h1>
                                <p className="text-gray-600 mb-4">{model.description}</p>
                                <div className="flex items-center gap-2 bg-gray-900 text-white rounded-2xl px-5 py-3 w-fit">
                                    <span className="text-sm font-medium opacity-70">À partir de</span>
                                    <span className="text-xl font-bold">{model.prix_base.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonnes tissus */}
                    <div className="col-span-1 lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-6">Choisissez votre tissu</h2>

                        {/* Option "J'ai mon propre tissu" */}
                        <Link href={`/models/${id}/tissus/own/mesure`}>
                            <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-3xl hover:border-gray-900 transition-all cursor-pointer group bg-gray-50 hover:bg-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FabricIcon size={24} className="text-gray-900" />
                                            <h3 className="text-xl font-bold group-hover:text-gray-900">
                                                J&apos;ai mon propre tissu
                                            </h3>
                                        </div>
                                        <p className="text-gray-600">
                                            Vous avez déjà votre tissu ? Cliquez ici pour continuer directement avec vos mesures.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <svg
                                            className="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Ou choisissez parmi nos tissus :</p>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Chargement des tissus...</p>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800">Erreur: {error}</p>
                            </div>
                        )}

                        {/* Barre de confirmation fixe en bas */}
                        {selectedTissuId && (
                            <div className="fixed bottom-0 left-0 right-0 z-50 lg:bottom-6 lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2 lg:w-auto">
                                {/* Mobile : barre pleine largeur avec modèle + tissu */}
                                <div className="lg:hidden bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={model.image_url || '/models/placeholder.svg'}
                                                alt={model.nom}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 truncate">Modèle sélectionné</p>
                                            <p className="font-bold text-gray-900 truncate">{model.nom}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs text-gray-500">Tissu</p>
                                            <p className="font-semibold text-gray-900 text-sm truncate max-w-[100px]">
                                                {fabrics.find(f => f.id === selectedTissuId)?.nom}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleConfirm}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Continuer
                                    </button>
                                </div>

                                {/* Desktop : bouton pill centré */}
                                <button
                                    onClick={handleConfirm}
                                    className="hidden lg:flex bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 items-center gap-3"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirmer mon choix
                                </button>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${selectedTissuId ? 'pb-36 lg:pb-0' : ''}`}>
                                {tissusData.map((tissu) => (
                                    <TissuCard
                                        key={tissu.id}
                                        tissu={tissu}
                                        modelId={id}
                                        isSelected={selectedTissuId === tissu.id}
                                        onSelect={handleSelectTissu}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
