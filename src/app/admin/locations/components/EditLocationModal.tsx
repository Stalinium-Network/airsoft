'use client'
import { useState, useEffect } from 'react'
import { Location } from '@/services/locationService'
import { adminApi } from '@/utils/api'
import {
  FormField,
  ImageGallery,
  ImageUploader,
  ModalWrapper,
  useImageHandling
} from './shared/LocationModalComponents'

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
  const [location, setLocation] = useState({
    name: initialLocation._id,
    coordinates: initialLocation.coordinates || '',
    description: initialLocation.description || ''
  });
  
  // Use our shared image handling hook for new images
  const {
    imageFiles,
    imagePreviews: newImagePreviews,
    setImagePreviews: setNewImagePreviews,
    handleImagesSelected,
    handleRemoveImage: handleRemoveNewImage
  } = useImageHandling();
  
  // Additional state for existing images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingImagePreviews, setExistingImagePreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  
  // Combined image previews for display
  const allImagePreviews = [...existingImagePreviews, ...newImagePreviews];
  
  // Load existing images on component mount
  useEffect(() => {
    if (initialLocation.images && initialLocation.images.length > 0) {
      const previews = initialLocation.images.map(
        img => `${process.env.NEXT_PUBLIC_API_URL}/locations/image/${img}`
      );
      setExistingImages(initialLocation.images);
      setExistingImagePreviews(previews);
    }
  }, [initialLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle removing images (both existing and new)
  const handleRemoveImage = (index: number) => {
    if (index < existingImagePreviews.length) {
      // Remove existing image
      const imageToRemove = existingImages[index];
      setRemovedImages(prev => [...prev, imageToRemove]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setExistingImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove new image
      const newIndex = index - existingImagePreviews.length;
      handleRemoveNewImage(newIndex);
    }
  };
  
  // Process image selection
  const handleFilesSelected = async (files: FileList) => {
    const result = await handleImagesSelected(files);
    if (result?.error) {
      setError(result.error);
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
      
      imageFiles.forEach((file) => {
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
      
      const response = await adminApi.updateLocation(initialLocation._id, formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onLocationUpdated(response.data);
    } catch (error: any) {
      console.error('Error updating location:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update location';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const editIcon = (
    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
  
  return (
    <ModalWrapper
      title="Edit Location"
      icon={editIcon}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleUpdateLocation}
      submitText="Save Changes"
      loadingText="Saving..."
      error={error}
      uploadProgress={uploadProgress}
    >
      <div className="space-y-4">
        <FormField
          label="Location Name"
          name="name"
          value={location.name}
          onChange={handleChange}
          placeholder="Airsoft Field 228"
          required={true}
          disabled={isLoading}
          readOnly={true}
          helpText="Location name (ID) cannot be changed after creation"
        />
        
        <FormField
          label="Coordinates"
          name="coordinates"
          value={location.coordinates}
          onChange={handleChange}
          placeholder="50.4501,30.5234"
          required={true}
          disabled={isLoading}
          helpText="Format: latitude,longitude (e.g. 50.4501,30.5234)"
        />
        
        <FormField
          label="Description"
          name="description"
          value={location.description}
          onChange={handleChange}
          placeholder="Describe the location..."
          type="textarea"
          disabled={isLoading}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Location Images
          </label>
          
          <ImageGallery
            imagePreviews={allImagePreviews}
            onRemoveImage={handleRemoveImage}
            isLoading={isLoading}
          />
          
          <ImageUploader
            onImagesSelected={handleFilesSelected}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
