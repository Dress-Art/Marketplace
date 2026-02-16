/**
 * Types for the suivi (order tracking) feature.
 * Display-friendly shape used across SuiviClient and ProfileClient.
 */

export type SuiviOrderStatus =
  | "En attente"
  | "En cours"
  | "En couture"
  | "Terminé"
  | "Livré";

export interface SuiviTimelineStep {
  step: string;
  date: string;
  completed: boolean;
}

export interface SuiviOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: SuiviOrderStatus;
  modelName: string;
  fabricName: string;
  totalAmount: number;
  estimatedDelivery: string;
  timeline: SuiviTimelineStep[];
}
