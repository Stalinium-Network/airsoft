import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  filename: string;
  description: string;
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gallery/preview`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}

export default async function GallerySection() {
  const galleryImages = await getGalleryImages();

  // Limit to 6 images for the preview section
  const previewImages = galleryImages.slice(0, 6);

  return (
    <section className="py-20 px-4 w-screen bg-gray-800 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-[600px] h-[600px] top-[10%] -right-[300px] rounded-full bg-green-500/30 blur-3xl"></div>
        <div className="absolute w-[400px] h-[400px] bottom-[10%] -left-[200px] rounded-full bg-green-600/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            THE <span className="text-green-500">GALLERY</span>
          </h2>
          <div className="h-1 w-40 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Glimpses from inside the Zone - moments captured by stalkers who
            lived to tell the tale.
          </p>
        </div>

        {previewImages.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No images available at the moment.</p>
            <p className="mt-2">Check back soon for updates from the Zone.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group">
                  {/* Background effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-800/30 rounded-xl transform rotate-1 scale-[0.98] opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>

                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 group-hover:border-green-500/50 transition-all duration-300 relative z-10">
                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent opacity-60 rounded-bl-full z-10"></div>

                    {/* Image container */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${image.filename}`}
                        alt={image.description || "Zone image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Description container */}
                    {image.description && (
                      <div className="p-4 bg-gray-800/95 relative">
                        {/* Description line decoration */}
                        <div className="absolute -top-12 left-0 w-full flex justify-center">
                          <div className="h-1 w-20 bg-gradient-to-r from-green-500/0 via-green-500/40 to-green-500/0"></div>
                        </div>

                        <p className="text-gray-300 text-center group-hover:text-gray-200 transition-colors duration-300">
                          {image.description}
                        </p>
                      </div>
                    )}

                    {/* Bottom decoration */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Interactive hover effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300 -z-10"></div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/gallery"
                className="relative inline-flex items-center px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/30 overflow-hidden group"
              >
                <span className="relative z-10">VIEW FULL GALLERY</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute right-0 w-8 h-8 -mr-2 bg-green-600/30 rounded-full blur-md transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
