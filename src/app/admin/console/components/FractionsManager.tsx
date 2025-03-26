"use client";
import { useState, useEffect } from "react";
import { Fraction, GameFraction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import MarkdownEditorComponent from '@/components/admin/MarkdownEditorComponent';

interface FractionsManagerProps {
  fractions: GameFraction[];
  onChange: (fractions: GameFraction[]) => void;
  isLoading: boolean;
}

export default function FractionsManager({
  fractions,
  onChange,
  isLoading,
}: FractionsManagerProps) {
  const [availableFractions, setAvailableFractions] = useState<Fraction[]>([]);
  const [selectedFractionId, setSelectedFractionId] = useState<string>("");
  const [isLoadingFractions, setIsLoadingFractions] = useState(false);


  // Fetch available fractions on component mount
  useEffect(() => {
    fetchFractions();
  }, []);

  const fetchFractions = async () => {
    try {
      setIsLoadingFractions(true);
      const response = await adminApi.getFractions();
      setAvailableFractions(response.data);
    } catch (error) {
      console.error("Error fetching fractions:", error);
    } finally {
      setIsLoadingFractions(false);
    }
  };

  // Handle adding a fraction to the game
  const handleAddFraction = () => {
    if (!selectedFractionId || isLoading) return;

    // Find the selected fraction from available fractions
    const fractionToAdd = availableFractions.find(
      (f) => f._id === selectedFractionId
    );

    if (!fractionToAdd) return;

    // Check if fraction is already added
    const isAlreadyAdded = fractions.some((f) => f._id === fractionToAdd._id);
    if (isAlreadyAdded) return;

    // Create a new GameFraction by adding game-specific fields to the base Fraction
    const newGameFraction: GameFraction = {
      ...fractionToAdd,
      capacity: 20, // Default capacity
      filled: 0, // Default filled (starts empty)
      details: "", // Добавляем пустое поле details для каждой новой фракции
    };

    // Update fractions array
    const updatedFractions = [...fractions, newGameFraction];
    onChange(updatedFractions);

    // Reset selection
    setSelectedFractionId("");
  };

  // Handle removing a fraction from the game
  const handleRemoveFraction = (fractionId: string) => {
    if (isLoading) return;
    
    const updatedFractions = fractions.filter((f) => f._id !== fractionId);
    onChange(updatedFractions);
  };

  // Handle updating a fraction's capacity and filled count
  const handleFractionChange = (
    fractionId: string,
    field: "capacity" | "filled" | "details" | "registrationLink",
    value: any
  ) => {
    if (isLoading) return;
    
    const updatedFractions = fractions.map((fraction) => {
      if (fraction._id === fractionId) {
        return {
          ...fraction,
          [field]: field === "capacity" || field === "filled" ? parseInt(value, 10) || 0 : value,
        };
      }
      return fraction;
    });
    
    onChange(updatedFractions);
  };

  // Calculate totals for summary
  const totalCapacity = fractions.reduce((sum, fraction) => sum + fraction.capacity, 0);
  const totalFilled = fractions.reduce((sum, fraction) => sum + fraction.filled, 0);

  return (
    <div className="space-y-6">
      {/* Fraction selection dropdown */}
      <div className="flex items-center mb-4">
        <div className="flex-grow mr-2">
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
            value={selectedFractionId}
            onChange={(e) => setSelectedFractionId(e.target.value)}
            disabled={isLoading || isLoadingFractions}
          >
            <option value="">Select a fraction to add...</option>
            {availableFractions
              .filter(
                (f) => !fractions.some((added) => added._id === f._id)
              )
              .map((fraction) => (
                <option key={fraction._id} value={fraction._id}>
                  {fraction.name || fraction._id}
                </option>
              ))}
          </select>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleAddFraction}
          disabled={!selectedFractionId || isLoading || isLoadingFractions}
        >
          Add
        </button>
      </div>

      {/* Fractions list */}
      <div className="space-y-4">
        <AnimatePresence>
          {fractions.length === 0 ? (
            <div className="text-center py-3 text-gray-400 italic">
              No fractions added yet. Add a fraction to get started.
            </div>
          ) : (
            fractions.map((fraction, index) => (
              <motion.div
                key={fraction._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-lg">
                    {fraction.name || fraction._id}
                  </h4>
                  <button
                    onClick={() => handleRemoveFraction(fraction._id)}
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

                {fraction.shortDescription && (
                  <p className="text-sm text-gray-400 mt-1 mb-3">
                    {fraction.shortDescription}
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
                      value={fraction.capacity}
                      onChange={(e) =>
                        handleFractionChange(
                          fraction._id,
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
                      max={fraction.capacity}
                      value={fraction.filled}
                      onChange={(e) =>
                        handleFractionChange(
                          fraction._id,
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
                    placeholder="https://example.com/register/fraction"
                    value={fraction.registrationLink || ""}
                    onChange={(e) =>
                      handleFractionChange(
                        fraction._id,
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

                {/* Новое поле для деталей фракции с поддержкой Markdown */}
                <div className="mb-1 mt-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                    <span>Fraction Details</span>
                    <span className="ml-2 text-xs text-blue-400">(Markdown supported)</span>
                  </label>
                  
                  <MarkdownEditorComponent
                    markdown={fraction.details || ""}
                    onChange={(markdown) => handleFractionChange(fraction._id, "details", markdown)}
                    placeholder="Enter details specific to this fraction in this game..."
                    editorStyles={{ height: '200px' }}
                  />
                  
                  <p className="text-xs text-gray-500 mt-1">
                    These details will be shown when players hover over this fraction on the game details page.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-gray-300">
                      {fraction.filled}/{fraction.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        fraction.filled / fraction.capacity < 0.3
                          ? "bg-green-500"
                          : fraction.filled / fraction.capacity < 0.7
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(fraction.filled / fraction.capacity) * 100}%`,
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
