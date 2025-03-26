"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Мок-данные для примера
const NEWS_CATEGORIES = [
  { id: "all", name: "All News" },
  { id: "events", name: "Events" },
  { id: "updates", name: "Updates" },
  { id: "announcements", name: "Announcements" },
  { id: "community", name: "Community" },
];

const NEWS_ITEMS = [
  {
    id: 1,
    title: "New Equipment Rules for Winter Season",
    category: "updates",
    date: "November 15, 2023",
    image: "/images/news1.jpg",
    description: "Updated equipment guidelines for the upcoming winter season to ensure safety and fair play in cold conditions.",
    pinned: true,
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Annual Tournament Registration Now Open",
    category: "events",
    date: "November 10, 2023",
    image: "/images/news2.jpg",
    description: "Register now for our annual championship tournament with exciting new maps and special game modes.",
    pinned: false,
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "Community Spotlight: Team Phantom",
    category: "community",
    date: "November 7, 2023",
    image: "/images/news3.jpg",
    description: "Get to know Team Phantom, the winners of our last major tournament and their unique strategies.",
    pinned: false,
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "New Field Opening Next Month",
    category: "announcements",
    date: "November 5, 2023",
    image: "/images/news4.jpg",
    description: "We're excited to announce the opening of our new urban combat field with multiple buildings and tactical positions.",
    pinned: true,
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "Airsoft Safety Workshop",
    category: "events",
    date: "October 30, 2023",
    image: "/images/news5.jpg",
    description: "Join our safety workshop for new players to learn proper equipment usage and game etiquette.",
    pinned: false,
    readTime: "2 min read",
  },
  {
    id: 6,
    title: "Rule Updates for CQB Engagements",
    category: "updates",
    date: "October 25, 2023",
    image: "/images/news6.jpg",
    description: "Important updates to close-quarters battle rules that will be implemented in all upcoming games.",
    pinned: false,
    readTime: "4 min read",
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredNews, setFilteredNews] = useState(NEWS_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedNewsIndex, setpinnedNewsIndex] = useState(0);
  const pinnedNews = NEWS_ITEMS.filter(item => item.pinned);
  
  // Автоматическая смена главной новости
  useEffect(() => {
    const interval = setInterval(() => {
      setpinnedNewsIndex(prev => (prev + 1) % pinnedNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pinnedNews.length]);

  // Фильтрация новостей
  useEffect(() => {
    let filtered = NEWS_ITEMS;
    
    // Фильтр по категории
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredNews(filtered);
  }, [selectedCategory, searchQuery]);

  // Получаем текущую главную новость
  const currentpinnedNews = pinnedNews[pinnedNewsIndex];

  // Наблюдатель за элементами для анимации при прокрутке
  const observerRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Hero Section с плавающими частицами */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-green-500/30"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
                scale: Math.random() * 3 + 1,
              }}
              animate={{
                x: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
                y: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [null, Math.random() * 0.7 + 0.3, Math.random() * 0.5 + 0.5],
              }}
              transition={{
                duration: Math.random() * 20 + 30,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-center mb-4"
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

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-8">
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
              {NEWS_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlighted pinned News with Animation */}
        {currentpinnedNews && (
          <motion.div
            key={currentpinnedNews.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-96 rounded-xl overflow-hidden mb-12 group"
          >
            {/* Placeholder for missing images in development */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 z-0"></div>
            
            {/* Image backdrop */}
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={currentpinnedNews.image}
                alt={currentpinnedNews.title}
                fill
                className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                unoptimized // For placeholder purposes
              />
            </motion.div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
            
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
              <div className="flex items-center mb-4">
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
                  {NEWS_CATEGORIES.find(cat => cat.id === currentpinnedNews.category)?.name || "News"}
                </span>
                <span className="text-gray-300 text-sm">{currentpinnedNews.date}</span>
                <span className="text-gray-400 text-sm ml-auto">{currentpinnedNews.readTime}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300">
                {currentpinnedNews.title}
              </h2>
              
              <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                {currentpinnedNews.description}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg flex items-center group"
              >
                Read Full Article
                <motion.svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              </motion.button>
              
              {/* Feature news indicators */}
              <div className="absolute bottom-6 right-8 flex space-x-2">
                {pinnedNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setpinnedNewsIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === pinnedNewsIndex 
                        ? "bg-green-500 w-10" 
                        : "bg-gray-500 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* News Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={observerRef}>
          <AnimatePresence>
            {filteredNews.map((newsItem, index) => (
              <motion.div
                key={newsItem.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/10"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Placeholder for missing images */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 z-0"></div>
                  
                  <Image
                    src={newsItem.image}
                    alt={newsItem.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    unoptimized // For placeholder purposes
                  />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-green-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                      {NEWS_CATEGORIES.find(cat => cat.id === newsItem.category)?.name || "News"}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>{newsItem.date}</span>
                    <span>{newsItem.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 hover:text-green-400 transition-colors">
                    {newsItem.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {newsItem.description}
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
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state when no news matches filters */}
        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <svg
              className="w-16 h-16 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-400 mb-2">No news found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Pagination controls */}
        {filteredNews.length > 0 && (
          <div className="flex justify-center mt-12">
            <motion.div
              className="inline-flex items-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              
              <button className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                1
              </button>
              
              <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
                2
              </button>
              
              <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
                3
              </button>
              
              <span className="text-gray-400">...</span>
              
              <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
                12
              </button>
              
              <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        )}

        {/* Newsletter subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter to receive the latest news, event announcements, and exclusive offers.
              </p>
            </div>
            <div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow bg-gray-900 border border-gray-700 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-r-lg font-medium"
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
