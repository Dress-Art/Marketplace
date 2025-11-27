'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/models/Header';
import Image from 'next/image';
import Link from 'next/link';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import { modelsData } from '@/app/models/data';
import { tissusData } from '@/app/models/tissus-data';
import TissuCard from '@/components/models/TissuCard';
import FabricIcon from '@/components/icons/FabricIcon';

interface TissusClientProps {
    id: string;
}

export default function TissusClient({ id }: TissusClientProps) {
    const router = useRouter();
    const modelId = parseInt(id);
    const model = modelsData.find(m => m.id === modelId);

    if (!model) {
        return <div>Modèle non trouvé</div>;
    }

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

            {/* Header fixe */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Main content */}
            <main className="min-h-screen pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
                    {/* Colonne modèle (1 colonne) */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="lg:sticky lg:top-20 p-4 border border-gray-300 rounded-3xl">
                            <div className="relative w-full rounded-2xl overflow-hidden">
                                <Image
                                    src={model.image}
                                    alt={model.titre}
                                    width={model.width}
                                    height={model.height}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold mb-2">{model.titre}</h1>
                                <p className="text-gray-600">{model.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Colonnes tissus (Responsive) */}
                    <div className="col-span-1 lg:col-span-4">
                        <h2 className="text-2xl font-bold mb-6">Choisissez votre tissu</h2>

                        {/* Option "J'ai mon propre tissu" */}
                        <Link href={`/models/${id}/tissus/own/mesure`}>
                            <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-3xl hover:border-gray-900 transition-all cursor-pointer group bg-gray-50 hover:bg-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FabricIcon size={24} className="text-gray-900" />
                                            <h3 className="text-xl font-bold group-hover:text-gray-900">
                                                J'ai mon propre tissu
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

                        {/* Vue XL (4 colonnes) */}
                        <div className="hidden xl:flex gap-4 items-start">
                            {Array.from({ length: 4 }).map((_, colIndex) => (
                                <div key={colIndex} className="flex-1 flex flex-col gap-4">
                                    {tissusData
                                        .filter((_, index) => index % 4 === colIndex)
                                        .map((tissu) => (
                                            <TissuCard key={tissu.id} tissu={tissu} modelId={id} />
                                        ))}
                                </div>
                            ))}
                        </div>

                        {/* Vue LG (3 colonnes) */}
                        <div className="hidden lg:flex xl:hidden gap-4 items-start">
                            {Array.from({ length: 3 }).map((_, colIndex) => (
                                <div key={colIndex} className="flex-1 flex flex-col gap-4">
                                    {tissusData
                                        .filter((_, index) => index % 3 === colIndex)
                                        .map((tissu) => (
                                            <TissuCard key={tissu.id} tissu={tissu} modelId={id} />
                                        ))}
                                </div>
                            ))}
                        </div>

                        {/* Vue MD (2 colonnes) hidden md:*/}
                        <div className="flex lg:hidden gap-4 items-start">
                            {Array.from({ length: 2 }).map((_, colIndex) => (
                                <div key={colIndex} className="flex-1 flex flex-col gap-4">
                                    {tissusData
                                        .filter((_, index) => index % 2 === colIndex)
                                        .map((tissu) => (
                                            <TissuCard key={tissu.id} tissu={tissu} modelId={id} />
                                        ))}
                                </div>
                            ))}
                        </div>

                        {/* Vue Mobile/SM (1 colonne) */}
                        {/* <div className="flex md:hidden gap-4 items-start">
                            <div className="flex-1 flex flex-col gap-4">
                                {tissusData.map((tissu) => (
                                    <TissuCard key={tissu.id} tissu={tissu} modelId={id} />
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}
