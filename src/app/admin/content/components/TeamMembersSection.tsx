'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/utils/api'
import CreateTeamMemberModal from './team/CreateTeamMemberModal'
import EditTeamMemberModal from './team/EditTeamMemberModal'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'

// Интерфейс для члена команды, соответствующий API
interface TeamMember {
  _id: string;    // Имя (идентификатор)
  name: string;   // Прозвище
  image: string;  // Изображение
  description?: string;  // Краткая информация
}

interface TeamMembersSectionProps {
  setMessage: (message: string) => void;
  setIsError: (isError: boolean) => void;
}

export default function TeamMembersSection({ setMessage, setIsError }: TeamMembersSectionProps) {
  // Состояние для управления списком команды
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Состояние для модальных окон
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)
  
  // Загрузка команды при монтировании компонента
  useEffect(() => {
    fetchTeamMembers()
  }, [])
  
  // Получение списка членов команды с сервера
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getAdminTeamList()
      // API теперь возвращает данные напрямую, а не объект с полем data
      setTeamMembers(response)
    } catch (error) {
      console.error('Error fetching team members:', error)
      setIsError(true)
      setMessage('Failed to fetch team members')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Открытие модального окна создания участника
  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }
  
  // Открытие модального окна редактирования
  const openEditModal = (member: TeamMember) => {
    setEditingMember(member)
    setIsEditModalOpen(true)
  }
  
  // Открытие модального окна подтверждения удаления
  const openDeleteModal = (memberId: string) => {
    setDeletingMemberId(memberId)
    setIsDeleteModalOpen(true)
  }
  
  // Обработка создания члена команды
  const handleMemberCreated = () => {
    setMessage('Team member created successfully')
    fetchTeamMembers()
    setIsCreateModalOpen(false)
  }
  
  // Обработка обновления члена команды
  const handleMemberUpdated = () => {
    setMessage('Team member updated successfully')
    fetchTeamMembers()
    setIsEditModalOpen(false)
    setEditingMember(null)
  }
  
  // Обработка удаления члена команды
  const handleDeleteMember = async () => {
    if (!deletingMemberId) return
    
    setIsLoading(true)
    
    try {
      await adminApi.deleteTeamMember(deletingMemberId)
      setMessage('Team member deleted successfully')
      
      // Обновление локального состояния
      setTeamMembers(prevMembers => prevMembers.filter(member => member._id !== deletingMemberId))
    } catch (error: any) {
      console.error('Error deleting team member:', error)
      setIsError(true)
      setMessage(error.response?.data?.message || error.message || 'Failed to delete team member')
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
      setDeletingMemberId(null)
    }
  }

  return (
    <div>
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team Members
        </h2>
        
        <button
          onClick={openCreateModal}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Team Member
        </button>
      </div>
      
      {/* Информационный блок */}
      <div className="bg-gray-800/60 border border-gray-700/60 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-green-500 mb-2">Managing Your Team</h3>
        <p className="text-gray-300 mb-3">
          Team members appear on the About page. The team section showcases key members of your organization.
        </p>
        <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
          <li><span className="font-medium text-white">ID</span> - Real name of the team member</li>
          <li><span className="font-medium text-white">Nickname</span> - Player's in-game callsign</li>
          <li><span className="font-medium text-white">Description</span> - Brief information about the player</li>
          <li>Changes update automatically on the site within an hour</li>
        </ul>
      </div>
      
      {/* Сетка команды */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && teamMembers.length === 0 ? (
          <div className="col-span-full flex justify-center p-12">
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/50">
            <p className="text-gray-400 text-lg mb-4">No team members found</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Team Member
            </button>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div 
              key={member._id} 
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-green-900/30 hover:border-gray-600"
            >
              {member.image ? (
                <div className="h-60 overflow-hidden relative">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}/team/image/${member.image}`} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <div className="bg-gray-900/80 px-3 py-1 rounded-md inline-block">
                      <p className="text-green-400 font-mono text-sm">"{member.name}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-60 bg-gray-700 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex flex-col mb-3">
                  <h3 className="text-xl font-semibold text-white mb-1 truncate">{member._id}</h3>
                  <div className="flex items-center">
                    <span className="mr-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Callsign</span>
                    <span className="text-green-400 font-medium text-sm">{member.name}</span>
                  </div>
                </div>
                
                {member.description && (
                  <div className="mb-4 border-t border-gray-700 pt-3 mt-2">
                    <p className="text-gray-300 text-sm line-clamp-3">{member.description}</p>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(member._id)}
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
      
      {/* Модальные окна */}
      {isCreateModalOpen && (
        <CreateTeamMemberModal
          onClose={() => setIsCreateModalOpen(false)}
          onMemberCreated={handleMemberCreated}
          onError={(message) => {
            setIsError(true)
            setMessage(message)
          }}
        />
      )}
      
      {isEditModalOpen && editingMember && (
        <EditTeamMemberModal
          member={editingMember}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingMember(null)
          }}
          onMemberUpdated={handleMemberUpdated}
          onError={(message) => {
            setIsError(true)
            setMessage(message)
          }}
        />
      )}
      
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          title="Delete Team Member"
          message={`Are you sure you want to delete this team member? This action cannot be undone.`}
          confirmButtonText="Delete"
          onConfirm={handleDeleteMember}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setDeletingMemberId(null)
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}