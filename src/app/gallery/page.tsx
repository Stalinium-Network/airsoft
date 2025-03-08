import GalleryGrid from '@/components/gallery/GalleryGrid';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import GalleryHero from '@/components/gallery/GalleryHero';

// Add revalidation time in seconds (1 hour = 3600 seconds)
export const revalidate = 3600;

// Gallery interface (matching the API response)
interface GalleryImage {
  filename: string;
  description: string;
}

// Fetch gallery data from the API
async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    // Updated fetch with next cache options
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/list`, {
      next: { 
        revalidate: 3600 // Cache for 1 hour (3600 seconds)
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching gallery: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();
  
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
          <Footer />
        </div>
      </ClientWrapper>
    </div>
  );
}
