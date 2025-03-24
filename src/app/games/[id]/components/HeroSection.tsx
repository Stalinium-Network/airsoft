import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/utils/time-format";

interface HeroSectionProps {
  game: {
    name: string;
    date: string | Date;
    image: string;
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
  return (
    <div className="relative h-[50vh] w-full">
      <Image
        src={process.env.NEXT_PUBLIC_IMAGES_URL + game.image}
        alt={game.name}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full p-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-green-400 hover:text-green-300 mb-4"
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
            <div className="flex items-center text-green-400">
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

            <div className="flex items-center text-green-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {game.duration} hours
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-400"
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
                href={`https://maps.google.com/?q=${game.location.coordinates}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                {game.location._id}
              </a>
            </div>

            {!game.isPast && (
              <div className="flex items-center ml-auto">
                <span className="bg-green-500 text-gray-900 font-bold px-4 py-1 rounded">
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
