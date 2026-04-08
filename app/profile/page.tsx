import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo/config';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'Mon Profil',
    description: 'Consultez votre profil DressArt et votre historique de commandes.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: getCanonicalUrl('/profile'),
    },
};

export default function ProfilePage() {
    return <ProfileClient />;
}
