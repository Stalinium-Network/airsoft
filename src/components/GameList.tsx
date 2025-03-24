"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraction, Game } from "@/services/gameService";
import { formatDateTime } from "@/utils/time-format";
import RegisterButton from "./RegisterButton";

interface GameListProps {
  pastGames: Game[];
  upcomingGames: Game[];
}

export default function GameList({ pastGames, upcomingGames }: GameListProps) {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const handleFilterChange = (newFilter: "upcoming" | "past") => {
    setFilter(newFilter);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-lg inline-flex relative">
          {/* Animated background pill */}
          <motion.div
            className="absolute inset-y-1 rounded-md bg-green-500 z-0"
            initial={false}
            animate={{
              x: filter === "upcoming" ? 0 : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          <button
            className={`px-6 py-2 rounded-md transition-all relative z-10 text-center w-30 ${
              filter === "upcoming" ? "text-gray-900 font-medium" : "text-gray-300"
            }`}
            onClick={() => handleFilterChange("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-all relative z-10 text-center w-30 ${
              filter === "past" ? "text-gray-900 font-medium" : "text-gray-300"
            }`}
            onClick={() => handleFilterChange("past")}
          >
            Past
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        >
          {(filter === "upcoming" ? upcomingGames : pastGames).map((game) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function GameCard({ game }: { game: Game }) {
  const router = useRouter();
  
  // Calculate total capacity and filled spots using fractions
  const getTotalCapacity = () => {
    // If using new fractions structure
    if (game.fractions && game.fractions.length > 0) {
      const total = game.fractions.reduce((sum, fraction) => sum + fraction.capacity, 0);
      const filled = game.fractions.reduce((sum, fraction) => sum + fraction.filled, 0);
      return {
        total,
        filled,
        percentFilled: Math.round((filled / total) * 100),
        spotsLeft: total - filled
      };
    }
    
    // Fallback
    return { total: 0, filled: 0, percentFilled: 0, spotsLeft: 0 };
  };
  
  const capacity = getTotalCapacity();
  const isFull = capacity.spotsLeft <= 0;

  // Helper to get location data
  const getLocationInfo = () => {
    if (!game.location) return { name: "TBD", coordinates: "" };

    if (typeof game.location === "string") {
      return { name: game.location, coordinates: "" };
    }

    return {
      name: game.location._id,
      coordinates: game.location.coordinates,
    };
  };

  const location = getLocationInfo();

  // Navigate to game details
  const navigateToGameDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/games/${game._id}`);
  };

  // Navigate to location on map
  const navigateToLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://maps.google.com/?q=${location.coordinates}`, "_blank");
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all border border-gray-700 hover:scale-[98%]">
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
          <p className="text-gray-400 text-sm">
            Duration: {game.duration} hours
          </p>
        </div>
      </div>

      <div className="p-5">
        {/* Location button */}
        <button
          onClick={navigateToLocation}
          className="flex items-center mb-3 hover:text-green-400 transition-colors w-auto text-left"
        >
          <svg
            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
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
              d="M15 11a3 3 0 11-6 0 3 3z"
            />
          </svg>
          <span className="text-gray-300">{location.name}</span>
        </button>

        {/* Only description is clickable to navigate to details */}
        <button
          onClick={navigateToGameDetails}
          className="text-gray-400 mb-5 line-clamp-2 cursor-pointer hover:underline transition-colors text-left w-full"
        >
          {game.description}
        </button>

        {/* Fractions & Capacity section */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Capacity</span>
            <span className="text-green-500">
              {capacity.filled}/{capacity.total}
              {!game.isPast && capacity.spotsLeft > 0 && (
                <span className="ml-1 text-green-400">
                  ({capacity.spotsLeft} spots left)
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                capacity.percentFilled < 30
                  ? "bg-green-500"
                  : capacity.percentFilled < 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${capacity.percentFilled}%` }}
            ></div>
          </div>
          
          {/* Show fractions if available */}
          {game.fractions && game.fractions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400">Fractions:</p>
              <div className="grid grid-cols-1 gap-2">
                {game.fractions.map((fraction) => (
                  <div key={fraction._id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">{fraction._id}</span>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">
                        {fraction.filled}/{fraction.capacity}
                      </span>
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            fraction.filled / fraction.capacity < 0.3
                              ? "bg-green-500"
                              : fraction.filled / fraction.capacity < 0.7
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${(fraction.filled / fraction.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Registration button */}
        <div className="w-full">
          {game.isPast ? (
            <button
              onClick={navigateToGameDetails}
              className="w-full py-3 bg-gray-700 text-white rounded-md transition-colors font-bold flex items-center justify-center gap-2"
            >
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
                  d="M15 12a3 3 0 11-6 0 3 3z"
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
            <RegisterButton
              gameId={game._id.toString()}
              gameName={game.name}
              isPast={game.isPast}
              isFull={isFull}
              hasFractions={game.fractions && game.fractions.length > 0}
              registrationLink={game.registrationLink} // Передаем новое поле
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
