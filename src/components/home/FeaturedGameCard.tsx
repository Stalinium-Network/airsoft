"use client";

import Image from "next/image";
import Link from "next/link";
import LocationLink from "./LocationLink";
import { calculateAvailableSlots } from "./calculateAvailableSlots";

interface FeaturedGameCardProps {
  game: any;
}

export default function FeaturedGameCard({ game }: FeaturedGameCardProps) {

  const availableSlots = calculateAvailableSlots(game.factions);

  return (
    <div className="max-w-5xl mx-auto mb-20">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        {game.image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.image}`}
            alt={game.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zone-dark-brown/40 to-zone-dark flex items-center justify-center">
            <Image
              src="/logo-z37.svg"
              alt="Zone 37 Logo"
              width={120}
              height={120}
              className="opacity-30"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zone-dark via-zone-dark/70 to-transparent"></div>
        
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-black/60 backdrop-blur-sm text-zone-gold px-4 py-2 rounded-full font-bold">
            {new Date(game.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-4xl font-bold text-zone-gold mb-4">
          {game.name}
        </h3>

        <p className="text-gray-300 text-lg mb-8 max-w-3xl">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-8 mb-10">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">
              Date & Time
            </span>
            <div className="flex items-center text-white">
              <svg
                className="w-5 h-5 mr-2 text-zone-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {new Date(game.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">Location</span>
            <div className="flex items-center text-white">
              {game.location && (
                <LocationLink
                  coordinates={(game.location as any).coordinates || ""}
                  locationName={(game.location as any).name || "Game Location"}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-sm mb-1">Available Slots</span>
            <span className="text-white font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 text-zone-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {availableSlots} slots
            </span>
          </div>
        </div>

        <Link
          href={`/games/${game._id}`}
          className="inline-flex items-center px-8 py-3 bg-zone-gold-lite hover:bg-zone-gold/80 text-zone-dark-brown font-bold rounded-lg transition-all"
        >
          Event Details
          <svg
            className="ml-2 w-5 h-5"
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
  );
}