import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase.service';
import { sendWhatsApp } from '@/lib/services/whatsapp.service';
import { sendOrderStatusEmail } from '@/lib/services/resend.service';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    const { orderNumber } = await params;

    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.toUpperCase())
        .single();

    if (error || !order) {
        return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    let modelName = 'Modèle';
    if (order.model_id) {
        const { data: modele } = await supabase.from('modeles').select('nom').eq('id', order.model_id).single();
        if (modele?.nom) modelName = modele.nom;
    }

    let fabricName = 'Tissu personnel';
    if (order.fabric_id) {
        const { data: tissu } = await supabase.from('tissus').select('nom').eq('id', order.fabric_id).single();
        if (tissu?.nom) fabricName = tissu.nom;
    }

    return NextResponse.json({
        orderNumber: order.order_number,
        date: order.created_at,
        status: order.status,
        paymentStatus: order.payment_status,
        modelName,
        fabricName,
        totalAmount: order.total_amount,
        paidAmount: order.paid_amount,
        appointmentDate: order.appointment_date || null,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email || null,
    });
}

const VALID_STATUSES = ['confirmed', 'in_progress', 'completed', 'cancelled'];

const STATUS_WA_MESSAGES: Record<string, (name: string, orderNumber: string, siteUrl: string, remaining: number) => string> = {
    confirmed: (name, num, url) =>
        `Bonjour ${name} 👋\n\nVotre commande *${num}* est confirmée ✅\n\nNous allons commencer la fabrication très prochainement.\n\nSuivez votre commande : ${url}/suivi?order=${num}\n\n— DressArt 🧵`,
    in_progress: (name, num, url) =>
        `Bonjour ${name} 👋\n\nBonne nouvelle ! Votre commande *${num}* est en cours de fabrication 🧵\n\nNous vous préviendrons dès qu'elle sera prête.\n\nSuivi : ${url}/suivi?order=${num}\n\n— DressArt`,
    completed: (name, num, url, remaining) =>
        `Bonjour ${name} 🎉\n\nVotre vêtement est prêt ! Commande *${num}*\n\n${remaining > 0 ? `Solde restant à la livraison : *${remaining.toLocaleString('fr-FR')} FCFA*\n\n` : ''}Contactez-nous pour organiser la livraison.\n\nSuivi : ${url}/suivi?order=${num}\n\n— DressArt`,
    cancelled: (name, num, url) =>
        `Bonjour ${name},\n\nVotre commande *${num}* a été annulée.\n\nContactez-nous si vous avez des questions.\n\nSuivi : ${url}/suivi?order=${num}\n\n— DressArt`,
};

/**
 * PATCH /api/orders/[orderNumber]
 * Changer le statut d'une commande (dashboard admin)
 * Requiert : x-admin-key header
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    // Auth admin simple par clé secrète
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { orderNumber } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    // Récupérer la commande
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.toUpperCase())
        .single();

    if (fetchError || !order) {
        return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('order_number', orderNumber.toUpperCase());

    if (updateError) {
        return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    const remaining = (order.total_amount ?? 0) - (order.paid_amount ?? 0);

    // WhatsApp
    if (order.customer_phone) {
        const msgFn = STATUS_WA_MESSAGES[status];
        if (msgFn) {
            await sendWhatsApp(
                order.customer_phone,
                msgFn(order.customer_name, order.order_number, siteUrl, remaining)
            );
        }
    }

    // Email (si disponible)
    if (order.customer_email) {
        await sendOrderStatusEmail({
            to: order.customer_email,
            customerName: order.customer_name,
            orderNumber: order.order_number,
            status,
            totalAmount: order.total_amount ?? 0,
            paidAmount: order.paid_amount ?? 0,
            siteUrl,
        });
    }

    // Notif admin
    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
    if (adminPhone) {
        const statusEmoji: Record<string, string> = { confirmed: '✅', in_progress: '🧵', completed: '🎉', cancelled: '❌' };
        await sendWhatsApp(
            adminPhone,
            `${statusEmoji[status] ?? '📦'} *Statut mis à jour*\n\n*${order.order_number}* → ${STATUS_WA_MESSAGES[status] ? status.replace('_', ' ') : status}\nClient : ${order.customer_name} (${order.customer_phone})`
        );
    }

    return NextResponse.json({ success: true, orderNumber: order.order_number, status });
}
