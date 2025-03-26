"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsItem, NewsCategory } from "@/services/newsService";
import Link from "next/link";
import Image from "next/image";

interface NewsHeroClientProps {
  pinnedNews: NewsItem[];
  categories: NewsCategory[];
}

export default function NewsHeroClient({ pinnedNews, categories }: NewsHeroClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 для prev, 1 для next

  // Пропускаем рендер если нет закрепленных новостей
  if (pinnedNews.length === 0) {
    return null;
  }

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

  // Автоматическое переключение новостей
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % pinnedNews.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [pinnedNews.length]);

  // Переключение на предыдущую новость
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? pinnedNews.length - 1 : prev - 1));
  };

  // Переключение на следующую новость
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % pinnedNews.length);
  };

  // Переключение по индексу
  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Варианты анимации
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden mb-12 group">
      {/* Carousel Navigation */}
      {pinnedNews.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Carousel Items */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0"
        >
          {/* Изображение */}
          <div className="absolute inset-0 bg-gray-800 z-0">
            {pinnedNews[currentIndex].image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/news/image/${pinnedNews[currentIndex].image}`}
                alt={pinnedNews[currentIndex].title}
                fill
                className="object-cover opacity-60"
                priority
              />
            )}
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
          
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
                  {getCategoryName(pinnedNews[currentIndex].category)}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDate(pinnedNews[currentIndex].date)}
                </span>
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300"
            >
              {pinnedNews[currentIndex].title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg mb-6 max-w-3xl"
            >
              {pinnedNews[currentIndex].description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href={`/news/${pinnedNews[currentIndex]._id}`}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg inline-flex items-center group"
              >
                Read Full Article
                <motion.svg 
                  className="w-5 h-5 ml-2"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Feature news indicators */}
      {pinnedNews.length > 1 && (
        <div className="absolute bottom-6 right-8 flex space-x-2 z-30">
          {pinnedNews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-green-500 w-10" 
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
