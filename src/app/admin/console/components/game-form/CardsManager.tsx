"use client";
import React from "react";
import { Card } from "@/services/gameService";
import { FaPlus } from "react-icons/fa";
import CardEditor from "./CardEditor";

interface CardsManagerProps {
  cards: Array<Card & { type: string }>;
  cardTypes: string[];
  onChange: (updatedCards: Array<Card & { type: string }>) => void;
  onAddCard: () => void;
  isLoading?: boolean;
}

export default function CardsManager({
  cards,
  cardTypes,
  onChange,
  onAddCard,
  isLoading = false,
}: CardsManagerProps) {
  // Функция для обновления карточки по индексу
  const handleCardChange = (cardType: string, updatedCard: Card) => {
    const cardIndex = cards.findIndex(card => card.type === cardType);
    if (cardIndex !== -1) {
      const newCards = [...cards];
      newCards[cardIndex] = {
        ...newCards[cardIndex],
        ...updatedCard
      };
      onChange(newCards);
    }
  };

  // Функция для удаления карточки по типу
  const handleRemoveCard = (cardType: string) => {
    onChange(cards.filter(card => card.type !== cardType));
  };

  return (
    <div className="space-y-4">
      {/* Отображение карточек */}
      {cards.length === 0 ? (
        <div className="text-center py-6 bg-gray-800/50 rounded-md border border-gray-700/50">
          <p className="text-gray-400">No cards added yet. Add your first card below.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {cards.map((card, index) => (
            <CardEditor
              key={`${card.type}-${index}`}
              cardType={card.type}
              card={card}
              onChange={handleCardChange}
              onRemove={handleRemoveCard}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Кнопка добавления карточки */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onAddCard}
          disabled={isLoading || cardTypes.length === 0}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-500/80 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
        >
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          Add Game Card
        </button>
      </div>
    </div>
  );
}