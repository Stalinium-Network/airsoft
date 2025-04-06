"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NewsItem, NewsCategory } from "@/services/newsService";
import { adminApi, publicApi } from "@/utils/api";
import Image from "next/image";
import { createImagePreview, prepareImageForUpload } from "@/utils/imageUtils";

interface EditNewsModalProps {
  news: NewsItem;
  onClose: () => void;
  onNewsUpdated: (news: NewsItem) => void;
  onError: (message: string) => void;
}

export default function EditNewsModal({
  news,
  onClose,
  onNewsUpdated,
  onError,
}: EditNewsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: news.title,
    category: news.category,
    description: news.description,
    content: news.content,
    pinned: news.pinned,
  });

  // Загрузка категорий при открытии модального окна
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsCategoriesLoading(true);
        const response = await publicApi.getNewsCategories();
        console.log("Fetched categories:", response);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching news categories:", error);
        onError("Failed to load news categories. Please try again.");
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Установка начального превью изображения
  useEffect(() => {
    if (news.image) {
      setImagePreview(
        `${process.env.NEXT_PUBLIC_API_URL}/news/image/${news.image}`
      );
    }
  }, [news.image]);

  // Обработка выбора изображения
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      onError("Please select an image file");
      return;
    }

    setImageFile(file);
    setImageChanged(true);

    // Создание превью изображения
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      console.error("Error creating image preview:", error);
      onError("Failed to create image preview");
    }
  };

  // Удаление выбранного изображения
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);
  };

  // Обработка изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Обработка изменения содержимого текстового поля
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      content: e.target.value,
    });
  };

  // Отправка формы
  const handleSubmit = async () => {
    // Проверка обязательных полей
    if (!formData.title || !formData.description || !formData.content) {
      onError("Please fill in all required fields");
      return;
    }

    // Проверка изображения при первом создании
    if (!news.image && !imageFile) {
      onError("Please upload an image");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Создаем объект FormData для отправки файлов
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);
      submitData.append("content", formData.content);
      submitData.append("pinned", formData.pinned.toString());

      // Обработка изображения
      if (imageFile && imageChanged) {
        // Используем правильный ключ 'file' вместо 'image'
        await prepareImageForUpload(submitData, imageFile);
      }

      if (imageChanged) {
        submitData.append("imageChanged", "true");
      }

      // Имитация прогресса загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 100);

      // Отправка запроса
      const response = await adminApi.updateNews(news._id, submitData);

      // Завершение прогресса
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Обновляем новость с актуальными данными
      onNewsUpdated(response.data);
    } catch (error: any) {
      console.error("Error updating news:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to update news: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-semibold flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit News Article
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Basic info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="News title"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                {isCategoriesLoading ? (
                  <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md animate-pulse">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading || isCategoriesLoading}
                  >
                    {categories.length === 0 ? (
                      <option value="">No categories available</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the news"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Pinned */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinned"
                  name="pinned"
                  checked={formData.pinned}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label htmlFor="pinned" className="ml-2 text-sm text-gray-300">
                  Pin this news (featured)
                </label>
              </div>

              {/* Image upload */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-1 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  News Image <span className="text-red-500">*</span>
                </h3>

                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden aspect-video">
                    <Image
                      src={imagePreview}
                      alt="News preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        className="w-12 h-12 text-gray-500 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-300">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content <span className="text-red-500">*</span>
              </label>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your news content here..."
                rows={15}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />

              <p className="text-xs text-gray-500 mt-1">
                Describe your news in detail.
              </p>
            </div>
          </div>

          {/* Прогресс загрузки */}
          {isLoading && uploadProgress > 0 && (
            <div className="mt-6 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
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
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
