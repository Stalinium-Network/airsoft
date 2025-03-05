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
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  
  // Initialize image preview if location has an image
  useEffect(() => {
    if (initialLocation.image) {
      // Create URL for the image - this assumes the image path needs to be constructed
      const image = `${process.env.NEXT_PUBLIC_API_URL}/locations/image/${initialLocation.image}`;
      setImagePreview(image);
    }
  }, [initialLocation]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      setImageChanged(true);
      console.log('DEBUG: Image selected for edit', { name: file.name, type: file.type, size: file.size });
    } catch (error) {
      console.error("Error handling image:", error);
      setError("Failed to process image. Please try another file.");
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);
  };
  
  // Handle save changes (update location)
  const handleUpdateLocation = async () => {        
    setError('');
    setIsLoading(true);
    setUploadProgress(0);
    
    // Validate data
    if (!location.name || !location.coordinates) {
      setError('Location name and coordinates are required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('name', location.name);
      formData.append('coordinates', location.coordinates);
      
      if (location.description) {
        formData.append('description', location.description);
      }
      
      // Handle image change logic
      if (imageChanged) {
        formData.append('imageChanged', 'true');
        if (imageFile) {
          formData.append('file', imageFile);
        }
      }
      
      // DEBUG log
      console.log('=== UPDATING LOCATION ===');
      console.log('Location ID:', initialLocation._id);
      console.log('Name:', location.name);
      console.log('Coordinates:', location.coordinates);
      console.log('Description:', location.description);
      console.log('Image Changed:', imageChanged);
      
      if (imageFile) {
        console.log('New Image:', {
          name: imageFile.name,
          type: imageFile.type,
          size: Math.round(imageFile.size / 1024) + 'KB'
        });
      } else if (imageChanged) {
        console.log('Image: Removed');
      } else {
        console.log('Image: Unchanged');
      }
      
      // Simulate upload progress
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
      
      // Submit the update request
      console.log('Submitting location update to API...');
      const response = await adminApi.updateLocation(initialLocation._id, formData);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('=== LOCATION UPDATED SUCCESSFULLY ===');
      console.log('Response data:', response.data);
      
      // Call the callback with the updated location
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
      <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-y-auto shadow-xl border border-gray-700">
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
                readOnly // Location ID (name) typically cannot be changed
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
                Location Image
              </label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Location preview" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-md px-6 py-8 text-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="mt-2 block text-sm font-medium text-gray-300">
                        Click to upload location image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageSelected(e.target.files[0]);
                          }
                        }}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Upload progress indicator */}
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
