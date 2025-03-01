'use client'
import { useState } from 'react'
import { Game } from '@/services/gameService'
import { isPastGame, formatDateForInput, formatDateForDisplay } from '@/services/adminService'
import { adminApi } from '@/utils/api'

interface EditGameModalProps {
  game: Game
  onClose: () => void
  onGameUpdated: (game: Game) => void
  onError: (message: string) => void
}

export default function EditGameModal({
  game,
  onClose,
  onGameUpdated,
  onError
}: EditGameModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editingGame, setEditingGame] = useState<Game>({...game})

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., capacity.total)
      const [parent, child] = name.split('.')
      setEditingGame({
        ...editingGame,
        [parent]: {
          ...editingGame[parent as keyof Game],
          [child]: parent === 'capacity' ? parseInt(value, 10) || 0 : value
        }
      })
    } else if (name === 'price') {
      setEditingGame({
        ...editingGame,
        price: parseInt(value, 10) || 0
      })
    } else if (name === 'date') {
      // When date changes, update isPast automatically
      setEditingGame({
        ...editingGame,
        date: value,
        isPast: isPastGame(value)
      })
    } else if (name === 'isPast') {
      setEditingGame({
        ...editingGame,
        isPast: value === 'true'
      })
    } else {
      setEditingGame({
        ...editingGame,
        [name]: value
      })
    }
  }

  // Update game using axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    // Format date for display and update isPast based on the actual date
    const gameToUpdate = {
      ...editingGame,
      isPast: isPastGame(editingGame.date),
      date: formatDateForDisplay(editingGame.date) // Ensure date is in display format for storage
    }
    
    try {
      await adminApi.updateGame(editingGame._id, gameToUpdate)
      
      // Call the callback with the updated game
      onGameUpdated(gameToUpdate)
    } catch (error: any) {
      console.error('Error updating game:', error)
      
      // Extract error message from axios error
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      onError(`Failed to update game: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Edit Game</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Game Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingGame.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formatDateForInput(editingGame.date)}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Status: {isPastGame(editingGame.date) ? 'Past Event' : 'Upcoming Event'}
                  {isPastGame(editingGame.date) !== editingGame.isPast && ' (Will update status on save)'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editingGame.location}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Coordinates</label>
                <input
                  type="text"
                  name="coordinates"
                  value={editingGame.coordinates}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingGame.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editingGame.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Total Capacity</label>
                <input
                  type="number"
                  name="capacity.total"
                  value={editingGame.capacity.total}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Registrations</label>
                <input
                  type="number"
                  name="capacity.filled"
                  value={editingGame.capacity.filled}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="0"
                  max={editingGame.capacity.total}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingGame.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="isPast"
                  value={editingGame.isPast.toString()}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                >
                  <option value="false">Upcoming</option>
                  <option value="true">Past</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
