import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/utils/time-format";
import LocationLink from "@/components/home/LocationLink";
import { isPreviewUrl } from "@/services/gameService";

interface HeroSectionProps {
  game: {
    name: string;
    date: string | Date;
    preview: string; // Changed from image to preview
    duration: number;
    price: number;
    isPast: boolean;
    location: {
      _id: string;
      coordinates: string;
    };
  };
}

export default function HeroSection({ game }: HeroSectionProps) {
  const isYoutubeVideo = isPreviewUrl(game.preview);
  
  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  const youtubeVideoId = isYoutubeVideo ? getYoutubeVideoId(game.preview) : null;

  return (
    <div className="relative h-[50vh] w-full">
      {isYoutubeVideo && youtubeVideoId ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full"
            frameBorder="0"
          />
          <div className="absolute inset-0" style={{ pointerEvents: 'none' }}></div>
        </div>
      ) : (
        <Image
          src={isYoutubeVideo ? game.preview : `${process.env.NEXT_PUBLIC_IMAGES_URL}${game.preview}`}
          alt={game.name}
          fill
          priority
          className="object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-zone-dark via-gray-900/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full p-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-zone-gold-lite hover:text-zone-gold-lite mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Events
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold">{game.name}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center text-zone-gold">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDateTime(game.date)}
            </div>

            <LocationLink coordinates={game.location.coordinates} locationName={game.location._id} />

            {!game.isPast && (
              <div className="flex items-center ml-auto">
                <span className="bg-zone-gold-lite text-zone-dark-brown font-bold px-4 py-1 rounded">
                  ${game.price}/person
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
