import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import type { CreatePaymentSessionParams, PendingPayment } from '@/lib/types/payment.types';

/**
 * AC1: Create payment session
 * POST /api/payment/create-session
 */
export async function POST(request: NextRequest) {
    try {
        const body: CreatePaymentSessionParams = await request.json();

        // Validation
        if (!body.amount || body.amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        if (!body.customerInfo?.name || !body.customerInfo?.phone) {
            return NextResponse.json(
                { error: 'Customer information is required' },
                { status: 400 }
            );
        }

        if (!body.paymentType || !['full', 'partial'].includes(body.paymentType)) {
            return NextResponse.json(
                { error: 'Invalid payment type' },
                { status: 400 }
            );
        }

        // Create payment session with FedaPay
        const session = await PaymentService.createSession(body);

        // Store pending payment details temporarily (in production, use Redis or database)
        // For now, we'll use a simple in-memory store or localStorage on client
        const pendingPayment: PendingPayment = {
            sessionId: session.sessionId,
            customerInfo: body.customerInfo,
            orderDetails: {
                ...body.orderDetails,
                appointmentDate: body.orderDetails.appointmentDate?.toISOString(),
            },
            paymentType: body.paymentType,
            amount: session.amount,
            createdAt: new Date().toISOString(),
        };

        // In production, store this in Redis with expiration
        // await redis.setex(`pending_payment:${session.sessionId}`, 3600, JSON.stringify(pendingPayment));

        // For now, we'll pass it back to the client to store temporarily
        return NextResponse.json({
            success: true,
            sessionId: session.sessionId,
            paymentUrl: session.paymentUrl,
            amount: session.amount,
            pendingPayment, // Client will store this temporarily
        });

    } catch (error) {
        console.error('Create payment session error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment session' },
            { status: 500 }
        );
    }
}
