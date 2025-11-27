import type { Metadata } from 'next';
import Header from '@/components/models/Header';
import { seoConfig, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
    title: 'Suivi de Commande',
    description: 'Suivez l\'état de votre commande DressArt en temps réel. Entrez votre numéro de commande pour voir l\'avancement de votre vêtement sur mesure.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: getCanonicalUrl('/suivi'),
    },
};

export default function SuiviPage() {
    return (
        <div className="min-h-screen relative">
            {/* Header fixe */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Main content */}
            <main className="min-h-screen pt-16">
                <div className="max-w-4xl mx-auto p-4 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
                        <p className="text-gray-600">Entrez votre numéro de commande pour suivre votre commande</p>
                    </div>

                    {/* Formulaire de recherche */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Numéro de commande</label>
                                <input
                                    type="text"
                                    placeholder="Ex: CMD-2024-001"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all cursor-pointer"
                            >
                                Suivre ma commande
                            </button>
                        </form>
                    </div>

                    {/* Section d'information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2">Comment suivre votre commande ?</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• Vous avez reçu un numéro de commande par SMS après validation de votre paiement</li>
                            <li>• Utilisez ce numéro pour suivre l'état actuel de votre commande</li>
                            <li>• Le suivi vous permet de voir l'état de fabrication et la date estimée de livraison</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
