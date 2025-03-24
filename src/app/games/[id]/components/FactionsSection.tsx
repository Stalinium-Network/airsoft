"use client"

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameFraction } from "@/services/gameService";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface FactionsSectionProps {
  fractions: GameFraction[];
}

export default function FactionsSection({ fractions }: FactionsSectionProps) {
  const [expandedFractionId, setExpandedFractionId] = useState<string | null>(null);

  return (
    <div className="mt-10 pt-8 border-t border-gray-700">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Available Factions
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fractions.map((fraction) => (
          <div 
            key={fraction._id} 
            className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-green-500 transition-all duration-300 hover:shadow-md hover:shadow-green-900/20"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-800/80 to-gray-800/60 z-10"></div>
            
            {/* Faction image as background */}
            {fraction.image && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`}
                  alt={fraction._id}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                />
              </div>
            )}
            
            {/* Status indicator */}
            <div 
              className={`absolute top-0 left-0 w-1 h-full ${
                fraction.filled / fraction.capacity < 0.5 
                  ? "bg-green-500" 
                  : fraction.filled / fraction.capacity < 0.9 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
              }`}
            ></div>
            
            {/* Main content */}
            <div className="p-4 relative z-20">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-bold mb-1 group-hover:text-green-400 transition-colors">
                  {fraction.name || fraction._id}
                </h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  fraction.filled === fraction.capacity 
                    ? "bg-red-900/50 text-red-200" 
                    : fraction.filled / fraction.capacity > 0.7 
                      ? "bg-yellow-900/50 text-yellow-200" 
                      : "bg-green-900/50 text-green-200"
                }`}>
                  {fraction.filled === fraction.capacity 
                    ? "Full" 
                    : fraction.filled / fraction.capacity > 0.7 
                      ? "Filling Up" 
                      : "Available"}
                </span>
              </div>
              
              {fraction.shortDescription && (
                <p className="text-gray-300 text-sm my-2 line-clamp-2">{fraction.shortDescription}</p>
              )}
              
              {/* Capacity visualization */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Capacity</span>
                  <span className={`${
                    fraction.filled / fraction.capacity < 0.5 
                      ? "text-green-400" 
                      : fraction.filled / fraction.capacity < 0.9 
                        ? "text-yellow-400" 
                        : "text-red-400"
                  }`}>
                    {fraction.filled}/{fraction.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      fraction.filled / fraction.capacity < 0.5
                        ? "bg-gradient-to-r from-green-600 to-green-400"
                        : fraction.filled / fraction.capacity < 0.9
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                        : "bg-gradient-to-r from-red-600 to-red-400"
                    }`}
                    style={{ width: `${(fraction.filled / fraction.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Spots left indicator */}
              {fraction.filled < fraction.capacity && (
                <div className="mt-2 text-xs text-green-400">
                  {fraction.capacity - fraction.filled} spots remaining
                </div>
              )}
              
              {/* "View Details" button if details are available */}
              {fraction.details && (
                <button 
                  onClick={() => setExpandedFractionId(expandedFractionId === fraction._id ? null : fraction._id)}
                  className="mt-3 inline-flex items-center justify-center w-full py-1.5 px-3 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                >
                  {expandedFractionId === fraction._id ? (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide Details
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      View Details
                    </>
                  )}
                </button>
              )}
              
              {/* Expanded details section */}
              <AnimatePresence>
                {expandedFractionId === fraction._id && fraction.details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="prose prose-sm prose-invert max-w-none">
                        <MarkdownRenderer content={fraction.details} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
