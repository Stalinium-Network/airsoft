'use client'

import { useRouter } from 'next/navigation';

interface RegisterButtonProps {
  gameId: string;
  gameName: string;
  isPast: boolean;
  isFull: boolean;
  className?: string;
}

export default function RegisterButton({ 
  gameId, 
  gameName, 
  isPast, 
  isFull, 
  className = '' 
}: RegisterButtonProps) {
  const router = useRouter();
  
  const handleRegister = () => {
    // Implement registration logic
    // For now, navigate to registration page with gameId
    router.push(`/registration/${gameId}?name=${encodeURIComponent(gameName)}`);
  };
  
  // Base button classes
  const baseClasses = "py-3 rounded-md transition-colors font-bold flex items-center justify-center gap-2";
  
  // Past event - disabled state
  if (isPast) {
    return (
      <div className={`${baseClasses} bg-gray-700 text-white cursor-not-allowed ${className}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Event has ended
      </div>
    );
  }
  
  // Full but still possible to register
  if (isFull) {
    return (
      <button 
        onClick={handleRegister}
        className={`${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white group ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        You can still register
      </button>
    );
  }
  
  // Available for registration
  return (
    <button 
      onClick={handleRegister}
      className={`${baseClasses} bg-green-500 hover:bg-green-600 text-gray-900 group ${className}`}
    >
      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" 
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
              clipRule="evenodd" />
      </svg>
      Register Now
    </button>
  );
}
