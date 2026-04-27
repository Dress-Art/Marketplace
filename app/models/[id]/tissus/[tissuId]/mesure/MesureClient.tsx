'use client';

import { useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModels } from '@/lib/hooks/useModels';
import { useFabrics } from '@/lib/hooks/useFabrics';
import { slugify } from '@/lib/utils/slugify';
import { supabase } from '@/lib/api/supabase-client';
import Calendar from '@/components/ui/Calendar';
import CalendarIcon from '@/components/icons/CalendarIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import InfoIcon from '@/components/icons/InfoIcon';

interface MesureClientProps {
    id: string;
    tissuId: string;
}

export default function MesureClient({ id, tissuId }: MesureClientProps) {
    const isOwnFabric = tissuId === 'own';

    const { models, loading: modelsLoading } = useModels({ page: 1, per_page: 100 });
    const { fabrics, loading: fabricsLoading } = useFabrics({ page: 1, per_page: 100 });

    const model = useMemo(() => models.find((m) => slugify(m.nom) === id), [models, id]);
    const tissu = useMemo(() => {
        if (isOwnFabric) return null;
        return fabrics.find((f) => slugify(f.nom) === tissuId);
    }, [fabrics, tissuId, isOwnFabric]);

    const loading = modelsLoading || fabricsLoading;

    const [isRendezVous, setIsRendezVous] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [location, setLocation] = useState<'cotonou' | 'calavi'>('cotonou');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('partial');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mobileOrderOpen, setMobileOrderOpen] = useState(false);

    const [ownFabricPreview, setOwnFabricPreview] = useState<string | null>(null);
    const [ownFabricUploading, setOwnFabricUploading] = useState(false);
    const [ownFabricUrl, setOwnFabricUrl] = useState<string | null>(null);
    const fabricInputRef = useRef<HTMLInputElement>(null);

    const phoneClean = useMemo(() => userPhone.replace(/\s|-/g, ''), [userPhone]);
    const isPhoneValid = useMemo(() => /^\+\d{8,15}$/.test(phoneClean) || /^\d{8,}$/.test(phoneClean), [phoneClean]);
    const emailClean = useMemo(() => userEmail.trim(), [userEmail]);
    const isEmailValid = useMemo(() => !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean), [emailClean]);
    const nameClean = useMemo(() => userName.trim().replace(/\s+/g, ' '), [userName]);
    const isNameValid = useMemo(() => {
        if (!nameClean) return false;
        const parts = nameClean.split(' ');
        if (parts.length < 2) return false;
        return parts.every((p) => /^[A-Za-zÀ-ÖØ-öø-ÿ''-]{2,}$/.test(p));
    }, [nameClean]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!model) return <div>Modele non trouve</div>;
    if (!isOwnFabric && !tissu) return <div>Tissu non trouve</div>;

    const deliveryFee = location === 'calavi' ? 500 : 0;
    const baseAmount = isOwnFabric ? model.prix_base : (tissu ? tissu.prix_metre + model.prix_base : model.prix_base);
    const finalAmount = baseAmount + deliveryFee;

    const handleFabricFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so re-selecting the same file triggers onChange again
        e.target.value = '';

        setOwnFabricPreview(URL.createObjectURL(file));
        setOwnFabricUploading(true);
        setOwnFabricUrl(null);

        const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 8000)
        );

        try {
            const ext = file.name.split('.').pop();
            const path = `own-fabrics/${Date.now()}.${ext}`;
            const upload = supabase.storage.from('fabrics').upload(path, file, { upsert: true });

            const { data, error } = await Promise.race([upload, timeout]) as Awaited<typeof upload>;

            if (!error && data) {
                const { data: { publicUrl } } = supabase.storage.from('fabrics').getPublicUrl(data.path);
                setOwnFabricUrl(publicUrl);
            }
        } catch {
            // Upload failed or timed out — photo kept locally, user can still continue
        } finally {
            setOwnFabricUploading(false);
        }
    };

    const handleRendezVousSubmit = () => {
        if (selectedDate) setShowPaymentModal(true);
    };

    const handlePaymentConfirm = async () => {
        if (!isNameValid || !isPhoneValid || !userName || !userPhone) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        setIsProcessing(true);
        try {
            const response = await fetch('/api/payment/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    paymentType,
                    customerInfo: { name: userName, phone: phoneClean, email: emailClean || undefined },
                    orderDetails: {
                        modelId: model.id,
                        fabricId: isOwnFabric ? null : (tissu ? tissu.id : null),
                        ownFabricImageUrl: isOwnFabric ? ownFabricUrl : undefined,
                        appointmentDate: selectedDate,
                        location,
                    },
                }),
            });
            const data = await response.json();
            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.error || 'Failed to create payment session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Erreur lors de la creation du paiement. Veuillez reessayer.');
            setIsProcessing(false);
        }
    };

    // ── Shared: panneau "Finaliser la commande" ──────────────────────────────
    const OrderPanel = () => (
        <div className="space-y-6">
            {/* Info localisation */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                    <InfoIcon size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800">
                        <strong>Cotonou :</strong> Récupération du tissu ou RDV gratuit<br />
                        <strong>Calavi :</strong> Frais de déplacement de 500 FCFA
                    </p>
                </div>
            </div>

            {/* Choix du lieu */}
            <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <h4 className="font-bold text-gray-900 mb-3">Lieu de récupération / rendez-vous</h4>
                <div className="grid grid-cols-2 gap-3">
                    <label className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${location === 'cotonou' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                        <input type="radio" name="location" value="cotonou" checked={location === 'cotonou'} onChange={() => setLocation('cotonou')} className="sr-only" />
                        <span className="font-semibold text-gray-900">Cotonou</span>
                        <span className="text-xs text-green-600 font-medium">Gratuit</span>
                    </label>
                    <label className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${location === 'calavi' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                        <input type="radio" name="location" value="calavi" checked={location === 'calavi'} onChange={() => setLocation('calavi')} className="sr-only" />
                        <span className="font-semibold text-gray-900">Calavi</span>
                        <span className="text-xs text-gray-500 font-medium">+500 FCFA</span>
                    </label>
                </div>
            </div>

            {/* Actions */}
            {!isRendezVous && (
                <div className="grid grid-cols-1 gap-3">
                    <Link
                        href={`/models/${id}/tissus/${tissuId}/mesure/prise-de-mesure`}
                        className="w-full flex flex-col py-5 px-6 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all items-center justify-center gap-1"
                    >
                        <span>Prendre mes mesures</span>
                        <span className="text-xs text-gray-300">Sur une page complète dédiée</span>
                    </Link>
                    <button
                        onClick={() => setIsRendezVous(true)}
                        className="w-full py-5 px-6 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <CalendarIcon size={20} />
                        Prendre RDV pour mes mesures
                    </button>
                </div>
            )}

            {isRendezVous && (
                <>
                    <button
                        onClick={() => setIsRendezVous(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <ArrowLeftIcon size={18} />
                        Retour aux choix
                    </button>
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                        </div>
                        {selectedDate && (
                            <p className="text-center text-sm text-gray-600">
                                {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                        <button
                            onClick={handleRendezVousSubmit}
                            disabled={!selectedDate}
                            className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${selectedDate ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Confirmer le rendez-vous
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen relative">
            <div className="fixed top-14 left-4 z-[60]">
                <Link
                    href={`/models/${id}/tissus`}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border border-gray-200 bg-white shadow-sm flex items-center justify-center"
                    aria-label="Retour"
                >
                    <ArrowLeftIcon size={24} className="text-gray-700" />
                </Link>
            </div>
            <main className="min-h-screen pt-16 pb-24 lg:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8">

                    {/* Colonne modèle — 2e sur mobile, 1e sur desktop */}
                    <div className="order-2 lg:order-1 p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4">Votre modèle</h2>
                        <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl" style={{ aspectRatio: '1 / 1', backgroundSize: '200% 100%', maxHeight: '400px' }} />
                            {model.image_url && (
                                <Image src={model.image_url} alt={model.nom} width={1024} height={1024} className="w-full h-auto object-cover relative" style={{ maxHeight: '400px' }} loading="lazy" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold">{model.nom}</h3>
                        <p className="text-gray-600 mb-4">{model.description}</p>
                        <div className="flex items-center gap-2 bg-gray-900 text-white rounded-2xl px-5 py-3 w-fit">
                            <span className="text-sm font-medium opacity-70">À partir de</span>
                            <span className="text-xl font-bold">{model.prix_base.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                    </div>

                    {/* Colonne tissu — 1e sur mobile, 2e sur desktop */}
                    <div className="order-1 lg:order-2 p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4">Votre tissu</h2>
                        {isOwnFabric ? (
                            <div>
                                <input
                                    ref={fabricInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFabricFileChange}
                                />
                                {ownFabricPreview ? (
                                    <div className="space-y-4">
                                        <div className="relative w-full rounded-2xl overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={ownFabricPreview} alt="Votre tissu" className="w-full h-auto object-cover rounded-2xl" />
                                            {ownFabricUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                            {ownFabricUrl && (
                                                <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => fabricInputRef.current?.click()} className="w-full py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                            Changer la photo
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fabricInputRef.current?.click()}
                                        className="w-full py-12 border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-900 transition-all cursor-pointer group bg-gray-50 hover:bg-gray-100 flex flex-col items-center gap-3"
                                    >
                                        <svg className="w-10 h-10 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="text-center">
                                            <p className="font-semibold text-gray-900">Prendre une photo ou importer</p>
                                            <p className="text-sm text-gray-500 mt-1">JPG, PNG — max 10 Mo</p>
                                        </div>
                                    </button>
                                )}
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Apportez votre tissu lors du rendez-vous. La photo aide l&apos;atelier à préparer votre commande.
                                </p>
                            </div>
                        ) : tissu ? (
                            <>
                                <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ maxHeight: '400px' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl" style={{ aspectRatio: '1 / 1', backgroundSize: '200% 100%', maxHeight: '400px' }} />
                                    {tissu.image_url && (
                                        <Image src={tissu.image_url} alt={tissu.nom} width={1024} height={1024} className="w-full h-auto object-cover relative" style={{ maxHeight: '400px' }} loading="lazy" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{tissu.nom}</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-semibold">Qualité :</span> {tissu.texture}</p>
                                    <p><span className="font-semibold">Couleur :</span> {tissu.couleur}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{tissu.prix_metre.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Colonne commande — desktop uniquement */}
                    <div className="order-3 hidden lg:block p-6 h-fit border border-gray-300 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-6">Finaliser votre commande</h2>
                        <OrderPanel />
                    </div>
                </div>
            </main>

            {/* Barre fixe mobile — "Finaliser la commande" */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
                {/* Panneau déplié */}
                {mobileOrderOpen && (
                    <div className="bg-white border-t border-gray-200 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Finaliser la commande</h2>
                            <button onClick={() => setMobileOrderOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <OrderPanel />
                        </div>
                    </div>
                )}

                {/* Barre repliée */}
                {!mobileOrderOpen && (() => {
                    const blocked = isOwnFabric && !ownFabricPreview;
                    return (
                        <button
                            onClick={() => !blocked && setMobileOrderOpen(true)}
                            disabled={blocked}
                            className={`w-full py-5 px-6 flex items-center justify-between transition-colors ${blocked ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 cursor-pointer'}`}
                        >
                            <div>
                                <p className={`font-bold text-lg ${blocked ? 'text-gray-500' : 'text-white'}`}>Finaliser la commande</p>
                                <p className={`text-sm ${blocked ? 'text-gray-400' : 'text-gray-300'}`}>
                                    {blocked ? 'Ajoutez une photo de votre tissu' : `À partir de ${model.prix_base.toLocaleString('fr-FR')} FCFA`}
                                </p>
                            </div>
                            <svg className={`w-6 h-6 ${blocked ? 'text-gray-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    );
                })()}
            </div>

            {/* Modal paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Finaliser la commande</h3>

                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Vos informations</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Nom complet *</label>
                                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ex: Pierre DOSSOU" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                                    {userName && !isNameValid && <p className="mt-1 text-sm text-red-600">Entrez votre nom complet (prénom + nom).</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Numéro WhatsApp *</label>
                                    <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Ex: +229 01 XX XX XX XX" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                                    {userPhone && !isPhoneValid && <p className="mt-1 text-sm text-red-600">Minimum 8 chiffres.</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email <span className="text-gray-400 font-normal">(optionnel)</span></label>
                                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="vous@exemple.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                                    {userEmail && !isEmailValid && <p className="mt-1 text-sm text-red-600">Email invalide.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Récapitulatif</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Modèle :</span>
                                    <span className="font-semibold text-right">{model.nom}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tissu :</span>
                                    <span className="font-semibold text-right">{isOwnFabric ? 'Votre propre tissu' : tissu?.nom}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lieu :</span>
                                    <span className="font-semibold text-right">{location === 'cotonou' ? 'Cotonou' : 'Calavi'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Type de paiement</h4>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all" style={{ borderColor: paymentType === 'partial' ? '#111827' : '#e5e7eb', backgroundColor: paymentType === 'partial' ? '#f9fafb' : 'white' }}>
                                    <input type="radio" name="paymentType" value="partial" checked={paymentType === 'partial'} onChange={() => setPaymentType('partial')} className="w-5 h-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Acompte (30%)</div>
                                        <p className="text-sm text-gray-600 mt-1">Payez {Math.round(finalAmount * 0.3).toLocaleString('fr-FR')} FCFA maintenant</p>
                                        <p className="text-xs text-gray-500 mt-1">Le solde sera payé à la livraison</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all" style={{ borderColor: paymentType === 'full' ? '#111827' : '#e5e7eb', backgroundColor: paymentType === 'full' ? '#f9fafb' : 'white' }}>
                                    <input type="radio" name="paymentType" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="w-5 h-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Paiement complet</div>
                                        <p className="text-sm text-gray-600 mt-1">Payez {finalAmount.toLocaleString('fr-FR')} FCFA maintenant</p>
                                        <p className="text-xs text-green-600 mt-1">Aucun paiement supplémentaire requis</p>
                                    </div>
                                </label>
                            </div>
                        </div>

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
                                    <span className="font-semibold">{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee} FCFA`}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">{paymentType === 'partial' ? 'Acompte à payer (30%)' : 'Total à payer'}</span>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {(paymentType === 'partial' ? Math.round(finalAmount * 0.3) : finalAmount).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                                {paymentType === 'partial' && (
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <span>Solde restant</span>
                                        <span>{Math.round(finalAmount * 0.7).toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => { setShowPaymentModal(false); setUserName(''); setUserPhone(''); setUserEmail(''); }} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all cursor-pointer">
                                Annuler
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                disabled={!isNameValid || !userPhone || !isPhoneValid || !isEmailValid || isProcessing}
                                className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${isNameValid && userPhone && isPhoneValid && isEmailValid && !isProcessing ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                {isProcessing ? (
                                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Traitement...</span></>
                                ) : 'Confirmer et payer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
