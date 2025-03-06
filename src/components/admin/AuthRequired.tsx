'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthRequired() {
  const router = useRouter()
  
  const handleLoginRedirect = () => {
    router.push('/admin')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
        <p className="text-gray-300 mb-6">
          You must be logged in to access this admin area.
        </p>
        
        <button
          onClick={handleLoginRedirect}
          className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-6 rounded transition-colors w-full"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  )
}
