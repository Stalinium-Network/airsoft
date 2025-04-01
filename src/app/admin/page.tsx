'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Улучшенные стили для анимации с поддержкой адаптивности
const floatingPanelStyles = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  @keyframes float2 {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(15px) rotate(-1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .float-panel-1 {
    animation: float 8s ease-in-out infinite;
  }
  
  .float-panel-2 {
    animation: float2 12s ease-in-out infinite;
  }
  
  .float-panel-3 {
    animation: float 15s ease-in-out infinite;
  }
  
  .pulse-glow {
    animation: pulse 3s ease-in-out infinite;
  }
  
  .gradient-bg {
    background: linear-gradient(-45deg, #1a2e44, #0f172a, #1e293b, #0d1325);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
  }
`;

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
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 sm:px-6 py-12 relative">
      {/* Добавляем стили анимации */}
      <style jsx global>{floatingPanelStyles}</style>
      
      {/* Улучшенные декоративные фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
        
        {/* Увеличенный размытый световой эффект */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-blue-500/10 blur-3xl pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 sm:w-[30rem] sm:h-[30rem] rounded-full bg-purple-500/10 blur-3xl pulse-glow"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full bg-indigo-500/5 blur-3xl pulse-glow" style={{animationDelay: '1s'}}></div>
        
        {/* Адаптивные плавающие панели, скрываемые на маленьких экранах */}
        <div className="block absolute top-[10%] left-[15%] w-64 h-40 float-panel-1">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 shadow-2xl">
            <div className="text-xs text-gray-400 mb-2 flex justify-between">
              <span>System Metrics</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            <div className="h-20 flex items-end space-x-1">
              {[40, 60, 30, 85, 45, 70, 55, 65, 40, 90, 30, 75, 50, 60, 40].map((h, i) => (
                <div 
                  key={i} 
                  className="w-3 bg-blue-500/50 hover:bg-blue-400/70 transition-colors rounded-t"
                  style={{height: `${h}%`}}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <div className="w-16 h-2 bg-gray-600/60 rounded"></div>
              <div className="w-10 h-2 bg-gray-600/60 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block absolute top-[60%] right-[10%] w-56 h-64 float-panel-2">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 shadow-2xl h-full">
            <div className="text-xs text-gray-400 mb-3 flex justify-between">
              <span>Access Logs</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="flex items-center mb-3 group">
                <div className="w-6 h-6 rounded-full bg-gray-700/60 group-hover:bg-gray-600/70 transition-colors mr-2"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-700/60 group-hover:bg-gray-600/70 transition-colors rounded mb-1 w-full"></div>
                  <div className="h-2 bg-gray-700/40 group-hover:bg-gray-600/50 transition-colors rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:block absolute bottom-[15%] left-[20%] w-72 h-48 float-panel-3">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 shadow-2xl h-full">
            <div className="text-xs text-gray-400 mb-2 flex justify-between">
              <span>Security Status</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="bg-gray-700/30 hover:bg-gray-700/40 transition-colors rounded p-2 group">
                  <div className="h-2 bg-gray-600/60 rounded mb-2 w-3/4"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-green-500/30 group-hover:bg-green-500/40 transition-colors flex items-center justify-center mr-2">
                      <div className="w-4 h-4 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-600/40 rounded mb-1 w-full"></div>
                      <div className="h-2 bg-gray-600/30 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Адаптивный логотип */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Image 
            src="/logo-header.svg" 
            alt="Logo" 
            width={120} 
            height={40} 
            className="h-10 sm:h-12 w-auto transition-transform hover:scale-105" 
          />
        </div>
        
        <div className="bg-gray-900/85 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all hover:shadow-blue-900/20">
          {/* Улучшенный акцент */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
          
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-medium text-white mb-1 sm:mb-2">Admin Portal</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">Secure authentication required for administrative access</p>
            
            {message && (
              <div className={`p-3 sm:p-4 mb-6 rounded-lg text-xs sm:text-sm ${
                isError 
                  ? 'bg-red-900/30 border border-red-800 text-red-200' 
                  : 'bg-green-900/30 border border-green-800 text-green-200'
              }`}>
                {message}
              </div>
            )}
            
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-gray-800/80 hover:bg-gray-700/90 text-white py-3 sm:py-3.5 px-4 rounded-lg border border-gray-700/80 transition-all hover:shadow-lg hover:shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <Image 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google logo" 
                width={20} 
                height={20}
                className="h-5 w-5"
              />
              <span className="font-medium">Sign in with Google</span>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300">Security Notice</h3>
                <p className="text-xs text-gray-500">This area is restricted to authorized personnel only. All access attempts are logged and monitored.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-950/80 px-6 sm:px-8 py-3 sm:py-4 text-xs text-gray-500 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span>Storage: {typeof window !== 'undefined' && window.localStorage ? 'Available' : 'Unavailable'}</span>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 pulse-glow"></span>
                <span className="text-gray-400">System online</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-5 sm:mt-6 text-center text-xs text-gray-500">
          Having trouble logging in? <span className="text-gray-400 hover:text-blue-400 transition-colors">Contact your system administrator</span>
        </p>
      </div>
    </div>
  )
}
