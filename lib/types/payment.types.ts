// Payment Types
export interface CreatePaymentSessionParams {
    amount: number;
    paymentType: 'full' | 'partial';
    customerInfo: {
        name: string;
        phone: string;
        email?: string;
    };
    orderDetails: {
        modelId: string;
        fabricId: string | null;
        measurements?: {
            taille: string;
            tourPoitrine: string;
            tourHanches: string;
            tourTaille: string;
            largeurEpaules: string;
            longueurBras: string;
        };
        appointmentDate?: Date;
        location?: 'cotonou' | 'calavi';
        specificLocation?: string;
    };
}

export interface PaymentSessionResponse {
    sessionId: string;
    paymentUrl: string;
    amount: number;
}

export interface FedaPayWebhookPayload {
    id: string;
    transaction: {
        id: string;
        reference: string;
        amount: number;
        status: 'approved' | 'declined' | 'pending';
        description: string;
        customer: {
            firstname: string;
            lastname: string;
            email?: string;
            phone_number: {
                number: string;
                country: string;
            };
        };
    };
    reason?: string;
}

export interface PendingPayment {
    sessionId: string;
    customerInfo: {
        name: string;
        phone: string;
    };
    orderDetails: {
        modelId: string;
        fabricId: string | null;
        measurements?: Record<string, string>;
        appointmentDate?: string;
        location: 'cotonou' | 'calavi';
        specificLocation?: string;
    };
    paymentType: 'full' | 'partial';
    amountToPay: number;
    totalAmount: number;
    createdAt: string;
}
