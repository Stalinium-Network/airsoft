"use client";
import { useState } from "react";
import { Faction } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { createImagePreview } from "@/utils/imageUtils";
import FactionFormFields from "./FractionFormFields";
import ProgressBar from "../../content/components/shared/ProgressBar";
import ModalHeader from "@/components/admin/ModalHeader";
import ImageUploadSection from "@/components/admin/ImageUploadSection";
import ModalFooter from "@/components/admin/ModalFooter";

// Default faction data
const defaultFactionData: Omit<Faction, "_id" | "image" | "camoSample"> = {
  shortDescription: "",
  description: "",
};

interface CreateFactionModalProps {
  onClose: () => void;
  onFactionCreated: () => void;
  onError: (message: string) => void;
}

export default function CreateFactionModal({
  onClose,
  onFactionCreated,
  onError,
}: CreateFactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newFaction, setNewFaction] = useState<Omit<Faction, "image" | "camoSample">>({
    _id: "",
    ...defaultFactionData
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [camoFile, setCamoFile] = useState<File | null>(null);
  const [camoPreview, setCamoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFaction(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
    } catch (error) {
      console.error("Error handling image:", error);
      onError("Failed to process image. Please try another file.");
    }
  };

  // Handle camo image selection
  const handleCamoSelected = async (file: File) => {
    try {
      const preview = await createImagePreview(file);
      setCamoPreview(preview);
      setCamoFile(file);
    } catch (error) {
      console.error("Error handling camo image:", error);
      onError("Failed to process camo image. Please try another file.");
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Remove selected camo image
  const handleRemoveCamo = () => {
    setCamoFile(null);
    setCamoPreview(null);
  };

  // Create new faction
  const handleCreateFaction = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    // Validate form
    if (!newFaction._id) {
      onError("Please provide a name for the faction");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Append form fields - we use _id for the name field as per API docs
      formData.append("_id", newFaction._id);
      if (newFaction.shortDescription) {
        formData.append("shortDescription", newFaction.shortDescription);
      }
      if (newFaction.description) {
        formData.append("description", newFaction.description);
      }

      // Image handling - обеспечиваем правильный порядок файлов в запросе
      // Сервер ожидает: первый файл - основное изображение, второй - камуфляж
      
      // Для обеспечения правильного порядка, создаем массив файлов
      const filesToUpload: Array<File | null> = [null, null];
      
      // Заполняем массив файлов в нужном порядке
      if (imageFile) {
        filesToUpload[0] = imageFile; // Основное изображение - первый файл
      }
      
      if (camoFile) {
        filesToUpload[1] = camoFile; // Камуфляж - второй файл
      }
      
      // Добавляем непустые файлы в formData в правильном порядке
      filesToUpload.forEach((file) => {
        if (file) {
          formData.append("files", file);
        }
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
      await adminApi.createFaction(formData);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      onFactionCreated();
    } catch (error: any) {
      console.error("Error creating faction:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to create faction: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const createIcon = (
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
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );

  const loadingIcon = (
    <svg
      className="animate-spin h-4 w-4 mr-2"
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
          title="Create New Faction"
          icon={createIcon}
          onClose={onClose}
          isLoading={isLoading}
        />

        <div className="p-6">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Creating faction...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Faction form fields */}
            <FactionFormFields
              faction={newFaction}
              onChange={handleInputChange}
              isLoading={isLoading}
            />
            
            {/* Image upload section */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
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
                Faction Image
              </h3>

              <ImageUploadSection
                imagePreview={imagePreview}
                onImageChange={handleImageSelected}
                onImageRemove={handleRemoveImage}
                fileInputDisabled={isLoading}
              />
            </div>

            {/* Camo sample upload section */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
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
                Camo Sample Image
              </h3>

              <ImageUploadSection
                imagePreview={camoPreview}
                onImageChange={handleCamoSelected}
                onImageRemove={handleRemoveCamo}
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
            onConfirm={handleCreateFaction}
            isLoading={isLoading}
            confirmLabel="Create Faction"
            confirmIcon={<span className="w-5 h-5 mr-1">{createIcon}</span>}
            loadingLabel="Creating..."
            loadingIcon={loadingIcon}
            confirmColor="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>
    </div>
  );
}
