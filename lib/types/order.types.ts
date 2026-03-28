// Order Types
export interface CreateOrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  modelId: number;
  fabricId: number | null;
  measurements?: {
    taille: string;
    tourPoitrine: string;
    tourHanches: string;
    tourTaille: string;
    largeurEpaules: string;
    longueurBras: string;
  };
  appointmentDate?: string;
  location: string;
  specificLocation?: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: "pending" | "partial" | "paid";
  paymentType: "full" | "partial";
  status: "confirmed" | "in_progress" | "completed" | "cancelled";
  transactionId?: string; // FedaPay transaction ID for idempotence
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  modelId: number;
  fabricId: number | null;
  measurements?: Record<string, string>;
  appointmentDate?: string;
  location: string;
  specificLocation?: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  paymentType: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
