import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Supabase custom SMS hook — envoie l'OTP via WhatsApp (MsgFlash)
 * Configure dans Supabase : Authentication > Hooks > Send SMS
 * Secret format : v1,whsec_{base64Key}
 * Supabase envoie header webhook-signature: v1,{hmac_sha256_base64}
 */

function verifySupabaseSignature(
    rawBody: string,
    signature: string,
    secret: string,
    webhookId: string,
    webhookTimestamp: string,
): boolean {
    try {
        // secret format: "v1,whsec_{base64Key}"
        const commaIdx = secret.indexOf(',');
        if (commaIdx === -1) return false;
        const version = secret.slice(0, commaIdx);
        const whsec = secret.slice(commaIdx + 1);
        if (version !== 'v1' || !whsec.startsWith('whsec_')) return false;

        const keyBase64 = whsec.slice('whsec_'.length);
        const key = Buffer.from(keyBase64, 'base64');

        // Standard Webhooks: sign "{webhook-id}.{webhook-timestamp}.{body}"
        const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

        // Supabase sends: v1,{base64_hmac}
        const sigCommaIdx = signature.indexOf(',');
        if (sigCommaIdx === -1) return false;
        const sigVersion = signature.slice(0, sigCommaIdx);
        const sigValue = signature.slice(sigCommaIdx + 1);
        if (sigVersion !== 'v1') return false;

        const computed = crypto.createHmac('sha256', key).update(signedContent).digest('base64');

        if (sigValue.length !== computed.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sigValue), Buffer.from(computed));
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    const rawBody = await request.text();

    const secret = process.env.SUPABASE_SMS_HOOK_SECRET;
    if (secret) {
        const sig = request.headers.get('webhook-signature') ?? '';
        const webhookId = request.headers.get('webhook-id') ?? '';
        const webhookTimestamp = request.headers.get('webhook-timestamp') ?? '';
        if (!sig || !verifySupabaseSignature(rawBody, sig, secret, webhookId, webhookTimestamp)) {
            console.error('SMS hook: invalid signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    let body: Record<string, unknown>;
    try {
        body = JSON.parse(rawBody);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Supabase envoie : { user: { phone }, otp, type }
    const phone: string = (body?.user as Record<string, unknown>)?.phone as string ?? body?.phone as string ?? '';
    const otp: string = body?.otp as string ?? '';

    if (!phone || !otp) {
        return NextResponse.json({ error: 'Missing phone or otp' }, { status: 400 });
    }

    const apiKey = process.env.MSGFLASH_API_KEY;
    const instanceId = process.env.MSGFLASH_INSTANCE_ID;

    if (!apiKey || !instanceId) {
        console.warn('MsgFlash not configured');
        return NextResponse.json({ success: true }); // Dev mode
    }

    // Normaliser en E.164
    let to = phone.replace(/[\s\-]/g, '');
    if (!to.startsWith('+')) {
        to = '+229' + to;
    }

    const message = `Votre code de connexion DressArt : *${otp}*\n\nCe code expire dans 10 minutes. Ne le partagez jamais.`;

    const res = await fetch('https://srv.msgflash.com/api/v1/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({ instanceId, to, type: 'text', text: message }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('MsgFlash OTP error:', res.status, err);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
