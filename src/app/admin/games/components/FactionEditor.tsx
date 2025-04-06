'use client';

import { useState } from 'react';
import { GameFaction } from '@/services/gameService';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import Trash from '@/components/SVG/Trash';
import Plus from '@/components/SVG/Plus';

interface FactionEditorProps {
  factions: GameFaction[];
  onFactionsChange: (factions: GameFaction[]) => void;
  availableFactions: any[]; // Получаем доступные фракции из пропсов
}

export default function FactionEditor({ factions, onFactionsChange, availableFactions }: FactionEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get available factions that haven't been added yet
  const getAvailableToAdd = () => {
    const usedFactionIds = factions.map(f => f._id);
    return availableFactions.filter(f => !usedFactionIds.includes(f._id));
  };

  // Add faction to list
  const handleAddFaction = (faction: any) => {
    // Create new game faction object
    const gameFaction: GameFaction = {
      ...faction,
      capacity: 30, // Default value
      filled: 0,
      details: ''
    };

    // Add faction to list
    const updatedFactions = [...factions, gameFaction];
    onFactionsChange(updatedFactions);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Remove faction from list
  const handleRemoveFaction = (index: number) => {
    const updatedFactions = [...factions];
    updatedFactions.splice(index, 1);
    onFactionsChange(updatedFactions);
  };

  // Update faction data
  const handleFactionChange = (index: number, field: keyof GameFaction, value: any) => {
    const updatedFactions = [...factions];
    updatedFactions[index] = {
      ...updatedFactions[index],
      [field]: value
    };
    onFactionsChange(updatedFactions);
  };

  // Get faction image URL
  const getFactionImageUrl = (image: string) => {
    if (!image) return '/logo.png';
    return `${process.env.NEXT_PUBLIC_API_URL}/factions/image/${image}`;
  };

  if (!availableFactions || availableFactions.length === 0) {
    return (
      <div className="flex justify-center my-4">
        <LoadingSpinner />
      </div>
    );
  }

  const availableToAdd = getAvailableToAdd();

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* List of added factions */}
      <div className="space-y-4">
        {factions.map((faction, index) => (
          <div key={`${faction._id}-${index}`} className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 relative overflow-hidden rounded-full">
                  <Image 
                    src={getFactionImageUrl(faction.image)}
                    alt={faction._id}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-200">{faction._id}</h4>
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveFaction(index)}
                className="text-red-400 hover:text-red-300"
                title="Remove faction"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Players count indicator */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Players</label>
                <div className="flex items-center">
                  <div className="relative flex items-center w-full bg-gray-800 rounded-md overflow-hidden border border-gray-600">
                    {/* Left input (filled) */}
                    <input
                      type="number"
                      value={faction.filled}
                      onChange={(e) => handleFactionChange(index, 'filled', parseInt(e.target.value))}
                      className="w-1/2 px-3 py-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent z-10"
                      min="0"
                      max={faction.capacity}
                    />
                    
                    {/* Divider with slash */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-full w-px bg-gray-600"></div>
                      <span className="text-gray-400 font-medium px-2">/</span>
                    </div>
                    
                    {/* Right input (capacity) */}
                    <input
                      type="number"
                      value={faction.capacity}
                      onChange={(e) => handleFactionChange(index, 'capacity', parseInt(e.target.value))}
                      className="w-1/2 px-3 py-2 bg-gray-800 text-gray-200 text-right focus:ring-2 focus:ring-amber-500 focus:border-transparent z-10"
                      min="0"
                    />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ 
                      width: `${faction.capacity > 0 ? (faction.filled / faction.capacity * 100) : 0}%`,
                      backgroundColor: faction.filled > faction.capacity ? '#ef4444' : undefined
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Additional Details</label>
                <textarea
                  value={faction.details || ''}
                  onChange={(e) => handleFactionChange(index, 'details', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button to add new faction with dropdown */}
      <div className="flex justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={availableToAdd.length === 0}
            className="flex items-center px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 transition-colors disabled:bg-gray-600 disabled:text-gray-400 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faction
          </button>
          
          {/* Dropdown with available factions */}
          {isDropdownOpen && availableToAdd.length > 0 && (
            <div className="absolute z-20 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto">
              {availableToAdd.map((faction) => (
                <button
                  key={faction._id}
                  onClick={() => handleAddFaction(faction)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2"
                >
                  <div className="h-8 w-8 relative overflow-hidden rounded-full flex-shrink-0">
                    <Image 
                      src={getFactionImageUrl(faction.image)}
                      alt={faction._id}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-200">{faction._id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}