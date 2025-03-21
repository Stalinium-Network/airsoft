'use client'
import { useState } from 'react'
import { adminApi } from '@/utils/api'
import FractionForm from './FractionForm'

interface Fraction {
  _id: string;
  name?: string;
  capacity: number;
  filled: number;
  image?: string;
  shortDescription?: string;
  description?: string;
}

interface FractionModalProps {
  fraction?: Partial<Fraction>;
  onClose: () => void;
  onFractionSaved: (fraction: Fraction) => void;
}

export default function FractionModal({ 
  fraction, 
  onClose, 
  onFractionSaved 
}: FractionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSave = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = fraction?._id
        ? await adminApi.updateFraction(fraction._id, formData)
        : await adminApi.createFraction(formData)
      
      onFractionSaved(response.data)
    } catch (err: any) {
      console.error('Error saving fraction:', err)
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while saving the fraction'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {fraction?._id ? 'Edit Fraction' : 'Create New Fraction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-200">
              {error}
            </div>
          )}
          
          <FractionForm
            initialFraction={fraction}
            onSave={handleSave}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
