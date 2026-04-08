/**
 * Run once to create required Supabase Storage buckets.
 * Usage: npx tsx --env-file=.env.local scripts/setup-storage.ts
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function setup() {
    const { data: existing } = await supabase.storage.listBuckets();
    const bucketExists = existing?.some(b => b.name === 'fabrics');

    if (bucketExists) {
        console.log('✓ Bucket "fabrics" already exists');
        return;
    }

    const { error } = await supabase.storage.createBucket('fabrics', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    if (error) {
        console.error('✗ Error creating bucket:', error.message);
        process.exit(1);
    }

    console.log('✓ Bucket "fabrics" created (public, 10Mo max)');
    await setupPolicies();
}

async function setupPolicies() {
    // Allow anyone to upload to own-fabrics/
    const { error: e1 } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE POLICY IF NOT EXISTS "allow_public_insert_own_fabrics"
            ON storage.objects FOR INSERT
            WITH CHECK (bucket_id = 'fabrics' AND name LIKE 'own-fabrics/%');
        `
    });
    if (e1) {
        // rpc not available — print SQL to run manually
        console.log('\n⚠ Could not auto-create policy. Run this SQL in Supabase SQL Editor:\n');
        console.log(`
CREATE POLICY "allow_public_insert_own_fabrics"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fabrics' AND name LIKE 'own-fabrics/%');
        `);
    } else {
        console.log('✓ Storage policy created');
    }
}

setup();
