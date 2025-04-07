export default function LoadingGame() {
  return (
    <div className="min-h-screen bg-zone-dark text-white">
      {/* Skeleton for hero section */}
      <div className="relative h-[50vh] w-full bg-gray-800/50 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-zone-dark to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="w-24 h-5 bg-gray-700/80 rounded mb-4"></div>
            <div className="h-10 md:h-12 bg-gray-700/80 rounded-lg w-3/4 mb-6"></div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="w-36 h-5 bg-gray-700/80 rounded"></div>
              <div className="w-28 h-5 bg-gray-700/80 rounded"></div>
              <div className="w-40 h-5 bg-gray-700/80 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Main content skeleton */}
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            {/* Game description section */}
            <div className="bg-zone-dark-light rounded-lg p-5 md:p-6 shadow-lg border border-gray-700/50">
              <div className="h-7 bg-gray-700/80 rounded-md w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-4/5"></div>
              </div>
            </div>

            {/* Game details/rules section */}
            <div className="bg-zone-dark-light rounded-lg p-5 md:p-6 shadow-lg border border-gray-700/50">
              <div className="h-7 bg-gray-700/80 rounded-md w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-11/12"></div>
                <div className="h-16 bg-gray-700/60 rounded-md w-full mt-5"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-full"></div>
                <div className="h-4 bg-gray-700/80 rounded-md w-3/4"></div>
              </div>
            </div>

            {/* Faction cards skeleton */}
            <div className="space-y-4">
              <div className="h-7 bg-gray-700/80 rounded-md w-1/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-zone-dark-light rounded-lg overflow-hidden border border-gray-700/50 shadow-lg"
                  >
                    <div className="h-32 bg-gray-700/60"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-700/80 rounded-md w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-700/80 rounded-md w-full mb-2"></div>
                      <div className="h-4 bg-gray-700/80 rounded-md w-5/6"></div>
                      <div className="mt-4 flex justify-between">
                        <div className="h-5 bg-gray-700/80 rounded-md w-1/3"></div>
                        <div className="h-5 bg-gray-700/80 rounded-md w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Registration section skeleton */}
            <div className="bg-zone-dark-light rounded-lg p-5 shadow-lg border border-gray-700/50">
              <div className="h-6 bg-gray-700/80 rounded-md w-2/3 mb-4"></div>

              {/* Price timeline skeleton */}
              <div className="my-6">
                <div className="w-full h-6 bg-gray-700/80 rounded-md mb-4"></div>
                <div className="relative h-12 my-6">
                  <div className="absolute w-full h-1 bg-gray-700/80 rounded-full top-4"></div>
                  <div className="absolute w-1/3 h-1 bg-amber-500/80 rounded-full top-4"></div>
                </div>
                <div className="w-full h-8 bg-amber-900/30 border border-amber-500/30 rounded-md mb-4"></div>
                <div className="w-full h-10 bg-gray-700/80 rounded-md mb-4"></div>

                {/* Registration progress */}
                <div className="mt-6">
                  <div className="h-5 bg-gray-700/80 rounded-md w-1/2 mb-2"></div>
                  <div className="w-full bg-gray-700/80 rounded-full h-4 mb-2">
                    <div
                      className="bg-zone-gold-lite h-4 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="h-4 bg-gray-700/80 rounded-md w-1/3 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Location map skeleton */}
            <div className="bg-zone-dark-light rounded-lg p-5 shadow-lg border border-gray-700/50">
              <div className="h-6 bg-gray-700/80 rounded-md w-1/2 mb-4"></div>
              <div className="aspect-video bg-gray-700/60 rounded-md mb-4"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-3/4 h-5 bg-gray-700/80 rounded-md"></div>
                <div className="w-2/3 h-4 bg-gray-700/80 rounded-md"></div>
              </div>
            </div>

            {/* Share button skeleton */}
            <div className="flex mt-4">
              <div className="bg-gray-700/80 rounded-md h-12 flex-grow mr-2"></div>
              <div className="bg-gray-700/80 rounded-md h-12 w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
