'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  
  // Handle OAuth redirect and extract token if present
  useEffect(() => {
    // Check if we're being redirected from OAuth with a token
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      // Store token in localStorage
      try {
        localStorage.setItem('adminToken', token)
        
        // Check if token was actually saved
        const savedToken = localStorage.getItem('adminToken')
        if (savedToken === token) {
          // Remove token from URL for security
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Redirect to gallery management instead of console
          setMessage('Login successful! Redirecting...')
          setTimeout(() => router.push('/admin/gallery'), 1000)
        } else {
          console.error('Failed to save token to localStorage')
          setIsError(true)
          setMessage('Error: Failed to save authentication token')
        }
      } catch (error) {
        console.error('Error saving token:', error)
        setIsError(true)
        setMessage('Error: Could not save authentication token')
      }
    } else {
      // Check if user is already logged in
      const existingToken = localStorage.getItem('adminToken')
      if (existingToken) {
        // Verify existing token
        const verifyToken = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify-token`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${existingToken}`
              }
            })
            
            if (response.ok) {
              router.push('/admin/gallery') // Redirect to gallery management
            } else {
              localStorage.removeItem('adminToken')
            }
          } catch (error) {
            console.error('Error verifying token:', error)
          }
        }
        
        verifyToken()
      }
    }
  }, [router])
  
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/admin/google`
  }
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Subtle accent line */}
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-medium text-white mb-1">Admin Login</h2>
            <p className="text-gray-500 text-sm mb-6">Secure authentication required</p>
            
            {message && (
              <div className={`p-3 mb-4 rounded text-sm ${isError ? 'bg-red-900/30 border border-red-800 text-red-200' : 'bg-green-900/30 border border-green-800 text-green-200'}`}>
                {message}
              </div>
            )}
            
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded border border-gray-700 transition-colors"
            >
              <Image 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google logo" 
                width={18} 
                height={18}
              />
              <span>Sign in with Google</span>
            </button>
          </div>
          
          <div className="bg-gray-950 px-6 py-3 text-xs text-gray-500 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span>Storage: {typeof window !== 'undefined' && window.localStorage ? 'Available' : 'Unavailable'}</span>
              <span className="text-green-500">●</span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-center text-xs text-gray-600">
          Access restricted to authorized personnel
        </p>
      </div>
    </div>
  )
}
