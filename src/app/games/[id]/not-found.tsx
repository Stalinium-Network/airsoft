import Link from 'next/link';

export default function GameNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-green-500 mb-6">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Game Not Found</h2>
        <p className="text-gray-400 mb-8">
          The game you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
