import { useState, useEffect } from 'react';
import { adminApi } from '@/utils/api';
import { Location } from '@/services/locationService';

interface LocationSelectorProps {
  selectedLocation: string;
  onSelect: (locationId: string) => void;
}

export default function LocationSelector({ selectedLocation, onSelect }: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.getLocations();
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <select
      value={selectedLocation}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
      disabled={isLoading}
    >
      <option value="">Select a location</option>
      {locations.map((location) => (
        <option key={location._id} value={location._id}>
          {location._id}
        </option>
      ))}
    </select>
  );
}
