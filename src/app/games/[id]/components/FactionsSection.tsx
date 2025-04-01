"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameFaction } from "@/services/gameService";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface FactionsSectionProps {
  factions: GameFaction[];
}

export default function FactionsSection({ factions }: FactionsSectionProps) {
  const [selectedFaction, setSelectedFaction] = useState<GameFaction | null>(
    null
  );
  const [cardPosition, setCardPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const openDetails = (faction: GameFaction) => {
    if (cardRefs.current[faction._id]) {
      const card = cardRefs.current[faction._id];
      const rect = card?.getBoundingClientRect();
      if (rect) {
        setCardPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    setSelectedFaction(faction);
    document.body.style.overflow = "hidden";
  };

  const closeDetails = () => {
    setSelectedFaction(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-700">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Available Factions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {factions.map((faction) => (
          <div
            key={faction._id}
            className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-green-500 transition-all duration-300 hover:shadow-md hover:shadow-green-900/20"
            ref={(el) => {
              cardRefs.current[faction._id] = el;
            }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-800/80 to-gray-800/60 z-10"></div>

            {/* Faction image as background */}
            {faction.image && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                  alt={faction._id}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                />
              </div>
            )}

            {/* Status indicator */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                faction.filled / faction.capacity < 0.5
                  ? "bg-green-500"
                  : faction.filled / faction.capacity < 0.9
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>

            {/* Content */}
            <div className="p-4 relative z-20">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-bold mb-1 group-hover:text-green-400 transition-colors">
                  {faction.name || faction._id}
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    faction.filled === faction.capacity
                      ? "bg-red-900/50 text-red-200"
                      : faction.filled / faction.capacity > 0.7
                      ? "bg-yellow-900/50 text-yellow-200"
                      : "bg-green-900/50 text-green-200"
                  }`}
                >
                  {faction.filled === faction.capacity
                    ? "Full"
                    : faction.filled / faction.capacity > 0.7
                    ? "Filling Up"
                    : "Available"}
                </span>
              </div>

              {faction.shortDescription && (
                <p className="text-gray-300 text-sm my-2 line-clamp-2">
                  {faction.shortDescription}
                </p>
              )}

              {/* Capacity visualization */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Capacity</span>
                  <span
                    className={`${
                      faction.filled / faction.capacity < 0.5
                        ? "text-green-400"
                        : faction.filled / faction.capacity < 0.9
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {faction.filled}/{faction.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      faction.filled / faction.capacity < 0.5
                        ? "bg-gradient-to-r from-green-600 to-green-400"
                        : faction.filled / faction.capacity < 0.9
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                        : "bg-gradient-to-r from-red-600 to-red-400"
                    }`}
                    style={{
                      width: `${(faction.filled / faction.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Spots left indicator */}
              {faction.filled < faction.capacity && (
                <div className="mt-2 text-xs text-green-400">
                  {faction.capacity - faction.filled} spots remaining
                </div>
              )}

              {/* "View Details" button if details are available */}
              {faction.details && (
                <button
                  onClick={() => openDetails(faction)}
                  className="mt-3 inline-flex items-center justify-center w-full py-1.5 px-3 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Анимированное модальное окно */}
      <AnimatePresence>
        {selectedFaction && cardPosition && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
          >
            {/* Затемненный фон с минимальным размытием */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Анимированная карточка с эффектом расширения */}
            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-2xl relative z-10 w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
              initial={{
                position: "fixed",
                top: cardPosition.top,
                left: cardPosition.left,
                width: cardPosition.width,
                height: cardPosition.height,
                opacity: 0.8,
                scale: 1,
                borderRadius: "0.5rem",
              }}
              animate={{
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                width: "min(90vw, 800px)",
                height: "auto",
                opacity: 1,
                scale: 1,
                borderRadius: "0.5rem",
              }}
              exit={{
                top: cardPosition.top,
                left: cardPosition.left,
                x: 0,
                y: 0,
                width: cardPosition.width,
                height: cardPosition.height,
                opacity: 0,
                scale: 0.9,
                borderRadius: "0.5rem",
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
            >
              {/* Заголовок */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                <h3 className="text-xl font-bold text-green-400 flex items-center">
                  {selectedFaction.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-600 relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${selectedFaction.image}`}
                        alt={selectedFaction.name || selectedFaction._id}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {selectedFaction.name || selectedFaction._id}
                </h3>
                <button
                  onClick={closeDetails}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Содержимое */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Детали фракции */}
                <div className="prose prose-invert max-w-none bg-gray-700/30 p-4 rounded-lg whitespace-pre-wrap">
                  <MarkdownRenderer content={selectedFaction.details} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
