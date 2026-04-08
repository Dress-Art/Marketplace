'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CalendarIcon from '@/components/icons/CalendarIcon';
import TrackingIcon from '@/components/icons/TrackingIcon';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/api/supabase-client';

interface OrderSummary {
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    paymentStatus: string;
    modelName: string;
    fabricName: string;
    totalAmount: number;
    paidAmount: number;
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

export default function ProfileClient() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setOrdersLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch('/api/orders', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders ?? []);
            }
            setOrdersLoading(false);
        };

        fetchOrders();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const firstName = user.user_metadata?.first_name as string ?? '';
    const lastName = user.user_metadata?.last_name as string ?? '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || (user.email ?? 'Utilisateur');
    const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-6 py-12 pt-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Mon Profil</h1>
                    <p className="text-lg text-gray-600">Bienvenue sur votre espace personnel DressArt.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Informations du profil */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl font-bold text-gray-400">{initials}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <div className="space-y-3">
                                <Link
                                    href="/profile/settings"
                                    className="block w-full py-3 px-6 rounded-full font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all text-center"
                                >
                                    Paramètres du compte
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-3 px-6 rounded-full font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Historique des commandes */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <TrackingIcon size={24} />
                                Historique des commandes
                            </h2>

                            {ordersLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-900 hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-lg font-bold text-gray-900">{order.orderNumber}</span>
                                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                            {STATUS_LABELS[order.status] ?? order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <CalendarIcon size={14} />
                                                        Commandé le {new Date(order.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {order.totalAmount.toLocaleString('fr-FR')} FCFA
                                                    </p>
                                                    <Link
                                                        href={`/suivi?order=${order.orderNumber}`}
                                                        className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
                                                    >
                                                        Suivre la fabrication
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Modèle</p>
                                                    <p className="font-medium text-gray-900">{order.modelName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tissu</p>
                                                    <p className="font-medium text-gray-900">{order.fabricName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Vous n&apos;avez pas encore passé de commande.</p>
                                    <Link
                                        href="/models"
                                        className="inline-block mt-4 bg-gray-900 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-800 transition-all"
                                    >
                                        Découvrir nos modèles
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
