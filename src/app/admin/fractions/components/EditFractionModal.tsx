"use client";
import { useState, useEffect } from "react";
import { Fraction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { createImagePreview } from "@/utils/imageUtils";
import ModalHeader from "../../console/components/modal/ModalHeader";
import ModalFooter from "../../console/components/modal/ModalFooter";
import FractionFormFields from "./FractionFormFields";
import ImageUploadSection from "../../console/components/game-form/ImageUploadSection";
import ProgressBar from "../../console/components/game-form/ProgressBar";

interface EditFractionModalProps {
  fraction: Fraction;
  onClose: () => void;
  onFractionUpdated: (fraction: Fraction) => void;
  onError: (message: string) => void;
}

export default function EditFractionModal({
  fraction,
  onClose,
  onFractionUpdated,
  onError,
}: EditFractionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [editingFraction, setEditingFraction] = useState<Fraction>({ 
    ...fraction
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageChanged, setImageChanged] = useState(false);

  // Initialize image preview from existing URL if available
  useEffect(() => {
    if (fraction.image) {
      setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`);
    }
  }, [fraction.image]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingFraction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      setImageChanged(true);
      setEditingFraction(prev => ({
        ...prev,
        image: "file_upload" // Placeholder
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
    setEditingFraction(prev => ({
      ...prev,
      image: ""
    }));
  };

  // Update fraction
  const handleUpdateFraction = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    // Validate form
    if (!editingFraction._id) {
      onError("Please provide a name for the fraction");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Append form fields
      formData.append("name", editingFraction._id);
      
      if (editingFraction.shortDescription) {
        formData.append("shortDescription", editingFraction.shortDescription);
      }
      
      if (editingFraction.description) {
        formData.append("description", editingFraction.description);
      }
      
      // Удаляем передачу registrationLink - его больше нет в модели фракции

      // Image handling
      if (imageFile) {
        formData.append("file", imageFile);
      } else if (editingFraction.image && !imageChanged) {
        formData.append("image", editingFraction.image);
      } else if (imageChanged && !imageFile) {
        formData.append("image", "");
      }

      // Flag if the image was changed
      if (imageChanged) {
        formData.append("imageChanged", "true");
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

      // Submit the form data
      await adminApi.updateFraction(editingFraction._id, formData);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onFractionUpdated(editingFraction);
    } catch (error: any) {
      console.error("Error updating fraction:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to update fraction: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const editIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );

  const saveIcon = (
    <svg
      className="w-5 h-5 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const loadingIcon = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        {/* Header */}
        <ModalHeader 
          title={`Edit Fraction: ${fraction._id}`}
          icon={editIcon}
          onClose={onClose}
          isLoading={isLoading}
          color="text-blue-500"
        />

        <div className="p-6">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Saving changes...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Fraction form fields */}
            <FractionFormFields
              fraction={editingFraction}
              onChange={handleInputChange}
              isLoading={isLoading}
            />
            
            {/* Image upload section */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-blue-500 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Fraction Image
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
          <ProgressBar
            progress={uploadProgress}
            show={isLoading && uploadProgress > 0}
          />

          {/* Footer with action buttons */}
          <ModalFooter
            onCancel={onClose}
            onConfirm={handleUpdateFraction}
            isLoading={isLoading}
            confirmLabel="Save Changes"
            confirmIcon={saveIcon}
            loadingLabel="Saving..."
            loadingIcon={loadingIcon}
            confirmColor="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
