import Header from '@/components/landing-page/Header';
import Hero from '@/components/landing-page/Hero';
import ModelsSection from '@/components/landing-page/ModelsSection';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import CTASection from '@/components/landing-page/CTASection';
import Footer from '@/components/landing-page/Footer';
import FadeIn from '@/components/animations/FadeIn';

export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background">
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
