'use client'

interface ProgressBarProps {
  progress: number;
  show: boolean;
}

export default function ProgressBar({ progress, show }: ProgressBarProps) {
  if (!show) return null;
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
      <div 
        className="bg-green-500 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
