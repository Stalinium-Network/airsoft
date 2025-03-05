'use client'
import { useState, useEffect } from 'react'
import { Game } from '@/services/gameService'
import { formatDateForInput } from '@/services/adminService'
import LocationSelector from './LocationSelector'

// Define the mixed event type
export type MixedChangeEvent = 
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> 
  | { target: { name: string; value: any } };

interface GameFormFieldsProps {
  game: Partial<Game>;
  onChange: (e: MixedChangeEvent) => void;
  isLoading?: boolean;
}

export default function GameFormFields({
  game,
  onChange,
  isLoading = false
}: GameFormFieldsProps) {
  // Converting date format for datetime-local input - automatically call when input renders
  const [startDate, setStartDate] = useState<string>(formatDateForInput(game.date || new Date()));

  useEffect(() => {
    // Update the state and parent form when props change
    if (game.date) {
      setStartDate(formatDateForInput(game.date));
    }
  }, [game.date]);
  
  // Function that updates both the local state and calls the parent's onChange
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onChange(e);
  };
  
  // Make sure we're correctly typing all event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e);
  };

  // Handle location change which could be a string or object
  const handleLocationChange = (location: any) => {
    // Create a synthetic event object that matches the expected format
    const syntheticEvent = {
      target: {
        name: 'location',
        value: location
      }
    };
    
    onChange(syntheticEvent);
  };
  
  return (
    <>
      {/* 1. Basic Information */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Game title field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={game.name || ''}
              onChange={handleChange}
              placeholder="Enter game title"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Date/time field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="date"
              value={startDate}
              onChange={handleDateChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Duration field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (hours) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              max="48"
              value={game.duration || ''}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Price field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price per Player ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              min="0"
              value={game.price || ''}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>
        
      {/* 2. Location Information */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location
        </h3>
        
        <LocationSelector
          selectedLocation={game.location || ''}
          onChange={handleLocationChange}
          isLoading={isLoading}
        />
      </div>
      
      {/* 3. Capacity Information */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Capacity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total capacity field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Total Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity.total"
              min="1"
              max="1000"
              value={game.capacity?.total || ''}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Current registrations field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Registrations
            </label>
            <input
              type="number"
              name="capacity.filled"
              min="0"
              max={game.capacity?.total || 1000}
              value={game.capacity?.filled || ''}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* 4. Description Information */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Description
        </h3>
        
        {/* Short description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Short Description <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(Shown in game listings)</span>
          </label>
          <textarea
            name="description"
            value={game.description || ''}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Brief description of the event (visible in game listings)"
            disabled={isLoading}
            required
          ></textarea>
        </div>

        {/* Detailed description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Detailed Description
            <span className="text-xs text-gray-500 ml-2">(Supports Markdown formatting)</span>
          </label>
          <textarea
            name="detailedDescription"
            value={game.detailedDescription || ''}
            onChange={handleChange}
            rows={8}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
            placeholder="# Full description of the event&#10;- Detailed info&#10;- Rules&#10;- Schedule"
            disabled={isLoading}
          ></textarea>
          <p className="mt-1 text-xs text-gray-400">
            Use Markdown to format text. Headers, lists, links, and emphasis are supported.
          </p>
        </div>
      </div>
    </>
  )
}
