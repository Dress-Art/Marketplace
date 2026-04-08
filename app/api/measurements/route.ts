import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getUserClient(token: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });
}
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function getAuthUser(request: NextRequest) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const { data: { user } } = await getUserClient(token).auth.getUser();
    return user ?? null;
}

export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { data } = await serviceClient
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    return NextResponse.json({ measurements: data ?? null });
}

export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const body = await request.json();
    const { height, weight, body_measurements } = body;

    // Upsert — one row per user
    const { data, error } = await serviceClient
        .from('measurements')
        .upsert(
            { user_id: user.id, height, weight, body_measurements, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
        )
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ measurements: data });
}
