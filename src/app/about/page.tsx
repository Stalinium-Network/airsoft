export const dynamic = "force-dynamic";

import AboutHero from '@/components/about/AboutHero';
import OurStorySection from '@/components/about/OurStorySection';
import TeamSection from '@/components/about/TeamSection';
import ValueSection from '@/components/about/ValueSection';
import GallerySection from '@/components/about/GallerySection';
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
