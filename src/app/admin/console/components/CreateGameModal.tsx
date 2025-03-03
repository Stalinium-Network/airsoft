"use client";
import { useState } from "react";
import { Game } from "@/services/gameService";
import { isPastGame, formatDateForDisplay } from "@/services/adminService";
import { adminApi } from "@/utils/api";
import { createImagePreview } from "@/utils/imageUtils";

// Components
import ImageUploadSection from "./game-form/ImageUploadSection";
import GameFormFields from "./game-form/GameFormFields";
import ProgressBar from "./game-form/ProgressBar";

// Default game data template with Date object
const defaultGameData = {
  name: "",
  date: new Date(), // Use actual Date object instead of string
  duration: 3, // Default to 3 hours
  location: "",
  coordinates: "",
  description: "",
  image: "",
  capacity: {
    total: 30,
    filled: 0,
  },
  price: 25,
  isPast: false,
};

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested properties (e.g., capacity.total)
      const [parent, child] = name.split(".");
      setNewGame((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: parent === "capacity" ? parseInt(value, 10) || 0 : value,
        },
      }));
    } else if (name === "price") {
      setNewGame((prev) => ({
        ...prev,
        price: parseInt(value, 10) || 0,
      }));
    } else if (name === "date") {
      // When start date changes, update isPast automatically
      const isPastValue = isPastGame(value);
      setNewGame((prev) => ({
        ...prev,
        date: value,
        isPast: isPastValue,
        // Note: we no longer update endDate here because it will be calculated from duration
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

  // Handle image file selection
  const handleImageSelected = async (file: File) => {
    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      
      // Update the game state to indicate we have an image
      setNewGame(prev => ({
        ...prev,
        image: 'file_upload' // This will be replaced by the server with the actual URL
      }));
    } catch (error) {
      console.error("Error handling image:", error);
      onError("Failed to process image. Please try another file.");
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    setNewGame(prev => ({
      ...prev,
      image: url
    }));
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setNewGame(prev => ({
      ...prev,
      image: ""
    }));
  };

  // Create a new game using FormData to support file upload
  const createGame = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setUploadProgress(0);

    // Validate form
    if (
      !newGame.name ||
      !newGame.date ||
      !newGame.duration ||
      !newGame.location ||
      !newGame.coordinates ||
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
      const dateString = newGame.date instanceof Date 
        ? newGame.date.toISOString() 
        : newGame.date;
      
      // Append individual form fields directly
      formData.append('name', newGame.name);
      formData.append('date', dateString);
      formData.append('duration', newGame.duration.toString());
      formData.append('location', newGame.location);
      formData.append('coordinates', newGame.coordinates);
      formData.append('description', newGame.description);
      formData.append('price', newGame.price.toString());
      formData.append('isPast', newGame.isPast.toString());
      
      // Append capacity as individual fields
      formData.append('totalCapacity', newGame.capacity.total.toString());
      formData.append('filledCapacity', newGame.capacity.filled.toString());
      
      // Image handling
      if (imageFile) {
        formData.append('file', imageFile);
      } else if (newGame.image) {
        formData.append('imageUrl', newGame.image);
      }
      
      // Simulate upload progress (for demo)
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
      await adminApi.createGameWithImage(formData);
      
      // Clear interval and finish progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onGameCreated();
    } catch (error: any) {
      console.error("Error creating game:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to create game: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create New Game</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={createGame}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Game info fields */}
              <GameFormFields 
                game={newGame} 
                onChange={handleInputChange} 
                isLoading={isLoading}
              />

              {/* Image upload section */}
              <ImageUploadSection 
                imagePreview={imagePreview}
                onImageChange={handleImageSelected}
                onImageRemove={handleRemoveImage}
                fileInputDisabled={isLoading}
              />
            </div>

            {/* Upload progress indicator */}
            <ProgressBar progress={uploadProgress} show={isLoading && uploadProgress > 0} />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Creating..." : "Create Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
