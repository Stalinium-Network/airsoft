'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { adminApi } from '@/utils/api'

interface Fraction {
  _id: string;
  name?: string;
  capacity: number;
  filled: number;
  image?: string;
  shortDescription?: string;
  description?: string;
}

interface FractionFormProps {
  initialFraction?: Partial<Fraction>;
  onSave: (fraction: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function FractionForm({ 
  initialFraction = {}, 
  onSave, 
  onCancel,
  isSubmitting 
}: FractionFormProps) {
  // Form state
  const [name, setName] = useState(initialFraction.name || '')
  const [capacity, setCapacity] = useState(initialFraction.capacity?.toString() || '20')
  const [shortDescription, setShortDescription] = useState(initialFraction.shortDescription || '')
  const [description, setDescription] = useState(initialFraction.description || '')
  
  // Image preview
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Set up image preview if editing existing fraction
  useEffect(() => {
    if (initialFraction.image) {
      setImagePreview(`${process.env.NEXT_PUBLIC_IMAGES_URL}/fractions/${initialFraction.image}`)
    }
  }, [initialFraction])
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create FormData object
    const formData = new FormData()
    if (initialFraction._id) formData.append('_id', initialFraction._id)
    formData.append('name', name)
    formData.append('capacity', capacity)
    formData.append('shortDescription', shortDescription)
    formData.append('description', description)
    
    if (imageFile) {
      formData.append('image', imageFile)
    }
    
    await onSave(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fraction name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Fraction Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-green-500 focus:border-green-500"
          placeholder="e.g. Duty, Freedom, etc."
        />
      </div>
      
      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
          Capacity *
        </label>
        <input
          id="capacity"
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Fraction Image
        </label>
        <div className="flex items-center space-x-4">
          {imagePreview && (
            <div className="relative h-24 w-24 rounded overflow-hidden">
              <Image 
                src={imagePreview} 
                alt="Fraction preview" 
                fill 
                className="object-cover"
              />
            </div>
          )}
          
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md py-2 px-4 text-white transition-colors">
            {imageFile ? 'Change Image' : imagePreview ? 'Replace Image' : 'Upload Image'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      
      {/* Short description */}
      <div>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300 mb-1">
          Short Description
        </label>
        <input
          id="shortDescription"
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-green-500 focus:border-green-500"
          placeholder="Brief description for list views"
        />
      </div>
      
      {/* Full description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Full Description (Markdown)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-green-500 focus:border-green-500 font-mono text-sm"
          placeholder="Full description in markdown format"
        />
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialFraction._id ? 'Update Fraction' : 'Create Fraction'}
        </button>
      </div>
    </form>
  )
}
