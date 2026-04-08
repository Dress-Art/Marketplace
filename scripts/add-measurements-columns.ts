/**
 * Run once to add body_measurements JSONB column to measurements table.
 * Usage: npx tsx --env-file=.env.local scripts/add-measurements-columns.ts
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function migrate() {
    const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE measurements ADD COLUMN IF NOT EXISTS body_measurements jsonb;`
    });

    if (error) {
        console.log('\n⚠ Run this SQL manually in Supabase SQL Editor:\n');
        console.log(`ALTER TABLE measurements ADD COLUMN IF NOT EXISTS body_measurements jsonb;`);
    } else {
        console.log('✓ Column body_measurements added to measurements table');
    }
}

migrate();
