'use client'
import { useState, useEffect } from 'react'
import { Game } from '@/services/gameService'
import { isPastGame, formatDateForDisplay } from '@/services/adminService'
import { adminApi } from '@/utils/api'
import { createImagePreview } from '@/utils/imageUtils'

// Components
import GameFormFields from './game-form/GameFormFields'
import ImageUploadSection from './game-form/ImageUploadSection'
import ProgressBar from './game-form/ProgressBar'

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageChanged, setImageChanged] = useState(false)

  // Initialize image preview from existing URL if available
  useEffect(() => {
    if (game.image && game.image.startsWith('http')) {
      setImagePreview(game.image);
    }
  }, [game.image]);

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
      // When start date changes, update isPast automatically
      setEditingGame({
        ...editingGame,
        date: value,
        isPast: isPastGame(value)
      });
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

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      setImageChanged(true);
      
      // Update the game state to indicate we have an image
      setEditingGame(prev => ({
        ...prev,
        image: 'file_upload' // Marker that will be replaced by the server
      }));
    } catch (error) {
      console.error("Error handling image:", error);
      onError("Failed to process image. Please try another file.");
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);
    
    setEditingGame(prev => ({
      ...prev,
      image: ""
    }));
  };

  // Update game with FormData to support file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setUploadProgress(0)
    
    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData()
      
      // Convert Date object to ISO string for API
      const dateString = editingGame.date instanceof Date 
        ? editingGame.date.toISOString() 
        : editingGame.date;
        
      // Append individual form fields directly
      formData.append('name', editingGame.name);
      formData.append('date', dateString);
      formData.append('duration', editingGame.duration.toString());
      formData.append('location', editingGame.location);
      formData.append('coordinates', editingGame.coordinates);
      formData.append('description', editingGame.description);
      formData.append('price', editingGame.price.toString());
      formData.append('isPast', isPastGame(editingGame.date).toString());
      
      // Append capacity as individual fields
      formData.append('totalCapacity', editingGame.capacity.total.toString());
      formData.append('filledCapacity', editingGame.capacity.filled.toString());
      
      // IMPORTANT FIX: Image handling
      // Only include the image file if it exists
      if (imageFile) {
        // Append as 'file', not as 'image'
        formData.append('file', imageFile);
      } else if (editingGame.image && !imageChanged) {
        // Only send imageUrl if we're using an external URL and not uploading a file
        formData.append('imageUrl', editingGame.image);
      } else if (imageChanged && !imageFile) {
        // If image was deleted (changed but no new file), explicitly set empty imageUrl
        formData.append('imageUrl', '');
      }
      
      // Flag if the image was changed (including removal)
      if (imageChanged) {
        formData.append('imageChanged', 'true');
      }

      // Add the game ID for identification
      formData.append('gameId', editingGame._id.toString());
      
      // Simulate upload progress (for demo)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // Submit the form
      await adminApi.updateGameWithImage(editingGame._id, formData)
      
      // Finish progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Create a complete game object for the state update
      const updatedGame = {
        ...editingGame,
        isPast: isPastGame(editingGame.date)
      };
      
      // Call the callback with the updated game
      onGameUpdated(updatedGame)
    } catch (error: any) {
      console.error('Error updating game:', error)
      
      // Extract error message from axios error
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      onError(`Failed to update game: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
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
              disabled={isLoading}
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
              {/* Game info fields */}
              <GameFormFields 
                game={editingGame} 
                onChange={handleInputChange} 
                isLoading={isLoading}
              />

              {/* Status field (only in Edit mode) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="isPast"
                  value={editingGame.isPast.toString()}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                  disabled={isLoading}
                >
                  <option value="false">Upcoming</option>
                  <option value="true">Past</option>
                </select>
              </div>

              {/* Image upload section - fixing the props that were cut off */}
              <ImageUploadSection 
                imagePreview={imagePreview}
                onImageChange={handleImageSelected}
                onImageRemove={handleRemoveImage}
                fileInputDisabled={isLoading}
              />
            </div>
            
            {/* Upload progress indicator - moved inside the form */}
            <ProgressBar progress={uploadProgress} show={isLoading && uploadProgress > 0} />

            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                disabled={isLoading}
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
