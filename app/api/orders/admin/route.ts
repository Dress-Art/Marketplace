import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/orders/admin
 * Liste toutes les commandes — réservé au dashboard admin
 * Requiert : x-admin-key header
 */
export async function GET(request: NextRequest) {
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;

    let query = serviceClient
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: 'Erreur chargement commandes' }, { status: 500 });
    }

    // Enrichir avec noms modèle et tissu
    const enriched = await Promise.all((orders ?? []).map(async (order) => {
        let modelName = 'Modèle';
        let fabricName = 'Tissu personnel';

        if (order.model_id) {
            const { data: modele } = await serviceClient.from('modeles').select('nom').eq('id', order.model_id).single();
            if (modele?.nom) modelName = modele.nom;
        }
        if (order.fabric_id) {
            const { data: tissu } = await serviceClient.from('tissus').select('nom').eq('id', order.fabric_id).single();
            if (tissu?.nom) fabricName = tissu.nom;
        }

        // Filtre texte côté serveur
        if (search) {
            const q = search.toLowerCase();
            const matchName = order.customer_name?.toLowerCase().includes(q);
            const matchNum = order.order_number?.toLowerCase().includes(q);
            const matchPhone = order.customer_phone?.includes(search);
            if (!matchName && !matchNum && !matchPhone) return null;
        }

        return {
            id: order.id,
            orderNumber: order.order_number,
            date: order.created_at,
            status: order.status,
            paymentStatus: order.payment_status,
            modelName,
            fabricName,
            totalAmount: order.total_amount,
            paidAmount: order.paid_amount,
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            customerEmail: order.customer_email || null,
            appointmentDate: order.appointment_date || null,
            location: order.location || null,
        };
    }));

    const filtered = enriched.filter(Boolean);

    return NextResponse.json({ orders: filtered, total: count ?? filtered.length });
}
