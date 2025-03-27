'use client'

interface ProgressBarProps {
  progress: number;
  show: boolean;
}

export default function ProgressBar({ progress, show }: ProgressBarProps) {
  if (!show) return null;
  
  return (
    <div className="mt-4">
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">{progress}%</p>
    </div>
  );
}