import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { OrderService } from '@/lib/services/order.service';
import { redis } from '@/lib/services/redis.service';
import { supabase } from '@/lib/services/supabase.service';
import { sendWhatsApp } from '@/lib/services/whatsapp.service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId') || url.searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }

    const tx = await PaymentService.getTransactionStatus(transactionId);
    if (!tx) {
      return NextResponse.json({ error: 'Unable to retrieve transaction' }, { status: 404 });
    }

    const txData = tx as Record<string, unknown>;
    const status = txData.status as string | null;
    const approved = status === 'approved';

    if (!approved) {
      return NextResponse.json({ success: true, transactionId, status, approved });
    }

    // Check if order already exists (webhook may have already created it)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('order_number')
      .eq('transaction_id', transactionId)
      .single();

    if (existingOrder?.order_number) {
      return NextResponse.json({
        success: true, transactionId, status, approved,
        orderNumber: existingOrder.order_number,
      });
    }

    // Fallback: webhook hasn't fired yet — create order from Redis data
    const pendingPaymentData = await redis.get(`pending_payment:${transactionId}`);
    if (!pendingPaymentData) {
      // Redis expired or webhook already cleaned it up but order check missed it
      return NextResponse.json({ success: true, transactionId, status, approved });
    }

    const pendingPayment = JSON.parse(pendingPaymentData);
    const totalAmount = Number(pendingPayment.totalAmount);
    const amountToPay = Number(pendingPayment.amountToPay);
    const paidAmount = Number(txData.amount ?? amountToPay);

    if (Math.abs(paidAmount - amountToPay) > 1) {
      return NextResponse.json({ success: true, transactionId, status, approved });
    }

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
        transactionId,
      });
    } catch {
      // Concurrent creation (webhook fired in the meantime) — return existing order
      const { data: concurrentOrder } = await supabase
        .from('orders')
        .select('order_number')
        .eq('transaction_id', transactionId)
        .single();
      return NextResponse.json({
        success: true, transactionId, status, approved,
        orderNumber: concurrentOrder?.order_number ?? null,
      });
    }

    // Clean up Redis
    await redis.del(`pending_payment:${transactionId}`);

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

    // Auto-create Supabase account if first order
    const phone = pendingPayment.customerInfo.phone;
    const phoneE164 = phone.startsWith('+') ? phone : `+229${phone}`;
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const alreadyExists = existingUsers?.users?.some((u) => u.phone === phoneE164);
    if (!alreadyExists) {
      const { error: createUserError } = await supabase.auth.admin.createUser({
        phone: phoneE164,
        phone_confirm: true,
        user_metadata: { full_name: pendingPayment.customerInfo.name },
      });
      if (!createUserError) {
        await sendWhatsApp(
          phone,
          `Bonjour ${pendingPayment.customerInfo.name} 👋\n\nVotre compte DressArt a été créé automatiquement.\n\nConnectez-vous avec votre numéro WhatsApp pour suivre vos commandes : ${siteUrl}/auth/login\n\n— DressArt`
        );
      }
    }

    // WhatsApp confirmation commande
    await sendWhatsApp(
      order.customerPhone,
      `Bonjour ${order.customerName} 👋\n\nVotre commande *${order.orderNumber}* est confirmée ✅\n\nMontant payé : *${order.paidAmount.toLocaleString('fr-FR')} FCFA*${order.totalAmount > order.paidAmount ? `\nSolde restant : ${(order.totalAmount - order.paidAmount).toLocaleString('fr-FR')} FCFA (à la livraison)` : ''}\n\nSuivez votre commande : ${siteUrl}/suivi\n\nMerci de votre confiance — DressArt 🧵`
    );

    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
    if (adminPhone) {
      await sendWhatsApp(
        adminPhone,
        `🛍️ *Nouvelle commande*\n\n*${order.orderNumber}*\nClient : ${order.customerName} (${order.customerPhone})\nMontant payé : ${order.paidAmount.toLocaleString('fr-FR')} FCFA\nTotal : ${order.totalAmount.toLocaleString('fr-FR')} FCFA`
      );
    }

    return NextResponse.json({
      success: true, transactionId, status, approved,
      orderNumber: order.orderNumber,
    });

  } catch (error) {
    console.error('Verify payment status error:', error);
    return NextResponse.json({ error: 'Failed to verify payment status' }, { status: 500 });
  }
}
