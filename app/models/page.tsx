'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/models/Header';
import ModelCard from '@/components/models/ModelCard';
import Filters from '@/components/models/Filters';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import { modelsData } from './data';

const ITEMS_PER_PAGE = 8; // Nombre de modèles à charger à chaque fois

export default function ModelsPage() {
    const router = useRouter();
    
    // États pour les filtres
    const [selectedType, setSelectedType] = useState('');
    const [selectedDesigner, setSelectedDesigner] = useState('');
    const [priceRange, setPriceRange] = useState('');
    
    // États pour l'infinite scroll
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

    // Réinitialiser le compte quand les filtres changent
    useEffect(() => {
        setDisplayCount(ITEMS_PER_PAGE);
    }, [selectedType, selectedDesigner, priceRange]);

    // Modèles à afficher (avec pagination)
    const displayedModels = useMemo(() => {
        return filteredModels.slice(0, displayCount);
    }, [filteredModels, displayCount]);

    const hasMore = displayCount < filteredModels.length;

    // Fonction pour charger plus de modèles
    const loadMore = () => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        // Simuler un délai de chargement (optionnel)
        setTimeout(() => {
            setDisplayCount(prev => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
        }, 500);
    };

    // Intersection Observer pour détecter le scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, isLoading]);

    // Distribution pour 5 colonnes (XL)
    const columns5 = Array.from({ length: 5 }, () => [] as typeof modelsData);
    displayedModels.forEach((model, index) => {
        columns5[index % 5].push(model);
    });

    // Distribution pour 3 colonnes (LG)
    const columns3 = Array.from({ length: 3 }, () => [] as typeof modelsData);
    displayedModels.forEach((model, index) => {
        columns3[index % 3].push(model);
    });

    // Distribution pour 2 colonnes (MD)
    const columns2 = Array.from({ length: 2 }, () => [] as typeof modelsData);
    displayedModels.forEach((model, index) => {
        columns2[index % 2].push(model);
    });

    // Distribution pour 1 colonne (Mobile/SM)
    const columns1 = [displayedModels];

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

                {/* Loader et trigger pour infinite scroll */}
                {filteredModels.length > 0 && (
                    <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                        {isLoading && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                                <p className="text-sm text-gray-600">Chargement...</p>
                            </div>
                        )}
                        {!hasMore && displayedModels.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Tous les modèles ont été chargés ({filteredModels.length} au total)
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
