export default function LoadingGame() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Skeleton for hero section */}
      <div className="relative h-[50vh] w-full bg-gray-800 animate-pulse">
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-6xl mx-auto">
            <div className="w-24 h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-12 bg-gray-700 rounded w-3/4 mb-6"></div>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="w-36 h-5 bg-gray-700 rounded"></div>
              <div className="w-28 h-5 bg-gray-700 rounded"></div>
              <div className="w-40 h-5 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-6">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <div className="w-20 h-4 bg-gray-700 rounded"></div>
                  <div className="w-16 h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"></div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div className="w-28 h-4 bg-gray-700 rounded"></div>
                  <div className="w-16 h-6 bg-gray-700 rounded"></div>
                </div>
              </div>
              
              <div className="w-full h-10 bg-gray-700 rounded"></div>
            </div>

            {/* Map skeleton */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="aspect-video bg-gray-700 rounded mb-4"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-32 h-4 bg-gray-700 rounded"></div>
                <div className="w-40 h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}