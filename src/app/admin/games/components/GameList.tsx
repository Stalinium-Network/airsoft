'use client';

import { Game } from '@/services/gameService';
import Image from 'next/image';
import { isPreviewUrl, getYoutubeVideoId, getYoutubeThumbnail } from '@/services/gameService';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Trash from '@/components/SVG/Trash';

interface GameListProps {
  games: Game[];
  onDelete: (id: string) => void;
  onEdit: (game: Game) => void;
}

export default function GameList({ games, onDelete, onEdit }: GameListProps) {
  // Format date function
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM dd, yyyy, h:mm a', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  // Function to get preview URL
  const getPreviewUrl = (preview: string) => {
    if (!preview) return '/logo.png'; // Fallback if no preview
    
    if (isPreviewUrl(preview)) {
      const videoId = getYoutubeVideoId(preview);
      if (videoId) {
        return getYoutubeThumbnail(videoId);
      }
      return preview;
    }
    
    // If it's a filename rather than URL
    return `${process.env.NEXT_PUBLIC_API_URL}/games/image/${preview}`;
  };

  return (
    <div>
      {games.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No games in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game._id}
              className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-lg border border-gray-600"
            >
              <div className="h-48 overflow-hidden relative">
                <Image
                  src={getPreviewUrl(game.preview)}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">
                    {formatDate(game.date)}
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">{game.name}</h3>
                
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300 text-sm">
                      {typeof game.location === 'object' 
                        ? game.location._id 
                        : game.location as string
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300 text-sm">
                      {game.duration} hours
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-300 text-sm">
                      ${game.currentPrice}
                    </span>
                  </div>
                </div>
                
                {game.factions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs text-gray-400 uppercase font-medium mb-2">Factions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {game.factions.map(faction => (
                        <span 
                          key={faction._id}
                          className="px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded-full"
                        >
                          {faction._id} ({faction.filled}/{faction.capacity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex mt-4 gap-3">
                  <button
                    onClick={() => onEdit(game)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => onDelete(game._id)}
                    className="flex items-center justify-center bg-red-800 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                    title="Delete game"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}