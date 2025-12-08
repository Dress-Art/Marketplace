'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/models/Header';
import ModelCard from '@/components/models/ModelCard';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import { modelsData } from './data';

export default function ModelsPage() {
    const router = useRouter();

    // Distribution pour 5 colonnes (XL)
    const columns5 = Array.from({ length: 5 }, () => [] as typeof modelsData);
    modelsData.forEach((model, index) => {
        columns5[index % 5].push(model);
    });

    // Distribution pour 3 colonnes (LG)
    const columns3 = Array.from({ length: 3 }, () => [] as typeof modelsData);
    modelsData.forEach((model, index) => {
        columns3[index % 3].push(model);
    });

    // Distribution pour 2 colonnes (MD)
    const columns2 = Array.from({ length: 2 }, () => [] as typeof modelsData);
    modelsData.forEach((model, index) => {
        columns2[index % 2].push(model);
    });

    // Distribution pour 1 colonne (Mobile/SM)
    const columns1 = [modelsData];

    return (
        <div className="min-h-screen relative">
            {/* Bouton retour */}
            <div className="fixed top-14 left-4 z-[60]">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border border-gray-200 bg-white shadow-sm"
                    aria-label="Retour"
                >
                    <ArrowLeftIcon size={24} className="text-gray-700" />
                </button>
            </div>

            {/* Header fixe */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Main content - Masonry Layout Responsif */}
            <main className="min-h-screen pt-20">
                {/* Vue XL (5 colonnes) */}
                <div className="hidden xl:flex gap-4 p-4 items-start">
                    {columns5.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((model) => (
                                <ModelCard
                                    key={model.id}
                                    id={model.id}
                                    image={model.image}
                                    titre={model.titre}
                                    description={model.description}
                                    prix={model.prix}
                                    width={model.width}
                                    height={model.height}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Vue LG (3 colonnes) */}
                <div className="hidden lg:flex xl:hidden gap-4 p-4 items-start">
                    {columns3.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((model) => (
                                <ModelCard
                                    key={model.id}
                                    id={model.id}
                                    image={model.image}
                                    titre={model.titre}
                                    description={model.description}
                                    prix={model.prix}
                                    width={model.width}
                                    height={model.height}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Vue MD (2 colonnes) hidden md:*/}
                <div className="flex lg:hidden gap-4 p-4 items-start">
                    {columns2.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((model) => (
                                <ModelCard
                                    key={model.id}
                                    id={model.id}
                                    image={model.image}
                                    titre={model.titre}
                                    description={model.description}
                                    prix={model.prix}
                                    width={model.width}
                                    height={model.height}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Vue Mobile/SM (1 colonne) */}
                {/* <div className="flex md:hidden gap-4 p-4 items-start">
                    {columns1.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((model) => (
                                <ModelCard
                                    key={model.id}
                                    id={model.id}
                                    image={model.image}
                                    titre={model.titre}
                                    description={model.description}
                                    width={model.width}
                                    height={model.height}
                                />
                            ))}
                        </div>
                    ))}
                </div> */}
            </main>
        </div>
    );
}
