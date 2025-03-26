'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// New ShareButton component
interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const [shareMessage, setShareMessage] = useState('');
  
  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support sharing
        await navigator.clipboard.writeText(shareData.url);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  const shareButtonClasses = "py-3 px-4 rounded-md transition-colors font-bold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center justify-center";
  
  return (
    <div className="relative">
      <button 
        onClick={handleShare} 
        className={`${shareButtonClasses} ${className}`}
        aria-label="Share this event"
        title="Share this event"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      
      {shareMessage && (
        <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-gray-800 text-xs text-green-400 rounded text-center border border-gray-700">
          {shareMessage}
        </div>
      )}
    </div>
  );
}

interface RegisterButtonProps {
  gameId: string;
  gameName: string;
  isPast: boolean;
  isFull: boolean;
  hasFractions?: boolean;
  registrationLink?: string;
  className?: string;
}

export default function RegisterButton({ 
  gameId, 
  gameName, 
  isPast, 
  isFull,
  hasFractions = false,
  registrationLink = '',
  className = '' 
}: RegisterButtonProps) {
  const router = useRouter();
  
  const handleRegister = () => {
    // Проверяем, что ссылка существует и перенаправляем только если она есть
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    }
    // Убираем перенаправление на страницу деталей, если ссылки нет
  };
  
  // Base button classes
  const baseClasses = "py-3 rounded-md transition-colors font-bold flex items-center justify-center gap-2";
  
  // Refactored ButtonContainer that doesn't take children
  const ButtonContainer = () => {
    // Determine which register button to render based on props
    let registerButton;
    
    if (isPast) {
      registerButton = (
        <div className={`${baseClasses} bg-gray-700 text-white cursor-not-allowed w-full`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Event has ended
        </div>
      );
    } else if (isFull) {
      registerButton = (
        <button 
          onClick={handleRegister}
          className={`${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white group w-full`}
          disabled={!registrationLink}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          You can still register
        </button>
      );
    } else if (!registrationLink) {
      // Новый случай: нет ссылки регистрации
      registerButton = (
        <div className={`${baseClasses} bg-gray-600 text-gray-400 cursor-not-allowed w-full`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registration Unavailable
        </div>
      );
    } else {
      registerButton = (
        <button 
          onClick={handleRegister}
          className={`${baseClasses} bg-green-500 hover:bg-green-600 text-gray-900 group w-full`}
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
    
    return (
      <div className={`flex ${className}`}>
        <div className="w-full mr-2">{registerButton}</div>
        <ShareButton 
          title={gameName} 
          text={`Check out this STALKER airsoft event: ${gameName}`}
          url={typeof window !== 'undefined' ? `${window.location.origin}/games/${gameId}` : `/games/${gameId}`}
        />
      </div>
    );
  };
  
  // Simplified main component return
  return <ButtonContainer />;
}
