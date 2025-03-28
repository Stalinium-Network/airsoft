'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { adminApi } from '@/utils/api'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'

// FAQ interface
interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQsSectionProps {
  setMessage: (message: string) => void;
  setIsError: (isError: boolean) => void;
}

// Modal component for creating/editing FAQs - memoized to prevent unnecessary re-renders
const FAQFormModal = memo(({ 
  isOpen, 
  onClose, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  formTitle, 
  isLoading, 
  editingFaq 
}: { 
  isOpen: boolean;
  onClose: () => void;
  formData: { question: string; answer: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formTitle: string;
  isLoading: boolean;
  editingFaq: FAQ | null;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl shadow-xl border border-gray-700">
        <div className="flex justify-between items-center border-b border-gray-700 p-5">
          <h3 className="text-xl font-semibold text-white">{formTitle}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Question</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a question..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Answer</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter the answer..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {editingFaq ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
});

// Ensure displayName is set for memo component to help with debugging
FAQFormModal.displayName = 'FAQFormModal';

export default function FAQsSection({ setMessage, setIsError }: FAQsSectionProps) {
  // State for managing FAQs list
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // State for modal windows
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null)
  
  // State for form data
  const [formData, setFormData] = useState({ question: '', answer: '' })
  const [formTitle, setFormTitle] = useState('Create New FAQ')
  
  // Load FAQs when component mounts
  useEffect(() => {
    fetchFaqs()
  }, [])
  
  // Fetch FAQs from the server
  const fetchFaqs = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getFaqs()
      setFaqs(response.data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setIsError(true)
      setMessage('Failed to fetch FAQs')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Open create modal - memoized with useCallback
  const openCreateModal = useCallback(() => {
    setFormData({ question: '', answer: '' })
    setFormTitle('Create New FAQ')
    setIsCreateModalOpen(true)
  }, [])
  
  // Open edit modal - memoized with useCallback
  const openEditModal = useCallback((faq: FAQ) => {
    setFormData({ question: faq.question, answer: faq.answer })
    setEditingFaq(faq)
    setFormTitle('Edit FAQ')
    setIsEditModalOpen(true)
  }, [])
  
  // Open delete confirmation modal - memoized with useCallback
  const openDeleteModal = useCallback((faqId: string) => {
    setDeletingFaqId(faqId)
    setIsDeleteModalOpen(true)
  }, [])
  
  // Handle form input changes - memoized with useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])
  
  // Handle form submission - memoized with useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question || !formData.answer) {
      setIsError(true)
      setMessage('Please fill out both question and answer fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (editingFaq) {
        // Update existing FAQ
        await adminApi.updateFaq(editingFaq._id, formData)
        setMessage('FAQ updated successfully')
        
        // Update local state
        setFaqs(prevFaqs => 
          prevFaqs.map(faq => 
            faq._id === editingFaq._id 
              ? { ...faq, ...formData } 
              : faq
          )
        )
        
        setIsEditModalOpen(false)
        setEditingFaq(null)
      } else {
        // Create new FAQ
        const response = await adminApi.createFaq(formData)
        setMessage('FAQ created successfully')
        
        // Update local state with the new FAQ
        setFaqs(prevFaqs => [...prevFaqs, response.data])
        
        setIsCreateModalOpen(false)
      }
    } catch (error: any) {
      console.error('Error saving FAQ:', error)
      setIsError(true)
      setMessage(error.response?.data?.message || error.message || 'Failed to save FAQ')
    } finally {
      setIsLoading(false)
    }
  }, [formData, editingFaq, setIsError, setMessage])
  
  // Handle FAQ deletion - memoized with useCallback
  const handleDeleteFaq = useCallback(async () => {
    if (!deletingFaqId) return
    
    setIsLoading(true)
    
    try {
      await adminApi.deleteFaq(deletingFaqId)
      setMessage('FAQ deleted successfully')
      
      // Update local state
      setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== deletingFaqId))
    } catch (error: any) {
      console.error('Error deleting FAQ:', error)
      setIsError(true)
      setMessage(error.response?.data?.message || error.message || 'Failed to delete FAQ')
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
      setDeletingFaqId(null)
    }
  }, [deletingFaqId, setMessage, setIsError])

  // Handlers for closing modals - memoized with useCallback
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), [])
  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingFaq(null)
  }, [])
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setDeletingFaqId(null)
  }, [])

  return (
    <div>
      {/* Header and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h2>
        
        <button
          onClick={openCreateModal}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add FAQ
        </button>
      </div>
      
      {/* Information section */}
      <div className="bg-gray-800/60 border border-gray-700/60 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-green-500 mb-2">Managing FAQs</h3>
        <p className="text-gray-300 mb-3">
          Frequently Asked Questions appear on the FAQs page and help users find information quickly.
        </p>
        <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
          <li><span className="font-medium text-white">Question</span> - A clear, concise question that users might ask</li>
          <li><span className="font-medium text-white">Answer</span> - A helpful, detailed response that addresses the question</li>
          <li>For best results, keep questions straightforward and answers precise</li>
          <li>Changes update automatically on the site within an hour</li>
        </ul>
      </div>
      
      {/* FAQs list */}
      <div className="space-y-4">
        {isLoading && faqs.length === 0 ? (
          <div className="flex justify-center p-12">
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/50">
            <p className="text-gray-400 text-lg mb-4">No FAQs found</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First FAQ
            </button>
          </div>
        ) : (
          faqs.map((faq) => (
            <div 
              key={faq._id} 
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-green-900/30 hover:border-gray-600 transition-all"
            >
              <div className="p-5">
                <h3 className="text-xl font-medium text-white mb-2">{faq.question}</h3>
                <div className="text-gray-300 mb-4 text-sm">
                  <p className="line-clamp-3">{faq.answer}</p>
                </div>
                
                <div className="flex space-x-2 mt-4 border-t border-gray-700 pt-4">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(faq._id)}
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
      
      {/* Modals */}
      <FAQFormModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formTitle={formTitle}
        isLoading={isLoading}
        editingFaq={null}
      />
      
      <FAQFormModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formTitle={formTitle}
        isLoading={isLoading}
        editingFaq={editingFaq}
      />
      
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          title="Delete FAQ"
          message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
          confirmButtonText="Delete"
          onConfirm={handleDeleteFaq}
          onCancel={closeDeleteModal}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}