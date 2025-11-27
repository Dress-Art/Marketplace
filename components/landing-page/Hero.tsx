'use client';

import Link from 'next/link';
import Image from 'next/image';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

// Composant Avatar pour les avis
const Avatar = ({ color, initial }: { color: string, initial: string }) => (
    <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${color} -ml-4 first:ml-0`}>
        {initial}
    </div>
);

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">

            <div className="container mx-auto px-4 h-full relative flex flex-col justify-center items-center">

                {/* Unified Title - Behind Image, Higher up and Smaller */}
                <h1 className="absolute flex max-sm:flex-col justify-between max-w-6xl px-4 z-0 max-sm:top-[10%] top-[20%] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900 font-playfair whitespace-nowrap text-center w-full">
                    <span>Créez Votre</span>
                    <span>Style Unique</span>
                </h1>

                {/* Center Image - On Top */}
                <div className="relative z-10 w-[400px] h-[600px] md:w-[500px] md:h-[800px] shrink-0 max-sm:mt-40 max-md:mt-60 mt-20">
                    <Image
                        src="/landing-page/modele.png"
                        alt="Modèle DressArt"
                        fill
                        className="object-contain drop-shadow-2xl scale-x-[-1]"
                        priority
                    />
                </div>

                {/* Floating Elements - Bottom Corners */}

                {/* Description - Bottom Left */}
                <div className="absolute left-4 bottom-40 md:left-10 md:bottom-80 max-w-md z-20 hidden lg:block">
                    <p className="text-gray-600 text-lg font-medium leading-relaxed">
                        Découvrez notre collection de vêtements sur mesure. Choisissez votre modèle, sélectionnez votre tissu, et laissez-nous créer la pièce parfaite pour vous.
                    </p>
                </div>

                {/* Buttons & Reviews - Bottom Right */}
                <div className="absolute right-4 bottom-10 md:right-10 md:bottom-30 z-20 flex flex-col items-end gap-6 hidden lg:flex">

                    {/* Reviews Section (First) */}
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="flex items-center pl-2">
                            <Avatar color="bg-purple-500" initial="JD" />
                            <Avatar color="bg-blue-500" initial="AS" />
                            <Avatar color="bg-pink-500" initial="MK" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900">Pour ceux qui créent</span>
                            <span className="text-xs text-gray-500">la tendance, pas ceux qui la suivent</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center rotate-180">
                            <ArrowLeftIcon size={14} className="text-gray-900" />
                        </div>
                    </div>

                    {/* Action Buttons (Below Reviews) */}
                    <div className="flex flex-col gap-4 items-end">
                        <Link
                            href="/models"
                            className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                        >
                            <span>Découvrir</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            href="/suivi"
                            className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:border-gray-900 transition-all hover:scale-105"
                        >
                            Suivre
                        </Link>
                    </div>
                </div>

                {/* Mobile/Tablet Layout Adjustments */}
                <div className="lg:hidden flex flex-col items-center gap-6 mt-8 z-20 relative pb-10">
                    <p className="text-center text-gray-600 max-w-md px-4">
                        L'élégance du sur-mesure à portée de main.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/models"
                            className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold"
                        >
                            Découvrir
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
