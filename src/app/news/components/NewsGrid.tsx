"use client";

import { motion } from "framer-motion";
import NewsCard from "./NewsCard";
import { NewsItem } from "@/services/newsService";

interface NewsGridProps {
  newsItems: NewsItem[];
  activeCategory: string;
  searchQuery: string;
  onResetFilters: () => void;
}

export default function NewsGrid({ 
  newsItems, 
  activeCategory, 
  searchQuery, 
  onResetFilters 
}: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsItems.length === 0 ? (
        <div className="col-span-full text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-400 mb-2">No news found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        newsItems.map((article, index) => (
          <NewsCard key={article._id} article={article} index={index} categories={[]} /> //TODO: Add categories
        ))
      )}
    </div>
  );
}
