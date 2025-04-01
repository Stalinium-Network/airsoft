"use client";
import { useState, useEffect } from "react";
import { Fraction, GameFraction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface FactionsManagerProps {
  factions: GameFraction[];
  onChange: (factions: GameFraction[]) => void;
  isLoading: boolean;
}

export default function FactionsManager({
  factions,
  onChange,
  isLoading,
}: FactionsManagerProps) {
  const [availableFactions, setAvailableFactions] = useState<Fraction[]>([]);
  const [selectedFractionId, setSelectedFractionId] = useState<string>("");
  const [isLoadingFactions, setIsLoadingFactions] = useState(false);


  // Fetch available factions on component mount
  useEffect(() => {
    fetchFactions();
  }, []);

  const fetchFactions = async () => {
    try {
      setIsLoadingFactions(true);
      const response = await adminApi.getFactions();
      setAvailableFactions(response.data);
    } catch (error) {
      console.error("Error fetching factions:", error);
    } finally {
      setIsLoadingFactions(false);
    }
  };

  // Handle adding a faction to the game
  const handleAddFraction = () => {
    if (!selectedFractionId || isLoading) return;

    // Find the selected faction from available factions
    const factionToAdd = availableFactions.find(
      (f) => f._id === selectedFractionId
    );

    if (!factionToAdd) return;

    // Check if faction is already added
    const isAlreadyAdded = factions.some((f) => f._id === factionToAdd._id);
    if (isAlreadyAdded) return;

    // Create a new GameFraction by adding game-specific fields to the base Fraction
    const newGameFraction: GameFraction = {
      ...factionToAdd,
      capacity: 20, // Default capacity
      filled: 0, // Default filled (starts empty)
      details: "", // Добавляем пустое поле details для каждой новой фракции
    };

    // Update factions array
    const updatedFactions = [...factions, newGameFraction];
    onChange(updatedFactions);

    // Reset selection
    setSelectedFractionId("");
  };

  // Handle removing a faction from the game
  const handleRemoveFraction = (factionId: string) => {
    if (isLoading) return;
    
    const updatedFactions = factions.filter((f) => f._id !== factionId);
    onChange(updatedFactions);
  };

  // Handle updating a faction's capacity and filled count
  const handleFractionChange = (
    factionId: string,
    field: "capacity" | "filled" | "details" | "registrationLink",
    value: any
  ) => {
    if (isLoading) return;
    
    const updatedFactions = factions.map((faction) => {
      if (faction._id === factionId) {
        return {
          ...faction,
          [field]: field === "capacity" || field === "filled" ? parseInt(value, 10) || 0 : value,
        };
      }
      return faction;
    });
    
    onChange(updatedFactions);
  };

  // Calculate totals for summary
  const totalCapacity = factions.reduce((sum, faction) => sum + faction.capacity, 0);
  const totalFilled = factions.reduce((sum, faction) => sum + faction.filled, 0);

  return (
    <div className="space-y-6">
      {/* Fraction selection dropdown */}
      <div className="flex items-center mb-4">
        <div className="flex-grow mr-2">
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            value={selectedFractionId}
            onChange={(e) => setSelectedFractionId(e.target.value)}
            disabled={isLoading || isLoadingFactions}
          >
            <option value="">Select a faction to add...</option>
            {availableFactions
              .filter(
                (f) => !factions.some((added) => added._id === f._id)
              )
              .map((faction) => (
                <option key={faction._id} value={faction._id}>
                  {faction.name || faction._id}
                </option>
              ))}
          </select>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleAddFraction}
          disabled={!selectedFractionId || isLoading || isLoadingFactions}
        >
          Add
        </button>
      </div>

      {/* Factions list */}
      <div className="space-y-4">
        <AnimatePresence>
          {factions.length === 0 ? (
            <div className="text-center py-3 text-gray-400 italic">
              No factions added yet. Add a faction to get started.
            </div>
          ) : (
            factions.map((faction, index) => (
              <motion.div
                key={faction._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-lg">
                    {faction.name || faction._id}
                  </h4>
                  <button
                    onClick={() => handleRemoveFraction(faction._id)}
                    className="text-red-400 hover:text-red-300"
                    disabled={isLoading}
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

                {faction.shortDescription && (
                  <p className="text-sm text-gray-400 mt-1 mb-3">
                    {faction.shortDescription}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={faction.capacity}
                      onChange={(e) =>
                        handleFractionChange(
                          faction._id,
                          "capacity",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Filled Spots
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={faction.capacity}
                      value={faction.filled}
                      onChange={(e) =>
                        handleFractionChange(
                          faction._id,
                          "filled",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Fraction- Registration Link (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/register/faction"
                    value={faction.registrationLink || ""}
                    onChange={(e) =>
                      handleFractionChange(
                        faction._id,
                        "registrationLink",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use the game-wide registration link.
                  </p>
                </div> */}

                {/* Поле для деталей фракции */}
                <div className="mb-1 mt-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                    <span>Fraction Details</span>
                  </label>
                  
                  <textarea
                    value={faction.details || ""}
                    onChange={(e) => handleFractionChange(faction._id, "details", e.target.value)}
                    placeholder="Enter details specific to this faction in this game..."
                    rows={6}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    disabled={isLoading}
                  />
                  
                  <p className="text-xs text-gray-500 mt-1">
                    These details will be shown when players hover over this faction on the game details page.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-gray-300">
                      {faction.filled}/{faction.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        faction.filled / faction.capacity < 0.3
                          ? "bg-green-500"
                          : faction.filled / faction.capacity < 0.7
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(faction.filled / faction.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Capacity management area */}
      
    </div>
  );
}
