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
      setEditingGame({
        ...editingGame,
        date: new Date(value), 
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
      
      // Append additional admin-only description
      if (editingGame.additional) {
        formData.append('additional', editingGame.additional);
      }
      
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Game
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Saving changes...</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Game info fields */}
              <GameFormFields 
                game={editingGame} 
                onChange={handleInputChange} 
                isLoading={isLoading}
              />

              {/* Status field (only in Edit mode) */}
              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Event Status
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Status</label>
                  <div className="flex items-center space-x-4">
                    <label className={`flex items-center p-3 rounded-md border ${editingGame.isPast ? 'bg-gray-700 border-gray-600' : 'bg-green-900/20 border-green-500 ring-2 ring-green-500'} cursor-pointer transition-all`}>
                      <input
                        type="radio"
                        name="isPast"
                        value="false"
                        checked={!editingGame.isPast}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Upcoming</span>
                    </label>
                    
                    <label className={`flex items-center p-3 rounded-md border ${!editingGame.isPast ? 'bg-gray-700 border-gray-600' : 'bg-red-900/20 border-red-500 ring-2 ring-red-500'} cursor-pointer transition-all`}>
                      <input
                        type="radio"
                        name="isPast"
                        value="true"
                        checked={editingGame.isPast}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Past</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image upload section */}
              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Image
                </h3>
                
                <ImageUploadSection 
                  imagePreview={imagePreview}
                  onImageChange={handleImageSelected}
                  onImageRemove={handleRemoveImage}
                  fileInputDisabled={isLoading}
                />
              </div>
            </div>
            
            {/* Upload progress indicator */}
            <ProgressBar progress={uploadProgress} show={isLoading && uploadProgress > 0} />

            <div className="flex gap-3 justify-end mt-6 sticky bottom-0 pt-4 bg-gradient-to-t from-gray-800 to-transparent">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition-colors flex items-center"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors flex items-center
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
