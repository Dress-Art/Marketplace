import type { Metadata } from 'next';
import Header from '@/components/landing-page/Header';
import Hero from '@/components/landing-page/Hero';
import ModelsSection from '@/components/landing-page/ModelsSection';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import CTASection from '@/components/landing-page/CTASection';
import Footer from '@/components/landing-page/Footer';
import FadeIn from '@/components/animations/FadeIn';
import { seoConfig } from '@/lib/seo/config';
import { getOrganizationSchema, getWebsiteSchema, renderJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'DressArt - Marketplace de Mode Sur Mesure',
  description: 'Découvrez DressArt, votre marketplace pour créer des vêtements sur mesure. Choisissez parmi nos modèles exclusifs, sélectionnez vos tissus préférés et commandez votre création unique.',
  keywords: [
    ...seoConfig.keywords,
    'accueil',
    'boutique en ligne',
    'vêtements haute couture',
  ],
  openGraph: {
    title: 'DressArt - Marketplace de Mode Sur Mesure',
    description: 'Créez vos vêtements sur mesure avec DressArt. Des modèles exclusifs, des tissus premium, une création unique.',
    url: seoConfig.siteUrl,
    type: 'website',
    images: seoConfig.openGraph.images,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DressArt - Marketplace de Mode Sur Mesure',
    description: 'Créez vos vêtements sur mesure avec DressArt. Des modèles exclusifs, des tissus premium, une création unique.',
    images: seoConfig.openGraph.images,
  },
  alternates: {
    canonical: seoConfig.siteUrl,
  },
};

export default function Home() {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(organizationSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(websiteSchema)}
      />

      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <main>
        <FadeIn>
          <Hero />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ModelsSection />
        </FadeIn>

        <FadeIn delay={0.3}>
          <FeaturesSection />
        </FadeIn>

        <FadeIn delay={0.4}>
          <CTASection />
        </FadeIn>

        <FadeIn delay={0.5}>
          <Footer />
        </FadeIn>
      </main>
    </div>
  );
}
