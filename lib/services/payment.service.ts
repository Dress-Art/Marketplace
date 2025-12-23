import FedaPay from 'fedapay';
import type { CreatePaymentSessionParams, PaymentSessionResponse } from '@/lib/types/payment.types';

// Initialize FedaPay
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);
FedaPay.setEnvironment(process.env.FEDAPAY_ENVIRONMENT || 'sandbox'); // 'sandbox' or 'live'

export class PaymentService {
    /**
     * Create a payment session with FedaPay
     * AC1: Opens payment session when user selects full or partial payment
     */
    static async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResponse> {
        try {
            // Calculate amount based on payment type
            const finalAmount = params.paymentType === 'partial'
                ? Math.round(params.amount * 0.3) // 30% deposit
                : params.amount;

            // Create FedaPay transaction
            const transaction = await FedaPay.Transaction.create({
                description: `Commande DressArt - ${params.paymentType === 'partial' ? 'Acompte 30%' : 'Paiement complet'}`,
                amount: finalAmount,
                currency: {
                    iso: 'XOF' // Franc CFA
                },
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/callback`,
                customer: {
                    firstname: params.customerInfo.name.split(' ')[0],
                    lastname: params.customerInfo.name.split(' ').slice(1).join(' ') || params.customerInfo.name,
                    email: `${params.customerInfo.phone}@dressart.com`, // Fallback email
                    phone_number: {
                        number: params.customerInfo.phone,
                        country: 'bj' // Benin
                    }
                }
            });

            // Generate payment token
            const token = await transaction.generateToken();

            return {
                sessionId: transaction.id,
                paymentUrl: token.url,
                amount: finalAmount
            };
        } catch (error) {
            console.error('FedaPay session creation error:', error);
            throw new Error('Failed to create payment session');
        }
    }

    /**
     * Verify webhook signature from FedaPay
     */
    static verifyWebhookSignature(payload: string, signature: string): boolean {
        try {
            const crypto = require('crypto');
            const secret = process.env.FEDAPAY_WEBHOOK_SECRET!;

            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

            return signature === expectedSignature;
        } catch (error) {
            console.error('Webhook signature verification error:', error);
            return false;
        }
    }

    /**
     * Get transaction status from FedaPay
     */
    static async getTransactionStatus(transactionId: string) {
        try {
            const transaction = await FedaPay.Transaction.retrieve(transactionId);
            return transaction;
        } catch (error) {
            console.error('Failed to retrieve transaction:', error);
            throw new Error('Failed to get transaction status');
        }
    }
}
