"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NewsItem, NewsCategory } from "@/services/newsService";

interface NewsCardProps {
  article: NewsItem;
  index: number;
  categories: NewsCategory[];
}

export default function NewsCard({ article, index, categories }: NewsCardProps) {
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
      className="bg-zone-dark-brown/20 rounded-xl overflow-hidden border border-zone-dark-brown/40 hover:border-zone-gold transition-all duration-300 shadow-lg hover:shadow-zone-gold/10"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Изображение новости */}
        {article.image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/news/image/${article.image}`}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-zone-dark via-zone-dark-brown/30 to-zone-dark"></div>
        )}
        
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-zone-gold/80 text-zone-dark-brown backdrop-blur-sm text-xs px-3 py-1 rounded-full font-medium">
            {getCategoryName(article.category)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>{formatDate(article.date)}</span>
        </div>
        
        <Link href={`/news/${article._id}`}>
          <h3 className="text-xl font-bold mb-3 hover:text-zone-gold transition-colors">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex justify-end mt-auto">
          <Link 
            href={`/news/${article._id}`}
            className="text-zone-gold hover:text-zone-gold/80 font-medium flex items-center group"
          >
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
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
