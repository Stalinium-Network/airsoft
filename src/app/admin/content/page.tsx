'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAdminAuth from '@/hooks/useAdminAuth'
import { adminApi } from '@/utils/api'
import AuthRequired from '../components/AuthRequired'
import AdminLayout from '../components/AdminLayout'
import TeamMembersSection from './components/TeamMembersSection'

export default function ContentManager() {
  const { token, message, isError, setMessage, setIsError } = useAdminAuth()
  const router = useRouter()
  
  // State for active content section
  const [activeSection, setActiveSection] = useState<'team'|'about'|'faq'|'rules'>('team')
  
  // If not authenticated, show login prompt
  if (!token) {
    return <AuthRequired />
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Content Management</h1>
          
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-800/70 p-1 rounded-lg">
            <button
              onClick={() => setActiveSection('team')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === 'team' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              Team
            </button>
            {/* <button
              onClick={() => setActiveSection('about')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === 'about' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              disabled
            >
              About (Coming Soon)
            </button>
            <button
              onClick={() => setActiveSection('faq')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === 'faq' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              disabled
            >
              FAQ (Coming Soon)
            </button>
            <button
              onClick={() => setActiveSection('rules')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === 'rules' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              disabled
            >
              Rules (Coming Soon)
            </button> */}
          </div>
        </div>
        
        {/* Messages */}
        {message && (
          <div className={`p-4 mb-8 rounded ${isError ? 'bg-red-900' : 'bg-green-900'}`}>
            {message}
          </div>
        )}
        
        {/* Content Sections */}
        {activeSection === 'team' && (
          <TeamMembersSection
            setMessage={setMessage}
            setIsError={setIsError}
          />
        )}
        
        {/* Placeholder for future content sections */}
        {activeSection !== 'team' && (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/50">
            <p className="text-gray-400 text-lg mb-4">This section is coming soon</p>
            <button
              onClick={() => setActiveSection('team')}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Go Back to Team Management
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}