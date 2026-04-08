'use client';

import { useState } from 'react';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackingIcon from '@/components/icons/TrackingIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';

interface OrderResult {
    orderNumber: string;
    date: string;
    status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    paymentStatus: string;
    modelName: string;
    fabricName: string;
    totalAmount: number;
    paidAmount: number;
    appointmentDate: string | null;
}

const STATUS_LABELS: Record<string, string> = {
    confirmed: 'En attente',
    in_progress: 'En couture',
    completed: 'Terminé',
    cancelled: 'Annulé',
};

const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const TIMELINE_STEPS = [
    { label: 'Commande confirmée', completedFrom: ['confirmed', 'in_progress', 'completed'] },
    { label: 'Paiement reçu', completedFrom: ['confirmed', 'in_progress', 'completed'] },
    { label: 'Mesures validées', completedFrom: ['in_progress', 'completed'] },
    { label: 'Couture en cours', completedFrom: ['in_progress', 'completed'] },
    { label: 'Finitions', completedFrom: ['completed'] },
    { label: 'Prêt pour livraison', completedFrom: ['completed'] },
];

function getTimeline(status: string, orderDate: string) {
    return TIMELINE_STEPS.map((step) => ({
        step: step.label,
        completed: step.completedFrom.includes(status),
        date: step.completedFrom.includes(status) ? orderDate : null,
    }));
}

export default function SuiviClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setNotFound(false);
        setSelectedOrder(null);

        try {
            const res = await fetch(`/api/orders/${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
            if (res.status === 404) {
                setNotFound(true);
                return;
            }
            if (!res.ok) throw new Error();
            const data: OrderResult = await res.json();
            setSelectedOrder(data);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const statusLabel = selectedOrder ? (STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status) : '';
    const statusColor = selectedOrder ? (STATUS_COLORS[selectedOrder.status] ?? 'bg-gray-100 text-gray-800 border-gray-200') : '';
    const timeline = selectedOrder ? getTimeline(selectedOrder.status, selectedOrder.date) : [];

    return (
        <div className="min-h-screen relative">
            <main className="min-h-screen pt-16">
                <div className="max-w-6xl mx-auto p-4 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
                        <p className="text-gray-600">Entrez votre numéro de commande pour suivre sa progression</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Numéro de commande</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ex: CMD-2025-0001"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                    <SearchIcon
                                        size={20}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !searchQuery.trim()}
                                className="w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Recherche...' : 'Suivre ma commande'}
                            </button>
                        </form>
                    </div>

                    {notFound && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                            <p className="text-red-800 font-semibold">Commande introuvable.</p>
                            <p className="text-red-700 text-sm mt-1">Vérifiez votre numéro de commande (ex: CMD-2025-0001). Il vous a été communiqué après validation de votre paiement.</p>
                        </div>
                    )}

                    {selectedOrder && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOrder.orderNumber}</h2>
                                    <p className="text-gray-600 flex items-center gap-1">
                                        <CalendarIcon size={16} />
                                        Commandé le {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full border font-semibold ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Modèle</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.modelName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tissu</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.fabricName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Montant total</p>
                                    <p className="font-semibold text-gray-900">{(selectedOrder.totalAmount ?? 0).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Montant payé</p>
                                    <p className="font-semibold text-gray-900">{(selectedOrder.paidAmount ?? 0).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                {selectedOrder.appointmentDate && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Rendez-vous</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(selectedOrder.appointmentDate).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrackingIcon size={24} />
                                    Suivi de fabrication
                                </h3>
                                <div className="space-y-4">
                                    {timeline.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    item.completed
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'bg-white border-gray-300'
                                                }`} />
                                                {index < timeline.length - 1 && (
                                                    <div className={`w-0.5 h-12 ${
                                                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                                                    }`} />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className={`font-semibold ${
                                                    item.completed ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                    {item.step}
                                                </p>
                                                {item.completed && item.date && (
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(item.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedOrder && !notFound && !loading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-bold text-blue-900 mb-2">Comment suivre votre commande ?</h3>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• Vous avez reçu un numéro de commande par SMS après validation de votre paiement</li>
                                <li>• Utilisez ce numéro pour suivre l&apos;état actuel de votre commande</li>
                                <li>• Le suivi vous permet de voir l&apos;état de fabrication en temps réel</li>
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
