'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthRequired() {
  const router = useRouter()
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [manualToken, setManualToken] = useState<string>('')
  
  const applyManualToken = () => {
    if (!manualToken.trim()) return
    
    localStorage.setItem('adminToken', manualToken.trim())
    // Force reload the page to re-trigger authentication
    window.location.reload()
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-16">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Console</h1>
        </header>
        
        <div className="bg-red-900 p-4 mb-8 rounded">
          Authentication required to access the admin console.
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access the admin console.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Go to Login
            </button>
            
            <div className="flex items-center gap-2 text-gray-400">
              <span>or</span>
              <button
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {showTokenInput ? 'Hide token input' : 'Enter token manually'}
              </button>
            </div>
            
            {showTokenInput && (
              <div className="mt-4">
                <label className="block text-sm mb-2">Admin Token</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste your admin token"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                  <button
                    onClick={applyManualToken}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
