"use client";
import { useState, useEffect } from "react";
import { Game, Fraction } from "@/services/gameService";
import { isPastGame } from "@/services/adminService";
import { adminApi } from "@/utils/api";
import { createImagePreview } from "@/utils/imageUtils";
import FractionsManager from "./FractionsManager";
import Image from "next/image";
import MarkdownEditorComponent from '@/components/admin/MarkdownEditorComponent';

// Components
import GameFormFields from "./game-form/GameFormFields";
import ImageUploadSection from "./game-form/ImageUploadSection";
import ProgressBar from "./game-form/ProgressBar";
import ModalHeader from "./modal/ModalHeader";
import ModalFooter from "./modal/ModalFooter";

// Define the mixed event type for consistent typing
type MixedChangeEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  | { target: { name: string; value: any } };

interface EditGameModalProps {
  game: Game;
  onClose: () => void;
  onGameUpdated: (game: Game) => void;
  onError: (message: string) => void;
}

export default function EditGameModal({
  game,
  onClose,
  onGameUpdated,
  onError,
}: EditGameModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<Game>({ 
    ...game,
    fractions: game.fractions || [] // Убедимся, что fractions существует
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageChanged, setImageChanged] = useState(false);

  // Initialize image preview from existing URL if available
  useEffect(() => {
    if (game.image && game.image.startsWith("http")) {
      setImagePreview(game.image);
    }
  }, [game.image]);

  // Handle form input changes
  const handleInputChange = (e: MixedChangeEvent) => {
    const { name, value } = e.target;

    if (name === "price") {
      setEditingGame({
        ...editingGame,
        price: parseInt(value, 10) || 0,
      });
    } else if (name === "date") {
      setEditingGame({
        ...editingGame,
        date: new Date(value),
        isPast: isPastGame(value),
      });
    } else if (name === "isPast") {
      setEditingGame({
        ...editingGame,
        isPast: value === "true",
      });
    } else {
      setEditingGame({
        ...editingGame,
        [name]: value,
      });
    }
  };

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      setImageChanged(true);

      // Update the game state to indicate we have an image
      setEditingGame((prev) => ({
        ...prev,
        image: "file_upload", // Marker that will be replaced by the server
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

    setEditingGame((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setEditingGame(prev => ({
      ...prev,
      location: locationId,
    }));
  };

  // Handle fractions update
  const handleFractionsChange = (updatedFractions: Fraction[]) => {
    setEditingGame((prev: any) => ({
      ...prev,
      fractions: updatedFractions
    }));
  };

  // Handle markdown changes
  const handleDetailedDescriptionChange = (markdown: string) => {
    setEditingGame({
      ...editingGame,
      detailedDescription: markdown
    });
  };

  // Update game with FormData
  const handleUpdateGame = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Convert Date object to ISO string for API
      const dateString =
        editingGame.date instanceof Date
          ? editingGame.date.toISOString()
          : editingGame.date;

      // Append individual form fields directly
      formData.append("name", editingGame.name);
      formData.append("date", dateString);
      formData.append("duration", editingGame.duration.toString());
      formData.append("location", typeof editingGame.location === 'string' 
        ? editingGame.location 
        : (editingGame.location as any)._id);
      formData.append("description", editingGame.description);
      formData.append("price", editingGame.price.toString());
      formData.append("isPast", isPastGame(editingGame.date).toString());

      if (editingGame.detailedDescription) {
        formData.append("detailedDescription", editingGame.detailedDescription);
      }
      
      // Всегда добавляем поле registrationLink, даже если оно пустое
      // Это позволит очистить ссылку если пользователь удалил значение
      formData.append("registrationLink", editingGame.registrationLink || '');

      // Add fractions as JSON string
      if (editingGame.fractions && editingGame.fractions.length > 0) {
        formData.append("fractions", JSON.stringify(editingGame.fractions));
      }

      // IMPORTANT FIX: Image handling
      // Only include the image file if it exists
      if (imageFile) {
        // Append as 'file', not as 'image'
        formData.append("file", imageFile);
      } else if (editingGame.image && !imageChanged) {
        // Only send image if we're using an external URL and not uploading a file
        formData.append("image", editingGame.image);
      } else if (imageChanged && !imageFile) {
        // If image was deleted (changed but no new file), explicitly set empty image
        formData.append("image", "");
      }

      // Flag if the image was changed (including removal)
      if (imageChanged) {
        formData.append("imageChanged", "true");
      }

      // Add the game ID for identification
      formData.append("gameId", editingGame._id.toString());

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

      // Submit the form
      const response = await adminApi.updateGameWithImage(
        editingGame._id,
        formData
      );

      // Finish progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create a complete game object for the state update
      const updatedGame = {
        ...editingGame,
        isPast: isPastGame(editingGame.date),
      };

      // Call the callback with the updated game
      onGameUpdated(updatedGame);
    } catch (error: any) {
      console.error("Error updating game:", error);

      // Extract error message from axios error
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to update game: ${errorMessage}`);
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        {/* Header */}
        <ModalHeader 
          title={`Edit Game: ${game.name}`}
          icon={editIcon}
          onClose={onClose}
          isLoading={isLoading}
          color="text-blue-500"
        />

        <div className="p-4 sm:p-2">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Saving changes...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Game form fields */}
            <GameFormFields
              game={editingGame}
              onChange={handleInputChange}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
            />

            {/* Status section (only in Edit mode) */}
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Event Status
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Status
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    className={`flex items-center p-3 rounded-md border ${
                      editingGame.isPast
                        ? "bg-gray-700 border-gray-600"
                        : "bg-green-900/20 border-green-500 ring-2 ring-green-500"
                    } cursor-pointer transition-all`}
                  >
                    <input
                      type="radio"
                      name="isPast"
                      value="false"
                      checked={!editingGame.isPast}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Upcoming</span>
                  </label>

                  <label
                    className={`flex items-center p-3 rounded-md border ${
                      !editingGame.isPast
                        ? "bg-gray-700 border-gray-600"
                        : "bg-red-900/20 border-red-500 ring-2 ring-red-500"
                    } cursor-pointer transition-all`}
                  >
                    <input
                      type="radio"
                      name="isPast"
                      value="true"
                      checked={editingGame.isPast}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <svg
                      className="w-5 h-5 mr-2 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Past</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Fractions Manager with updated approach */}
            <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Game Factions
              </h3>
              
              <div className="bg-gray-800/50 p-4 mb-4 rounded border border-gray-700/50">
                <p className="text-sm text-gray-300">
                  Manage the factions for this game. Add or remove factions and adjust their capacities.
                </p>
              </div>
              
              <FractionsManager 
                fractions={editingGame.fractions || []}
                onChange={handleFractionsChange}
                isLoading={isLoading}
              />
            </div>

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
                Event Image
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
                markdown={editingGame.detailedDescription || ""}
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
            onConfirm={handleUpdateGame}
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
