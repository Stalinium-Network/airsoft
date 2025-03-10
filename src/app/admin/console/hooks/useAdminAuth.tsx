'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, adminApi } from '@/utils/api'

export default function useAdminAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isError, setIsError] = useState(false)
  
  // Check authentication on hook mount
  useEffect(() => {
    // Safe localStorage access with browser check
    const getToken = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken')
      }
      return null
    }

    // Ensure we're on client-side before accessing localStorage
    if (typeof window === 'undefined') return

    // Try to get token from URL first (in case of fresh redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    
    if (urlToken) {
      console.log('Token found in URL, saving to localStorage')
      localStorage.setItem('adminToken', urlToken)
      setToken(urlToken)
      
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      // If no token in URL, try localStorage
      const savedToken = getToken()
      console.log('Checking localStorage for token:', savedToken ? 'Token found' : 'No token in localStorage')
      setToken(savedToken)
      
      if (!savedToken) {
        setMessage('No authentication token found. Please log in.')
        setIsError(true)
      }
    }
  }, [])
  
  // Separate effect for token verification
  useEffect(() => {
    if (!token) return
    
    // Verify token using axios
    const verifyToken = async () => {
      try {
        console.log('Verifying token...')
        const response = await adminApi.verifyToken()
        
        const data = response.data
        setUserEmail(data.email)
        setIsError(false)
        console.log('Token verified successfully')
      } catch (error: any) {
        console.error('Error verifying token:', error)
        setIsError(true)
        
        // Extract error message from axios error
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
        setMessage(`Error verifying token: ${errorMessage}`)
      }
    }
    
    verifyToken()
  }, [token])
  
  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setUserEmail('')
    setMessage('Logged out successfully')
    setIsError(false)
    router.push('/admin')
  }
  
  const applyManualToken = (manualToken: string) => {
    if (!manualToken.trim()) {
      setIsError(true)
      setMessage('Please enter a token')
      return
    }
    
    localStorage.setItem('adminToken', manualToken.trim())
    setToken(manualToken.trim())
    setMessage('Token applied. Verifying...')
  }
  
  return {
    token,
    userEmail,
    message,
    isError,
    logout,
    applyManualToken,
    setMessage,
    setIsError
  }
}
