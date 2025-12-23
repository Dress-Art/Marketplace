import Link from 'next/link';
import Header from '@/components/models/Header';

export const metadata = {
    title: 'Paiement Réussi | DressArt',
    description: 'Votre paiement a été effectué avec succès',
};

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="min-h-screen pt-24 pb-12 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Paiement réussi !
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Votre commande a été confirmée avec succès. Vous recevrez un SMS avec votre numéro de suivi dans quelques instants.
                        </p>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
                            <h3 className="font-bold text-blue-900 mb-2">Prochaines étapes</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>✓ Vous recevrez un SMS de confirmation</li>
                                <li>✓ Votre numéro de commande vous sera envoyé</li>
                                <li>✓ Vous pourrez suivre votre commande en temps réel</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link
                                href="/suivi"
                                className="block w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all"
                            >
                                Suivre ma commande
                            </Link>
                            <Link
                                href="/models"
                                className="block w-full bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-all"
                            >
                                Retour aux modèles
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
