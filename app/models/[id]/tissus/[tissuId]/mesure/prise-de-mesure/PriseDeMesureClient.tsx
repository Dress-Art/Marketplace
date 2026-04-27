'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useModels } from '@/lib/hooks/useModels';
import { useFabrics } from '@/lib/hooks/useFabrics';
import { useAuth } from '@/lib/hooks/useAuth';
import { slugify } from '@/lib/utils/slugify';
import { supabase } from '@/lib/api/supabase-client';
import Calendar from '@/components/ui/Calendar';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import RulerIcon from '@/components/icons/RulerIcon';
import InfoIcon from '@/components/icons/InfoIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';

interface Props {
    id: string;
    tissuId: string;
}

interface BodyMeasurements {
    // Haut
    longueurHaut: string;
    dos: string;
    cou: string;
    longueurManche: string;
    tourBras: string;
    poitrine: string;
    ventre: string;
    // Pantalon
    longueurPantalon: string;
    ceinture: string;
    fesse: string;
    cuisse: string;
    bas: string;
    longueurGenou: string;
    tourGenou: string;
}

const EMPTY: BodyMeasurements = {
    longueurHaut: '', dos: '', cou: '', longueurManche: '', tourBras: '', poitrine: '', ventre: '',
    longueurPantalon: '', ceinture: '', fesse: '', cuisse: '', bas: '', longueurGenou: '', tourGenou: '',
};

const SECTIONS = [
    {
        title: 'Haut du corps',
        fields: [
            { key: 'longueurHaut', label: 'Longueur haut', required: true },
            { key: 'dos', label: 'Dos', required: true },
            { key: 'cou', label: 'Cou', required: true },
            { key: 'longueurManche', label: 'Longueur manche', required: true },
            { key: 'tourBras', label: 'Tour de bras', required: true },
            { key: 'poitrine', label: 'Poitrine', required: true },
            { key: 'ventre', label: 'Ventre', required: true },
        ],
    },
    {
        title: 'Pantalon',
        fields: [
            { key: 'longueurPantalon', label: 'Longueur pantalon', required: true },
            { key: 'ceinture', label: 'Ceinture', required: true },
            { key: 'fesse', label: 'Fesse', required: true },
            { key: 'cuisse', label: 'Cuisse', required: true },
            { key: 'bas', label: 'Bas', required: true },
            { key: 'longueurGenou', label: 'Longueur genou', required: false },
            { key: 'tourGenou', label: 'Tour genou', required: false },
        ],
    },
];

// Convert cm ↔ inch. Always store in cm; display in selected unit.
const CM_TO_INCH = 1 / 2.54;
const INCH_TO_CM = 2.54;

function toDisplay(cmValue: string, useInch: boolean): string {
    if (!cmValue) return '';
    const num = parseFloat(cmValue);
    if (isNaN(num)) return cmValue;
    return useInch ? (num * CM_TO_INCH).toFixed(1) : cmValue;
}

function toCm(displayValue: string, useInch: boolean): string {
    if (!displayValue) return '';
    const num = parseFloat(displayValue);
    if (isNaN(num)) return displayValue;
    return useInch ? (num * INCH_TO_CM).toFixed(1) : displayValue;
}

// ── Body silhouette SVG guide ──────────────────────────────────────────────
function BodySVGGuide() {
    return (
        <svg
            viewBox="0 0 300 520"
            width="300"
            height="520"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Guide visuel des mesures"
            className="mx-auto"
        >
            {/* ─── Body silhouette (line-art) ─── */}
            {/* Head */}
            <ellipse cx="150" cy="42" rx="28" ry="34" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Neck */}
            <line x1="137" y1="74" x2="133" y2="90" stroke="#9ca3af" strokeWidth="2" />
            <line x1="163" y1="74" x2="167" y2="90" stroke="#9ca3af" strokeWidth="2" />
            {/* Shoulders */}
            <path d="M133,90 Q110,92 96,102" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <path d="M167,90 Q190,92 204,102" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Left arm */}
            <path d="M96,102 Q88,135 84,175" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Right arm */}
            <path d="M204,102 Q212,135 216,175" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Left forearm + hand */}
            <path d="M84,175 Q80,205 82,225" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <ellipse cx="82" cy="232" rx="8" ry="9" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            {/* Right forearm + hand */}
            <path d="M216,175 Q220,205 218,225" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <ellipse cx="218" cy="232" rx="8" ry="9" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            {/* Torso sides */}
            <path d="M133,90 Q120,115 118,150 Q116,180 120,210 Q124,235 130,260" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <path d="M167,90 Q180,115 182,150 Q184,180 180,210 Q176,235 170,260" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Hips */}
            <path d="M130,260 Q125,275 122,295 Q118,320 120,340" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <path d="M170,260 Q175,275 178,295 Q182,320 180,340" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Crotch */}
            <path d="M120,340 Q130,345 150,345 Q170,345 180,340" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Left leg */}
            <path d="M120,340 Q114,375 112,415 Q110,445 112,480" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <path d="M150,345 Q144,375 142,415 Q140,445 142,480" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Right leg */}
            <path d="M150,345 Q156,375 158,415 Q160,445 158,480" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <path d="M180,340 Q186,375 188,415 Q190,445 188,480" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Feet */}
            <path d="M112,480 Q110,490 108,495 Q114,500 122,498 Q128,494 130,488" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M142,480 Q140,490 140,495 Q146,500 154,498 Q160,494 158,488" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M158,488 Q160,494 168,498 Q176,500 180,495 Q178,490 176,480" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M188,480 Q190,490 190,495 Q196,500 204,498 Q210,494 208,488" fill="none" stroke="#9ca3af" strokeWidth="1.5" />

            {/* ─── Measurement indicator lines ─── */}
            {/* Poitrine — horizontal at ~y=120 */}
            <line x1="118" y1="120" x2="182" y2="120" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="62" y1="120" x2="102" y2="120" stroke="#6366f1" strokeWidth="1" />
            <text x="58" y="116" fontSize="9" fill="#4f46e5" textAnchor="end" fontWeight="600">Poitrine</text>

            {/* Taille — y=165 */}
            <line x1="118" y1="165" x2="182" y2="165" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="62" y1="165" x2="102" y2="165" stroke="#10b981" strokeWidth="1" />
            <text x="58" y="161" fontSize="9" fill="#047857" textAnchor="end" fontWeight="600">Taille</text>

            {/* Hanches — y=220 */}
            <line x1="120" y1="218" x2="180" y2="218" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="62" y1="218" x2="104" y2="218" stroke="#f59e0b" strokeWidth="1" />
            <text x="58" y="214" fontSize="9" fill="#b45309" textAnchor="end" fontWeight="600">Hanches</text>

            {/* Épaules — y=96 */}
            <line x1="96" y1="96" x2="204" y2="96" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="238" y1="96" x2="214" y2="96" stroke="#ef4444" strokeWidth="1" />
            <text x="242" y="93" fontSize="9" fill="#b91c1c" textAnchor="start" fontWeight="600">Épaules</text>

            {/* Longueur totale — vertical arrow on right */}
            <line x1="235" y1="76" x2="235" y2="480" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="230" y1="76" x2="240" y2="76" stroke="#8b5cf6" strokeWidth="1.5" />
            <line x1="230" y1="480" x2="240" y2="480" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="258" y="285" fontSize="9" fill="#7c3aed" textAnchor="start" fontWeight="600" transform="rotate(90,258,285)">Longueur totale</text>

            {/* Dot markers */}
            <circle cx="150" cy="120" r="3" fill="#6366f1" />
            <circle cx="150" cy="165" r="3" fill="#10b981" />
            <circle cx="150" cy="218" r="3" fill="#f59e0b" />
        </svg>
    );
}

export default function PriseDeMesureClient({ id, tissuId }: Props) {
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const isOwnFabric = tissuId === 'own';

    const { models, loading: modelsLoading } = useModels({ page: 1, per_page: 100 });
    const { fabrics, loading: fabricsLoading } = useFabrics({ page: 1, per_page: 100 });

    const model = useMemo(() => models.find(m => slugify(m.nom) === id), [models, id]);
    const tissu = useMemo(() => {
        if (isOwnFabric) return null;
        return fabrics.find(f => slugify(f.nom) === tissuId);
    }, [fabrics, tissuId, isOwnFabric]);

    const loading = modelsLoading || fabricsLoading || authLoading;

    // ── Mode: 'rdv' par défaut — un agent se déplace ──
    const [mode, setMode] = useState<'form' | 'rdv'>('form');

    // ── Form state ──
    const [mesures, setMesures] = useState<BodyMeasurements>(EMPTY);
    const [useInch, setUseInch] = useState(false);
    const [location, setLocation] = useState<'cotonou' | 'calavi'>('cotonou');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loadedFromProfile, setLoadedFromProfile] = useState(false);

    // ── RDV state ──
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // ── Payment modal state ──
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [paymentType, setPaymentType] = useState<'full' | 'partial'>('partial');
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment validation
    const phoneClean = useMemo(() => userPhone.replace(/\s|-/g, ''), [userPhone]);
    const isPhoneValid = useMemo(() => /^\+\d{8,15}$/.test(phoneClean) || /^\d{8,}$/.test(phoneClean), [phoneClean]);
    const emailClean = useMemo(() => userEmail.trim(), [userEmail]);
    const isEmailValid = useMemo(() => !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean), [emailClean]);
    const nameClean = useMemo(() => userName.trim().replace(/\s+/g, ' '), [userName]);
    const isNameValid = useMemo(() => {
        if (!nameClean) return false;
        const parts = nameClean.split(' ');
        if (parts.length < 2) return false;
        return parts.every(p => /^[A-Za-zÀ-ÖØ-öø-ÿ''-]{2,}$/.test(p));
    }, [nameClean]);

    // ── Pre-fill from API if logged in ──
    useEffect(() => {
        if (!user || loadedFromProfile) return;
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch('/api/measurements', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (res.ok) {
                const { measurements } = await res.json();
                if (measurements?.body_measurements) {
                    setMesures({ ...EMPTY, ...measurements.body_measurements });
                    setLoadedFromProfile(true);
                }
            }
        };
        load();
    }, [user, loadedFromProfile]);

    // ── If returning from rdv param, open rdv mode ──
    useEffect(() => {
        const rdvParam = searchParams?.get('rdv');
        if (rdvParam) setMode('rdv');
    }, [searchParams]);

    const setField = (key: keyof BodyMeasurements, displayValue: string) => {
        const cmVal = toCm(displayValue, useInch);
        setMesures(prev => ({ ...prev, [key]: cmVal }));
    };

    const requiredFields = SECTIONS
        .flatMap(s => s.fields)
        .filter(f => f.required)
        .map(f => f.key as keyof BodyMeasurements);

    const isFormValid = requiredFields.every(k => mesures[k] !== '');

    // ── Amounts ──
    const deliveryFee = location === 'calavi' ? 500 : 0;
    const baseAmount = isOwnFabric
        ? model?.prix_base ?? 0
        : (tissu ? tissu.prix_metre + (model?.prix_base ?? 0) : (model?.prix_base ?? 0));
    const finalAmount = baseAmount + deliveryFee;

    // ── Submit form ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setSaving(true);

        if (user) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await fetch('/api/measurements', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({
                            height: parseFloat(mesures.longueurHaut) || null,
                            body_measurements: mesures,
                        }),
                    });
                }
            } catch {
                // Non-blocking — continue to payment even if save fails
            }
        }

        sessionStorage.setItem('dressart_measurements', JSON.stringify(mesures));
        sessionStorage.setItem('dressart_location', location);

        setSaving(false);
        setSaved(true);

        setTimeout(() => {
            setShowPaymentModal(true);
            setSaved(false);
        }, 600);
    };

    // ── Submit RDV ──
    const handleRdvSubmit = () => {
        if (!selectedDate) return;
        sessionStorage.setItem('dressart_location', location);
        setShowPaymentModal(true);
    };

    // ── Payment confirm ──
    const handlePaymentConfirm = async () => {
        if (!isNameValid || !isPhoneValid || !userName || !userPhone) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        if (!model) return;
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
                        appointmentDate: mode === 'rdv' ? selectedDate : undefined,
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
            alert('Erreur lors de la création du paiement. Veuillez réessayer.');
            setIsProcessing(false);
        }
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!model) return <div>Modèle non trouvé</div>;
    if (!isOwnFabric && !tissu) return <div>Tissu non trouvé</div>;

    // ── Render ──
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="min-h-screen pt-20 px-4 lg:px-8 pb-16">
                <div className="">

                    {/* Bouton retour — même style que le reste du flow */}
                    <div className="fixed top-14 left-4 z-[60]">
                        <Link
                            href={`/models/${id}/tissus/${tissuId}/mesure`}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border border-gray-200 bg-white shadow-sm flex items-center justify-center"
                            aria-label="Retour"
                        >
                            <ArrowLeftIcon size={24} className="text-gray-700" />
                        </Link>
                    </div>

                    {/* ── Form mode ── */}
                    {mode === 'form' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Sidebar */}
                            <aside className="xl:col-span-1 space-y-4">
                                {/* Guide visuel — en haut de la sidebar */}
                                <div className="bg-white p-5 border border-gray-200 rounded-3xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <InfoIcon size={16} className="text-gray-500 shrink-0" />
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Guide des mesures</h3>
                                    </div>
                                    <BodySVGGuide />
                                    <ul className="mt-3 text-xs text-gray-500 space-y-1.5 list-disc list-inside">
                                        <li>Utilisez un mètre ruban souple</li>
                                        <li>Mesurez sur des sous-vêtements fins</li>
                                        <li>Tenez-vous droit, détendu</li>
                                        <li>Demandez de l&apos;aide pour le dos</li>
                                    </ul>
                                </div>

                                {/* Model card */}
                                <div className="bg-white p-5 border border-gray-200 rounded-3xl">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Votre modèle</h2>
                                    {model.image_url && (
                                        <div className="relative w-full rounded-2xl overflow-hidden mb-3" style={{ maxHeight: '280px' }}>
                                            <Image src={model.image_url} alt={model.nom} width={600} height={600} className="w-full h-auto object-cover" />
                                        </div>
                                    )}
                                    <p className="font-bold text-gray-900">{model.nom}</p>
                                    <div className="mt-2 flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 w-fit">
                                        <span className="text-xs opacity-70">À partir de</span>
                                        <span className="font-bold text-sm">{model.prix_base.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                </div>

                                {/* Tissu card */}
                                <div className="bg-white p-5 border border-gray-200 rounded-3xl">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Votre tissu</h2>
                                    {isOwnFabric ? (
                                        <p className="text-sm text-gray-600 py-3">Vous utilisez votre propre tissu.</p>
                                    ) : (
                                        <>
                                            {tissu?.image_url && (
                                                <div className="relative w-full rounded-2xl overflow-hidden mb-3" style={{ maxHeight: '180px' }}>
                                                    <Image src={tissu.image_url} alt={tissu.nom} width={600} height={600} className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                            <p className="font-bold text-gray-900">{tissu?.nom}</p>
                                            <p className="text-sm text-gray-500">{tissu?.texture}</p>
                                        </>
                                    )}
                                </div>

                            </aside>

                            {/* Main form */}
                            <section className="xl:col-span-2 bg-white p-6 lg:p-8 border border-gray-200 rounded-3xl">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <RulerIcon size={26} className="text-gray-900" />
                                        <h1 className="text-2xl font-bold">Mes mesures</h1>
                                    </div>
                                    {/* cm / inch toggle */}
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                        <button
                                            type="button"
                                            onClick={() => setUseInch(false)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!useInch ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            cm
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUseInch(true)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${useInch ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            inch
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-500 mb-2 text-sm">
                                    {useInch
                                        ? 'Les valeurs sont affichées en pouces. Champs * obligatoires.'
                                        : 'Toutes les mesures sont en centimètres. Les champs * sont obligatoires.'}
                                </p>

                                {loadedFromProfile && (
                                    <p className="text-sm text-green-600 mb-4">Vos mesures sauvegardées ont été pré-remplies.</p>
                                )}
                                {!loadedFromProfile && <div className="mb-4" />}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {SECTIONS.map(section => (
                                        <div key={section.title}>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">{section.title}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {section.fields.map(field => {
                                                    const fkey = field.key as keyof BodyMeasurements;
                                                    const displayVal = toDisplay(mesures[fkey], useInch);
                                                    return (
                                                        <div key={field.key}>
                                                            <label className="block text-sm font-semibold mb-1.5">
                                                                {field.label}{' '}
                                                                {field.required
                                                                    ? <span className="text-gray-400">*</span>
                                                                    : <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
                                                                }
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    value={displayVal}
                                                                    onChange={e => setField(fkey, e.target.value)}
                                                                    required={field.required}
                                                                    min="1"
                                                                    max={useInch ? '120' : '300'}
                                                                    step={useInch ? '0.1' : '1'}
                                                                    className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                                                    placeholder="0"
                                                                />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                                                                    {useInch ? 'in' : 'cm'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Location — uniquement si l'utilisateur a son propre tissu */}
                                    {isOwnFabric && (
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Lieu de récupération du tissu</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${location === 'cotonou' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                                    <input type="radio" name="location" value="cotonou" checked={location === 'cotonou'} onChange={() => setLocation('cotonou')} className="sr-only" />
                                                    <span className="font-semibold text-gray-900">Cotonou</span>
                                                    <span className="text-xs text-green-600 font-medium">Gratuit</span>
                                                </label>
                                                <label className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${location === 'calavi' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                                    <input type="radio" name="location" value="calavi" checked={location === 'calavi'} onChange={() => setLocation('calavi')} className="sr-only" />
                                                    <span className="font-semibold text-gray-900">Calavi</span>
                                                    <span className="text-xs text-gray-500 font-medium">+500 FCFA</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {!user && (
                                        <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                                            <Link href="/auth/login" className="font-semibold text-gray-900 underline underline-offset-2">Connectez-vous</Link>{' '}
                                            pour sauvegarder vos mesures et ne plus les ressaisir à chaque commande.
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || saving}
                                        className={`w-full py-4 rounded-full font-bold text-lg transition-all ${isFormValid && !saving ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {saved
                                            ? '✓ Mesures sauvegardées'
                                            : saving
                                                ? 'Sauvegarde...'
                                                : isOwnFabric
                                                    ? 'Sauvegarder et continuer'
                                                    : 'Confirmer et payer'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMode('rdv')}
                                        className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <CalendarIcon size={16} />
                                        Je n&apos;ai pas mes mesures — Prendre RDV
                                    </button>
                                </form>
                            </section>
                        </div>
                    )}

                    {/* ── RDV mode ── */}
                    {mode === 'rdv' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Sidebar */}
                            <aside className="xl:col-span-1 space-y-4">
                                <div className="bg-white p-5 border border-gray-200 rounded-3xl">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Votre modèle</h2>
                                    {model.image_url && (
                                        <div className="relative w-full rounded-2xl overflow-hidden mb-3" style={{ maxHeight: '280px' }}>
                                            <Image src={model.image_url} alt={model.nom} width={600} height={600} className="w-full h-auto object-cover" />
                                        </div>
                                    )}
                                    <p className="font-bold text-gray-900">{model.nom}</p>
                                    <div className="mt-2 flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 w-fit">
                                        <span className="text-xs opacity-70">À partir de</span>
                                        <span className="font-bold text-sm">{model.prix_base.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                </div>

                                <div className="bg-white p-5 border border-gray-200 rounded-3xl">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Votre tissu</h2>
                                    {isOwnFabric ? (
                                        <p className="text-sm text-gray-600 py-3">Vous utilisez votre propre tissu. Gardez-le lors du RDV.</p>
                                    ) : (
                                        <>
                                            {tissu?.image_url && (
                                                <div className="relative w-full rounded-2xl overflow-hidden mb-3" style={{ maxHeight: '180px' }}>
                                                    <Image src={tissu.image_url} alt={tissu.nom} width={600} height={600} className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                            <p className="font-bold text-gray-900">{tissu?.nom}</p>
                                            <p className="text-sm text-gray-500">{tissu?.texture}</p>
                                        </>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl">
                                    <div className="flex items-start gap-2 mb-2">
                                        <InfoIcon size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                        <h3 className="font-bold text-blue-900">Comment ça se passe</h3>
                                    </div>
                                    <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
                                        <li>Notre agent se déplace à l&apos;adresse de votre choix</li>
                                        <li>Il prend toutes vos mesures sur place</li>
                                        {isOwnFabric && <li>Il repart avec votre tissu pour l&apos;atelier</li>}
                                        <li>Durée estimée : 20–30 minutes</li>
                                        <li>Portez des vêtements fins pour plus de précision</li>
                                    </ul>
                                </div>
                            </aside>

                            {/* RDV form */}
                            <section className="xl:col-span-2 bg-white p-6 lg:p-8 border border-gray-200 rounded-3xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <CalendarIcon size={26} className="text-gray-900" />
                                    <h1 className="text-2xl font-bold">Prise de mesure à domicile</h1>
                                </div>
                                <p className="text-gray-500 text-sm mb-6">
                                    Un de nos agents se déplace chez vous pour prendre vos mesures.
                                    {isOwnFabric ? ' Il récupérera aussi votre tissu lors du même rendez-vous.' : ''}
                                </p>

                                <div className="flex justify-center mb-6">
                                    <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                                </div>

                                {selectedDate && (
                                    <p className="text-center text-sm text-gray-700 font-medium mb-6">
                                        RDV le{' '}
                                        <span className="text-gray-900 font-bold">
                                            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </p>
                                )}

                                {/* Location */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Lieu du rendez-vous</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${location === 'cotonou' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="rdv_location" value="cotonou" checked={location === 'cotonou'} onChange={() => setLocation('cotonou')} className="sr-only" />
                                            <span className="font-semibold text-gray-900">Cotonou</span>
                                            <span className="text-xs text-green-600 font-medium">Gratuit</span>
                                        </label>
                                        <label className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${location === 'calavi' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="rdv_location" value="calavi" checked={location === 'calavi'} onChange={() => setLocation('calavi')} className="sr-only" />
                                            <span className="font-semibold text-gray-900">Calavi</span>
                                            <span className="text-xs text-gray-500 font-medium">+500 FCFA</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRdvSubmit}
                                    disabled={!selectedDate}
                                    className={`w-full py-4 rounded-full font-bold text-lg transition-all ${selectedDate ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Confirmer le rendez-vous et payer
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode('form')}
                                    className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                                >
                                    Je connais déjà mes mesures
                                </button>
                            </section>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Payment modal ── */}
            {showPaymentModal && model && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Finaliser la commande</h3>

                        {/* Contact info */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Vos informations</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Nom complet *</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={e => setUserName(e.target.value)}
                                        placeholder="Ex: Pierre DOSSOU"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                    {userName && !isNameValid && (
                                        <p className="mt-1 text-sm text-red-600">Entrez votre nom complet (prénom + nom).</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Numéro WhatsApp *</label>
                                    <input
                                        type="tel"
                                        value={userPhone}
                                        onChange={e => setUserPhone(e.target.value)}
                                        placeholder="Ex: +229 01 XX XX XX XX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        required
                                    />
                                    {userPhone && !isPhoneValid && (
                                        <p className="mt-1 text-sm text-red-600">Minimum 8 chiffres.</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email <span className="text-gray-400 font-normal">(optionnel)</span></label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={e => setUserEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                    {userEmail && !isEmailValid && (
                                        <p className="mt-1 text-sm text-red-600">Email invalide.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recap */}
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
                                {(mode === 'rdv' || isOwnFabric) && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{mode === 'rdv' ? 'Lieu du RDV :' : 'Lieu de récupération :'}</span>
                                        <span className="font-semibold text-right">{location === 'cotonou' ? 'Cotonou' : 'Calavi'}</span>
                                    </div>
                                )}
                                {mode === 'rdv' && selectedDate && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">RDV :</span>
                                        <span className="font-semibold text-right">
                                            {selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment type */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Type de paiement</h4>
                            <div className="space-y-3">
                                <label
                                    className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all"
                                    style={{ borderColor: paymentType === 'partial' ? '#111827' : '#e5e7eb', backgroundColor: paymentType === 'partial' ? '#f9fafb' : 'white' }}
                                >
                                    <input type="radio" name="paymentType" value="partial" checked={paymentType === 'partial'} onChange={() => setPaymentType('partial')} className="w-5 h-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Acompte (30%)</div>
                                        <p className="text-sm text-gray-600 mt-1">Payez {Math.round(finalAmount * 0.3).toLocaleString('fr-FR')} FCFA maintenant</p>
                                        <p className="text-xs text-gray-500 mt-1">Le solde sera payé à la livraison</p>
                                    </div>
                                </label>
                                <label
                                    className="flex items-start gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all"
                                    style={{ borderColor: paymentType === 'full' ? '#111827' : '#e5e7eb', backgroundColor: paymentType === 'full' ? '#f9fafb' : 'white' }}
                                >
                                    <input type="radio" name="paymentType" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="w-5 h-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Paiement complet</div>
                                        <p className="text-sm text-gray-600 mt-1">Payez {finalAmount.toLocaleString('fr-FR')} FCFA maintenant</p>
                                        <p className="text-xs text-green-600 mt-1">Aucun paiement supplémentaire requis</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Payment details */}
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
                                {(mode === 'rdv' || isOwnFabric) && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{mode === 'rdv' ? 'Frais de déplacement' : 'Frais de récupération tissu'}</span>
                                        <span className="font-semibold">{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee} FCFA`}</span>
                                    </div>
                                )}
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

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowPaymentModal(false); setUserName(''); setUserPhone(''); setUserEmail(''); }}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                disabled={!isNameValid || !userPhone || !isPhoneValid || !isEmailValid || isProcessing}
                                className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${isNameValid && userPhone && isPhoneValid && isEmailValid && !isProcessing ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Traitement...</span>
                                    </>
                                ) : 'Confirmer et payer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
