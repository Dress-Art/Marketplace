import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo/config';
import SuiviClient from './SuiviClient';

export const metadata: Metadata = {
    title: 'Suivi de Commande',
    description: 'Suivez l\'état de votre commande DressArt en temps réel. Entrez votre numéro de commande pour voir l\'avancement de votre vêtement sur mesure.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: getCanonicalUrl('/suivi'),
    },
};

export default function SuiviPage() {
    return <SuiviClient />;
}
