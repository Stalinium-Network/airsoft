import Image from "next/image";
import { Game } from "@/services/gameService";
import { formatDateTime } from "@/utils/time-format";

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
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Game Management</h2>

        {/* Filter toggle */}
        <div className="bg-gray-700 p-1 rounded-lg inline-flex">
          <button
            className={`px-4 py-1 rounded-md transition-all ${
              filter === "upcoming"
                ? "bg-green-600 text-white"
                : "text-gray-300"
            }`}
            onClick={() => onFilterChange("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-1 rounded-md transition-all ${
              filter === "past" ? "bg-green-600 text-white" : "text-gray-300"
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

      {/* Game cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game._id}
            className="bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-600"
          >
            {/* Game image */}
            <div className="h-40 relative">
              <Image
                src={process.env.NEXT_PUBLIC_IMAGES_URL + game.image}
                alt={game.name}
                fill
                className="object-cover"
              />
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
              </div>

              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {game.description}
              </p>

              <div className="text-xs text-gray-400 mb-3">
                <div>Location: {game.location}</div>
                <div>
                  Capacity: {game.capacity.filled}/{game.capacity.total}
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
          </div>
        ))}
      </div>
    </div>
  );
}
