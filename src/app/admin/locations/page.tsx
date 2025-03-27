'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAdminAuth from '@/hooks/useAdminAuth'
import { adminApi } from '@/utils/api'
import { Location, deleteLocation } from '@/services/locationService'
import CreateLocationModal from '../console/components/location/CreateLocationModal'
import EditLocationModal from '../console/components/location/EditLocationModal'
import AuthRequired from '../components/AuthRequired'
import AdminLayout from '../components/AdminLayout'

export default function LocationsManager() {
  const { token, setMessage, setIsError } = useAdminAuth()
  const router = useRouter()
  
  // State variables
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  // Effect for fetching locations once authenticated
  useEffect(() => {
    if (token) {
      fetchLocations()
    }
  }, [token])

  // Fetch locations from the server
  const fetchLocations = async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await adminApi.getLocations()
      setLocations(response.data)
    } catch (error) {
      console.error('Error fetching locations:', error)
      setIsError(true)
      setMessage('Failed to fetch locations')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Open modal for creating a new location
  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }
  
  // Open modal for editing an existing location
  const openEditModal = (location: Location) => {
    setEditingLocation(location)
    setIsEditModalOpen(true)
  }
  
  // Handle location creation
  const handleLocationCreated = (location: Location) => {
    setMessage('Location created successfully!')
    fetchLocations()
    setIsCreateModalOpen(false)
  }

  // Handle location update
  const handleLocationUpdated = (location: Location) => {
    setMessage('Location updated successfully!')
    fetchLocations()
    setIsEditModalOpen(false)
    setEditingLocation(null)
  }
  
  // Handle location deletion
  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm(`Are you sure you want to delete location "${locationId}"? This action cannot be undone.`)) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await deleteLocation(locationId)
      setMessage('Location deleted successfully')
      
      // Update local state
      setLocations(prev => prev.filter(loc => loc._id !== locationId))
    } catch (error: any) {
      console.error('Error deleting location:', error)
      setIsError(true)
      setMessage(error.message || 'Failed to delete location')
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Locations Management</h1>
          
          <button
            onClick={openCreateModal}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Location
          </button>
        </div>
        
        {/* Help text */}
        <div className="bg-gray-800/60 border border-gray-700/60 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-green-500 mb-2">About Locations</h3>
          <p className="text-gray-300 mb-3">
            Locations are used for game events and appear on the map. Each location needs:
          </p>
          <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
            <li>A unique name (also serves as the identifier)</li>
            <li>Coordinates (latitude,longitude format)</li>
            <li>Optionally, an image and description</li>
          </ul>
        </div>
        
        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && locations.length === 0 ? (
            <div className="col-span-full flex justify-center p-12">
              <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="col-span-full bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/50">
              <p className="text-gray-400 text-lg mb-4">No locations found</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Location
              </button>
            </div>
          ) : (
            locations.map((location) => (
              <div 
                key={location._id} 
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-green-900/30 hover:border-gray-600"
              >
                {location.image ? (
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/games/location-image/${location.image}`} 
                      alt={location._id} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2 truncate">{location._id}</h3>
                  <p className="text-sm text-gray-400 mb-3 font-mono">
                    <span className="inline-block bg-gray-700 px-2 py-1 rounded-md">
                      {location.coordinates}
                    </span>
                  </p>
                  {location.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{location.description}</p>
                  )}
                  
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => openEditModal(location)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location._id)}
                      disabled={isLoading}
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Create Location Modal */}
        {isCreateModalOpen && (
          <CreateLocationModal
            onClose={() => setIsCreateModalOpen(false)}
            onLocationCreated={handleLocationCreated}
          />
        )}
        
        {/* Edit Location Modal */}
        {isEditModalOpen && editingLocation && (
          <EditLocationModal
            location={editingLocation}
            onClose={() => {
              setIsEditModalOpen(false)
              setEditingLocation(null)
            }}
            onLocationUpdated={handleLocationUpdated}
            onError={(message) => {
              setIsError(true)
              setMessage(message)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}