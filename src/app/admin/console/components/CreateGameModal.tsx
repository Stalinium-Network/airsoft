"use client";
import { useState } from "react";
import { Game } from "@/services/gameService";
import {
  isPastGame,
  formatDateForInput,
  formatDateForDisplay,
} from "@/services/adminService";
import { adminApi } from "@/utils/api";

// Default game data template
const defaultGameData = {
  name: "",
  date: new Date().toISOString().split("T")[0],
  location: "",
  coordinates: "",
  description: "",
  image: "https://images.unsplash.com/photo-1518407613690-d9fc990e795f",
  capacity: {
    total: 30,
    filled: 0,
  },
  price: 50,
  isPast: false,
};

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: () => void;
  onError: (message: string) => void;
}

export default function CreateGameModal({
  onClose,
  onGameCreated,
  onError,
}: CreateGameModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newGame, setNewGame] = useState<Omit<Game, "_id">>(defaultGameData);

  // Handle input changes for new game
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested properties (e.g., capacity.total)
      const [parent, child] = name.split(".");
      setNewGame((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: parent === "capacity" ? parseInt(value, 10) || 0 : value,
        },
      }));
    } else if (name === "price") {
      setNewGame((prev) => ({
        ...prev,
        price: parseInt(value, 10) || 0,
      }));
    } else if (name === "date") {
      // Set isPast based on the date
      const isPastValue = isPastGame(value);
      setNewGame((prev) => ({
        ...prev,
        date: value,
        isPast: isPastValue,
      }));
    } else {
      setNewGame((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Create a new game using axios
  const createGame = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // Validate form
    if (
      !newGame.name ||
      !newGame.location ||
      !newGame.coordinates ||
      !newGame.description ||
      !newGame.image
    ) {
      onError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Ensure isPast is correctly set based on date and format date for display
    const gameToCreate = {
      ...newGame,
      isPast: isPastGame(newGame.date),
      date: formatDateForDisplay(newGame.date), // Format date for display
    };

    try {
      await adminApi.createGame(gameToCreate);
      onGameCreated();
    } catch (error: any) {
      console.error("Error creating game:", error);

      // Extract error message from axios error
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to create game: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create New Game</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={createGame}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Game Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newGame.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Operation Blackout"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formatDateForInput(newGame.date)}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Status:{" "}
                  {isPastGame(newGame.date) ? "Past Event" : "Upcoming Event"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newGame.location}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Forest Base, Kiev"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Coordinates
                </label>
                <input
                  type="text"
                  name="coordinates"
                  value={newGame.coordinates}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="50.4501,30.5234"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newGame.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="An intense tactical mission through challenging terrain..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={newGame.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total Capacity
                </label>
                <input
                  type="number"
                  name="capacity.total"
                  value={newGame.capacity.total}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Registrations
                </label>
                <input
                  type="number"
                  name="capacity.filled"
                  value={newGame.capacity.filled}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={newGame.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Creating..." : "Create Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
