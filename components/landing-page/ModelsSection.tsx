'use client';

import Link from 'next/link';
import { modelsData } from '@/app/models/data';
import ModelCard from '@/components/models/ModelCard';

export default function ModelsSection() {
    // Sélectionner les 5 premiers modèles pour l'affichage
    const displayModels = modelsData.slice(0, 5);

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Arc Layout Container - Responsive */}
                {/* On mobile: gap-2, height adjusted. On desktop: gap-8 */}
                <div className="flex justify-center items-end gap-2 md:gap-8 mb-16  pt-10 md:pt-20">
                    {displayModels.map((model, index) => {
                        // Calcul des transformations pour l'effet d'arc
                        // Index 2 est le centre (0, 1, [2], 3, 4)
                        const offsetFromCenter = index - 2;
                        const rotate = offsetFromCenter * 5; // -10, -5, 0, 5, 10 degrés
                        const translateY = Math.abs(offsetFromCenter) * 30; // 60px, 30px, 0px, 30px, 60px

                        // Masquer les éléments extérieurs (0 et 4) sur mobile pour n'en garder que 3
                        const isHiddenOnMobile = index === 0 || index === 4;

                        return (
                            <div
                                key={model.id}
                                className={`
                                    transition-all duration-500 hover:z-50 hover:scale-110
                                    w-32 sm:w-40 md:w-64
                                    ${isHiddenOnMobile ? 'hidden md:block' : 'block'}
                                `}
                                style={{
                                    transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                                    zIndex: 10 - Math.abs(offsetFromCenter) // Le centre est au-dessus (10, 9, 8...)
                                }}
                            >
                                <ModelCard
                                    id={model.id}
                                    image={model.image}
                                    titre={model.titre}
                                    description={model.description}
                                    prix={model.prix}
                                    width={model.width}
                                    height={model.height}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center max-w-2xl mx-auto py-10 md:py-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6 md:mb-8 text-gray-900">
                        Prêt à Créer Votre Tenue Sur Mesure ?
                    </h2>
                    <Link
                        href="/models"
                        className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                    >
                        Découvrir nos modèles
                    </Link>
                </div>

            </div>
        </section>
    );
}
