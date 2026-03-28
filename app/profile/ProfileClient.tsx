"use client";

import Header from "@/components/landing-page/Header";
import CalendarIcon from "@/components/icons/CalendarIcon";
import TrackingIcon from "@/components/icons/TrackingIcon";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { ordersData } from "@/lib/constants/suivi-orders";
import Link from "next/link";

export default function ProfileClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
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
                  <span className="text-3xl font-bold text-gray-400">JD</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Jane Doe</h2>
                <p className="text-gray-500">jane.doe@example.com</p>
              </div>
              <div className="space-y-4">
                <button className="w-full py-3 px-6 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer">
                  Modifier mon profil
                </button>
                <button className="w-full py-3 px-6 rounded-full font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-all cursor-pointer">
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

              <div className="space-y-6">
                {ordersData.length > 0 ? (
                  ordersData.map((order) => (
                    <div
                      key={order.id}
                      className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-900 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-gray-900">
                              {order.orderNumber}
                            </span>
                            <OrderStatusBadge status={order.status} size="sm" />
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <CalendarIcon size={14} />
                            Commandé le {new Date(order.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {order.totalAmount.toLocaleString("fr-FR")} FCFA
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
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Modèle
                          </p>
                          <p className="font-medium text-gray-900">{order.modelName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Tissu
                          </p>
                          <p className="font-medium text-gray-900">{order.fabricName}</p>
                        </div>
                      </div>
                    </div>
                  ))
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
        </div>
      </main>
    </div>
  );
}
