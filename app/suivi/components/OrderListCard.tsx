"use client";

import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import CalendarIcon from "@/components/icons/CalendarIcon";
import type { SuiviOrder } from "@/lib/types/suivi.types";

interface OrderListCardProps {
  order: SuiviOrder;
  onClick: () => void;
}

export default function OrderListCard({ order, onClick }: OrderListCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
      aria-label={`Voir les détails de la commande ${order.orderNumber}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <CalendarIcon size={16} aria-hidden />
            {new Date(order.date).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Modèle</p>
          <p className="font-semibold text-gray-900">{order.modelName}</p>
        </div>
        <div>
          <p className="text-gray-600">Montant</p>
          <p className="font-semibold text-gray-900">
            {order.totalAmount.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>
    </div>
  );
}
