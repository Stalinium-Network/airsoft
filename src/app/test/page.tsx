"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NEWS_ITEMS } from "./data/news";

// Components
import NewsHero from "./components/NewsHero";
import NewsFilters from "./components/NewsFilters";
import NewsGrid from "./components/NewsGrid";
import NewsNewsletter from "./components/NewsNewsletter";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredNews, setFilteredNews] = useState(NEWS_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Получаем главные новости для карусели
  const pinnedNews = NEWS_ITEMS.filter(item => item.pinned);

  // Фильтрация новостей по категории и поисковому запросу
  useEffect(() => {
    let result = [...NEWS_ITEMS];
    
    // Фильтр по категории
    if (activeCategory !== "all") {
      result = result.filter(item => item.category === activeCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredNews(result);
  }, [activeCategory, searchQuery]);

  // Сброс фильтров
  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      {/* Header Section */}
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-center mb-4"
          >
            LATEST <span className="text-green-500">NEWS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 text-center max-w-2xl mx-auto"
          >
            Stay updated with the latest events, community happenings, and announcements in the airsoft world.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Фильтры */}
        <NewsFilters 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Карусель основных новостей */}
        <NewsHero pinnedNews={pinnedNews} />

        {/* Сетка новостей */}
        <NewsGrid 
          newsItems={filteredNews} 
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onResetFilters={resetFilters}
        />

        {/* Подписка на новости */}
        {/* <NewsNewsletter /> */}
      </section>
    </div>
  );
}
