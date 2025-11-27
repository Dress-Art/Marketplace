'use client';

import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="my-20 py-24 bg-gray-900 text-white overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
                    Votre Style, Votre Signature
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                    Ne vous contentez pas de suivre la mode. Créez la vôtre avec nos artisans experts et nos tissus d'exception.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/models"
                        className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                    >
                        Commencer la création
                    </Link>
                </div>
            </div>
        </section>
    );
}
