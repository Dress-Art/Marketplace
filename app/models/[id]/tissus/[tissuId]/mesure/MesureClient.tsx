'use client';

import { useState } from 'react';
import Header from '@/components/models/Header';
import Image from 'next/image';
import { modelsData } from '@/app/models/data';
import { tissusData } from '@/app/models/tissus-data';
import Calendar from '@/components/ui/Calendar';
import RulerIcon from '@/components/icons/RulerIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import InfoIcon from '@/components/icons/InfoIcon';

interface MesureClientProps {
    id: string;
    tissuId: string;
}

export default function MesureClient({ id, tissuId }: MesureClientProps) {
    const modelId = parseInt(id);

    // Gérer le cas où le client a son propre tissu
    const isOwnFabric = tissuId === 'own';
    const fabricId = isOwnFabric ? null : parseInt(tissuId);

    const model = modelsData.find(m => m.id === modelId);
    const tissu = isOwnFabric ? null : tissusData.find(t => t.id === fabricId);

    const [mode, setMode] = useState<'mesure' | 'rendez-vous' | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showConfirmation, setShowConfirmation] = useState(false);

    // États pour la localisation
    const [location, setLocation] = useState<'cotonou' | 'outside'>('cotonou');
    const [specificLocation, setSpecificLocation] = useState('');

    // État pour le modal de paiement
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Informations utilisateur pour le paiement
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    // États pour le formulaire de mesures
    const [mesures, setMesures] = useState({
        taille: '',
        tourPoitrine: '',
        tourHanches: '',
        tourTaille: '',
        largeurEpaules: '',
        longueurBras: ''
    });

    if (!model) {
        return <div>Modèle non trouvé</div>;
    }

    if (!isOwnFabric && !tissu) {
        return <div>Tissu non trouvé</div>;
    }

    // Calcul des frais
    const deliveryFee = location === 'outside' ? 500 : 0;
    const deposit = isOwnFabric ? 0 : (tissu ? tissu.prix * 0.3 : 0); // 30% d'acompte
    const totalAmount = deposit + deliveryFee;

    const handleMesureSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ouvrir le modal de paiement au lieu de la confirmation
        setShowPaymentModal(true);
    };

    const handleRendezVousSubmit = () => {
        if (selectedDate) {
            // Ouvrir le modal de paiement au lieu de la confirmation
            setShowPaymentModal(true);
        }
    };

    const handlePaymentConfirm = () => {
        // Fermer le modal et afficher la confirmation
        setShowPaymentModal(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    };

    // Afficher la bannière si rendez-vous ou propre tissu
    const showDeliveryInfo = mode === 'rendez-vous' || isOwnFabric;

    return (
        <div className="min-h-screen relative">
            {/* Header fixe */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Main content */}
            <main className="min-h-screen pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8">
                    {/* Colonne 1 : Modèle */}
                    <div className="p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4">Votre modèle</h2>
                        <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
                            {/* Skeleton loader */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl"
                                style={{
                                    aspectRatio: `${model.width} / ${model.height}`,
                                    backgroundSize: '200% 100%',
                                    maxHeight: '400px'
                                }}
                            />

                            <Image
                                src={model.image}
                                alt={model.titre}
                                width={model.width}
                                height={model.height}
                                className="w-full h-auto object-cover relative"
                                style={{ maxHeight: '400px' }}
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-xl font-bold">{model.titre}</h3>
                        <p className="text-gray-600">{model.description}</p>
                    </div>

                    {/* Colonne 2 : Tissu */}
                    <div className="p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4">Votre tissu</h2>
                        {isOwnFabric ? (
                            <div className="py-12 px-6 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                <div className="text-6xl mb-4">✨</div>
                                <h3 className="text-xl font-bold mb-2">Votre propre tissu</h3>
                                <p className="text-gray-600">
                                    Vous avez choisi d'utiliser votre propre tissu. N'oubliez pas de l'apporter lors de votre rendez-vous ou de votre passage en atelier.
                                </p>
                            </div>
                        ) : tissu ? (
                            <>
                                <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
                                    {/* Skeleton loader */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl"
                                        style={{
                                            aspectRatio: `${tissu.width} / ${tissu.height}`,
                                            backgroundSize: '200% 100%',
                                            maxHeight: '400px'
                                        }}
                                    />

                                    <Image
                                        src={tissu.image}
                                        alt={tissu.titre}
                                        width={tissu.width}
                                        height={tissu.height}
                                        className="w-full h-auto object-cover relative"
                                        style={{ maxHeight: '400px' }}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{tissu.titre}</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-semibold">Qualité:</span> {tissu.qualite}</p>
                                    <p><span className="font-semibold">Couleur:</span> {tissu.couleur}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{tissu.prix.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Colonne 3 : Finaliser la commande */}
                    <div className="p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-6">Finaliser votre commande</h2>

                        {/* Bannière d'information sur les frais */}
                        {showDeliveryInfo && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <InfoIcon size={24} className="text-blue-600" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-blue-900 mb-1">Information importante</h4>
                                        <p className="text-sm text-blue-800">
                                            <strong>Cotonou :</strong> Récupération du tissu ou prise de RDV gratuite<br />
                                            <strong>Hors Cotonou :</strong> Frais de déplacement de 500 FCFA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sélection du lieu (visible si rendez-vous ou propre tissu) */}
                        {showDeliveryInfo && (
                            <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-white">
                                <h4 className="font-bold text-gray-900 mb-3">Lieu de récupération / rendez-vous</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="location"
                                            value="cotonou"
                                            checked={location === 'cotonou'}
                                            onChange={() => {
                                                setLocation('cotonou');
                                                setSpecificLocation('');
                                            }}
                                            className="w-4 h-4 text-gray-900"
                                        />
                                        <span className="text-gray-700">Cotonou (Gratuit)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="location"
                                            value="outside"
                                            checked={location === 'outside'}
                                            onChange={() => setLocation('outside')}
                                            className="w-4 h-4 text-gray-900"
                                        />
                                        <span className="text-gray-700">Hors Cotonou (+500 FCFA)</span>
                                    </label>
                                    {location === 'outside' && (
                                        <div className="ml-7 mt-2">
                                            <input
                                                type="text"
                                                value={specificLocation}
                                                onChange={(e) => setSpecificLocation(e.target.value)}
                                                placeholder="Précisez le lieu (ex: Porto-Novo, Abomey...)"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Choix initial : 2 options */}
                        {!mode && (
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setMode('mesure')}
                                    className="w-full flex flex-col py-6 px-6 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl items-center justify-center gap-2 cursor-pointer"
                                >
                                    <RulerIcon size={28} />
                                    <span>Prendre mes mesures</span>
                                </button>
                                <button
                                    onClick={() => setMode('rendez-vous')}
                                    className="w-full flex flex-col py-10 px-6 bg-gray-900 text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    <CalendarIcon size={28} />
                                    Prendre RDV pour mes mesures
                                </button>
                            </div>
                        )}

                        {/* Bouton retour */}
                        {mode && (
                            <button
                                onClick={() => setMode(null)}
                                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <ArrowLeftIcon size={20} />
                                Retour aux choix
                            </button>
                        )}

                        {/* Formulaire de mesures */}
                        {mode === 'mesure' && (
                            <form onSubmit={handleMesureSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Taille (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.taille}
                                        onChange={(e) => setMesures({ ...mesures, taille: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tour de poitrine (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.tourPoitrine}
                                        onChange={(e) => setMesures({ ...mesures, tourPoitrine: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tour de hanches (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.tourHanches}
                                        onChange={(e) => setMesures({ ...mesures, tourHanches: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tour de taille (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.tourTaille}
                                        onChange={(e) => setMesures({ ...mesures, tourTaille: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Largeur d'épaules (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.largeurEpaules}
                                        onChange={(e) => setMesures({ ...mesures, largeurEpaules: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Longueur de bras (cm)</label>
                                    <input
                                        type="number"
                                        value={mesures.longueurBras}
                                        onChange={(e) => setMesures({ ...mesures, longueurBras: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                        min="0"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all"
                                >
                                    Valider les mesures
                                </button>
                            </form>
                        )}

                        {/* Calendrier de rendez-vous */}
                        {mode === 'rendez-vous' && (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <Calendar
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                    />
                                </div>
                                {selectedDate && (
                                    <div className="text-center text-sm text-gray-600 mb-4">
                                        Date sélectionnée : {selectedDate.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                )}
                                <button
                                    onClick={handleRendezVousSubmit}
                                    disabled={!selectedDate}
                                    className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${selectedDate
                                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Confirmer le rendez-vous
                                </button>
                            </div>
                        )}

                        {/* Message de confirmation */}
                        {showConfirmation && (
                            <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in">
                                <p className="font-semibold">✓ Confirmation enregistrée !</p>
                                <p className="text-sm">Nous vous contacterons bientôt.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Finaliser la commande</h3>

                        {/* Informations personnelles */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Vos informations</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Nom complet *</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Ex: Jean Dupont"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Numéro de téléphone *</label>
                                    <input
                                        type="tel"
                                        value={userPhone}
                                        onChange={(e) => setUserPhone(e.target.value)}
                                        placeholder="Ex: +229 XX XX XX XX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Récapitulatif de la commande */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Récapitulatif de la commande</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Modèle :</span>
                                    <span className="font-semibold text-right">{model.titre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tissu :</span>
                                    <span className="font-semibold text-right">
                                        {isOwnFabric ? 'Votre propre tissu' : tissu?.titre}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type de service :</span>
                                    <span className="font-semibold text-right">
                                        {mode === 'mesure' ? 'Prise de mesures' : 'Rendez-vous'}
                                    </span>
                                </div>
                                {location && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Lieu :</span>
                                        <span className="font-semibold text-right">
                                            {location === 'cotonou' ? 'Cotonou' : specificLocation || 'Hors Cotonou'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Récapitulatif financier */}
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-4">Détails du paiement</h4>
                            <div className="space-y-3">
                                {!isOwnFabric && tissu && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Acompte (30%)</span>
                                        <span className="font-semibold">{deposit.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Frais de déplacement</span>
                                    <span className="font-semibold">{deliveryFee} FCFA</span>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">Total à payer</span>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {(deposit + deliveryFee).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Note :</strong> Le paiement sera traité via Mobile Money. Vous recevrez les instructions par SMS au {userPhone || 'numéro indiqué'}.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setUserName('');
                                    setUserPhone('');
                                }}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                disabled={!userName || !userPhone}
                                className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all cursor-pointer ${userName && userPhone
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
