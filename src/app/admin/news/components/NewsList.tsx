"use client";

import { useState, useEffect } from "react";
import { NewsItem, NewsCategory } from "@/services/newsService";
import { publicApi } from "@/utils/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NewsListProps {
  news: NewsItem[];
  isLoading: boolean;
  onEditNews: (news: NewsItem) => void;
  onDeleteNews: (newsId: string) => void;
}

export default function NewsList({ 
  news, 
  isLoading, 
  onEditNews, 
  onDeleteNews 
}: NewsListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Загрузка категорий
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsCategoriesLoading(true);
        const response = await publicApi.getNewsCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching news categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Функция для фильтрации новостей
  const getFilteredNews = () => {
    let filtered = [...news];

    // Фильтр по категории
    if (activeCategory !== "all") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Фильтр по поисковому запросу
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "category") {
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

    return filtered;
  };

  const filteredNews = getFilteredNews();

  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Функция для получения имени категории
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Функция для переключения порядка сортировки
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Функция для установки поля сортировки
  const handleSortBy = (field: "date" | "title" | "category") => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Функция для получения класса цвета категории
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case "events":
        return "bg-blue-500";
      case "updates":
        return "bg-yellow-500";
      case "announcements":
        return "bg-red-500";
      case "community":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      {/* Фильтры и поиск */}
      <div className="p-5 border-b border-gray-700 bg-gray-750">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-1 hide-scrollbar">
            <button
              className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors ${
                activeCategory === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All Categories
            </button>
            
            {isCategoriesLoading ? (
              <div className="px-4 py-2 bg-gray-700 rounded-lg animate-pulse">
                Loading...
              </div>
            ) : (
              categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors ${
                    activeCategory === category.id 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Таблица новостей */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-750 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortBy("title")}
              >
                <div className="flex items-center">
                  Title
                  {sortBy === "title" && (
                    <svg 
                      className={`ml-2 w-4 h-4 transition-transform ${sortOrder === "desc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortBy("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortBy === "category" && (
                    <svg 
                      className={`ml-2 w-4 h-4 transition-transform ${sortOrder === "desc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortBy("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortBy === "date" && (
                    <svg 
                      className={`ml-2 w-4 h-4 transition-transform ${sortOrder === "desc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pinned
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : filteredNews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-gray-400">
                  No news items found matching your criteria.
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filteredNews.map((item, index) => (
                  <motion.tr 
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-700">
                        {item.image ? (
                          <Image 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/news/image/${item.image}`} 
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</div>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColorClass(item.category)}`}>
                        {getCategoryName(item.category)}
                      </span>
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(item.date)}
                    </td>
                    
                    {/* Pinned */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.pinned ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Pinned
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditNews(item)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteNews(item._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
