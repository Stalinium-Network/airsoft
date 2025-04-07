'use client'
import { useState } from 'react'
import { Location, createLocation } from '@/services/locationService'
import { 
  FormField,
  ImageGallery,
  ImageUploader,
  ModalWrapper,
  useImageHandling
} from './shared/LocationModalComponents'

interface CreateLocationModalProps {
  onClose: () => void;
  onLocationCreated: (location: Location) => void;
}

export default function CreateLocationModal({
  onClose,
  onLocationCreated
}: CreateLocationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({
    name: '',
    coordinates: '',
    description: ''
  });
  
  // Use our shared image handling hook
  const {
    imageFiles,
    imagePreviews,
    handleImagesSelected,
    handleRemoveImage
  } = useImageHandling();
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleCreateLocation = async () => {    
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
      
      // Append each image file
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });
      
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
      
      // Submit the form data
      const response = await createLocation(formData);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Call the callback with the new location
      onLocationCreated(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to create location');
    } finally {
      setIsLoading(false);
    }
  };
  
  const locationIcon = (
    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  // Process image selection
  const handleFilesSelected = async (files: FileList) => {
    const result = await handleImagesSelected(files);
    if (result?.error) {
      setError(result.error);
    }
  };
  
  return (
    <ModalWrapper
      title="Create New Location"
      icon={locationIcon}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleCreateLocation}
      submitText="Create Location"
      loadingText="Creating..."
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
          helpText="This name will be used as the location identifier"
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
            imagePreviews={imagePreviews}
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
