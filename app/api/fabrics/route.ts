// Next.js API Route - Proxy for Supabase Fabrics Function
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Get params from request body
        const params = await request.json();

        console.log('Calling Supabase function marketplace-fabrics-list with params:', params);

        // Call Supabase edge function from server
        const { data, error } = await supabase.functions.invoke('marketplace-fabrics-list', {
            body: JSON.stringify(params),
        });

        if (error) {
            console.error('Supabase function error:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to fetch fabrics' },
                { status: 500 }
            );
        }

        console.log('Supabase function success');
        return NextResponse.json(data);
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
