'use client'
import { useState, useEffect } from 'react'
import { Location, fetchLocations, deleteLocation } from '@/services/locationService'
import CreateLocationModal from '../components/location/CreateLocationModal'
import { SvgPlus } from '@/components/SVG/Plus'
import { SvgMap } from '@/components/SVG/Map'
import { SvgTrash } from '@/components/SVG/Trash'

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null)
  
  // Load locations
  const loadLocations = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchLocations()
      setLocations(data)
    } catch (err) {
      setError('Failed to load locations')
      console.error('Error loading locations:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadLocations()
  }, [])
  
  // Handle location creation
  const handleLocationCreated = (location: Location) => {
    setLocations(prev => [...prev, location])
    setIsCreateModalOpen(false)
  }
  
  // Handle location deletion
  const handleDeleteLocation = async (locationId: string) => {
    // Ask for confirmation
    if (!window.confirm(`Are you sure you want to delete location "${locationId}"?`)) {
      return
    }
    
    setDeletingLocationId(locationId)
    
    try {
      await deleteLocation(locationId)
      setLocations(prev => prev.filter(loc => loc._id !== locationId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete location')
      console.error('Error deleting location:', err)
    } finally {
      setDeletingLocationId(null)
    }
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Locations</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <SvgPlus className="mr-2" />
          New Location
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-800 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : locations.length > 0 ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-gray-300">Location Name</th>
                <th className="px-4 py-3 text-gray-300">Coordinates</th>
                <th className="px-4 py-3 text-gray-300">Description</th>
                <th className="px-4 py-3 text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location._id} className="border-t border-gray-700">
                  <td className="px-4 py-3 font-medium text-white">{location._id}</td>
                  <td className="px-4 py-3 text-gray-300">
                    <a 
                      href={`https://maps.google.com/?q=${location.coordinates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <SvgMap className="mr-1" />
                      {location.coordinates}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {location.description ? (
                      <span>{location.description.slice(0, 50)}{location.description.length > 50 ? '...' : ''}</span>
                    ) : (
                      <span className="text-gray-500 italic">No description</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
                        disabled={deletingLocationId === location._id}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/30"
                        title="Delete location"
                      >
                        {deletingLocationId === location._id ? (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 rounded-full border-t-transparent"></div>
                          </div>
                        ) : (
                          <SvgTrash className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-300 mb-4">No locations found</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create your first location
          </button>
        </div>
      )}
      
      {isCreateModalOpen && (
        <CreateLocationModal
          onClose={() => setIsCreateModalOpen(false)}
          onLocationCreated={handleLocationCreated}
        />
      )}
    </div>
  )
}
