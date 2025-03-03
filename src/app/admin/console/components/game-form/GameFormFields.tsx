'use client'
import { useEffect } from "react";
import { isPastGame } from "@/services/adminService";
import { Game } from "@/services/gameService";

interface GameFormFieldsProps {
  game: Partial<Game>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
      ...e,
      target: {
        ...e.target,
        name: 'date',
        value: new Date(dateValue)
      }
    };
    
    onChange(syntheticEvent as any);
  };
  
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Game Name
        </label>
        <input
          type="text"
          name="name"
          value={game.name || ''}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Operation Blackout"
          required
          disabled={isLoading}
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formatDateTimeForInput(game.date)}
            onChange={handleDateChange}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
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
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={game.location || ''}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Forest Base, Kiev"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Coordinates
        </label>
        <input
          type="text"
          name="coordinates"
          value={game.coordinates || ''}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="50.4501,30.5234"
          required
          disabled={isLoading}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={game.description || ''}
          onChange={onChange}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="An intense tactical mission through challenging terrain..."
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Total Capacity
        </label>
        <input
          type="number"
          name="capacity.total"
          value={game.capacity?.total || 0}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
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
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          required
          min="0"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={game.price || 0}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          required
          min="0"
          disabled={isLoading}
        />
      </div>
    </>
  );
}
