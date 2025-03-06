import Image from 'next/image';
import Link from 'next/link';

interface GalleryImage {
  filename: string;
  description: string;
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/preview`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export default async function GallerySection() {
  const galleryImages = await getGalleryImages();
  
  // Limit to 6 images for the preview section
  const previewImages = galleryImages.slice(0, 6);
  
  return (
    <section className="py-20 px-4 w-screen bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">THE <span className="text-green-500">GALLERY</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Glimpses from inside the Zone - moments captured by stalkers who lived to tell the tale.
          </p>
        </div>
        
        {previewImages.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No images available at the moment.</p>
            <p className="mt-2">Check back soon for updates from the Zone.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewImages.map((image, index) => (
                <div 
                  key={index} 
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${image.filename}`}
                      alt={image.description || "Zone image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {image.description && (
                    <div className="p-4 bg-gray-700">
                      <p className="text-gray-200">{image.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/gallery"
                className="inline-block px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors shadow-lg hover:shadow-green-500/30"
              >
                VIEW FULL GALLERY
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
