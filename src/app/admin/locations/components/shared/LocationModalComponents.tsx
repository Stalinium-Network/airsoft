'use client'

import { JSX, useState } from 'react'
import ProgressBar from '../../../content/components/shared/ProgressBar'
import { createImagePreview } from '@/utils/imageUtils'

// Shared interface for location form data
export interface LocationFormData {
  name: string;
  coordinates: string;
  description: string;
}

// Shared props for modal components
export interface ModalWrapperProps {
  title: string;
  icon: JSX.Element;
  onClose: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  onSubmit: () => void;
  submitText: string;
  loadingText: string;
  error?: string;
  uploadProgress?: number;
}

// Reusable Modal Wrapper component
export function ModalWrapper({
  title,
  icon,
  onClose,
  isLoading,
  children,
  onSubmit,
  submitText,
  loadingText,
  error,
  uploadProgress = 0
}: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-xl shadow-xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-white flex items-center">
            {icon}
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
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
          
          {children}
          
          {isLoading && uploadProgress > 0 && (
            <ProgressBar progress={uploadProgress} show={true} />
          )}
          
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
              onClick={onSubmit}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingText}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={submitText === "Create Location" ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M5 13l4 4L19 7"} />
                  </svg>
                  {submitText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form field components
export function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false,
  helpText,
  type = "text",
  readOnly = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  type?: "text" | "textarea";
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            readOnly ? "opacity-70 cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            readOnly ? "opacity-70 cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      {helpText && (
        <p className="mt-1 text-xs text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}

// Image gallery component
export function ImageGallery({ 
  imagePreviews, 
  onRemoveImage, 
  isLoading 
}: {
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
  isLoading: boolean;
}) {
  if (imagePreviews.length === 0) return null;
  
  return (
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
            onClick={() => onRemoveImage(index)}
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
  );
}

// Image upload component
export function ImageUploader({ onImagesSelected, isLoading }: {
  onImagesSelected: (files: FileList) => void;
  isLoading: boolean;
}) {
  return (
    <div className="border-2 border-dashed border-gray-600 rounded-md px-6 py-8 text-center">
      <label className="cursor-pointer flex flex-col items-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="mt-2 block text-sm font-medium text-gray-300">
          Click to upload location images
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
              onImagesSelected(e.target.files);
            }
          }}
          disabled={isLoading}
        />
      </label>
    </div>
  );
}

// Shared image handling hook
export function useImageHandling() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
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
      
    } catch (error) {
      console.error("Error handling images:", error);
      return { error: "Failed to process images. Please try again with different files." };
    }
    
    return { error: null };
  };
  
  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  return {
    imageFiles,
    setImageFiles,
    imagePreviews,
    setImagePreviews,
    handleImagesSelected,
    handleRemoveImage
  };
}