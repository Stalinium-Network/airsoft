export const dynamic = "force-dynamic";

import AboutHero from '@/app/about/components/AboutHero';
import OurStorySection from '@/app/about/components/OurStorySection';
import TeamSection from '@/app/about/components/TeamSection';
import GameFeaturesSection from '@/app/about/components/GameFeaturesSection';
import FractionsSection from '@/app/about/components/FractionsSection';
import PackingListSection from '@/app/about/components/PackingListSection';
import GallerySection from '@/app/about/components/GallerySection';
import ClientWrapper from '@/components/ClientWrapper';

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <ClientWrapper>
        <AboutHero />
        <div className='px-auto flex flex-col items-center justify-center w-screen'>
          <OurStorySection />
          <GameFeaturesSection />
          <FractionsSection />
          <PackingListSection />
          <GallerySection />
          <TeamSection />
        </div>
      </ClientWrapper>
    </div>
  );
}
