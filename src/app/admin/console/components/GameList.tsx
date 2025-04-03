import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Game, Faction, isPreviewUrl, getYoutubeVideoId, getYoutubeThumbnail } from "@/services/gameService";
import { formatDateTime } from "@/utils/time-format";
import { Location } from "@/services/locationService";

interface GameListProps {
  games: Game[];
  isLoading: boolean;
  filter: "upcoming" | "past";
  onFilterChange: (filter: "upcoming" | "past") => void;
  onEditGame: (game: Game) => void;
  onDeleteGame: (gameId: string | number) => void;
}

export default function GameList({
  games,
  isLoading,
  filter,
  onFilterChange,
  onEditGame,
  onDeleteGame,
}: GameListProps) {
  // Calculate total capacity from factions
  const getCapacityInfo = (game: Game) => {
    if (!game.factions || game.factions.length === 0) {
      return { total: 0, filled: 0 };
    }
    
    const total = game.factions.reduce((sum, faction) => sum + faction.capacity, 0);
    const filled = game.factions.reduce((sum, faction) => sum + faction.filled, 0);
    
    return { total, filled };
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        {/* Filter toggle with animation */}
        <div className="bg-gray-700 p-1 rounded-lg inline-flex relative">
          {/* Animated background pill */}
          <motion.div
            className="absolute inset-y-1 rounded-md bg-green-600 z-0 cursor-pointer"
            initial={false}
            animate={{
              x: filter === "upcoming" ? 0 : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          <button
            className={`px-4 py-1 rounded-md transition-all relative z-10 text-center w-30 ${
              filter === "upcoming" ? "text-white font-medium" : "text-gray-300"
            }`}
            onClick={() => onFilterChange("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-1 rounded-md transition-all relative z-10 text-center w-30 ${
              filter === "past" ? "text-white font-medium" : "text-gray-300"
            }`}
            onClick={() => onFilterChange("past")}
          >
            Past
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No {filter} games found. Create a new game to get started.
        </div>
      )}

      {/* Game cards grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => {
            const { total, filled } = getCapacityInfo(game);
            
            // Check if any faction has details
            const hasFactionDetails = game.factions?.some(f => !!f.details);
            
            // Check if the preview is a URL (YouTube)
            const isPreviewVideo = isPreviewUrl(game.preview);
            const youtubeVideoId = isPreviewVideo ? getYoutubeVideoId(game.preview) : null;
            const previewUrl = isPreviewVideo 
              ? (youtubeVideoId ? getYoutubeThumbnail(youtubeVideoId) : game.preview) 
              : `${process.env.NEXT_PUBLIC_IMAGES_URL}${game.preview}`;
            
            return (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                layout
                className="bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-600"
              >
                {/* Game image */}
                <div className="h-40 relative">
                  <Image
                    src={previewUrl}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                  {isPreviewVideo && youtubeVideoId && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-30 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-3">
                    <h3 className="text-lg font-semibold text-white">
                      {game.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {formatDateTime(game.date)}
                    </p>
                  </div>
                </div>

                {/* Game info */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="text-xs font-medium bg-gray-600 text-gray-300 px-2 py-1 rounded">
                      {game.isPast ? "Past Event" : "Upcoming"}
                    </span>
                    <span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded ml-2">
                      ${game.price}
                    </span>
                    {isPreviewVideo && (
                      <span className="text-xs font-medium bg-red-600 text-white px-2 py-1 rounded ml-2">
                        YouTube
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="text-xs text-gray-400 mb-3">
                    <div>
                      Location:{" "}
                      {typeof game.location === "string"
                        ? game.location
                        : (game.location as Location)._id}
                    </div>

                    {/* Factions information */}
                    <div>
                      {game.factions && game.factions.length > 0 ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span>Total Capacity:</span>
                            <span>{filled}/{total}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Factions: {game.factions.length}
                            </span>
                            {hasFactionDetails && (
                              <span className="text-xs text-green-500 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                With details
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>No factions defined</div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditGame(game)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteGame(game._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
