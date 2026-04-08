export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { OrderService } from '@/lib/services/order.service';
import type { FedaPayWebhookPayload } from '@/lib/types/payment.types';
import { redis } from '@/lib/services/redis.service';
import { supabase } from '@/lib/services/supabase.service';
import { sendWhatsApp } from '@/lib/services/whatsapp.service';

/**
 * AC2: Handle payment callback and create order
 * POST /api/payment/callback
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const payload: FedaPayWebhookPayload = JSON.parse(body);

        // Verify webhook signature (important for security)
        const webhookSecret = process.env.FEDAPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('FEDAPAY_WEBHOOK_SECRET is missing. Rejecting callback for safety.');
            return NextResponse.json(
                { error: 'Webhook not configured' },
                { status: 503 }
            );
        }

        const signature = request.headers.get('x-fedapay-signature') || '';
        const isValid = PaymentService.verifyWebhookSignature(body, signature);

        if (!isValid) {
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
            const totalAmount = Number(pendingPayment.totalAmount || payload.transaction.amount);
            const amountToPay = Number(pendingPayment.amountToPay || payload.transaction.amount);
            const paidAmount = Number(payload.transaction.amount);

            if (paidAmount <= 0 || Math.abs(paidAmount - amountToPay) > 1) {
                console.error('Paid amount mismatch', {
                    transactionId: payload.transaction.id,
                    expected: amountToPay,
                    got: paidAmount,
                });

                return NextResponse.json(
                    { error: 'Amount mismatch' },
                    { status: 400 }
                );
            }

            // Create order in database
            let order;
            try {
                order = await OrderService.createOrder({
                    customerName: pendingPayment.customerInfo.name,
                    customerPhone: pendingPayment.customerInfo.phone,
                    modelId: pendingPayment.orderDetails.modelId,
                    fabricId: pendingPayment.orderDetails.fabricId,
                    measurements: pendingPayment.orderDetails.measurements || null,
                    appointmentDate: pendingPayment.orderDetails.appointmentDate || null,
                    location: pendingPayment.orderDetails.location,
                    specificLocation: pendingPayment.orderDetails.specificLocation || null,
                    totalAmount,
                    paidAmount,
                    paymentStatus: pendingPayment.paymentType === 'full' ? 'paid' : 'partial',
                    paymentType: pendingPayment.paymentType,
                    status: 'confirmed',
                    transactionId: payload.transaction.id,
                });
            } catch (createError) {
                // If a concurrent callback inserted the order first, return it as success.
                const { data: concurrentOrder } = await supabase
                    .from('orders')
                    .select('order_number')
                    .eq('transaction_id', payload.transaction.id)
                    .single();

                if (concurrentOrder?.order_number) {
                    console.log('Order already created concurrently:', concurrentOrder.order_number);
                    return NextResponse.json({
                        success: true,
                        orderNumber: concurrentOrder.order_number,
                    });
                }

                throw createError;
            }

            console.log('Order created:', order.orderNumber);

            // Clean up pending payment
            await redis.del(`pending_payment:${payload.transaction.id}`);

            const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

            // Créer le compte Supabase si c'est la première commande de ce numéro
            const phone = pendingPayment.customerInfo.phone;
            const phoneE164 = phone.startsWith('+') ? phone : `+229${phone}`;
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            const alreadyExists = existingUser?.users?.some(u => u.phone === phoneE164);
            if (!alreadyExists) {
                const { error: createUserError } = await supabase.auth.admin.createUser({
                    phone: phoneE164,
                    phone_confirm: true,
                    user_metadata: {
                        full_name: pendingPayment.customerInfo.name,
                    },
                });
                if (!createUserError) {
                    await sendWhatsApp(
                        phone,
                        `Bonjour ${pendingPayment.customerInfo.name} 👋\n\nVotre compte DressArt a été créé automatiquement.\n\nConnectez-vous avec votre numéro WhatsApp pour suivre vos commandes : ${siteUrl}/auth/login\n\n— DressArt`
                    );
                }
            }

            // Send WhatsApp confirmation de commande au client
            await sendWhatsApp(
                order.customerPhone,
                `Bonjour ${order.customerName} 👋\n\nVotre commande *${order.orderNumber}* est confirmée ✅\n\nMontant payé : *${order.paidAmount.toLocaleString('fr-FR')} FCFA*${order.totalAmount > order.paidAmount ? `\nSolde restant : ${(order.totalAmount - order.paidAmount).toLocaleString('fr-FR')} FCFA (à la livraison)` : ''}\n\nSuivez votre commande : ${siteUrl}/suivi\n\nMerci de votre confiance — DressArt 🧵`
            );

            // Notif admin
            const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
            if (adminPhone) {
                await sendWhatsApp(
                    adminPhone,
                    `🛍️ *Nouvelle commande*\n\n*${order.orderNumber}*\nClient : ${order.customerName} (${order.customerPhone})\nMontant payé : ${order.paidAmount.toLocaleString('fr-FR')} FCFA\nTotal : ${order.totalAmount.toLocaleString('fr-FR')} FCFA\n\nVoir : ${siteUrl}/api/orders/admin`
                );
            }

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

