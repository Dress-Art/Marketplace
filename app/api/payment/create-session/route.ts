import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import type { CreatePaymentSessionParams, PendingPayment } from '@/lib/types/payment.types';
import { redis } from '@/lib/services/redis.service';
import { supabase } from '@/lib/services/supabase.service';

async function computeTotalAmount(params: CreatePaymentSessionParams): Promise<number> {
    const modelId = params.orderDetails?.modelId;
    if (!modelId) {
        throw new Error('Missing modelId');
    }

    const { data: model, error: modelError } = await supabase
        .from('modeles')
        .select('prix_base')
        .eq('id', modelId)
        .single();

    if (modelError || !model) {
        throw new Error('Invalid model');
    }

    let fabricPrice = 0;
    if (params.orderDetails.fabricId) {
        const { data: fabric, error: fabricError } = await supabase
            .from('tissus')
            .select('prix_metre')
            .eq('id', params.orderDetails.fabricId)
            .single();

        if (fabricError || !fabric) {
            throw new Error('Invalid fabric');
        }

        fabricPrice = Number(fabric.prix_metre) || 0;
    }

    const location = params.orderDetails.location;
    const deliveryFee = location === 'calavi' ? 500 : 0;
    return (Number(model.prix_base) || 0) + fabricPrice + deliveryFee;
}

/**
 * AC1: Create payment session
 * POST /api/payment/create-session
 */
export async function POST(request: NextRequest) {
    try {
        const body: CreatePaymentSessionParams = await request.json();

        // Validation
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

        if (!body.orderDetails?.modelId) {
            return NextResponse.json(
                { error: 'Model is required' },
                { status: 400 }
            );
        }

        if (body.orderDetails.location && !['cotonou', 'calavi'].includes(body.orderDetails.location)) {
            return NextResponse.json(
                { error: 'Invalid location' },
                { status: 400 }
            );
        }

        const totalAmount = await computeTotalAmount(body);
        if (totalAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid computed amount' },
                { status: 400 }
            );
        }

        const paymentPayload: CreatePaymentSessionParams = {
            ...body,
            amount: totalAmount,
            orderDetails: {
                ...body.orderDetails,
                location: body.orderDetails.location || 'cotonou',
            },
        };

        // Create payment session with FedaPay
        const session = await PaymentService.createSession(paymentPayload);

        // Prepare pending payment data
        const pendingPayment: PendingPayment = {
            sessionId: session.sessionId,
            customerInfo: body.customerInfo,
            orderDetails: {
                ...body.orderDetails,
                location: body.orderDetails.location || 'cotonou',
                appointmentDate: body.orderDetails?.appointmentDate 
                    ? new Date(body.orderDetails.appointmentDate).toISOString() 
                    : undefined,
            },
            paymentType: body.paymentType,
            amountToPay: session.amount,
            totalAmount,
            createdAt: new Date().toISOString(),
        };

        // Store in Redis (Supabase backend) with 1 hour expiration
        await redis.setex(
            `pending_payment:${session.sessionId}`, 
            3600, 
            JSON.stringify(pendingPayment)
        );

        return NextResponse.json({
            success: true,
            sessionId: session.sessionId,
            paymentUrl: session.paymentUrl,
            amount: session.amount,
        });

    } catch (error) {
        console.error('Create payment session error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment session' },
            { status: 500 }
        );
    }
}
