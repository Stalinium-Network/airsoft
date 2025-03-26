"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NewsItem, NewsCategory } from "@/services/newsService";
import { publicApi } from "@/utils/api";

interface NewsCardProps {
  article: NewsItem;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка категорий
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await publicApi.getNewsCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching news categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Функция получения имени категории
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "News";
  };
  
  // Форматирование даты для отображения
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/10"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
        
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-green-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
            {isLoading ? "..." : getCategoryName(article.category)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>{formatDate(article.date)}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 hover:text-green-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex justify-end">
          <button className="text-green-400 hover:text-green-300 font-medium flex items-center group">
            Read More
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
