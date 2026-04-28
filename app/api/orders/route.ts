import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * GET /api/orders
 * Returns orders for the authenticated user (matched by phone stored in user metadata).
 * Requires Authorization: Bearer <access_token> header.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Verify the JWT and get user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const rawPhone = user.phone;
    if (!rawPhone) {
        return NextResponse.json({ orders: [] });
    }

    // customer_phone is stored as 8 local digits (e.g. "61198941"). user.phone may be
    // "+22961198941", "22961198941", or even contain a stray leading 0 — normalize.
    const digits = rawPhone.replace(/\D/g, '');
    const withoutCC = digits.startsWith('229') ? digits.slice(3) : digits;
    const localPhone = withoutCC.replace(/^0+/, '');

    // Fetch orders using service role key (bypasses RLS)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: orders, error } = await serviceClient
        .from('orders')
        .select('*')
        .eq('customer_phone', localPhone)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: 'Erreur lors du chargement des commandes' }, { status: 500 });
    }

    // Enrich with model and fabric names
    const enriched = await Promise.all((orders ?? []).map(async (order) => {
        let modelName = 'Modèle';
        let fabricName = 'Tissu personnel';

        if (order.model_id) {
            const { data: modele } = await serviceClient
                .from('modeles')
                .select('nom')
                .eq('id', order.model_id)
                .single();
            if (modele?.nom) modelName = modele.nom;
        }

        if (order.fabric_id) {
            const { data: tissu } = await serviceClient
                .from('tissus')
                .select('nom')
                .eq('id', order.fabric_id)
                .single();
            if (tissu?.nom) fabricName = tissu.nom;
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
        };
    }));

    return NextResponse.json({ orders: enriched });
}
