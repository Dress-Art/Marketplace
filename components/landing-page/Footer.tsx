'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white pt-20 pb-10 overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 items-start">

                    {/* Links Column 1 */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <h4 className="font-bold text-lg mb-2">Navigation</h4>
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Accueil</Link>
                        <Link href="/models" className="text-gray-600 hover:text-gray-900 transition-colors">Modèles</Link>
                        <Link href="/suivi" className="text-gray-600 hover:text-gray-900 transition-colors">Suivi</Link>
                    </div>

                    {/* Center - Empty for now as the big title will take visual precedence below */}
                    <div className="hidden md:block"></div>

                    {/* Links Column 2 */}
                    <div className="flex flex-col gap-4 items-center md:items-end">
                        <h4 className="font-bold text-lg mb-2">Légal</h4>
                        <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Mentions Légales</Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Confidentialité</Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">CGV</Link>
                    </div>
                </div>

                {/* Big Title */}
                <div className="relative flex justify-center items-center py-10 border-t border-gray-100">
                    <h1 className="text-[12vw] leading-none font-bold font-playfair text-gray-900 tracking-tighter select-none">
                        DressArt
                    </h1>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm mt-8">
                    &copy; {currentYear} DressArt. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
