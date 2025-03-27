'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/utils/api'
import ProgressBar from '../../../console/components/game-form/ProgressBar'
import { createImagePreview } from '@/utils/imageUtils'

// Интерфейс для члена команды, соответствующий API
interface TeamMember {
  _id: string;    // Имя (идентификатор)
  name: string;   // Прозвище
  image: string;  // Изображение
  description?: string;  // Краткая информация
}

interface EditTeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  onMemberUpdated: () => void;
  onError: (message: string) => void;
}

export default function EditTeamMemberModal({
  member: initialMember,
  onClose,
  onMemberUpdated,
  onError
}: EditTeamMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  
  // Состояние для формы
  const [member, setMember] = useState({
    nickname: initialMember.name,  // Прозвище (name в API)
    description: initialMember.description || ''
  })
  
  // Состояние для изображения
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageChanged, setImageChanged] = useState(false)
  
  // Инициализация предпросмотра изображения при загрузке компонента
  useEffect(() => {
    if (initialMember.image) {
      // Создаем URL для изображения
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/team/image/${initialMember.image}`
      setImagePreview(imageUrl)
    }
  }, [initialMember])
  
  // Обработка изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMember(prev => ({ ...prev, [name]: value }))
  }
  
  // Обработка выбора изображения
  const handleImageSelected = async (file: File) => {
    try {
      const preview = await createImagePreview(file)
      setImagePreview(preview)
      setImageFile(file)
      setImageChanged(true)
    } catch (error) {
      console.error('Error processing image:', error)
      setError('Failed to process image. Please try another file.')
    }
  }
  
  // Удаление выбранного изображения
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageChanged(true)
  }
  
  // Валидация формы
  const validateForm = () => {
    if (!member.nickname.trim()) {
      setError('Nickname is required')
      return false
    }
    
    if (imageChanged && !imagePreview) {
      setError('Image is required')
      return false
    }
    
    setError('')
    return true
  }
  
  // Отправка формы
  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setUploadProgress(0)
    
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData()
      
      // Передаем обновленные данные
      formData.append('name', member.nickname.trim())
      
      if (member.description) {
        formData.append('description', member.description.trim())
      }
      
      // Обрабатываем логику изменения изображения
      if (imageChanged) {
        formData.append('imageChanged', 'true')
        if (imageFile) {
          formData.append('file', imageFile)
        }
      }
      
      // Имитация прогресса загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 300)
      
      // Отправляем запрос
      await adminApi.updateTeamMember(initialMember._id, formData)
      
      // Завершаем прогресс
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Вызываем колбэк успешного обновления
      onMemberUpdated()
    } catch (error: any) {
      console.error('Error updating team member:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      setError(`Failed to update team member: ${errorMessage}`)
      onError(`Failed to update team member: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-y-auto shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Team Member
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-white text-sm">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Real Name Field (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Real Name
              </label>
              <input
                type="text"
                value={initialMember._id}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-md px-3 py-2 text-gray-400"
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-gray-400">
                Real name cannot be changed
              </p>
            </div>
            
            {/* Nickname Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nickname/Callsign <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nickname"
                value={member.nickname}
                onChange={handleChange}
                placeholder="Enter player's in-game callsign"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={member.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter brief information about the player"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Image <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Member preview" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-md px-6 py-8 text-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="mt-2 block text-sm font-medium text-gray-300">
                        Click to upload team member photo
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageSelected(e.target.files[0])
                          }
                        }}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Upload progress indicator */}
          <ProgressBar progress={uploadProgress} show={isLoading && uploadProgress > 0} />
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
