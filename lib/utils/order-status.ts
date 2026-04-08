/**
 * Order status utilities for consistent display across the app.
 * Maps DB status values to French labels and Tailwind color classes.
 */

export const ORDER_STATUS_LABELS: Record<string, string> = {
  confirmed: "En attente",
  in_progress: "En cours",
  "En attente": "En attente",
  "En cours": "En cours",
  "En couture": "En couture",
  Terminé: "Terminé",
  Livré: "Livré",
  completed: "Terminé",
  cancelled: "Annulé",
};

export const ORDER_STATUS_DISPLAY_ORDER = [
  "Commande confirmée",
  "Paiement reçu",
  "Mesures validées",
  "Couture en cours",
  "Finitions",
  "Prêt pour livraison",
] as const;

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case "En attente":
    case "confirmed":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "En cours":
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "En couture":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Terminé":
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Livré":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status] ?? status;
};
