import ClientWrapper from '@/components/ClientWrapper';
import GalleryHero from '@/app/admin/gallery/components/GalleryHero';
import GalleryGrid from '@/app/admin/gallery/components/GalleryGrid';
import { publicApi } from '@/utils/api';


// Gallery interface (matching the API response)
interface GalleryImage {
  filename: string;
  description: string;
  game?: string | null;
}

export default async function GalleryPage() {
  let galleryImages: GalleryImage[] = [];
  
  try {
    galleryImages = await publicApi.getGalleryList({revalidate: 3600});
  } catch (error) {
    console.error('Error fetching gallery images:', error);
  }
  
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <ClientWrapper>
        <GalleryHero />
        <div className='px-auto flex flex-col items-center justify-center w-screen'>
          <section className="py-16 px-4 w-screen">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-4xl font-bold text-center mb-2">THE <span className="text-green-500">GALLERY</span></h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Explore photos from our events and get a glimpse into the world of STALKER-themed airsoft.
              </p>
              
              {galleryImages.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400">No images to display yet.</p>
                  <p className="mt-4 text-gray-500">Check back soon for updates from the Zone.</p>
                </div>
              ) : (
                <GalleryGrid images={galleryImages} />
              )}
            </div>
          </section>
        </div>
      </ClientWrapper>
    </div>
  );
}
