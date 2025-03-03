'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background radiation pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 800 800">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="radial" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#radial)" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="z-10 max-w-2xl w-full">
        <motion.div 
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error icon and code */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </motion.div>
              <motion.div 
                className="absolute inset-0 border-2 border-green-500 rounded-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Access <span className="text-green-500">Restricted</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">ERROR CODE: 401</p>
            
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700 mx-auto max-w-md mb-8">
              <p className="text-gray-300 font-mono text-sm">
                <span className="text-green-500">{'>'}</span> Entry denied. Your PDA does not have the required clearance to access this area of the Zone.
              </p>
            </div>
            
            <p className="text-gray-400 mb-8">
              You need proper authorization to enter this area. Either your token has expired or you don't have permission to access this resource.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.back()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back
              </button>
              <Link href="/" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Return to Base
              </Link>
              <Link href="/admin" className="bg-green-600 hover:bg-green-700 text-gray-900 font-bold px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                </svg>
                Login Again
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Radiation warning */}
        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p>⚠️ WARNING: High radiation levels detected in this area</p>
        </motion.div>
      </div>
      
      {/* Animated warning triangles */}
      <div className="absolute top-8 right-8 z-0">
        <motion.div
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-8 z-0">
        <motion.div
          animate={{ 
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
