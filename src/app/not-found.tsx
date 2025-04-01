import Link from 'next/link';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const DynamicBackground = dynamic(
  () => import('../components/DynamicBackground'),
  { ssr: true }
);

export const metadata: Metadata = {
  title: 'Page Not Found | Zone 37',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-zone-dark to-black text-white flex items-center justify-center px-4 py-16 animate-gradient-pulse">
      <div className="absolute inset-0 z-0">
        <DynamicBackground />
      </div>
      <div className="max-w-md mx-auto text-center z-10 relative">
        <div className="relative mb-8 mx-auto w-32 h-32">
          {/* Radiation symbol */}
          <div className="absolute inset-0 bg-zone-gold rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-zone-gold">
              <circle cx="50" cy="50" r="20" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="8" fill="none">
                <circle cx="50" cy="50" r="40" />
                <path d="M50,10 50,30" />
                <path d="M50,70 50,90" />
                <path d="M10,50 30,50" />
                <path d="M70,50 90,50" />
                <path d="M26,26 39,39" />
                <path d="M61,61 74,74" />
                <path d="M26,74 39,61" />
                <path d="M61,39 74,26" />
              </g>
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 text-white">
          <span className="text-zone-gold">404</span> - ANOMALY DETECTED
        </h1>
        
        <p className="text-gray-300 mb-8">
          The path you're seeking doesn't exist in the Zone. Perhaps it's been consumed by an anomaly, or perhaps you took a wrong turn.
        </p>

        <div className="grid gap-4 mb-12">
          <p className="text-gray-400">
            Your PDA shows no records of this location.
          </p>
          <p className="text-amber-400 text-sm">
            Last known coordinates: Invalid
          </p>
        </div>

        <Link 
          href="/"
          className="inline-block px-8 py-3 bg-zone-gold hover:bg-zone-gold/80 text-zone-dark-brown font-medium rounded-lg transition-colors"
        >
          Return to Base Camp
        </Link>
      </div>
    </div>
  );
}
