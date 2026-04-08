"use client";

import type { SuiviOrder } from "@/lib/types/suivi.types";

interface SuiviInfoSectionProps {
  testOrders: SuiviOrder[];
  onOrderNumberClick: (orderNumber: string, order: SuiviOrder) => void;
}

export default function SuiviInfoSection({ testOrders, onOrderNumberClick }: SuiviInfoSectionProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="font-bold text-blue-900 mb-2">Comment suivre votre commande ?</h3>
      <ul className="text-sm text-blue-800 space-y-2">
        <li>
          • Vous avez reçu un numéro de commande par SMS après validation de votre paiement
        </li>
        <li>• Utilisez ce numéro pour suivre l&apos;état actuel de votre commande</li>
        <li>
          • Le suivi vous permet de voir l&apos;état de fabrication et la date estimée de
          livraison
        </li>
        <li>
          • Cliquez sur &quot;Voir toutes mes commandes&quot; pour consulter votre historique
          complet
        </li>
      </ul>

      {testOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="font-semibold text-blue-900 mb-2">Pour tester, essayez ces numéros :</p>
          <div className="flex flex-wrap gap-2">
            {testOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => onOrderNumberClick(order.orderNumber, order)}
                className="px-3 py-1 bg-white border border-blue-300 rounded-lg text-xs font-mono text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {order.orderNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
