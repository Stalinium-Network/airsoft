'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Game } from '@/services/gameService'
import useAdminAuth from './hooks/useAdminAuth'
import GameList from './components/GameList'
import CreateGameModal from './components/CreateGameModal'
import EditGameModal from './components/EditGameModal'
import AuthRequired from './components/AuthRequired'
import { adminApi } from '@/utils/api'

export default function AdminConsole() {
  const router = useRouter()
  const { token, userEmail, logout, message, isError, setMessage, setIsError } = useAdminAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Effect for fetching games once authenticated
  useEffect(() => {
    if (token) {
      fetchGames()
    }
  }, [token])

  // Fetch games from the server using axios
  const fetchGames = async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await adminApi.getGames()
      
      // Get data from axios response
      const data = response.data
      
      // Flatten past and upcoming games into a single array
      const allGames = [...data.past, ...data.upcoming]
      setGames(allGames)
      
      // Apply initial filter
      filterGames(allGames, filter)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter games by past/upcoming
  const filterGames = (gamesList: Game[], filterType: 'upcoming' | 'past') => {
    const filtered = gamesList.filter(game => 
      filterType === 'upcoming' ? !game.isPast : game.isPast
    )
    setFilteredGames(filtered)
  }
  
  // Handle filter change
  const handleFilterChange = (newFilter: 'upcoming' | 'past') => {
    setFilter(newFilter)
    filterGames(games, newFilter)
  }
  
  // Open create game modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }
  
  // Open the edit modal for a game
  const openEditModal = (game: Game) => {
    setEditingGame({...game})
    setIsEditModalOpen(true)
  }
  
  // Delete a game using axios
  const deleteGame = async (gameId: string | number) => {
    if (!token) {
      setIsError(true)
      setMessage('You must be logged in to perform this action')
      return
    }
    
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return
    }
    
    setIsLoading(true)
    setMessage('')
    setIsError(false)
    
    try {
      await adminApi.deleteGame(gameId)
      
      setMessage('Game deleted successfully!')
      
      // Update local state
      const updatedGames = games.filter(g => g._id !== gameId)
      setGames(updatedGames)
      filterGames(updatedGames, filter)
    } catch (error: any) {
      console.error('Error deleting game:', error)
      
      // Extract error message from axios error
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      
      setIsError(true)
      setMessage(`Failed to delete game: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle successful game creation
  const handleGameCreated = async () => {
    setIsCreateModalOpen(false)
    await fetchGames()
  }

  // Handle successful game update
  const handleGameUpdated = (updatedGame: Game) => {
    setGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g))
    filterGames(games.map(g => g._id === updatedGame._id ? updatedGame : g), filter)
    setIsEditModalOpen(false)
    setEditingGame(null)
  }

  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />
  }
  
  // Main admin console UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-gray-300">{userEmail}</span>
            )}
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Messages */}
        {message && (
          <div className={`p-4 mb-8 rounded ${isError ? 'bg-red-900' : 'bg-green-900'}`}>
            {message}
          </div>
        )}
        
        {/* Create new game button */}
        <div className="mb-8">
          <button
            onClick={openCreateModal}
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Create New Game'}
          </button>
        </div>
        
        {/* Game listing section */}
        <GameList 
          games={filteredGames}
          isLoading={isLoading}
          filter={filter}
          onFilterChange={handleFilterChange}
          onEditGame={openEditModal}
          onDeleteGame={deleteGame}
        />
      </div>
      
      {/* Create Game Modal */}
      {isCreateModalOpen && (
        <CreateGameModal
          token={token}
          onClose={() => setIsCreateModalOpen(false)}
          onGameCreated={handleGameCreated}
          onError={(errorMessage) => {
            setIsError(true)
            setMessage(errorMessage)
          }}
        />
      )}
      
      {/* Edit Modal */}
      {isEditModalOpen && editingGame && (
        <EditGameModal
          game={editingGame}
          token={token}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingGame(null)
          }}
          onGameUpdated={handleGameUpdated}
          onError={(errorMessage) => {
            setIsError(true)
            setMessage(errorMessage)
          }}
        />
      )}
    </div>
  )
}
