"use client";
import React, { useState } from "react";
import { Card } from "@/services/gameService";
import { FaChevronDown, FaTrash } from "react-icons/fa";

interface CardEditorProps {
  cardType: string;
  card?: Card;
  onChange: (type: string, card: Card) => void;
  onRemove: (type: string) => void;
  isLoading?: boolean;
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
}: CardEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof Card, value: string) => {
    onChange(cardType, {
      ...card,
      [field]: value,
    });
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
          {/* Заголовок */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              Card Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full input-field"
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
              value={card.svgContent}
              onChange={(e) => handleChange("svgContent", e.target.value)}
              rows={3}
              className="w-full input-field font-mono text-xs"
              disabled={isLoading}
              placeholder="<svg>...</svg>"
            />
            
            <p className="text-xs text-gray-500 mt-1">Paste the full SVG code here</p>
            
            {/* {card.svgContent && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-md border border-gray-800">
                <div 
                  className="h-16 flex items-center justify-center text-blue-400" 
                  dangerouslySetInnerHTML={{ __html: card.svgContent }}
                />
              </div>
            )} */}
          </div>

          {/* Markdown контент */}
          <div>
            <label className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-1">
              Card Content (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={card.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={5}
              className="w-full input-field"
              disabled={isLoading}
              placeholder="Use Markdown for formatting..."
            />
          </div>
        </div>
      )}
    </div>
  );
}