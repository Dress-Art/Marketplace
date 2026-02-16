import type { SuiviOrder } from "@/lib/types/suivi.types";

/**
 * Fetches order tracking data by order number.
 * @param orderNumber - Order number (e.g. CMD-2024-001)
 * @returns SuiviOrder or null if not found
 */
export async function fetchOrderByNumber(orderNumber: string): Promise<SuiviOrder | null> {
  const normalized = orderNumber.trim().toUpperCase();
  if (!normalized) return null;

  try {
    const response = await fetch(`/api/suivi/${encodeURIComponent(normalized)}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error((data.error as string) || "Erreur lors de la récupération de la commande");
    }

    const data = await response.json();
    return data as SuiviOrder;
  } catch (error) {
    console.error("fetchOrderByNumber error:", error);
    throw error;
  }
}
