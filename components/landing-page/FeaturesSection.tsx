'use client';

import SpeedIcon from '@/components/icons/SpeedIcon';
import PaymentIcon from '@/components/icons/PaymentIcon';
import TrackingIcon from '@/components/icons/TrackingIcon';

export default function FeaturesSection() {
    const features = [
        {
            title: "Commande Rapide",
            description: "Parcours optimisé en 4 étapes : modèle, tissu, mesures, paiement. Finalisez votre commande en moins de 5 minutes.",
            icon: <SpeedIcon size={48} className="text-gray-900" />
        },
        {
            title: "Paiement Flexible",
            description: "Payez en plusieurs fois (30%, 50%, 75% ou 100%) via Mobile Money. Sécurisé par FedaPay.",
            icon: <PaymentIcon size={48} className="text-gray-900" />
        },
        {
            title: "Suivi en Temps Réel",
            description: "Suivez chaque étape de la confection de votre tenue, de la commande à la livraison.",
            icon: <TrackingIcon size={48} className="text-gray-900" />
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-6 text-gray-900">
                        Pourquoi Choisir DressArt ?
                    </h2>
                    <p className="text-xl text-gray-600 font-light">
                        Une expérience de commande sur mesure simplifiée et sécurisée
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-4 transition-shadow duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
