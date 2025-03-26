"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { NewsItem, NewsCategory } from "@/services/newsService";
import NewsCard from "./NewsCard";

interface NewsGridClientProps {
  initialNews: NewsItem[];
  categories: NewsCategory[];
}

export default function NewsGridClient({ 
  initialNews, 
  categories
}: NewsGridClientProps) {
  const searchParams = useSearchParams();
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(initialNews);
  
  // Получаем параметры из URL
  const categoryFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  // Эффект для фильтрации новостей при изменении URL или данных
  useEffect(() => {
    let result = [...initialNews];
    
    // Фильтр по категории
    if (categoryFilter !== "all") {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Фильтр по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredNews(result);
  }, [initialNews, categoryFilter, searchQuery]);

  // Функция сброса фильтров
  const handleResetFilters = () => {
    // Редирект на базовый URL без параметров
    window.location.href = window.location.pathname;
  };

  // Если нет новостей после фильтрации
  if (filteredNews.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-400 mb-2">No news found</h3>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        <button
          onClick={handleResetFilters}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredNews.map((article, index) => (
        <NewsCard 
          key={article._id} 
          article={article} 
          index={index} 
          categories={categories}
        />
      ))}
    </div>
  );
}
