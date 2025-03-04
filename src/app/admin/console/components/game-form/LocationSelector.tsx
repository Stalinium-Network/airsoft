'use client'
import { useState, useEffect } from 'react'
import { Location, fetchLocations, deleteLocation } from '@/services/locationService'
import CreateLocationModal from '../location/CreateLocationModal'
import EditLocationModal from '../location/EditLocationModal'
import ConfirmationDialog from '../ui/ConfirmationDialog'

interface LocationSelectorProps {
  selectedLocation: string | Location | null;
  onChange: (location: Location | string) => void;
  isLoading?: boolean;
}

export default function LocationSelector({
  selectedLocation,
  onChange,
  isLoading = false
}: LocationSelectorProps) {
  const [locationOptions, setLocationOptions] = useState<Location[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  
  // For delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  
  // Fetch all available locations on component mount
  const loadLocations = async () => {
    setLoadingLocations(true)
    try {
      const data = await fetchLocations()
      setLocationOptions(data)
    } catch (error) {
      console.error('LocationSelector: Error fetching locations:', error)
      setError('Failed to load locations')
    } finally {
      setLoadingLocations(false)
    }
  }
  
  useEffect(() => {
    loadLocations();
  }, [])
  
  // Handle single location selection
  const handleSelectLocation = (location: Location) => {
    onChange(location)
    setIsDropdownOpen(false)
  }
  
  // Handle location creation success
  const handleLocationCreated = (newLocation: Location) => {
    // Add the new location to the options list
    setLocationOptions(prev => [...prev, newLocation])
    
    // Automatically select the newly created location
    onChange(newLocation)
    
    // Close the modal without page reload
    setIsCreateModalOpen(false)
  }
  
  // Handle location update success
  const handleLocationUpdated = (updatedLocation: Location) => {
    // Update the location in the options list
    setLocationOptions(prev => 
      prev.map(loc => loc._id === updatedLocation._id ? updatedLocation : loc)
    )
    
    // If this was the selected location, update it
    if (typeof selectedLocation === 'object' && selectedLocation?._id === updatedLocation._id) {
      onChange(updatedLocation)
    }
    
    // Close the modal
    setIsEditModalOpen(false)
  }
  
  // Open edit modal for a location
  const handleEditLocation = (e: React.MouseEvent, location: Location) => {
    e.stopPropagation() // Prevent selecting the location when clicking edit
    setCurrentLocation(location)
    setIsEditModalOpen(true)
  }
  
  // Open delete confirmation for a location
  const handleDeleteClick = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation() // Prevent selecting the location when clicking delete
    setLocationToDelete(locationId)
    setIsDeleteDialogOpen(true)
  }
  
  // Confirm and delete a location
  const confirmDeleteLocation = async () => {
    if (!locationToDelete) return;
    
    setIsDeleting(true)
    
    try {
      await deleteLocation(locationToDelete);
      
      // Remove from locations list
      setLocationOptions(prev => prev.filter(loc => loc._id !== locationToDelete))
      
      // If this was the selected location, clear the selection
      if (typeof selectedLocation === 'object' && selectedLocation?._id === locationToDelete ||
          typeof selectedLocation === 'string' && selectedLocation === locationToDelete) {
        onChange('');
      }
      
      // Close the confirmation dialog
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting location:', error)
      setError('Failed to delete location')
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Handle opening the create location modal
  const handleOpenCreateModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCreateModalOpen(true);
  };
  
  // Filter locations based on search query if any
  const filteredLocations = searchQuery
    ? locationOptions.filter(location => 
        location._id.toLowerCase().includes(searchQuery.toLowerCase()))
    : locationOptions;
  
  // Get the selected location name for display
  const getSelectedLocationName = (): string => {
    if (!selectedLocation) return 'Select a location'
    
    // Handle both string ID and location object
    if (typeof selectedLocation === 'string') {
      const found = locationOptions.find(loc => loc._id === selectedLocation)
      return found ? found._id : selectedLocation
    }
    
    return selectedLocation._id
  }
  
  return (
    <div>
      {error && (
        <div className="mb-2 p-2 bg-red-900/50 border border-red-800 rounded-md text-white text-xs">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-300">Location</label>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
          disabled={isLoading}
        >
          + New Location
        </button>
      </div>
      
      <div className="relative">
        {/* Selected location display - click to open dropdown */}
        <div 
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center justify-between">
            <span>{getSelectedLocationName()}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Search input - shown when dropdown is open */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading || loadingLocations}
              />
            </div>
            
            {/* Dropdown for location selection */}
            {loadingLocations ? (
              <div className="px-3 py-2 text-gray-400">Loading locations...</div>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map(location => (
                <div
                  key={location._id}
                  className="px-3 py-2 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    handleSelectLocation(location)
                    setSearchQuery('')
                  }}
                >
                  <div>
                    <div className="font-medium">{location._id}</div>
                    <div className="text-xs text-gray-400">{location.coordinates}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="text-xs text-blue-500 hover:underline"
                      onClick={(e) => handleEditLocation(e, location)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-500 hover:underline"
                      onClick={(e) => handleDeleteClick(e, location._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400">No locations found</div>
            )}
          </div>
        )}
      </div>
      
      {/* Create location modal */}
      {isCreateModalOpen && (
        <CreateLocationModal
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          onLocationCreated={handleLocationCreated}
        />
      )}
      
      {/* Edit location modal */}
      {isEditModalOpen && currentLocation && (
        <EditLocationModal
          location={currentLocation}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          onLocationUpdated={handleLocationUpdated}
        />
      )}
      
      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          title="Delete Location"
          message="Are you sure you want to delete this location? This action cannot be undone."
          onConfirm={confirmDeleteLocation}
          onCancel={() => setIsDeleteDialogOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
