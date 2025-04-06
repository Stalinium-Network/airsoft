'use client';

import { useState, useEffect } from 'react';
import { Card, Cards } from '@/services/gameService';
import Trash from '@/components/SVG/Trash';
import Plus from '@/components/SVG/Plus';

interface CardEditorProps {
  cards?: Cards;
  availableCardTypes: string[];
  onChange: (cards: Cards) => void;
}

export default function CardEditor({ cards, availableCardTypes, onChange }: CardEditorProps) {
  // State to store current cards
  const [currentCards, setCurrentCards] = useState<Cards>({});
  
  // Load cards on initialization
  useEffect(() => {
    if (cards) {
      setCurrentCards({ ...cards });
    }
  }, [cards]);

  // Handler for adding a new card
  const handleAddCard = (type: string) => {
    if (currentCards[type]) {
      return; // Card already exists
    }
    
    const newCard: Card = {
      title: getDefaultCardTitle(type),
      svgContent: '', // Empty SVG content by default
      content: '' // Empty content by default
    };
    
    const updatedCards = {
      ...currentCards,
      [type]: newCard
    };
    
    setCurrentCards(updatedCards);
    onChange(updatedCards);
  };

  // Get default title for a new card type
  const getDefaultCardTitle = (type: string): string => {
    switch (type) {
      case 'timeline':
        return 'Timeline';
      case 'starter_pack':
        return 'Starter Pack';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/-|_/g, ' ');
    }
  };

  // Handler for removing a card
  const handleRemoveCard = (type: string) => {
    const updatedCards = { ...currentCards };
    delete updatedCards[type];
    
    setCurrentCards(updatedCards);
    onChange(updatedCards);
  };

  // Handler for changing card fields
  const handleCardFieldChange = (type: string, field: keyof Card, value: string) => {
    if (!currentCards[type]) {
      return;
    }
    
    const updatedCards = {
      ...currentCards,
      [type]: {
        ...currentCards[type],
        [field]: value
      }
    };
    
    setCurrentCards(updatedCards);
    onChange(updatedCards);
  };

  // Check if a card type is available to add
  const isCardTypeAvailable = (type: string): boolean => {
    return !currentCards[type];
  };

  return (
    <div className="space-y-6">
      {/* List of current cards */}
      {Object.entries(currentCards).length > 0 ? (
        Object.entries(currentCards).map(([type, card]) => (
          <div key={type} className="bg-gray-900 border border-gray-600 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg text-gray-200">{card.title || getDefaultCardTitle(type)}</h4>
              <button
                type="button"
                onClick={() => handleRemoveCard(type)}
                className="text-red-400 hover:text-red-300"
                title="Remove card"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                <input
                  type="text"
                  value={card.title || ''}
                  onChange={(e) => handleCardFieldChange(type, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Card title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">SVG Content (icon)</label>
                <textarea
                  value={card.svgContent || ''}
                  onChange={(e) => handleCardFieldChange(type, 'svgContent', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-xs"
                  rows={3}
                  placeholder="<svg>...</svg>"
                ></textarea>
                {card.svgContent && (
                  <div className="mt-2 p-2 bg-gray-800 rounded-md flex justify-center">
                    <div className="h-8 w-8" dangerouslySetInnerHTML={{ __html: card.svgContent }}></div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Content (supports Markdown)</label>
                <textarea
                  value={card.content || ''}
                  onChange={(e) => handleCardFieldChange(type, 'content', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={6}
                  placeholder="## Heading\n- Item 1\n- Item 2"
                ></textarea>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No cards added yet</p>
      )}

      {/* Buttons to add new cards */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-300">Available card types:</h4>
        <div className="flex flex-wrap gap-2">
          {availableCardTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddCard(type)}
              disabled={!isCardTypeAvailable(type)}
              className={`px-3 py-1 rounded-md text-sm flex items-center ${
                isCardTypeAvailable(type)
                  ? 'bg-amber-500 text-gray-900 hover:bg-amber-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="h-3 w-3 mr-1" />
              {getDefaultCardTitle(type)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}