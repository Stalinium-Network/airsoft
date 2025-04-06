"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { FaUpload, FaImage, FaSpinner, FaRedoAlt } from "react-icons/fa";
import { compressImageToWebP, iterativeImageProcessing, continueIterating } from "@/utils/imageUtils";
import { Game } from "@/services/gameService";
import { adminApi } from "@/utils/api";

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
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [description, setDescription] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    newSize: number;
    compressionRatio: number;
  } | null>(null);
  const [iterationCount, setIterationCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if file is an image
    if (!selectedFile.type.includes("image/")) {
      setError("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setError("");
    setIsProcessing(true);
    setIterationCount(0);

    try {
      // Process the image initially
      const result = await iterativeImageProcessing(selectedFile);
      setProcessedBlob(result.processedBlob);
      setCompressionStats(result.stats);
      setIterationCount(1);
      
      // Create preview from the processed image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(result.processedBlob);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
      
      // Fallback to original preview if processing fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle continue iteration
  const handleContinueIteration = async () => {
    if (!processedBlob) return;
    
    setIsProcessing(true);
    try {
      // Apply another compression cycle
      const result = await continueIterating(processedBlob, {
        maxWidth: 1200,
        quality: Math.max(0.6, 0.8 - (iterationCount * 0.05)), // Reduce quality with each iteration, but not below 0.6
      });
      
      setProcessedBlob(result.processedBlob);
      setCompressionStats(result.stats);
      setIterationCount(prev => prev + 1);
      
      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(result.processedBlob);
    } catch (err) {
      console.error("Error in continue iteration:", err);
      setError("Failed to process image further. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!processedBlob && !file) {
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

      // Use the processed blob if available, otherwise compress the original file
      if (processedBlob) {
        formData.append("file", processedBlob, file?.name || "image.webp");
      } else if (file) {
        const compressedImage = await compressImageToWebP(file);
        formData.append("file", compressedImage);
      }

      if (!description.trim()) return;
      formData.append("description", description.trim());

      // Only append game if one is selected
      if (selectedGameId) {
        formData.append("game", selectedGameId);
      }

      // Using adminApi.uploadGalleryImage instead of direct fetch
      await adminApi.uploadGalleryImage(formData);

      // Reset form
      setFile(null);
      setProcessedBlob(null);
      setPreviewUrl(null);
      setDescription("");
      setSelectedGameId("");
      setCompressionStats(null);
      setIterationCount(0);
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

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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
                disabled={isUploading || isProcessing}
              />

              {isProcessing ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <FaSpinner className="animate-spin text-4xl text-green-500 mb-2" />
                  <p className="text-gray-300">Processing image...</p>
                </div>
              ) : previewUrl ? (
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
            
            {/* Compression stats */}
            {compressionStats && (
              <div className="mt-2 bg-gray-800 p-3 rounded-md text-sm">
                <p className="text-gray-300">
                  Original: <span className="text-green-400">{formatFileSize(compressionStats.originalSize)}</span>
                </p>
                <p className="text-gray-300">
                  Compressed: <span className="text-green-400">{formatFileSize(compressionStats.newSize)}</span>
                </p>
                <p className="text-gray-300">
                  Reduction: <span className="text-green-400">{compressionStats.compressionRatio.toFixed(1)}%</span>
                </p>
                <p className="text-gray-300">
                  Iterations: <span className="text-green-400">{iterationCount}</span>
                </p>
                
                {/* Continue iteration button */}
                <button
                  type="button"
                  onClick={handleContinueIteration}
                  disabled={isProcessing || isUploading}
                  className={`mt-2 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition
                    ${
                      !isProcessing && !isUploading
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaRedoAlt className="mr-2" />
                      Continue to iterate?
                    </>
                  )}
                </button>
              </div>
            )}
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
            disabled={isUploading || (!file && !processedBlob) || !token}
            className={`w-full mt-4 flex items-center justify-center py-3 px-6 rounded-md text-lg font-medium transition
              ${
                (file || processedBlob) && !isUploading && token
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
