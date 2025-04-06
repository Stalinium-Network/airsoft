"use client";

import Image from "next/image";
import Link from "next/link";
import LocationLink from "./LocationLink";
import { calculateAvailableSlots } from "./calculateAvailableSlots";
import { Location } from "@/services/locationService";
import { isPreviewUrl, Game } from "@/services/gameService";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
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
  
  // Get YouTube thumbnail URL if it's a YouTube video
  const getYoutubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };
  
  const youtubeVideoId = isPreviewVideo ? getYoutubeVideoId(game.preview) : null;
  const thumbnailUrl = youtubeVideoId 
    ? getYoutubeThumbnail(youtubeVideoId)
    : game.preview 
      ? `${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.preview}`
      : null;

  return (
    <div className="relative bg-zone-dark-brown/20 rounded-lg overflow-hidden shadow-lg hover:shadow-zone-gold-lite/20 border border-zone-dark-brown/40 hover:border-zone-gold-lite/30 transition-all group">
      <div className="relative aspect-video">
        {thumbnailUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={thumbnailUrl}
              alt={game.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isPreviewVideo && youtubeVideoId && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
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
          <span className="bg-black/60 text-zone-gold-lite text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {new Date(game.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-zone-gold-lite mb-2 group-hover:translate-x-1 transition-transform">
          {game.name}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{game.description}</p>

        {game.location && (
          <div className="mb-4">
            <LocationLink
              coordinates={(game.location as Location).coordinates}
              locationName={(game.location as Location)._id}
            />
          </div>
        )}

        <div className="mt-4 mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Registration Status</span>
            <span className="text-white">{occupiedSlots}/{fillingInfo.total} slots</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full ${occupiedSlots > fillingInfo.total * 0.8 ? 'bg-red-500' : 'bg-zone-gold-lite'}`} 
              style={{ width: `${(Math.min(occupiedSlots / fillingInfo.total, 1)) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-zone-gold-lite font-medium">
            {Math.max(0, fillingInfo.available)} spots available
          </div>
        </div>

        <div className="mt-6">
          <Link
            href={`/games/${game._id}`}
            className="inline-flex items-center px-4 py-2 bg-zone-gold-lite hover:bg-zone-gold-lite/80 text-zone-dark-brown font-medium rounded-lg transition-all"
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

          {/* Отображение текущей актуальной цены */}
          {game.currentPrice !== null && (
            <span className="ml-3 text-zone-gold-lite font-medium">
              ${game.currentPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
