'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAndSaveToken = async () => {
      try {
        // First check if there's a token in URL parameters (from OAuth redirect)
        const urlToken = searchParams.get('token')
        
        if (urlToken) {
          // Store token in localStorage
          localStorage.setItem('adminToken', urlToken)
          console.log('Token saved from URL parameters')
          
          // Remove token from URL for security
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
          
          // Use the token from URL
          setToken(urlToken)
          
          // Verify this token with the server
          const verifyResult = await verifyTokenWithServer(urlToken)
          if (verifyResult) {
            setUserEmail(verifyResult.email)
            setIsLoading(false)
            return
          }
        }

        // If no URL token or verification failed, check localStorage
        const storedToken = localStorage.getItem('adminToken')
        console.log('Checking stored token:', storedToken?.substring(0, 10) + '...')
        
        if (!storedToken) {
          setIsLoading(false)
          return
        }

        // Verify the localStorage token
        const verifyResult = await verifyTokenWithServer(storedToken)
        if (verifyResult) {
          setToken(storedToken)
          setUserEmail(verifyResult.email)
        } else {
          // Token invalid, remove it
          localStorage.removeItem('adminToken')
          setMessage('Your session has expired. Please log in again.')
          setIsError(true)
        }
      } catch (error) {
        console.error('Error in authentication process:', error)
        setMessage('An error occurred while verifying your session.')
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkAndSaveToken()
  }, [searchParams])

  // Helper function to verify token with server
  const verifyTokenWithServer = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error verifying token with server:', error)
      return null
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setUserEmail(null)
    router.push('/admin')
  }

  return {
    token,
    userEmail,
    isLoading,
    message,
    isError,
    setMessage,
    setIsError,
    logout
  }
}
