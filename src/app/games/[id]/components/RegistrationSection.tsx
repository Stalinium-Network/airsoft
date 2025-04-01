import dynamic from "next/dynamic";

// Динамически импортируем RegisterButton как клиентский компонент
const RegisterButton = dynamic(() => import('@/components/RegisterButton'));

interface RegistrationSectionProps {
  game: {
    _id: string;
    name: string;
    price: number;
    isPast: boolean;
    registrationLink?: string;
    factions?: any[];
  };
  capacity: {
    total: number;
    filled: number;
    percentFilled: number;
    spotsLeft: number;
  };
  isFull: boolean;
}

export default function RegistrationSection({ game, capacity, isFull }: RegistrationSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-6">
      {/* Новый заголовок с градиентом */}
      <div className="bg-gradient-to-r from-green-900 to-gray-800 p-5 border-b border-gray-700">
        <h3 className="text-xl font-bold flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Registration
        </h3>
      </div>
      
      <div className="p-5">
        
          {/* Capacity visualization с улучшенным дизайном */}
          <div className="p-4">
            <div className="flex justify-between items-center text-sm mb-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">Total Capacity</span>
              </div>
              <span className="font-bold text-green-400">
                {capacity.filled}/{capacity.total}
              </span>
            </div>
            
            {/* Improved progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full ${
                  capacity.percentFilled < 30
                    ? "bg-gradient-to-r from-green-600 to-green-400"
                    : capacity.percentFilled < 70
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                    : "bg-gradient-to-r from-red-600 to-red-400"
                } transition-all duration-500 ease-in-out`}
                style={{ width: `${capacity.percentFilled}%` }}
              ></div>
            </div>
            
            {/* Summary text */}
            {!game.isPast && (
              <div className="text-center">
                {capacity.spotsLeft > 0 ? (
                  <p className="text-sm font-medium">
                    <span className="text-green-400 font-bold">{capacity.spotsLeft}</span> 
                    <span className="text-gray-300"> spots remaining</span>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-400">
                    No spots available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Price section with improved design */}
        {/* {!game.isPast && (
          <div className="mb-6 bg-gray-750 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300">Price per person</span>
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-lg">
                <span className="text-2xl font-bold text-green-400">
                  ${game.price}
                </span>
              </div>
            </div>
          </div>
        )} */}
        
        {/* Register button with improved styling */}
        {!game.isPast && (
          <div className="mt-4 px-2">
            <RegisterButton
              gameId={game._id.toString()}
              gameName={game.name}
              isPast={game.isPast}
              isFull={isFull}
              hasFactions={game.factions && game.factions.length > 0}
              registrationLink={game.registrationLink}
              className="w-full py-3 text-base font-medium"
            />
            
            {/* Additional information text */}
            {/* <p className="text-xs text-center text-gray-400 mt-2">
              {isFull 
                ? "This event is currently full. Check back later for possible openings."
                : "Secure your spot now. Registration details will be sent via email."}
            </p> */}
          </div>
        )}
        
        {/* Информация о фракциях с улучшенным дизайном */}
        {/* {game.factions && game.factions.length > 0 && !game.isPast && (
          <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-750 p-4 rounded-lg border border-gray-700 shadow-inner">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-300 font-medium">Choose your faction below</p>
            </div>
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )} */}
      </div>
  );
}
