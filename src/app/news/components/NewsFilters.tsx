"use client";

import { useState, useEffect } from "react";
import { NewsCategory } from "@/services/newsService";
import { publicApi } from "@/utils/api";

interface NewsFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function NewsFilters({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery 
}: NewsFiltersProps) {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const response = await publicApi.getNewsCategories();
        // Добавляем категорию "All" в начало списка
        setCategories([
          { id: "all", name: "All News" },
          ...response
        ]);
      } catch (error) {
        console.error("Error fetching news categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="w-full md:w-1/3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 py-2">
          {isLoading ? (
            <div className="px-6 py-2 bg-gray-800 text-gray-400 rounded-full animate-pulse">
              Loading categories...
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
