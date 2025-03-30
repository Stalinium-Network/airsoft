'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// This is a client-only component that uses useSearchParams
function TokenHandlerClient() {
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

// The main component wrapped with Suspense
export default function TokenHandler() {
  // Use a dynamic import with Suspense to properly handle useSearchParams
  return (
    <Suspense fallback={null}>
      <TokenHandlerClient />
    </Suspense>
  )
}