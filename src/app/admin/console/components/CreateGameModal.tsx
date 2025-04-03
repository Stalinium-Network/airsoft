"use client";
import { useState, useEffect } from "react";
import { Game, Faction, RegistrationInfo } from "@/services/gameService";
import { isPastGame } from "@/services/adminService";
import { adminApi } from "@/utils/api";
import { createImagePreview, prepareImageForUpload } from '@/utils/imageUtils';
import FactionsManager from "./FactionsManager";

// Components
import ImageUploadSection from "./game-form/ImageUploadSection";
import GameFormFields from "./game-form/GameFormFields";
import ProgressBar from "./game-form/ProgressBar";
import ModalHeader from "./modal/ModalHeader";
import ModalFooter from "./modal/ModalFooter";

const defaultGameData: Omit<Game, "_id"> = {
  name: "",
  date: new Date().toISOString(),
  duration: 3,
  location: "",
  description: "",
  detailedDescription: "",
  preview: "", // Changed from 'image' to 'preview'
  factions: [],
  price: 25,
  isPast: false,
  regInfo: {
    link: "",
    opens: "", 
    closes: "", 
    status: "not-open",
    details: "",
  }
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
  const [isYoutubeUrl, setIsYoutubeUrl] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

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
        date: value, // Keep as string instead of converting to Date
        isPast: isPastValue,
      }));
    } else if (name === "endDate") {
      // Update end date when it's changed (either manually or via duration)
      setNewGame((prev) => ({
        ...prev,
        endDate: value,
      })); 
    } else if (name === "regInfo") {
      // Handle regInfo object changes
      setNewGame((prev) => ({
        ...prev,
        regInfo: {
          ...prev.regInfo,
          ...value
        }
      }));
    } else if (name === "youtubeUrl") {
      // Handle YouTube URL input
      setYoutubeUrl(value);
      if (value.trim() !== "") {
        setNewGame((prev) => ({
          ...prev,
          preview: value.trim(),
        }));
      }
    } else {
      setNewGame((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle between image upload and YouTube URL input
  const togglePreviewType = () => {
    setIsYoutubeUrl(!isYoutubeUrl);
    
    // Reset preview values when switching
    if (!isYoutubeUrl) {
      setImageFile(null);
      setImagePreview(null);
      if (youtubeUrl) {
        setNewGame((prev) => ({
          ...prev,
          preview: youtubeUrl,
        }));
      }
    } else {
      setYoutubeUrl("");
      setNewGame((prev) => ({
        ...prev,
        preview: "",
      }));
    }
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
        preview: "file_upload", // This will be replaced by the server with the actual URL
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
      preview: "",
    }));
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setNewGame((prev) => ({
      ...prev,
      location: locationId,
    }));
  };

  // Handle factions update
  const handleFactionsChange = (updatedFactions: Faction[]) => {
    setNewGame((prev: any) => ({
      ...prev,
      factions: updatedFactions,
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
      ((!imageFile && !isYoutubeUrl) || (isYoutubeUrl && !youtubeUrl))
    ) {
      onError("Please fill in all required fields and provide an image or YouTube URL");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Append individual form fields directly
      formData.append("name", newGame.name);
      formData.append("date", newGame.date);
      formData.append("duration", newGame.duration.toString());
      formData.append("location", typeof newGame.location === 'string' ? newGame.location : (newGame.location as any)._id);
      formData.append("description", newGame.description);
      formData.append("detailedDescription", newGame.detailedDescription as string);
      formData.append("price", newGame.price.toString());
      formData.append("isPast", newGame.isPast.toString());
      
      // Add registration info as JSON string
      if (newGame.regInfo) {
        const cleanRegInfo = {
          link: newGame.regInfo.link || "",
          opens: newGame.regInfo.opens || "",  // Now using string
          closes: newGame.regInfo.closes || "", // Now using string
          details: newGame.regInfo.details || ""
        };
        formData.append("regInfoJson", JSON.stringify(cleanRegInfo));
      }

      // Add factions as JSON string
      if (newGame.factions && newGame.factions.length > 0) {
        formData.append("factions", JSON.stringify(newGame.factions));
      }

      // Handle preview content (either file or YouTube URL)
      if (isYoutubeUrl && youtubeUrl) {
        formData.append("preview", youtubeUrl);
        formData.append("isYoutubeUrl", "true");
      } else if (imageFile) {
        formData.append("file", imageFile);
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
            
            {/* Factions Manager with new approach */}
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
              
              <FactionsManager 
                factions={newGame.factions || []}
                onChange={handleFactionsChange}
                isLoading={isLoading}
              />
            </div>

            {/* Preview section (Image or YouTube) */}
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
                Event Preview <span className="text-red-500">*</span>
              </h3>
              
              {/* Toggle switch between image and YouTube URL */}
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={togglePreviewType}
                  className={`px-4 py-2 rounded-l-md ${
                    !isYoutubeUrl 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-700 text-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={togglePreviewType}
                  className={`px-4 py-2 rounded-r-md ${
                    isYoutubeUrl 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-700 text-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  YouTube URL
                </button>
              </div>
              
              {isYoutubeUrl ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                  {youtubeUrl && (
                    <div className="mt-4 aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeUrl.split('v=')[1]?.split('&')[0] || ''}`}
                        title="YouTube video"
                        className="w-full h-full rounded"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              ) : (
                <ImageUploadSection
                  imagePreview={imagePreview}
                  onImageChange={handleImageSelected}
                  onImageRemove={handleRemoveImage}
                  fileInputDisabled={isLoading}
                />
              )}
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
