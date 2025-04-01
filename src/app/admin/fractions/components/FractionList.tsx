import { Faction } from '@/services/gameService';
import Image from 'next/image';

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
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-6">All Factions</h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {!isLoading && factions.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No factions found. Create a new faction to get started.
        </div>
      )}

      {/* Faction grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factions.map((faction) => (
          <div
            key={faction._id}
            className="bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-600"
          >
            {/* Faction image */}
            <div className="h-40 relative">
              {faction.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                  alt={faction.name || faction._id}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-gray-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-xl font-bold text-white">{faction.name || faction._id}</h3>
              </div>
            </div>

            {/* Faction info */}
            <div className="p-4">
              {faction.shortDescription && (
                <p className="text-gray-300 mb-3 line-clamp-2">{faction.shortDescription}</p>
              )}
              
              <div className="text-sm text-gray-400 mb-4">
                <div className="mb-1">
                  <span className="text-gray-500">ID:</span> {faction._id}
                </div>
              </div>

              {/* Usage indicators - could show in how many games the faction is used */}
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
                  Faction
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditFaction(faction)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteFaction(faction._id)}
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
