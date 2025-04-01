"use client";

import Image from "next/image";
import Link from "next/link";
import LocationLink from "./LocationLink";
import { calculateAvailableSlots } from "./calculateAvailableSlots";

interface GameCardProps {
  game: any;
}

export default function GameCard({ game }: GameCardProps) {
  const availableSlots = calculateAvailableSlots(game.factions);

  return (
    <div className="relative bg-zone-dark-brown/20 rounded-lg overflow-hidden shadow-lg hover:shadow-zone-gold/20 border border-zone-dark-brown/40 hover:border-zone-gold/30 transition-all group">
      <div className="relative aspect-video">
        {game.image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.image}`}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zone-dark-brown/40 to-zone-dark flex items-center justify-center">
            <Image
              src="/logo-z37.svg"
              alt="Zone 37 Logo"
              width={80}
              height={80}
              className="opacity-30"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 text-zone-gold text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {new Date(game.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-zone-gold mb-2 group-hover:translate-x-1 transition-transform">
          {game.name}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-2">
          {game.description}
        </p>

        {game.location && (
          <div className="mb-4">
            <LocationLink
              coordinates={(game.location as any).coordinates || ""}
              locationName={(game.location as any).name || "Game Location"}
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <svg className="w-4 h-4 text-zone-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>{availableSlots} slots available</span>
        </div>

        <div className="mt-6">
          <Link
            href={`/games/${game._id}`}
            className="inline-flex items-center px-4 py-2 bg-zone-gold hover:bg-zone-gold/80 text-zone-dark-brown font-medium rounded-lg transition-all"
          >
            Event Details
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
