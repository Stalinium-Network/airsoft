'use client'
import { useEffect } from "react";
import { isPastGame } from "@/services/adminService";
import { Game } from "@/services/gameService";
import { Location } from "@/services/locationService";
import LocationSelector from "./LocationSelector";

interface GameFormFieldsProps {
  game: Partial<Game>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | {
    target: { name: string; value: any };
  }) => void;
  isLoading?: boolean;
}

// Helper function to format Date object for datetime-local input
const formatDateTimeForInput = (date: Date | undefined): string => {
  if (!date) return '';
  
  try {
    // Handle string conversion if needed (for backward compatibility)
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    // Format as YYYY-MM-DDThh:mm for datetime-local input
    const pad = (n: number) => n < 10 ? '0' + n : n;
    
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  } catch (err) {
    console.error("Date formatting error:", err);
    return '';
  }
};

// Helper function to calculate end time based on start date and duration
const calculateEndTime = (date: Date | undefined, durationHours: number): string => {
  if (!date) return 'Set start date first';
  
  try {
    // Handle string conversion if needed
    const start = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(start.getTime())) return 'Invalid start date';
    
    const end = new Date(start.getTime() + (durationHours || 0) * 60 * 60 * 1000);
    
    // Format as "Month DD, YYYY at HH:MM AM/PM"
    return end.toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch (err) {
    console.error("End time calculation error:", err);
    return 'Calculation error';
  }
};

export default function GameFormFields({ game, onChange, isLoading = false }: GameFormFieldsProps) {
  // Handle date change with proper Date object conversion
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;
    
    // Create a synthetic event with the Date object
    const syntheticEvent = {
      target: {
        name: 'date',
        value: new Date(dateValue)
      }
    };
    
    onChange(syntheticEvent);
  };
  
  // Handle single location selection
  const handleLocationChange = (location: Location | string) => {
    // Single location is always selected, never multiple
    console.log("GameFormFields: Single location selected:", 
      typeof location === 'object' ? location._id : location);
    
    // Create a synthetic event with the location
    const syntheticEvent = {
      target: {
        name: 'location',
        // If it's a Location object, we just need to send the ID (name)
        value: typeof location === 'string' ? location : location._id
      }
    };
    
    onChange(syntheticEvent);
  };
  
  return (
    <>
      {/* Basic info section */}
      <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg border border-gray-700 mb-4">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game Name
            </label>
            <input
              type="text"
              name="name"
              value={game.name || ''}
              onChange={onChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Operation Blackout"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <LocationSelector
              selectedLocation={game.location || null}
              onChange={handleLocationChange}
              isLoading={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-300">
                $
              </span>
              <input
                type="number"
                name="price"
                value={game.price || 0}
                onChange={onChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-7 px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                min="0"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timing section */}
      <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg border border-gray-700 mb-4">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Date & Time
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formatDateTimeForInput(game.date)}
              onChange={handleDateChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {game.date ? (typeof game.date === 'string' ? new Date(game.date) : game.date).toLocaleString() : 'Select start date'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              name="duration"
              value={game.duration || 3} // Default 3 hours if not set
              onChange={onChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              step="0.5"
              min="0.5"
              max="72"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              End time: {calculateEndTime(game.date, game.duration || 3)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Capacity section */}
      <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg border border-gray-700 mb-4">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Capacity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Total Capacity
            </label>
            <input
              type="number"
              name="capacity.total"
              value={game.capacity?.total || 0}
              onChange={onChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              min="1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Registrations
            </label>
            <input
              type="number"
              name="capacity.filled"
              value={game.capacity?.filled || 0}
              onChange={onChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              min="0"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Description section */}
      <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg border border-gray-700 mb-4">
        <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Description
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Public Description <span className="text-gray-400">(visible to all users)</span>
          </label>
          <textarea
            name="description"
            value={game.description || ''}
            onChange={onChange}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="An intense tactical mission through challenging terrain..."
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            This description will be visible on game preview.
          </p>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Detailed Description
          </label>
          <textarea
            name="detailedDescription"
            value={game.detailedDescription || ''}
            onChange={onChange}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Detailed description..."
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Detailed description in MARKDOWN form.
          </p>
        </div>
      </div>
    </>
  );
}
