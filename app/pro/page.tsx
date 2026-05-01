import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/landing-page/Footer';
import { seoConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
    title: 'Espace Pro — Rejoignez DressArt',
    description:
        'Couturiers, créateurs, agents : développez votre activité avec DressArt. Publiez vos modèles, gérez vos commandes et touchez une nouvelle clientèle.',
    openGraph: {
        title: 'Espace Pro — Rejoignez DressArt',
        description:
            'Couturiers, créateurs, agents : développez votre activité avec DressArt. Publiez vos modèles, gérez vos commandes et touchez une nouvelle clientèle.',
        url: `${seoConfig.siteUrl}/pro`,
        type: 'website',
    },
};

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.dressart.studio';

const benefits = [
    {
        title: 'Une clientèle nationale',
        description:
            'Touchez des clients dans tout le Bénin, sans budget marketing. DressArt amène les commandes, vous concentrez-vous sur la création.',
    },
    {
        title: 'Paiements sécurisés',
        description:
            'Encaissez via FedaPay (Mobile Money, carte). Acomptes, soldes, suivi des transactions — tout est automatisé.',
    },
    {
        title: 'Gestion centralisée',
        description:
            'Vos modèles, vos tissus, vos commandes, vos clients : un seul tableau de bord pour piloter votre activité.',
    },
    {
        title: 'Vous gardez le contrôle',
        description:
            'Vous fixez vos prix, vos délais, vos rendez-vous. DressArt ne fait pas écran entre vous et vos clients.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Créez votre compte',
        description:
            'Inscription en quelques minutes. Renseignez votre atelier, votre localisation, vos spécialités.',
    },
    {
        number: '02',
        title: 'Publiez vos modèles',
        description:
            'Ajoutez vos créations avec photos et prix. Mettez en avant vos tissus disponibles ou laissez le client apporter le sien.',
    },
    {
        number: '03',
        title: 'Recevez vos commandes',
        description:
            'Notifications WhatsApp à chaque nouvelle commande. Prise de mesures, rendez-vous, paiements — gérez tout depuis le dashboard.',
    },
];

export default function ProPage() {
    return (
        <main className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="flex flex-col gap-6 max-w-xl">
                            <span className="inline-block w-fit px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                Espace professionnel
                            </span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 font-playfair leading-tight">
                                Votre talent.<br />Notre vitrine.
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Couturiers, stylistes, créateurs : faites grandir votre atelier avec DressArt.
                                Publiez vos modèles, recevez des commandes sur-mesure, et concentrez-vous sur ce
                                que vous faites le mieux — créer.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    href={DASHBOARD_URL}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                                >
                                    Rejoindre DressArt
                                    <span aria-hidden="true">→</span>
                                </Link>
                                <a
                                    href="#comment-ca-marche"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:border-gray-900 transition-all"
                                >
                                    En savoir plus
                                </a>
                            </div>
                        </div>

                        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
                            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/landing-page/khalifa.png"
                                    alt="Atelier de couture"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 max-w-xs hidden sm:flex">
                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold font-playfair shrink-0">
                                    +
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Atelier 100% gratuit</p>
                                    <p className="text-xs text-gray-500">Aucun frais d&apos;inscription</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mb-14">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-playfair mb-4">
                            Pourquoi rejoindre DressArt ?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Une plateforme pensée pour les artisans de la mode au Bénin et au-delà.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((b) => (
                            <div
                                key={b.title}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-900 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair">{b.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{b.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="comment-ca-marche" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mb-14">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-playfair mb-4">
                            Comment ça marche ?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Trois étapes pour démarrer. Aucun engagement.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((s) => (
                            <div key={s.number} className="relative">
                                <div className="text-6xl md:text-7xl font-bold font-playfair text-gray-200 mb-4 leading-none">
                                    {s.number}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase image strip */}
            <section className="py-20 bg-gray-900 text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                                <Image
                                    src="/landing-page/model_victor.png"
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                                <Image
                                    src="/landing-page/unique.png"
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden -mt-8">
                                <Image
                                    src="/landing-page/cottonbro.png"
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                                <Image
                                    src="/robe.png"
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="max-w-md">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-playfair mb-6">
                                Votre savoir-faire mérite d&apos;être vu.
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                Chaque jour, des clients cherchent un couturier de confiance pour leur prochaine
                                pièce sur-mesure. Soyez celui qu&apos;ils trouvent.
                            </p>
                            <Link
                                href={DASHBOARD_URL}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
                            >
                                Créer mon compte pro
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-playfair mb-6">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-lg text-gray-600 mb-10">
                            L&apos;inscription est gratuite et prend moins de 5 minutes. Aucune carte requise.
                        </p>
                        <Link
                            href={DASHBOARD_URL}
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl"
                        >
                            Accéder au dashboard
                            <span aria-hidden="true">→</span>
                        </Link>
                        <p className="text-sm text-gray-500 mt-6">
                            Déjà inscrit ?{' '}
                            <Link href={DASHBOARD_URL} className="text-gray-900 underline underline-offset-2 hover:opacity-70">
                                Connectez-vous
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
