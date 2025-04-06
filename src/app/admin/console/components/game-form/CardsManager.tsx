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
  // Handle card changes, including type changes
  const handleCardChange = (cardType: string, updatedCard: Card & { type?: string }) => {
    // Make a copy of the cards array
    const newCards = [...cards];
    
    // Find the index of the card we need to update
    const cardIndex = cards.findIndex(card => card.type === cardType);
    
    if (cardIndex !== -1) {
      // Get the new type value if provided, otherwise use the existing type
      const newType = updatedCard.type || cardType;
      
      // If the card exists, update it
      newCards[cardIndex] = {
        ...updatedCard,
        type: newType // Ensure type is always set
      };
      
      // If we're changing to a new type that already exists, we need to handle conflicts
      if (newType !== cardType) {
        // Check if there's already a card with the new type
        const existingTypeIndex = cards.findIndex(
          (card, idx) => card.type === newType && idx !== cardIndex
        );
        
        if (existingTypeIndex !== -1) {
          // If there's already a card with the new type, create a unique type name
          const uniqueType = `${newType}_${Date.now()}`;
          newCards[cardIndex].type = uniqueType;
        }
      }
      
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
          {cards.map((card) => (
            <CardEditor
              key={card.type}
              cardType={card.type}
              card={card}
              onChange={handleCardChange}
              onRemove={handleRemoveCard}
              isLoading={isLoading}
              cardTypes={cardTypes} // Pass cardTypes to CardEditor
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