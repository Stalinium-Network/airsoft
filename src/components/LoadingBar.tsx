'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
})

export default function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Start progress bar when navigation starts
    NProgress.start()
    
    // Complete the progress bar when navigation finishes
    const timeoutId = setTimeout(() => {
      NProgress.done()
    }, 300)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [pathname, searchParams]) // This effect runs when the route changes
  
  return null // This component doesn't render anything visible
}
