import HeroSection from '@/components/HeroSection';
import GameSection from '@/components/GameSection';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';

export default function Home() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <ClientWrapper>
        <HeroSection />
        <div className='px-auto flex flex-col items-center justify-center w-screen'>
          {/* GameSection is now a proper server component */}
          <GameSection />
          <FeatureSection />
          <Footer />
        </div>
      </ClientWrapper>
    </div>
  );
}
