'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/models/Header';
import Image from 'next/image';
import { useModels } from '@/lib/hooks/useModels';
import { useFabrics } from '@/lib/hooks/useFabrics';
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
    // Gérer le cas où le client a son propre tissu
    const isOwnFabric = tissuId === 'own';

    // Fetch models from API
    const { models, loading: modelsLoading } = useModels({
        page: 1,
        per_page: 100,
    });

    // Fetch fabrics from API (only if not own fabric)
    const { fabrics, loading: fabricsLoading } = useFabrics({
        page: 1,
        per_page: 100,
    });

    // Find the model by converting the ID string to match the API format
    const model = useMemo(() => {
        const targetId = parseInt(id);
        return models.find(m => {
            // Convert UUID to number for comparison
            const modelNumericId = parseInt(m.id.substring(0, 8), 16);
            return modelNumericId === targetId;
        });
    }, [models, id]);

    // Find the fabric if not own fabric
    const tissu = useMemo(() => {
        if (isOwnFabric) return null;
        const targetFabricId = parseInt(tissuId);
        return fabrics.find(f => {
            const fabricNumericId = parseInt(f.id.substring(0, 8), 16);
            return fabricNumericId === targetFabricId;
        });
    }, [fabrics, tissuId, isOwnFabric]);

    const loading = modelsLoading || fabricsLoading;

    const [mode, setMode] = useState<'mesure' | 'rendez-vous' | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [saveIndicator, setSaveIndicator] = useState(false);

    // États pour la localisation
    const [location, setLocation] = useState<'cotonou' | 'outside'>('cotonou');
    const [specificLocation, setSpecificLocation] = useState('');

    // État pour le modal de paiement
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Informations utilisateur pour le paiement
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const phoneClean = useMemo(() => userPhone.replace(/\s|-/g, ''), [userPhone]);
    const isPhoneValid = useMemo(() => (/^\+22901\d{8}$/.test(phoneClean) || /^\d{10}$/.test(phoneClean)), [phoneClean]);
    const nameClean = useMemo(() => userName.trim().replace(/\s+/g, ' '), [userName]);
    const isNameValid = useMemo(() => {
        if (!nameClean) return false;
        const parts = nameClean.split(' ');
        if (parts.length < 2) return false;
        return parts.every((p) => /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,}$/.test(p));
    }, [nameClean]);

    // Type de paiement et état de traitement
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('partial');
    const [isProcessing, setIsProcessing] = useState(false);

    // États pour le formulaire de mesures
    const [mesures, setMesures] = useState({
        taille: '',
        tourPoitrine: '',
        tourHanches: '',
        tourTaille: '',
        largeurEpaules: '',
        longueurBras: ''
    });

    // AC2: Charger les mesures sauvegardées au montage du composant
    useEffect(() => {
        if (!model) return;
        const storageKey = `measurements_${model.id}`;
        const savedMeasurements = localStorage.getItem(storageKey);

        if (savedMeasurements) {
            try {
                const parsed = JSON.parse(savedMeasurements);
                setMesures(parsed);
            } catch (error) {
                console.error('Erreur lors du chargement des mesures:', error);
            }
        }
    }, [model]);

    // AC1: Sauvegarder automatiquement les mesures lors de la saisie
    useEffect(() => {
        if (!model) return;
        // Ne sauvegarder que si au moins un champ est rempli
        const hasData = Object.values(mesures).some(value => value !== '');

        if (hasData) {
            const storageKey = `measurements_${model.id}`;
            localStorage.setItem(storageKey, JSON.stringify(mesures));

            // Afficher l'indicateur de sauvegarde
            setSaveIndicator(true);
            const timer = setTimeout(() => setSaveIndicator(false), 2000);

            return () => clearTimeout(timer);
        }
    }, [mesures, model]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!model) {
        return <div>Modèle non trouvé</div>;
    }

    if (!isOwnFabric && !tissu) {
        return <div>Tissu non trouvé</div>;
    }

    // Calcul des frais
    const deliveryFee = location === 'outside' ? 500 : 0;

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

    const handlePaymentConfirm = async () => {
        if (!isNameValid || !isPhoneValid || !userName || !userPhone) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        setIsProcessing(true);

        try {
            // Calculate total amount based on payment type
            const baseAmount = isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base);
            const finalAmount = baseAmount + deliveryFee;

            // AC1: Create payment session
            const response = await fetch('/api/payment/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    paymentType,
                    customerInfo: {
                        name: userName,
                        phone: phoneClean,
                    },
                    orderDetails: {
                        modelId: model.id,
                        fabricId: isOwnFabric ? null : (tissu ? tissu.id : null),
                        measurements: mode === 'mesure' ? mesures : undefined,
                        appointmentDate: mode === 'rendez-vous' ? selectedDate : undefined,
                        location,
                        specificLocation: location === 'outside' ? specificLocation : undefined,
                    },
                }),
            });

            const data = await response.json();

            if (data.success && data.paymentUrl) {
                // AC1: Redirect to payment session
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.error || 'Failed to create payment session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Erreur lors de la création du paiement. Veuillez réessayer.');
            setIsProcessing(false);
        }
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
                                    aspectRatio: '1 / 1',
                                    backgroundSize: '200% 100%',
                                    maxHeight: '400px'
                                }}
                            />

                            {model.image_url && (
                                <Image
                                    src={model.image_url}
                                    alt={model.nom}
                                    width={1024}
                                    height={1024}
                                    className="w-full h-auto object-cover relative"
                                    style={{ maxHeight: '400px' }}
                                    loading="lazy"
                                />
                            )}
                        </div>
                        <h3 className="text-xl font-bold">{model.nom}</h3>
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
                                    Vous avez choisi d&apos;utiliser votre propre tissu. N&apos;oubliez pas de l&apos;apporter lors de votre rendez-vous ou de votre passage en atelier.
                                </p>
                            </div>
                        ) : tissu ? (
                            <>
                                <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
                                    {/* Skeleton loader */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl"
                                        style={{
                                            aspectRatio: '1 / 1',
                                            backgroundSize: '200% 100%',
                                            maxHeight: '400px'
                                        }}
                                    />

                                    {tissu.image_url && (
                                        <Image
                                            src={tissu.image_url}
                                            alt={tissu.nom}
                                            width={1024}
                                            height={1024}
                                            className="w-full h-auto object-cover relative"
                                            style={{ maxHeight: '400px' }}
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{tissu.nom}</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-semibold">Qualité:</span> {tissu.texture}</p>
                                    <p><span className="font-semibold">Couleur:</span> {tissu.couleur}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{tissu.prix_metre.toLocaleString('fr-FR')} FCFA</p>
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
                                    <label className="block text-sm font-semibold mb-2">Largeur d&apos;épaules (cm)</label>
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

                                {/* Indicateur de sauvegarde automatique */}
                                {saveIndicator && (
                                    <div className="text-center text-sm text-green-600 flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Mesures sauvegardées automatiquement
                                    </div>
                                )}
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
                                        placeholder="Ex: Pierre DOSSOU"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                    {userName && !isNameValid && (
                                        <div className="mt-1 text-sm text-red-600">Entrez votre nom complet (prénom + nom).</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Numéro de téléphone *</label>
                                    <input
                                        type="tel"
                                        value={userPhone}
                                        onChange={(e) => setUserPhone(e.target.value)}
                                        placeholder="Ex: +229 01 XX XX XX XX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                    {userPhone && !isPhoneValid && (
                                        <div className="mt-1 text-sm text-red-600">Format : 10 chiffres (ex: 0164000001) ou +229 01 suivi de 8 chiffres (ex: +2290164000001).</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Récapitulatif de la commande */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Récapitulatif de la commande</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Modèle :</span>
                                    <span className="font-semibold text-right">{model.nom}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tissu :</span>
                                    <span className="font-semibold text-right">
                                        {isOwnFabric ? 'Votre propre tissu' : tissu?.nom}
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

                        {/* Type de paiement */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Type de paiement</h4>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all hover:border-gray-400"
                                    style={{
                                        borderColor: paymentType === 'partial' ? '#111827' : '#e5e7eb',
                                        backgroundColor: paymentType === 'partial' ? '#f9fafb' : 'white'
                                    }}>
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="partial"
                                        checked={paymentType === 'partial'}
                                        onChange={() => setPaymentType('partial')}
                                        className="w-5 h-5 mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Acompte (30%)</div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Payez {Math.round((isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base) + deliveryFee) * 0.3).toLocaleString('fr-FR')} FCFA maintenant
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Le solde sera payé à la livraison
                                        </p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all hover:border-gray-400"
                                    style={{
                                        borderColor: paymentType === 'full' ? '#111827' : '#e5e7eb',
                                        backgroundColor: paymentType === 'full' ? '#f9fafb' : 'white'
                                    }}>
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="full"
                                        checked={paymentType === 'full'}
                                        onChange={() => setPaymentType('full')}
                                        className="w-5 h-5 mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Paiement complet</div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Payez {(isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base) + deliveryFee).toLocaleString('fr-FR')} FCFA maintenant
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ Aucun paiement supplémentaire requis
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Récapitulatif financier */}
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-4">Détails du paiement</h4>
                            <div className="space-y-3">
                                {!isOwnFabric && tissu && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Prix tissu</span>
                                        <span className="font-semibold">{tissu.prix_metre.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Prix modèle</span>
                                    <span className="font-semibold">{model.prix_base.toLocaleString('fr-FR')} FCFA</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Frais de déplacement</span>
                                    <span className="font-semibold">{deliveryFee} FCFA</span>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">
                                        {paymentType === 'partial' ? 'Acompte à payer (30%)' : 'Total à payer'}
                                    </span>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {paymentType === 'partial'
                                            ? Math.round((isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base) + deliveryFee) * 0.3).toLocaleString('fr-FR')
                                            : (isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base) + deliveryFee).toLocaleString('fr-FR')
                                        } FCFA
                                    </span>
                                </div>

                                {paymentType === 'partial' && (
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <span>Solde restant</span>
                                        <span>{Math.round((isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base) + deliveryFee) * 0.7).toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                )}
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
                                disabled={!isNameValid || !userPhone || !isPhoneValid || isProcessing}
                                className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${isNameValid && userPhone && isPhoneValid && !isProcessing
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Traitement...</span>
                                    </>
                                ) : (
                                    'Confirmer et payer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
