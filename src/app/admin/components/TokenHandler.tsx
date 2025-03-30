'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

/**
 * This component handles token extraction from URL parameters
 * and saves it to localStorage. It should be included in the
 * layout of all admin pages.
 */
function TokenHandlerComponent() {
  // Initialize state
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Mark component as mounted
    setMounted(true)
    
    // Only execute when the component is mounted on the client side
    if (mounted && searchParams) {
      // Extract token from URL if present
      const token = searchParams.get('token')
      
      if (token) {
        // Save token to localStorage
        localStorage.setItem('adminToken', token)
        console.log('Admin token saved from URL parameter')
        
        // Remove token from URL for security
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
      }
    }
  }, [searchParams, mounted])

  // This is a utility component that doesn't render anything visible
  return null
}

export default function TokenHandler() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenHandlerComponent />
    </Suspense>
  )
}