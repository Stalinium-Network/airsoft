'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/utils/api'

// Create a client component specifically for reading search params
function SearchParamsReader() {
  const searchParams = new URL(window.location.href).searchParams
  return searchParams
}

export default function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAndSaveToken = async () => {
      try {
        // First check if we're in a browser environment
        if (typeof window === 'undefined') {
          return
        }

        // First check if there's a token in URL parameters (from OAuth redirect)
        const searchParamsObj = new URL(window.location.href).searchParams
        const urlToken = searchParamsObj.get('token')

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
  }, [])

  // Helper function to verify token with server using adminApi
  const verifyTokenWithServer = async (tokenToVerify: string) => {
    try {
      // Временно сохраняем текущий токен
      const currentToken = localStorage.getItem('adminToken');
      
      // Устанавливаем проверяемый токен для запроса
      localStorage.setItem('adminToken', tokenToVerify);
      
      // Используем adminApi.verifyToken вместо прямого fetch
      const result = await adminApi.verifyToken();
      
      // Восстанавливаем исходный токен если он отличался
      if (currentToken !== tokenToVerify) {
        if (currentToken) {
          localStorage.setItem('adminToken', currentToken);
        }
      }
      
      return result;
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
