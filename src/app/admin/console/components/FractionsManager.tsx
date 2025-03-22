import React, { useState } from 'react';
import { GameFraction } from '@/services/gameService';
import FractionSelector from './FractionSelector';
import Image from 'next/image';

interface FractionsManagerProps {
  fractions: GameFraction[];
  onChange: (fractions: GameFraction[]) => void;
  isLoading?: boolean;
}

export default function FractionsManager({ fractions, onChange, isLoading = false }: FractionsManagerProps) {
  // Add a selected fraction to the game
  const handleAddFraction = (fraction: GameFraction) => {
    onChange([...fractions, fraction]);
  };

  // Remove a fraction from the game
  const handleRemoveFraction = (fractionId: string) => {
    onChange(fractions.filter(f => f._id !== fractionId));
  };

  // Update a fraction's capacity, filled or registrationLink values
  const handleUpdateFraction = (index: number, field: 'capacity' | 'filled' | 'registrationLink', value: number | string) => {
    const updatedFractions = [...fractions];
    updatedFractions[index] = {
      ...updatedFractions[index],
      [field]: value
    };
    onChange(updatedFractions);
  };

  // Calculate totals for summary
  const totalCapacity = fractions.reduce((sum, fraction) => sum + fraction.capacity, 0);
  const totalFilled = fractions.reduce((sum, fraction) => sum + fraction.filled, 0);

  return (
    <div className="space-y-6">
      {/* Faction selection area */}
      <FractionSelector
        selectedFractions={fractions}
        onSelect={handleAddFraction}
        onRemove={handleRemoveFraction}
        isLoading={isLoading}
      />
      
      {/* Capacity management area */}
      {fractions.length > 0 && (
        <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
          <h3 className="text-md font-medium text-green-400 mb-4">Faction Capacities</h3>
          
          {/* Summary */}
          <div className="flex justify-between text-sm bg-gray-700/50 p-3 rounded mb-4">
            <span className="text-gray-300">Total Capacity: <span className="text-white font-medium">{totalCapacity}</span></span>
            <span className="text-gray-300">Total Filled: <span className="text-white font-medium">{totalFilled}</span></span>
            <span className="text-gray-300">Remaining: <span className="text-green-400 font-medium">{totalCapacity - totalFilled}</span></span>
          </div>
          
          {/* Capacity editing interface */}
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Faction
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Filled
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Available
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {fractions.map((fraction, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-700'}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {fraction.image && (
                          <div className="flex-shrink-0 h-8 w-8 mr-3 relative">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`}
                              alt={fraction.name || fraction._id}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-white">{fraction.name || fraction._id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={fraction.capacity}
                        onChange={(e) => handleUpdateFraction(index, 'capacity', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max={fraction.capacity}
                        value={fraction.filled}
                        onChange={(e) => handleUpdateFraction(index, 'filled', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fraction.capacity - fraction.filled > 0 
                          ? 'bg-green-900/40 text-green-400' 
                          : 'bg-red-900/40 text-red-400'
                      }`}>
                        {fraction.capacity - fraction.filled}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Registration links section - скрыта, но код сохранен */}
          <div className="mt-6 hidden">
            <h4 className="text-md font-medium text-green-400 mb-4">Registration Links</h4>
            <div className="space-y-3">
              {fractions.map((fraction, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                  <div className="flex items-center mb-2">
                    {fraction.image && (
                      <div className="flex-shrink-0 h-6 w-6 mr-2 relative">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`}
                          alt={fraction.name || fraction._id}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="text-sm font-medium text-white">{fraction.name || fraction._id}</div>
                  </div>
                  <input
                    type="text"
                    value={fraction.registrationLink || ''}
                    onChange={(e) => handleUpdateFraction(index, 'registrationLink', e.target.value)}
                    placeholder="Enter registration link (e.g., /register/game-1/fraction-1)"
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
