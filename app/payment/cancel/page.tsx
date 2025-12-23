import Link from 'next/link';
import Header from '@/components/models/Header';

export const metadata = {
    title: 'Paiement Annulé | DressArt',
    description: 'Votre paiement a été annulé',
};

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="min-h-screen pt-24 pb-12 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
                        {/* Cancel Icon */}
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        {/* Cancel Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Paiement annulé
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
                        </p>

                        {/* Info Box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-left">
                            <h3 className="font-bold text-gray-900 mb-2">Que faire maintenant ?</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Vous pouvez réessayer le paiement</li>
                                <li>• Vérifiez vos informations bancaires</li>
                                <li>• Contactez-nous si vous avez besoin d'aide</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link
                                href="/models"
                                className="block w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all"
                            >
                                Retour aux modèles
                            </Link>
                            <Link
                                href="/"
                                className="block w-full bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-all"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
