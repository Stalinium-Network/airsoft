'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/services/gameService';
import { adminApi } from '@/utils/api';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import useAdminAuth from '@/hooks/useAdminAuth';
import AdminLayout from '../components/AdminLayout';
import AuthRequired from '../components/AuthRequired';
import GameList from './components/GameList';
import GameForm from './components/GameForm';
import { Tab } from '@headlessui/react';
import { Location } from '@/services/locationService';

export default function GamesAdmin() {
  const { token, setMessage, setIsError } = useAdminAuth();
  const router = useRouter();
  
  const [games, setGames] = useState<{ past: Game[], upcoming: Game[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for upcoming, 1 for past
  
  // Pre-load data needed for game form
  const [locations, setLocations] = useState<Location[]>([]);
  const [availableFactions, setAvailableFactions] = useState<any[]>([]);
  const [availableCardTypes, setAvailableCardTypes] = useState<string[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch games list and initial data once authenticated
  useEffect(() => {
    if (token) {
      fetchGames();
      fetchInitialData();
    }
  }, [token]);

  // Function to fetch games
  const fetchGames = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const gamesData = await adminApi.getGames();
      setGames(gamesData);
    } catch (err) {
      console.error('Error loading games:', err);
      setIsError(true);
      setMessage('Failed to load games list');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch initial data (locations, factions, card types)
  const fetchInitialData = async () => {
    if (!token || initialDataLoaded) return;
    
    try {
      const [locationsData, factionsData, cardTypesData] = await Promise.all([
        adminApi.getLocations(),
        adminApi.getFactions(),
        adminApi.getCardTypes()
      ]);
      
      setLocations(locationsData);
      setAvailableFactions(factionsData);
      setAvailableCardTypes(cardTypesData.types);
      setInitialDataLoaded(true);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setIsError(true);
      setMessage('Failed to load required data for game management');
    }
  };

  // Function to delete a game
  const handleDeleteGame = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await adminApi.deleteGame(id);
      setMessage('Game successfully deleted');
      
      // Update games list after deletion
      const updatedGames = await adminApi.getGames();
      setGames(updatedGames);
    } catch (err) {
      console.error('Error deleting game:', err);
      setIsError(true);
      setMessage('Failed to delete game');
    } finally {
      setLoading(false);
    }
  };

  // Function to edit a game
  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setIsCreating(false);
  };

  // Function to create a new game
  const handleCreateGame = () => {
    setEditingGame(null);
    setIsCreating(true);
  };

  // Function to return to games list
  const handleBack = () => {
    setEditingGame(null);
    setIsCreating(false);
  };

  // Function after successful save
  const handleSaveGame = async () => {
    setLoading(true);
    try {
      // Refresh games list after save
      const updatedGames = await adminApi.getGames();
      setGames(updatedGames);
      setEditingGame(null);
      setIsCreating(false);
      setMessage('Game saved successfully!');
    } catch (err) {
      console.error('Error refreshing games list:', err);
      setIsError(true);
      setMessage('Failed to update games list');
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />;
  }

  return (
    <AdminLayout>
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {!isCreating && !editingGame ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Games Management
              </h1>
              
              <button
                onClick={handleCreateGame}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Game
              </button>
            </div>
            
            {/* Help text */}
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-amber-400 mb-2">About Games</h3>
              <p className="text-gray-300 mb-3">
                Games are events that players can join. Each game includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
                <li>Basic information (name, date, location)</li>
                <li>Factions that players can join</li>
                <li>Registration details</li>
                <li>Information cards with important details</li>
              </ul>
            </div>
            
            {loading ? (
              <div className="flex justify-center my-12">
                <LoadingSpinner />
              </div>
            ) : !games ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-300 mb-4">No games found</p>
                <button
                  onClick={handleCreateGame}
                  className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Game
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
                <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                  <Tab.List className="flex bg-gray-900 p-1">
                    <Tab 
                      className={({ selected }) => 
                        `w-full py-3 font-medium text-base rounded-md transition-colors
                        ${selected 
                          ? 'bg-gray-800 text-amber-400 shadow' 
                          : 'text-gray-400 hover:text-gray-200'}`
                      }
                    >
                      Upcoming Games
                    </Tab>
                    <Tab 
                      className={({ selected }) => 
                        `w-full py-3 font-medium text-base rounded-md transition-colors
                        ${selected 
                          ? 'bg-gray-800 text-amber-400 shadow' 
                          : 'text-gray-400 hover:text-gray-200'}`
                      }
                    >
                      Past Games
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="p-4">
                    <Tab.Panel>
                      <GameList 
                        games={games.upcoming} 
                        onDelete={handleDeleteGame}
                        onEdit={handleEditGame}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <GameList 
                        games={games.past} 
                        onDelete={handleDeleteGame}
                        onEdit={handleEditGame}
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            )}
          </>
        ) : (
          <GameForm 
            game={editingGame} 
            isCreating={isCreating} 
            onBack={handleBack} 
            onSave={handleSaveGame} 
            locations={locations}
            availableFactions={availableFactions}
            availableCardTypes={availableCardTypes}
            isLoading={!initialDataLoaded}
          />
        )}
      </div>
    </AdminLayout>
  );
}
