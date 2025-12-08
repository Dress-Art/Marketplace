'use client';

import { useState } from 'react';
import Header from '@/components/models/Header';
import SearchIcon from '@/components/icons/SearchIcon';
import TrackingIcon from '@/components/icons/TrackingIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import { ordersData, Order } from './orders-data';

export default function SuiviClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showAllOrders, setShowAllOrders] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const order = ordersData.find(o => o.orderNumber === searchQuery.toUpperCase());
        if (order) {
            setSelectedOrder(order);
            setShowAllOrders(false);
        } else {
            alert('Commande non trouvée. Vérifiez votre numéro de commande.');
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'En attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'En cours':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'En couture':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Terminé':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Livré':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* Header fixe */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Main content */}
            <main className="min-h-screen pt-16">
                <div className="max-w-6xl mx-auto p-4 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
                        <p className="text-gray-600">Entrez votre numéro de commande ou consultez votre historique</p>
                    </div>

                    {/* Formulaire de recherche */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Numéro de commande</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ex: CMD-2024-001"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                    <SearchIcon 
                                        size={20} 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all cursor-pointer"
                                >
                                    Suivre ma commande
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAllOrders(true);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex-1 bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                                >
                                    Voir toutes mes commandes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Affichage d'une commande spécifique */}
                    {selectedOrder && !showAllOrders && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOrder.orderNumber}</h2>
                                    <p className="text-gray-600">Commandé le {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full border font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            {/* Détails de la commande */}
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
                                    <p className="font-semibold text-gray-900">{selectedOrder.totalAmount.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Livraison estimée</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline de suivi */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrackingIcon size={24} />
                                    Suivi de fabrication
                                </h3>
                                <div className="space-y-4">
                                    {selectedOrder.timeline.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    item.completed 
                                                        ? 'bg-green-500 border-green-500' 
                                                        : 'bg-white border-gray-300'
                                                }`} />
                                                {index < selectedOrder.timeline.length - 1 && (
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
                                                {item.date && (
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

                    {/* Affichage de toutes les commandes */}
                    {showAllOrders && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Historique des commandes</h2>
                            {ordersData.map((order) => (
                                <div 
                                    key={order.id}
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowAllOrders(false);
                                    }}
                                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <CalendarIcon size={16} />
                                                {new Date(order.date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Modèle</p>
                                            <p className="font-semibold text-gray-900">{order.modelName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Montant</p>
                                            <p className="font-semibold text-gray-900">{order.totalAmount.toLocaleString('fr-FR')} FCFA</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section d'information */}
                    {!selectedOrder && !showAllOrders && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-bold text-blue-900 mb-2">Comment suivre votre commande ?</h3>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• Vous avez reçu un numéro de commande par SMS après validation de votre paiement</li>
                                <li>• Utilisez ce numéro pour suivre l'état actuel de votre commande</li>
                                <li>• Le suivi vous permet de voir l'état de fabrication et la date estimée de livraison</li>
                                <li>• Cliquez sur "Voir toutes mes commandes" pour consulter votre historique complet</li>
                            </ul>
                            
                            {/* Exemples de numéros de commande pour tester */}
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="font-semibold text-blue-900 mb-2">Pour tester, essayez ces numéros :</p>
                                <div className="flex flex-wrap gap-2">
                                    {ordersData.map(order => (
                                        <button
                                            key={order.id}
                                            onClick={() => {
                                                setSearchQuery(order.orderNumber);
                                                setSelectedOrder(order);
                                            }}
                                            className="px-3 py-1 bg-white border border-blue-300 rounded-lg text-xs font-mono text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
                                        >
                                            {order.orderNumber}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
