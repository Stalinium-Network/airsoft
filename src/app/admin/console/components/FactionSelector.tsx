import { useState, useEffect } from 'react';
import { adminApi } from '@/utils/api';
import { Faction, GameFaction } from '@/services/gameService';
import Image from 'next/image';

interface FactionSelectorProps {
  selectedFactions: GameFaction[];
  onSelect: (faction: GameFaction) => void;
  onRemove: (factionId: string) => void;
  isLoading?: boolean;
}

export default function FactionSelector({ 
  selectedFactions, 
  onSelect, 
  onRemove,
  isLoading = false 
}: FactionSelectorProps) {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    const fetchFactions = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getFactions();
        setFactions(response.data);
      } catch (error) {
        console.error('Error fetching factions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactions();
  }, []);

  // Filter out already selected factions
  const availableFactions = factions.filter(
    faction => !selectedFactions.some(selected => selected._id === faction._id)
  );

  const handleAddFaction = () => {
    if (!selectedId) return;
    
    const faction = factions.find(f => f._id === selectedId);
    if (faction) {
      // Add default values for the faction in the game context
      const GameFaction: GameFaction = {
        ...faction,
        details: '', // Default empty details
        capacity: 20, // Default capacity
        filled: 0, // Default filled
      };
      
      onSelect(GameFaction);
      setSelectedId(''); // Reset selection
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected factions */}
      {selectedFactions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-blue-400">Selected Factions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {selectedFactions.map(faction => (
              <div 
                key={faction._id} 
                className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg border border-gray-600 group"
              >
                {faction.image && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                      alt={faction.name || faction._id}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-white truncate">{faction.name || faction._id}</h4>
                  {faction.shortDescription && (
                    <p className="text-xs text-gray-400 truncate">{faction.shortDescription}</p>
                  )}
                </div>
                
                <button 
                  onClick={() => onRemove(faction._id)}
                  className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-gray-900 transition-colors"
                  title="Remove faction"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Faction selection */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h4 className="text-md font-medium text-green-400 mb-3">Add Faction</h4>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            disabled={loading || isLoading || availableFactions.length === 0}
          >
            <option value="">Select a faction to add</option>
            {availableFactions.map((faction) => (
              <option key={faction._id} value={faction._id}>
                {faction.name || faction._id}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleAddFaction}
            disabled={!selectedId || isLoading}
            className={`px-4 py-2 rounded-md font-medium sm:w-auto w-full ${
              !selectedId
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Add
          </button>
        </div>
        
        {availableFactions.length === 0 && selectedFactions.length > 0 && (
          <p className="text-yellow-500 mt-2 text-sm">All available factions have been added.</p>
        )}
        
        {availableFactions.length === 0 && selectedFactions.length === 0 && (
          <p className="text-yellow-500 mt-2 text-sm">No factions available. Create factions in the Faction Management section.</p>
        )}
      </div>
    </div>
  );
}
