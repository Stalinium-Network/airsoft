import Image from "next/image";

interface LocationSectionProps {
  location: {
    _id: string;
    coordinates: string;
    image?: string;
    description?: string;
  };
}

export default function LocationSection({ location }: LocationSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4">Location</h3>

      {/* Display location image if available */}
      {location.image && (
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_LOCATION_IMAGES_URL}${location.image}`}
            alt={location._id}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Location details */}
      <div className="space-y-2">
        <h4 className="font-bold text-lg">{location._id}</h4>

        {location.description && (
          <p className="text-gray-300 text-sm mb-3">
            {location.description}
          </p>
        )}

        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0z"
            />
          </svg>
          <a
            href={`https://maps.google.com/?q=${location.coordinates}`}
            target="_blank"
            rel="noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            {location.coordinates}
          </a>
        </div>
      </div>
    </div>
  );
}
