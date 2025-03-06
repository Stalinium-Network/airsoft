'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has a token
    const storedToken = localStorage.getItem('adminToken')
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    // Verify the token with the server
    const verifyToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setToken(storedToken)
          setUserEmail(data.email)
        } else {
          // Token invalid, remove it
          console.error('Invalid token')
          localStorage.removeItem('adminToken')
          setMessage('Your session has expired. Please log in again.')
          setIsError(true)
        }
      } catch (error) {
        console.error('Error verifying token:', error)
        setMessage('An error occurred while verifying your session.')
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

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
