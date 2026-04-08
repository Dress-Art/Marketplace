import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM || 'DressArt <contact@dressart.studio>';

const STATUS_LABELS: Record<string, string> = {
    confirmed: 'confirmée ✅',
    in_progress: 'en couture 🧵',
    completed: 'prête 🎉',
    cancelled: 'annulée',
};

const STATUS_MESSAGES: Record<string, string> = {
    confirmed: 'Votre commande a bien été enregistrée. Nous allons commencer la fabrication très prochainement.',
    in_progress: 'Nos couturiers ont commencé à travailler sur votre pièce. Nous vous préviendrons dès qu\'elle sera prête.',
    completed: 'Votre vêtement est prêt ! Contactez-nous pour organiser la livraison ou le retrait.',
    cancelled: 'Votre commande a été annulée. Contactez-nous si vous avez des questions.',
};

export async function sendOrderStatusEmail({
    to,
    customerName,
    orderNumber,
    status,
    totalAmount,
    paidAmount,
    siteUrl,
}: {
    to: string;
    customerName: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    paidAmount: number;
    siteUrl: string;
}): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
        console.warn('Resend not configured — skipping email');
        return;
    }

    const label = STATUS_LABELS[status] ?? status;
    const message = STATUS_MESSAGES[status] ?? '';
    const remaining = totalAmount - paidAmount;

    const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
            <h1 style="font-size:24px;font-weight:700;color:#111827;margin-bottom:4px;">DressArt</h1>
            <p style="color:#6b7280;font-size:14px;margin-bottom:32px;">Couture sur mesure au Bénin</p>

            <h2 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px;">
                Commande ${orderNumber} — ${label}
            </h2>
            <p style="color:#374151;margin-bottom:24px;">Bonjour ${customerName},<br/><br/>${message}</p>

            <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span style="color:#6b7280;font-size:14px;">Montant total</span>
                    <span style="font-weight:600;font-size:14px;">${totalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span style="color:#6b7280;font-size:14px;">Déjà payé</span>
                    <span style="font-weight:600;font-size:14px;color:#059669;">${paidAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
                ${remaining > 0 ? `
                <div style="display:flex;justify-content:space-between;">
                    <span style="color:#6b7280;font-size:14px;">Solde restant</span>
                    <span style="font-weight:600;font-size:14px;">${remaining.toLocaleString('fr-FR')} FCFA</span>
                </div>` : ''}
            </div>

            <a href="${siteUrl}/suivi?order=${orderNumber}"
               style="display:inline-block;background:#111827;color:#fff;padding:12px 28px;border-radius:99px;font-weight:600;font-size:14px;text-decoration:none;">
                Suivre ma commande
            </a>

            <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
                DressArt · Cotonou, Bénin<br/>
                Des questions ? Écrivez-nous à <a href="mailto:contact@dressart.studio" style="color:#6b7280;">contact@dressart.studio</a>
            </p>
        </div>
    `;

    const { error } = await resend.emails.send({
        from: FROM,
        to,
        subject: `Votre commande ${orderNumber} est ${label}`,
        html,
    });

    if (error) {
        console.error('Resend error:', error);
    }
}
