'use client'
import { useRef } from 'react';
import Image from 'next/image';
import { createImagePreview, compressImageToWebP } from '@/utils/imageUtils';

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  fileInputDisabled?: boolean;
}

export default function ImageUploadSection({
  imagePreview,
  onImageChange,
  onImageRemove,
  fileInputDisabled = false
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current && !fileInputDisabled) {
      fileInputRef.current.click();
    }
  };

  // Handle image file selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      
      // Compress and convert to WebP
      const compressedImage = await compressImageToWebP(file);
      
      // Convert Blob to File
      const compressedFile = new File([compressedImage], file.name, { type: 'image/webp' });
      
      // Pass the processed image up
      onImageChange(compressedFile);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Event Image
      </label>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        disabled={fileInputDisabled}
      />
      
      {/* Image preview or placeholder */}
      <div className="mt-2 mb-4">
        {imagePreview ? (
          <div className="relative">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className={`border-2 border-dashed border-gray-600 rounded-lg p-6 text-center 
              ${!fileInputDisabled ? 'cursor-pointer hover:border-gray-500' : 'opacity-70 cursor-not-allowed'} 
              transition-colors h-48 flex flex-col items-center justify-center`}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-400 mt-2">
              <span className={`relative rounded-md font-medium ${!fileInputDisabled ? 'text-green-400 hover:text-green-300' : 'text-gray-500'} focus-within:outline-none`}>
                Click to upload an image
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
