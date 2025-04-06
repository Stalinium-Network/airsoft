"use client";
import React, { useState } from "react";
import { Card } from "@/services/gameService";
import { FaChevronDown, FaTrash } from "react-icons/fa";

interface CardEditorProps {
  cardType: string;
  card?: Card & { type?: string };
  onChange: (type: string, card: Card & { type?: string }) => void;
  onRemove: (type: string) => void;
  isLoading?: boolean;
  cardTypes?: string[]; // Add cardTypes prop to select from available types
}

const defaultCard: Card = {
  title: "",
  svgContent: "",
  content: "",
};

export default function CardEditor({
  cardType,
  card = defaultCard,
  onChange,
  onRemove,
  isLoading = false,
  cardTypes = [], // Default to empty array
}: CardEditorProps) {
  const [expanded, setExpanded] = useState(false);

  // Handle input changes including type changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "type") {
      // When changing card type, need to handle differently
      onChange(cardType, { 
        ...card,
        type: value // Include the new type
      });
    } else {
      // For regular field changes
      onChange(cardType, {
        ...card,
        [name]: value,
      });
    }
  };

  // Функция для форматирования названия типа карточки (first letter uppercase)
  const formatCardType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-gray-800/30 border-l-2 border-blue-500/70 rounded-md overflow-hidden shadow-sm transition-all hover:shadow-md mb-4">
      {/* Карточка-аккордеон */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {/* Тип карточки */}
          <div className="text-blue-400 font-medium mr-3 text-sm">
            {formatCardType(cardType)}
          </div>
          
          {/* Заголовок карточки */}
          <h4 className="text-gray-200 font-medium">
            {card.title || "Untitled card"}
          </h4>
        </div>

        <div className="flex items-center">
          {/* Иконка удаления карточки */}
          <button
            type="button"
            className="text-gray-400 hover:text-red-400 transition-colors mr-3 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(cardType);
            }}
            disabled={isLoading}
            aria-label="Remove card"
          >
            <FaTrash size={14} />
          </button>

          {/* Иконка раскрытия/сворачивания */}
          <FaChevronDown 
            className={`text-gray-400 transition-transform ${expanded ? "transform rotate-180" : ""}`}
            size={14}
          />
        </div>
      </div>

      {/* Развернутая панель редактирования */}
      {expanded && (
        <div className="p-4 border-t border-gray-700/50">
          {/* Card Type Selection */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              Card Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={cardType}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {cardTypes.map((type) => (
                <option key={type} value={type}>
                  {formatCardType(type)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              The card type determines where this content appears on the game page
            </p>
          </div>
          
          {/* Заголовок */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              Card Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={card.title || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
              placeholder="Enter card title"
            />
          </div>

          {/* SVG Контент */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              SVG Icon Content <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              name="svgContent"
              value={card.svgContent || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-xs"
              disabled={isLoading}
              placeholder="<svg>...</svg>"
            />
            
            <p className="text-xs text-gray-500 mt-1">Paste the full SVG code here</p>
          </div>

          {/* Markdown контент */}
          <div>
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              Card Content (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={card.content || ""}
              onChange={handleChange}
              rows={5}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
              placeholder="Use Markdown for formatting..."
            />
          </div>
        </div>
      )}
    </div>
  );
}