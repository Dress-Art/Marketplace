import type { SuiviTimelineStep } from "@/lib/types/suivi.types";

const STEPS = [
  "Commande confirmée",
  "Paiement reçu",
  "Mesures validées",
  "Couture en cours",
  "Finitions",
  "Prêt pour livraison",
] as const;

/**
 * Builds a timeline from order status and created date.
 * Used when real timeline data is not available from DB.
 */
export const buildTimelineFromStatus = (
  status: string,
  createdAt: string
): SuiviTimelineStep[] => {
  const statusToStepIndex: Record<string, number> = {
    confirmed: 1,
    in_progress: 3,
    completed: 5,
    cancelled: 0,
  };
  const stepIndex = statusToStepIndex[status] ?? 0;
  const baseDate = new Date(createdAt);

  return STEPS.map((step, index) => {
    const completed = index <= stepIndex;
    const date = completed
      ? new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : "";
    return { step, date, completed };
  });
};
