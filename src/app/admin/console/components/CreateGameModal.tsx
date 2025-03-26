"use client";
import { useState, useEffect } from "react";
import { Game, Fraction } from "@/services/gameService";
import { isPastGame } from "@/services/adminService";
import { adminApi } from "@/utils/api";
import { createImagePreview, prepareImageForUpload } from '@/utils/imageUtils';
import FractionsManager from "./FractionsManager";
import Image from "next/image";
import MarkdownEditorComponent from '@/components/admin/MarkdownEditorComponent';

// Components
import ImageUploadSection from "./game-form/ImageUploadSection";
import GameFormFields from "./game-form/GameFormFields";
import ProgressBar from "./game-form/ProgressBar";
import ModalHeader from "./modal/ModalHeader";
import ModalFooter from "./modal/ModalFooter";

// Default game data template with Date object - обновлено для фракций
const defaultGameData: Omit<Game, "_id"> = {
  name: "",
  date: new Date(),
  duration: 3,
  location: "",
  description: "",
  detailedDescription: "",
  image: "",
  fractions: [], // Используем только фракции, без capacity
  price: 25,
  isPast: false,
};

// Define the mixed event type for consistent typing
type MixedChangeEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  | { target: { name: string; value: any } };

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: () => void;
  onError: (message: string) => void;
}

export default function CreateGameModal({
  onClose,
  onGameCreated,
  onError,
}: CreateGameModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newGame, setNewGame] = useState<Omit<Game, "_id">>(defaultGameData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle input changes for new game, including start date that affects end date
  const handleInputChange = (e: MixedChangeEvent) => {
    const { name, value } = e.target;

    if (name === "price") {
      setNewGame((prev) => ({
        ...prev,
        price: parseInt(value, 10) || 0,
      }));
    } else if (name === "date") {
      // When start date changes, update isPast automatically
      const isPastValue = isPastGame(value);
      setNewGame((prev) => ({
        ...prev,
        date: new Date(value),
        isPast: isPastValue,
      }));
    } else if (name === "endDate") {
      // Update end date when it's changed (either manually or via duration)
      setNewGame((prev) => ({
        ...prev,
        endDate: value,
      })); 
    } else {
      setNewGame((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle markdown changes
  const handleDetailedDescriptionChange = (markdown: string) => {
    setNewGame({
      ...newGame,
      detailedDescription: markdown
    });
  };

  // Handle image file selection
  const handleImageSelected = async (file: File) => {
    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);

      // Update the game state to indicate we have an image
      setNewGame((prev) => ({
        ...prev,
        image: "file_upload", // This will be replaced by the server with the actual URL
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
    setNewGame((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setNewGame((prev) => ({
      ...prev,
      location: locationId,
    }));
  };

  // Handle fractions update
  const handleFractionsChange = (updatedFractions: Fraction[]) => {
    setNewGame((prev: any) => ({
      ...prev,
      fractions: updatedFractions,
    }));
  };

  // Create a new game using FormData to support file upload
  const handleCreateGame = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    // Validate form
    if (
      !newGame.name ||
      !newGame.date ||
      !newGame.duration ||
      !newGame.location ||
      !newGame.description ||
      (!imageFile && !newGame.image)
    ) {
      onError("Please fill in all required fields and provide an image");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Convert Date object to ISO string for API
      const dateString =
        newGame.date instanceof Date
          ? newGame.date.toISOString()
          : newGame.date;

      // Append individual form fields directly
      formData.append("name", newGame.name);
      formData.append("date", dateString);
      formData.append("duration", newGame.duration.toString());
      formData.append("location", typeof newGame.location === 'string' ? newGame.location : (newGame.location as any)._id);
      formData.append("description", newGame.description);
      formData.append("detailedDescription", newGame.detailedDescription as string);
      formData.append("price", newGame.price.toString());
      formData.append("isPast", newGame.isPast.toString());
      
      // Всегда добавляем поле registrationLink, даже если оно пустое
      formData.append("registrationLink", newGame.registrationLink || '');

      // Add fractions as JSON string
      if (newGame.fractions && newGame.fractions.length > 0) {
        formData.append("fractions", JSON.stringify(newGame.fractions));
      }

      // Image handling
      if (imageFile) {
        formData.append("file", imageFile);
      } else if (newGame.image) {
        formData.append("image", newGame.image);
      }

      // Simulate upload progress (for demo)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      // Submit the form data
      const response = await adminApi.createGameWithImage(formData);

      // Clear interval and finish progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      onGameCreated();
    } catch (error: any) {
      console.error("Error creating game:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to create game: ${errorMessage}`);
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        {/* Header */}
        <ModalHeader 
          title="Create New Game"
          icon={createIcon}
          onClose={onClose}
          isLoading={isLoading}
        />

        <div className="p-4 sm:p-2">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Creating game...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <GameFormFields
              game={newGame}
              onChange={handleInputChange}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
            />
            
            {/* Fractions Manager with new approach */}
            <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Game Factions
              </h3>
              
              <div className="bg-gray-800/50 p-4 mb-4 rounded border border-gray-700/50">
                <p className="text-sm text-gray-300">
                  Add factions to this game and specify their capacities. Players will be able to choose which faction to join.
                </p>
              </div>
              
              <FractionsManager 
                fractions={newGame.fractions || []}
                onChange={handleFractionsChange}
                isLoading={isLoading}
              />
            </div>

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
                Event Image <span className="text-red-500">*</span>
              </h3>

              <ImageUploadSection
                imagePreview={imagePreview}
                onImageChange={handleImageSelected}
                onImageRemove={handleRemoveImage}
                fileInputDisabled={isLoading}
              />
            </div>

            {/* Detailed Description with Markdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <MarkdownEditorComponent
                markdown={newGame.detailedDescription || ""}
                onChange={handleDetailedDescriptionChange}
                placeholder="Enter detailed description of the game..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Detailed description supports Markdown formatting.
              </p>
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
            onConfirm={handleCreateGame}
            isLoading={isLoading}
            confirmLabel="Create Game"
            confirmIcon={<span className="w-5 h-5 mr-1">{createIcon}</span>}
            loadingLabel="Creating..."
            loadingIcon={loadingIcon}
          />
        </div>
      </div>
    </div>
  );
}
