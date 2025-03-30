"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { FaUpload, FaImage, FaSpinner } from "react-icons/fa";
import { compressImageToWebP } from "@/utils/imageUtils";
import { Game } from "@/services/gameService";

// interface Game {
//   _id: string;
//   name: string;
//   date: string;
//   isPast: boolean;
// }

interface ImageUploadFormProps {
  onImageUploaded: () => void;
  token: string | null;
  games: Game[];
  isLoadingGames: boolean;
}

export default function ImageUploadForm({
  onImageUploaded,
  token,
  games,
  isLoadingGames,
}: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if file is an image
    if (!selectedFile.type.includes("image/")) {
      setError("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    if (!token) {
      setError("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();

      // Compress the image before uploading
      const compressedImage = await compressImageToWebP(file);
      formData.append("file", compressedImage);

      if (!description.trim()) return;
      formData.append("description", description.trim());

      // Only append game if one is selected
      if (selectedGameId) {
        formData.append("game", selectedGameId);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setDescription("");
      setSelectedGameId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent component of successful upload
      onImageUploaded();
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: Date | string) => {
    if (typeof dateString === "string")
      return new Date(dateString).toLocaleDateString();
    return dateString.toLocaleDateString();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* File input */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-300 mb-2">
              Select Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
                ${
                  previewUrl
                    ? "border-green-500"
                    : "border-gray-600 hover:border-gray-500"
                }`}
            >
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {previewUrl ? (
                <div className="relative h-48 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-contain mx-auto"
                  />
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  <FaImage className="text-4xl text-gray-500 mb-2" />
                  <p className="text-gray-400">Click to select an image</p>
                  <p className="text-gray-500 text-sm mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Description input */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-gray-100 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
              placeholder="Enter a description for this image..."
              disabled={isUploading}
            />
          </div>

          {/* Game selection */}
          <div className="mb-4">
            <label htmlFor="game" className="block text-gray-300 mb-2">
              Associated Game (optional)
            </label>
            <select
              id="game"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoadingGames}
            >
              <option value="">None</option>
              {isLoadingGames ? (
                <option disabled>Loading games...</option>
              ) : (
                games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.name} ({formatDate(game.date)}){" "}
                    {game.isPast ? "(Past)" : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isUploading || !file || !token}
            className={`w-full mt-4 flex items-center justify-center py-3 px-6 rounded-md text-lg font-medium transition
              ${
                file && !isUploading && token
                  ? "bg-green-500 hover:bg-green-600 text-gray-900"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
