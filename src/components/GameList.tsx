"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Game } from "@/services/gameService";
import { formatDateTime } from "@/utils/time-format";

interface GameListProps {
  pastGames: Game[];
  upcomingGames: Game[];
}

export default function GameList({ pastGames, upcomingGames }: GameListProps) {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const filteredGames = filter === "upcoming" ? upcomingGames : pastGames;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            className={`px-6 py-2 rounded-md transition-all ${
              filter === "upcoming"
                ? "bg-green-500 text-gray-900"
                : "text-gray-300"
            }`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-all ${
              filter === "past" ? "bg-green-500 text-gray-900" : "text-gray-300"
            }`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredGames.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </motion.div>
  );
}

function GameCard({ game }: { game: Game }) {
  const percentFilled = Math.round(
    (game.capacity.filled / game.capacity.total) * 100
  );
  const spotsLeft = game.capacity.total - game.capacity.filled;

  // Helper to get location data
  const getLocationInfo = () => {
    if (!game.location) return { name: "TBD", coordinates: "" };
    
    if (typeof game.location === 'string') {
      return { name: game.location, coordinates: "" };
    }
    
    return { 
      name: game.location._id, 
      coordinates: game.location.coordinates 
    };
  };
  
  const location = getLocationInfo();

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all border border-gray-700"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-56 relative">
        <Image
          src={process.env.NEXT_PUBLIC_IMAGES_URL + game.image}
          alt={game.name}
          fill
          className="object-cover"
        />
        {!game.isPast && (
          <div className="absolute top-0 right-0 bg-green-500 text-gray-900 font-bold px-4 py-1 rounded-bl-lg">
            ${game.price}/person
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-2xl font-bold text-white">{game.name}</h3>
          <p className="text-green-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {formatDateTime(game.date)}
          </p>
          <p className="text-gray-400 text-sm">Duration: {game.duration} hours</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center mb-3">
          <svg
            className="w-5 h-5 text-green-500 mr-2"
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
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <a
            href={location.coordinates ? `https://maps.google.com/?q=${location.coordinates}` : '#'}
            target="_blank"
            rel="noreferrer"
            className="text-gray-300 hover:text-green-500 transition-colors"
          >
            {location.name}
          </a>
        </div>

        <p className="text-gray-400 mb-5 line-clamp-2">{game.description}</p>

        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Capacity</span>
            <span className="text-green-500">
              {game.capacity.filled}/{game.capacity.total}
              {!game.isPast && spotsLeft > 0 && (
                <span className="ml-1 text-green-400">
                  ({spotsLeft} spots left)
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                percentFilled < 30
                  ? "bg-green-500"
                  : percentFilled < 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>
        </div>

        {game.isPast ? (
          <button className="w-full py-3 bg-gray-700 text-white rounded-md font-medium flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Details
          </button>
        ) : (
          <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-gray-900 rounded-md transition-colors font-bold flex items-center justify-center gap-2 group">
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Register Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
