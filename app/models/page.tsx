'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/models/Header';
import ModelCard from '@/components/models/ModelCard';
import Filters from '@/components/models/Filters';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import { modelsData } from './data';

export default function ModelsPage() {
    const router = useRouter();
    
    // États pour les filtres
    const [selectedType, setSelectedType] = useState('');
    const [selectedDesigner, setSelectedDesigner] = useState('');
    const [priceRange, setPriceRange] = useState('');

    // Extraire les types et designers uniques
    const types = useMemo(() => {
        return Array.from(new Set(modelsData.map(m => m.type))).sort();
    }, []);

    const designers = useMemo(() => {
        return Array.from(new Set(modelsData.map(m => m.designer))).sort();
    }, []);

    // Filtrer les modèles
    const filteredModels = useMemo(() => {
        return modelsData.filter(model => {
            // Filtre par type
            if (selectedType && model.type !== selectedType) {
                return false;
            }

            // Filtre par designer
            if (selectedDesigner && model.designer !== selectedDesigner) {
                return false;
            }

            // Filtre par prix
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                if (model.prix < min || model.prix > max) {
                    return false;
                }
            }

            return true;
        });
    }, [selectedType, selectedDesigner, priceRange]);

    // Distribution pour 5 colonnes (XL)
    const columns5 = Array.from({ length: 5 }, () => [] as typeof modelsData);
    filteredModels.forEach((model, index) => {
        columns5[index % 5].push(model);
    });

    // Distribution pour 3 colonnes (LG)
    const columns3 = Array.from({ length: 3 }, () => [] as typeof modelsData);
    filteredModels.forEach((model, index) => {
        columns3[index % 3].push(model);
    });

    // Distribution pour 2 colonnes (MD)
    const columns2 = Array.from({ length: 2 }, () => [] as typeof modelsData);
    filteredModels.forEach((model, index) => {
        columns2[index % 2].push(model);
    });

    // Distribution pour 1 colonne (Mobile/SM)
    const columns1 = [filteredModels];

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
                {/* Filtres */}
                <div className="px-4 mb-4">
                    <Filters
                        selectedType={selectedType}
                        selectedDesigner={selectedDesigner}
                        priceRange={priceRange}
                        onTypeChange={setSelectedType}
                        onDesignerChange={setSelectedDesigner}
                        onPriceRangeChange={setPriceRange}
                        types={types}
                        designers={designers}
                    />
                    
                    {/* Compteur de résultats */}
                    <div className="text-sm text-gray-600 mb-2">
                        {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''} trouvé{filteredModels.length > 1 ? 's' : ''}
                    </div>
                </div>

                {/* Message si aucun résultat */}
                {filteredModels.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun modèle trouvé</h3>
                        <p className="text-gray-600 mb-4">Essayez de modifier vos filtres pour voir plus de résultats</p>
                        <button
                            onClick={() => {
                                setSelectedType('');
                                setSelectedDesigner('');
                                setPriceRange('');
                            }}
                            className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all cursor-pointer"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

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
