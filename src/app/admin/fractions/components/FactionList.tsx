import React from "react";
import Image from "next/image";
import { Faction } from "@/services/gameService";

interface FactionListProps {
  factions: Faction[];
  isLoading: boolean;
  onEditFaction: (faction: Faction) => void;
  onDeleteFaction: (factionId: string) => void;
}

export default function FactionList({
  factions,
  isLoading,
  onEditFaction,
  onDeleteFaction,
}: FactionListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-14 h-14 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (factions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-gray-700 rounded-lg bg-gray-800 p-6">
        <svg
          className="w-16 h-16 text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className="text-lg text-gray-400">No factions found</p>
        <p className="text-sm text-gray-500 mt-1">
          Create a new faction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {factions.map((faction) => (
        <div
          key={faction._id}
          className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          {/* Image Section with two images side by side */}
          <div className="flex h-40">
            {/* Main Faction Image */}
            <div className="w-1/2 relative bg-gray-900">
              {faction.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                  alt={`${faction._id} faction`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-850 text-gray-600">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-2 py-1 m-1 rounded">
                Main Image
              </div>
            </div>
            
            {/* Camo Sample Image */}
            <div className="w-1/2 relative bg-gray-900">
              {faction.camoSample ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/factions/camo-image/${faction.camoSample}`}
                  alt={`${faction._id} camo sample`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-850 text-gray-600">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-2 py-1 m-1 rounded">
                Camo Sample
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{faction._id}</h3>
            {faction.shortDescription && (
              <p className="text-gray-300 text-sm mb-3">{faction.shortDescription}</p>
            )}
            
            {/* Actions */}
            <div className="flex justify-between mt-2">
              <button
                onClick={() => onEditFaction(faction)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteFaction(faction._id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}