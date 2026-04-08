const MSGFLASH_URL = 'https://srv.msgflash.com/api/v1/messages/send';

export async function sendWhatsApp(phone: string, message: string): Promise<void> {
    const apiKey = process.env.MSGFLASH_API_KEY;
    const instanceId = process.env.MSGFLASH_INSTANCE_ID;

    if (!apiKey || !instanceId) {
        console.warn('MsgFlash not configured — skipping WhatsApp notification');
        return;
    }

    // Normalize to E.164: strip spaces/dashes, add +229 if no country code
    let to = phone.replace(/[\s\-]/g, '');
    if (!to.startsWith('+')) {
        to = '+229' + to;
    }

    const res = await fetch(MSGFLASH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({ instanceId, to, type: 'text', text: message }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('MsgFlash error:', res.status, err);
    }
}
