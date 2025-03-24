import React from 'react';

interface ModalHeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  isLoading?: boolean;
  color?: string;
}

export default function ModalHeader({ 
  title, 
  icon, 
  onClose, 
  isLoading = false,
  color = 'text-green-500'
}: ModalHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-700 p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
      <h3 className="text-xl font-bold text-white flex items-center">
        <span className={`mr-2 ${color}`}>{icon}</span>
        <span className="truncate">{title}</span>
      </h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors p-1"
        disabled={isLoading}
        aria-label="Close"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
