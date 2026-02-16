"use client";

import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import TrackingIcon from "@/components/icons/TrackingIcon";
import type { SuiviOrder } from "@/lib/types/suivi.types";

interface OrderDetailCardProps {
  order: SuiviOrder;
}

export default function OrderDetailCard({ order }: OrderDetailCardProps) {
  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-200 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{order.orderNumber}</h2>
          <p className="text-gray-600">
            Commandé le {new Date(order.date).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
        <div>
          <p className="text-sm text-gray-600 mb-1">Modèle</p>
          <p className="font-semibold text-gray-900">{order.modelName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Tissu</p>
          <p className="font-semibold text-gray-900">{order.fabricName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Montant total</p>
          <p className="font-semibold text-gray-900">
            {order.totalAmount.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Livraison estimée</p>
          <p className="font-semibold text-gray-900">
            {new Date(order.estimatedDelivery).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrackingIcon size={24} aria-hidden />
          Suivi de fabrication
        </h3>
        <OrderTimeline steps={order.timeline} />
      </div>
    </div>
  );
}
