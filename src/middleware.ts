import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Path that requires authentication
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin/console')
  
  // Check for admin token
  if (isAdminPath) {
    // In middleware, we can't access localStorage, but we can check cookies
    // If you're using cookies for token storage instead of localStorage, uncomment this:
    // const token = request.cookies.get('adminToken')?.value
    
    // For demo purposes, let's assume we detected an unauthorized access
    // In a real app, you'd check the token validity here
    const isUnauthorized = false // Set to true to simulate 401 error
    
    if (isUnauthorized) {
      // Redirect to the custom 401 page
      return NextResponse.redirect(new URL('/not-authorized', request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specified paths
export const config = {
  matcher: ['/admin/:path*'],
}
