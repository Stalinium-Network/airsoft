export const dynamic = "force-dynamic";

import AboutHero from '@/app/about/components/AboutHero';
import OurStorySection from '@/app/about/components/OurStorySection';
import TeamSection from '@/app/about/components/TeamSection';
import ValueSection from '@/app/about/components/ValueSection';
import GallerySection from '@/app/about/components/GallerySection';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <ClientWrapper>
        <AboutHero />
        <div className='px-auto flex flex-col items-center justify-center w-screen'>
          <OurStorySection />
          <ValueSection />
          <GallerySection />
          <TeamSection />
          <Footer />
        </div>
      </ClientWrapper>
    </div>
  );
}
