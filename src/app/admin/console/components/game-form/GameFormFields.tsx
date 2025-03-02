'use client'
import { formatDateForInput, isPastGame } from "@/services/adminService";
import { Game } from "@/services/gameService";

interface GameFormFieldsProps {
  game: Partial<Game>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isLoading?: boolean;
}

export default function GameFormFields({ game, onChange, isLoading = false }: GameFormFieldsProps) {
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formatDateForInput(game.date || '')}
          onChange={onChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Status:{" "}
          {isPastGame(game.date || '') ? "Past Event" : "Upcoming Event"}
        </p>
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
