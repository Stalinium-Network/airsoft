"use client";

import Image from "next/image";
import Link from "next/link";
import LocationLink from "./LocationLink";
import { calculateAvailableSlots } from "./calculateAvailableSlots";
import { Location } from "@/services/locationService";
import { Game, isPreviewUrl } from "@/services/gameService";

interface FeaturedGameCardProps {
  game: Game;
}

export default function FeaturedGameCard({ game }: FeaturedGameCardProps) {
  const fillingInfo = calculateAvailableSlots(game.factions);

  // Вычисляем количество занятых мест
  const occupiedSlots = fillingInfo.total - fillingInfo.available;
  
  // Check if preview is a URL (YouTube video)
  const isPreviewVideo = isPreviewUrl(game.preview);
  
  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeVideoId = (url: string): string | null => {
    try {
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };
  
  const youtubeVideoId = isPreviewVideo ? getYoutubeVideoId(game.preview) : null;

  return (
    <div className="mx-auto mb-20">
      <h3 className="w-fit text-5xl pb-2 font-bold mb-4 bg-gradient-to-r from-white via-white to-zone-gold-lite bg-clip-text text-transparent">
        {game.name}
      </h3>

      <div className="flex flex-wrap flex-col gap-3 mb-14 mt-10">
        <div className="flex items-center text-white">
          <svg
            className="w-5 h-5 mr-2 text-zone-gold-lite"
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
        {game.location && (
          <LocationLink
            coordinates={(game.location as Location).coordinates}
            locationName={(game.location as Location)._id}
          />
        )}
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        {isPreviewVideo && youtubeVideoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
            title={game.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <Image
            src={isPreviewVideo ? game.preview : `${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.preview}`}
            alt={game.name}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="mt-8">
        <pre className="text-gray-300 text-lg mb-8 whitespace-pre-wrap font-sans">
          {game.description}
        </pre>

        <div className="flex md:items-center flex-col md:flex-row mb-10">
          <div className="flex flex-col w-full max-w-xs">
            <span className="text-gray-400 text-sm mb-1">
              Registration Status
            </span>
            <div className="flex flex-col">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">
                  {occupiedSlots}/{fillingInfo.total} slots
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${
                    occupiedSlots > fillingInfo.total * 0.8
                      ? "bg-red-500"
                      : "bg-zone-gold-lite"
                  }`}
                  style={{
                    width: `${
                      Math.min(occupiedSlots / fillingInfo.total, 1) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-zone-gold-lite font-medium text-sm">
                {Math.max(0, fillingInfo.available)} spots available
              </div>
            </div>
          </div>

          <Link
            href={`/games/${game._id}`}
            className="inline-flex w-fit mt-5 md:ml-auto items-center px-8 py-3 bg-zone-gold-lite hover:bg-zone-gold-lite/80 text-zone-dark-brown font-bold rounded-lg transition-all"
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
    </div>
  );
}
