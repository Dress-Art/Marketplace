const { FedaPay, Transaction } = require('fedapay');
import type { CreatePaymentSessionParams, PaymentSessionResponse } from '@/lib/types/payment.types';

// Initialize FedaPay - called once at module load
// This is safe because we're using require() syntax which works in Node.js environment
let fedapayInitialized = false;

function initializeFedaPay() {
    if (fedapayInitialized) return;

    const apiKey = process.env.FEDAPAY_API_KEY;
    const environment = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';

    if (apiKey) {
        FedaPay.setApiKey(apiKey);
        FedaPay.setEnvironment(environment);
        fedapayInitialized = true;
    }
}

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

            // Check if FedaPay is configured
            const apiKey = process.env.FEDAPAY_API_KEY;

            if (!apiKey) {
                console.warn('FedaPay not configured - using placeholder for development');
                return {
                    sessionId: `dev_${Date.now()}`,
                    paymentUrl: '/payment/success?dev=true',
                    amount: finalAmount
                };
            }

            // Initialize FedaPay
            initializeFedaPay();

            // Create FedaPay transaction
            const transaction = await Transaction.create({
                description: `Commande DressArt - ${params.paymentType === 'partial' ? 'Acompte 30%' : 'Paiement complet'}`,
                amount: finalAmount,
                currency: {
                    iso: 'XOF' // Franc CFA
                },
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/callback`,
                customer: {
                    firstname: params.customerInfo.name.split(' ')[0],
                    lastname: params.customerInfo.name.split(' ').slice(1).join(' ') || params.customerInfo.name,
                    email: `${params.customerInfo.phone}@dressart.com`,
                    phone_number: {
                        number: params.customerInfo.phone,
                        country: 'bj'
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
            const secret = process.env.FEDAPAY_WEBHOOK_SECRET;

            if (!secret) {
                console.warn('FEDAPAY_WEBHOOK_SECRET not configured');
                return false;
            }

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
            const apiKey = process.env.FEDAPAY_API_KEY;

            if (!apiKey) {
                console.warn('FedaPay not configured');
                return null;
            }

            // Initialize FedaPay
            initializeFedaPay();

            // Retrieve transaction
            const transaction = await Transaction.retrieve(transactionId);
            return transaction;
        } catch (error) {
            console.error('Failed to retrieve transaction:', error);
            throw new Error('Failed to get transaction status');
        }
    }
}
