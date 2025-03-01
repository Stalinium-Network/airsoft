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
      console.log('Token received from redirect, saving to localStorage')
      
      // Store token in localStorage
      try {
        localStorage.setItem('adminToken', token)
        
        // Check if token was actually saved
        const savedToken = localStorage.getItem('adminToken')
        if (savedToken === token) {
          console.log('Token successfully saved to localStorage')
          
          // Remove token from URL for security
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Redirect to console
          setMessage('Login successful! Redirecting...')
          setTimeout(() => router.push('/admin/console'), 1000)
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
        console.log('Existing token found, verifying...')
        
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
              console.log('Existing token is valid, redirecting to console')
              router.push('/admin/console')
            } else {
              console.log('Existing token is invalid, removing')
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded text-center ${isError ? 'bg-red-900' : 'bg-green-900'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Image 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              width={18} 
              height={18}
            />
            Sign in with Google
          </button>
          
          <div className="text-center text-gray-400 text-sm">
            <p>Debug check:</p>
            <p className="mt-1">
              localStorage availability: {typeof window !== 'undefined' && window.localStorage ? 'Available' : 'Not available'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Admin access only. Non-authorized emails will be rejected.
        </div>
      </div>
    </div>
  )
}
