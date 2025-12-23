import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { OrderService } from '@/lib/services/order.service';
import type { FedaPayWebhookPayload } from '@/lib/types/payment.types';

/**
 * AC2: Handle payment callback and create order
 * POST /api/payment/callback
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const payload: FedaPayWebhookPayload = JSON.parse(body);

        // Verify webhook signature (important for security)
        const signature = request.headers.get('x-fedapay-signature') || '';
        const isValid = PaymentService.verifyWebhookSignature(body, signature);

        if (!isValid && process.env.NODE_ENV === 'production') {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Check if payment was successful
        if (payload.transaction.status === 'approved') {
            console.log('Payment approved:', payload.transaction.id);

            // Retrieve pending payment details
            // In production: const pendingPaymentData = await redis.get(`pending_payment:${payload.id}`);
            // For now, we'll get it from the transaction description or custom_metadata

            // Get transaction details from FedaPay to retrieve custom metadata
            const transaction = await PaymentService.getTransactionStatus(payload.transaction.id);

            // Extract order details from transaction metadata
            // Note: In production, you should store these in Redis/DB when creating session
            const customMetadata = (transaction as any).custom_metadata || {};

            // Create order in database
            const order = await OrderService.createOrder({
                customerName: payload.transaction.customer.firstname + ' ' + payload.transaction.customer.lastname,
                customerPhone: payload.transaction.customer.phone_number.number,
                modelId: customMetadata.modelId || 0,
                fabricId: customMetadata.fabricId || null,
                measurements: customMetadata.measurements || null,
                appointmentDate: customMetadata.appointmentDate || null,
                location: customMetadata.location || 'cotonou',
                specificLocation: customMetadata.specificLocation || null,
                totalAmount: payload.transaction.amount,
                paidAmount: payload.transaction.amount,
                paymentStatus: customMetadata.paymentType === 'full' ? 'paid' : 'partial',
                paymentType: customMetadata.paymentType || 'full',
                status: 'confirmed',
            });

            console.log('Order created:', order.orderNumber);

            // TODO: Send SMS confirmation
            // await sendSMS({
            //     to: order.customerPhone,
            //     message: `Commande ${order.orderNumber} confirmée! Montant: ${order.paidAmount} FCFA. Suivez votre commande: ${process.env.NEXT_PUBLIC_URL}/suivi`
            // });

            // Clean up pending payment
            // await redis.del(`pending_payment:${payload.id}`);

            return NextResponse.json({
                success: true,
                orderNumber: order.orderNumber,
            });
        } else {
            console.log('Payment not approved:', payload.transaction.status, payload.reason);
            return NextResponse.json({
                success: false,
                status: payload.transaction.status,
                reason: payload.reason,
            });
        }

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json(
            { error: 'Failed to process payment callback' },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
    return NextResponse.json({
        message: 'Payment callback endpoint is active',
        timestamp: new Date().toISOString(),
    });
}
