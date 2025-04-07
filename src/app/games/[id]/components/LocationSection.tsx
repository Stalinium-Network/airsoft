import ClientLocationLink from "./ClientLocationLink";
import Image from "next/image";

interface LocationSectionProps {
  location: {
    _id: string;
    coordinates: string;
    images: string[];
    description?: string;
  };
}

export default function LocationSection({ location }: LocationSectionProps) {
  // Get the first image from the images array, or use an empty string if no images
  const locationImage =
    location.images && location.images.length > 0 ? location.images[0] : "";
  // Get the remaining images (if any)
  const remainingImages =
    location.images && location.images.length > 1
      ? location.images.slice(1)
      : [];

  return (
    <div className="mx-auto py-8">
      <h2 className="text-zone-gold-lite uppercase mb-4 text-sm">Location</h2>
      <ClientLocationLink
        coordinates={location.coordinates}
        locationName={location._id}
      />

      <p className="text-gray-400 my-8">{location.description}</p>

      {/* Main location image */}
      {locationImage && (
        <div className="relative w-full aspect-[20/9] mb-4">
          <Image
            src={
              process.env.NEXT_PUBLIC_API_URL +
              "/locations/image/" +
              locationImage
            }
            alt={location._id}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      )}

      {/* Remaining images grid */}
      {remainingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-8 mt-3 mb-8">
          {remainingImages.map((image, index) => (
            <div
              key={`${location._id}-image-${index}`}
              className="relative aspect-video w-full"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/locations/image/${image}`}
                alt={`${location._id} - image ${index + 2}`}
                fill
                className="object-cover rounded-md hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
