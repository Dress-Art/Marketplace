export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { OrderService } from '@/lib/services/order.service';
import type { FedaPayWebhookPayload } from '@/lib/types/payment.types';
import { redis } from '@/lib/services/redis.service';
import { supabase } from '@/lib/services/supabase.service';

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

        if (!isValid && process.env.FEDAPAY_WEBHOOK_SECRET) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Check if payment was successful
        if (payload.transaction.status === 'approved') {
            console.log('Payment approved:', payload.transaction.id);

            // Check for duplicate (idempotence)
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('order_number')
                .eq('transaction_id', payload.transaction.id)
                .single();

            if (existingOrder) {
                console.log('Order already exists:', existingOrder.order_number);
                return NextResponse.json({
                    success: true,
                    orderNumber: existingOrder.order_number,
                });
            }

            // Retrieve pending payment details from Redis
            const pendingPaymentData = await redis.get(`pending_payment:${payload.transaction.id}`);

            if (!pendingPaymentData) {
                console.error('Pending payment not found for transaction:', payload.transaction.id);
                return NextResponse.json(
                    { error: 'Payment data not found' },
                    { status: 404 }
                );
            }

            const pendingPayment = JSON.parse(pendingPaymentData);

            // Create order in database
            const order = await OrderService.createOrder({
                customerName: pendingPayment.customerInfo.name,
                customerPhone: pendingPayment.customerInfo.phone,
                modelId: pendingPayment.orderDetails.modelId,
                fabricId: pendingPayment.orderDetails.fabricId,
                measurements: pendingPayment.orderDetails.measurements || null,
                appointmentDate: pendingPayment.orderDetails.appointmentDate || null,
                location: pendingPayment.orderDetails.location,
                specificLocation: pendingPayment.orderDetails.specificLocation || null,
                totalAmount: payload.transaction.amount,
                paidAmount: payload.transaction.amount,
                paymentStatus: pendingPayment.paymentType === 'full' ? 'paid' : 'partial',
                paymentType: pendingPayment.paymentType,
                status: 'confirmed',
                transactionId: payload.transaction.id,
            });

            console.log('Order created:', order.orderNumber);

            // Clean up pending payment
            await redis.del(`pending_payment:${payload.transaction.id}`);

            // TODO: Send SMS confirmation
            // await sendSMS({
            //     to: order.customerPhone,
            //     message: `Commande ${order.orderNumber} confirmée! Montant: ${order.paidAmount} FCFA. Suivez votre commande: ${process.env.NEXT_PUBLIC_URL}/suivi`
            // });

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

