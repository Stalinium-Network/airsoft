"use client";

import { useState } from "react";
import ImageUploadSection from "./ImageUploadSection";

interface PreviewSectionProps {
  imagePreview: string | null;
  youtubeUrl: string;
  isYoutubeUrl: boolean;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  onYoutubeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePreviewType: () => void;
  getYoutubeVideoId: (url: string) => string | null;
  isLoading?: boolean;
}

export default function PreviewSection({
  imagePreview,
  youtubeUrl,
  isYoutubeUrl,
  onImageChange,
  onImageRemove,
  onYoutubeChange,
  onTogglePreviewType,
  getYoutubeVideoId,
  isLoading = false,
}: PreviewSectionProps) {
  return (
    <>
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
        Event Preview <span className="text-red-500">*</span>
      </h3>

      {/* Toggle switch between image and YouTube URL */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onTogglePreviewType}
          className={`px-4 py-2 rounded-l-md ${
            !isYoutubeUrl
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          disabled={isLoading}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={onTogglePreviewType}
          className={`px-4 py-2 rounded-r-md ${
            isYoutubeUrl
              ? "bg-blue-600 text-white"
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
            onChange={onYoutubeChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full input-class"
            disabled={isLoading}
          />
          {youtubeUrl && (
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${
                  getYoutubeVideoId(youtubeUrl) || ""
                }`}
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
          onImageChange={onImageChange}
          onImageRemove={onImageRemove}
          fileInputDisabled={isLoading}
        />
      )}
    </>
  );
}