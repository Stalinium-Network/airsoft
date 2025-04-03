'use client'
import { useState, useEffect } from 'react'
import { Location } from '@/services/locationService'
import { adminApi } from '@/utils/api'
import { createImagePreview } from '@/utils/imageUtils'
import ProgressBar from '../game-form/ProgressBar'

interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onLocationUpdated: (location: Location) => void;
  onError: (message: string) => void;
}

export default function EditLocationModal({
  location: initialLocation,
  onClose,
  onLocationUpdated,
  onError
}: EditLocationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{
    name: string;
    coordinates: string;
    description: string;
  }>({
    name: initialLocation._id,
    coordinates: initialLocation.coordinates || '',
    description: initialLocation.description || ''
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  
  useEffect(() => {
    if (initialLocation.images && initialLocation.images.length > 0) {
      const previews = initialLocation.images.map(
        img => `${process.env.NEXT_PUBLIC_API_URL}/locations/image/${img}`
      );
      setExistingImages(initialLocation.images);
      setImagePreviews(previews);
    }
  }, [initialLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImagesSelected = async (files: FileList) => {
    try {
      const newFiles: File[] = Array.from(files);
      const newPreviews: string[] = [];
      
      for (const file of newFiles) {
        const preview = await createImagePreview(file);
        newPreviews.push(preview);
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
      
      console.log('DEBUG: Images selected for edit', newFiles.length);
    } catch (error) {
      console.error("Error handling images:", error);
      setError("Failed to process images. Please try again with different files.");
    }
  };
  
  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setRemovedImages(prev => [...prev, imageToRemove]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveNewImage = (index: number) => {
    const adjustedIndex = index - existingImages.length;
    if (adjustedIndex >= 0) {
      setImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews.splice(index, 1);
        return newPreviews;
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      handleRemoveExistingImage(index);
    } else {
      handleRemoveNewImage(index);
    }
  };
  
  const handleUpdateLocation = async () => {        
    setError('');
    setIsLoading(true);
    setUploadProgress(0);
    
    if (!location.name || !location.coordinates) {
      setError('Location name and coordinates are required');
      setIsLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', location.name);
      formData.append('coordinates', location.coordinates);
      
      if (location.description) {
        formData.append('description', location.description);
      }
      
      if (removedImages.length > 0) {
        formData.append('removedImages', JSON.stringify(removedImages));
      }
      
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }
      
      imageFiles.forEach((file, index) => {
        formData.append('files', file);
      });
    
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
      
      console.log('Submitting location update to API...');
      const response = await adminApi.updateLocation(initialLocation._id, formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('=== LOCATION UPDATED SUCCESSFULLY ===');
      console.log('Response data:', response.data);
      
      onLocationUpdated(response.data);
    } catch (error: any) {
      console.error('=== ERROR UPDATING LOCATION ===');
      console.error('Error object:', error);
      console.error('Message:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      setError(error.response?.data?.message || error.message || 'Failed to update location');
      onError(error.response?.data?.message || error.message || 'Failed to update location');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-xl overflow-y-auto shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Location
          </h3>
          <button
            type="button"
            onClick={() => {
              console.log('Close button clicked');
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-white text-sm">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={location.name}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Airsoft Field 228"
                required
                disabled={isLoading}
                readOnly
              />
              <p className="mt-1 text-xs text-gray-400">
                Location name (ID) cannot be changed after creation
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Coordinates <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="coordinates"
                value={location.coordinates}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="50.4501,30.5234"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-400">
                Format: latitude,longitude (e.g. 50.4501,30.5234)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={location.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Describe the location..."
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location Images
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-40">
                      <img 
                        src={preview} 
                        alt={`Location preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-600 rounded-md px-6 py-8 text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-gray-300">
                    Click to upload additional images
                  </span>
                  <span className="text-xs text-gray-500">
                    You can select multiple images
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImagesSelected(e.target.files);
                      }
                    }}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <ProgressBar progress={uploadProgress} show={isLoading && uploadProgress > 0} />
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={isLoading}
              onClick={handleUpdateLocation}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        </div>
      </div>
    </div>
  );
}
