'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ProCallout() {
    return (
        <section className="py-20 md:py-28 bg-[#f5f1ec] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Image — colonne gauche, asymétrique */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="/landing-page/khalifa.png"
                                alt="Couturier au travail"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Étiquette flottante — chiffre symbolique */}
                        <div className="absolute -top-4 -right-2 sm:right-4 lg:-right-4 bg-gray-900 text-white rounded-2xl px-5 py-3 shadow-lg rotate-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Atelier connecté</p>
                            <p className="text-sm font-bold">+ de clients, — de paperasse</p>
                        </div>
                    </div>

                    {/* Texte — colonne droite */}
                    <div className="lg:col-span-7 flex flex-col gap-6 max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
                            <span className="w-8 h-px bg-gray-400" />
                            Espace Pro
                        </span>

                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-playfair text-gray-900 leading-[1.05] tracking-tight">
                            Vous créez.<br />
                            <span className="italic text-gray-700">Nous amenons</span> les clients.
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Couturier·e, styliste, atelier : DressArt vous donne une vitrine nationale,
                            des outils de gestion simples et des paiements sécurisés. Vous gardez la main
                            sur vos prix, vos délais, votre style.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link
                                href="/pro"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-all hover:scale-105 shadow-lg"
                            >
                                Découvrir l&apos;espace pro
                                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                            </Link>
                            <Link
                                href="/pro#comment-ca-marche"
                                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-gray-900 border border-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
                            >
                                Comment ça marche
                            </Link>
                        </div>

                        {/* Trio de chiffres / arguments brefs */}
                        <div className="grid grid-cols-3 gap-4 pt-8 mt-4 border-t border-gray-300">
                            <div>
                                <p className="text-2xl md:text-3xl font-bold font-playfair text-gray-900">0 FCFA</p>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Inscription</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold font-playfair text-gray-900">5 min</p>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Pour démarrer</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold font-playfair text-gray-900">100%</p>
                                <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Liberté tarifaire</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
