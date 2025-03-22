import { Fraction } from '@/services/gameService';
import Image from 'next/image';

interface FractionListProps {
  fractions: Fraction[];
  isLoading: boolean;
  onEditFraction: (fraction: Fraction) => void;
  onDeleteFraction: (fractionId: string) => void;
}

export default function FractionList({
  fractions,
  isLoading,
  onEditFraction,
  onDeleteFraction,
}: FractionListProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-6">All Fractions</h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {!isLoading && fractions.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No fractions found. Create a new fraction to get started.
        </div>
      )}

      {/* Fraction grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fractions.map((fraction) => (
          <div
            key={fraction._id}
            className="bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-600"
          >
            {/* Fraction image */}
            <div className="h-40 relative">
              {fraction.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`}
                  alt={fraction.name || fraction._id}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-gray-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-xl font-bold text-white">{fraction.name || fraction._id}</h3>
              </div>
            </div>

            {/* Fraction info */}
            <div className="p-4">
              {fraction.shortDescription && (
                <p className="text-gray-300 mb-3 line-clamp-2">{fraction.shortDescription}</p>
              )}
              
              <div className="text-sm text-gray-400 mb-4">
                <div className="mb-1">
                  <span className="text-gray-500">ID:</span> {fraction._id}
                </div>
              </div>

              {/* Usage indicators - could show in how many games the fraction is used */}
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
                  Fraction
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditFraction(fraction)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteFraction(fraction._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
