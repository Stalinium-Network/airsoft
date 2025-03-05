'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type RegistrationPageProps = {
  params: any; // Using 'any' to match Next.js expected type
}

export default function RegistrationPage({ params }: RegistrationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameName, setGameName] = useState<string>('');
  
  useEffect(() => {
    // Get game name from URL parameters or fetch from API
    const name = searchParams?.get('name') || '';
    setGameName(decodeURIComponent(name));
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Registration for <span className="text-green-500">{gameName}</span>
        </h1>
        
        <div className="bg-green-900/20 border border-green-500/30 text-green-400 p-4 rounded-md mb-8">
          <p className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              This is a placeholder registration page for game ID: <span className="font-mono">{params.gameId}</span>.
              <br />
              In a real application, this would include a form to collect player information.
            </span>
          </p>
        </div>
        
        {/* Placeholder registration form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Experience Level
            </label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors">
              Complete Registration
            </button>
            <Link href={`/games/${params.gameId}`} className="block text-center text-sm text-green-400 hover:text-green-300 mt-3">
              Back to Event Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
