import { calculateAvailableSlots } from "@/components/home/calculateAvailableSlots";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { GameFaction, PricePeriod, RegistrationInfo } from "@/services/gameService";

interface RegistrationSectionProps {
  regInfo: RegistrationInfo;
  factions: GameFaction[];
  prices: PricePeriod[];
  currentPrice: number | null;
}

// Server function to calculate and format remaining time
function calculateTimeRemaining(targetDateStr: string | null): { days: number; hours: number; text: string } | null {
  if (!targetDateStr) return null;
  
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  
  if (isNaN(targetDate.getTime())) return null;
  
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return {
    days,
    hours,
    text: `${days} ${days === 1 ? 'day' : 'days'} and ${hours} ${hours === 1 ? 'hour' : 'hours'}`
  };
}

// Check if less than one week remains
function isLessThanOneWeek(dateStr: string | null): boolean {
  if (!dateStr) return false;
  
  const targetDate = new Date(dateStr);
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
  
  return targetDate.getTime() - now.getTime() < oneWeek;
}

// Find current price period
function getCurrentPricePeriod(prices: PricePeriod[]): { 
  current: PricePeriod | null; 
  next: PricePeriod | null;
  index: number 
} {
  if (!prices || prices.length === 0) {
    return { current: null, next: null, index: -1 };
  }

  const now = new Date();
  
  for (let i = 0; i < prices.length; i++) {
    const period = prices[i];
    const startDate = new Date(period.starts);
    const endDate = period.ends ? new Date(period.ends) : null;
    
    if (now >= startDate && (!endDate || now < endDate)) {
      return { 
        current: period, 
        next: i < prices.length - 1 ? prices[i + 1] : null,
        index: i 
      };
    }
  }
  
  // If we're before the first period
  if (now < new Date(prices[0].starts)) {
    return { current: null, next: prices[0], index: -1 };
  }
  
  // If we're after the last period
  const lastPeriod = prices[prices.length - 1];
  if (lastPeriod.ends && now >= new Date(lastPeriod.ends)) {
    return { current: null, next: null, index: -1 };
  }
  
  return { current: prices[prices.length - 1], next: null, index: prices.length - 1 };
}

// Format date nicely
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  });
}

export default function RegistrationSection({
  regInfo,
  factions,
  prices,
  currentPrice
}: RegistrationSectionProps) {
  const { total, available, filled } = calculateAvailableSlots(factions);
  const progressPercentage = (filled / total) * 100;
  
  // Find current price period and next price period
  const { current: currentPeriod, next: nextPeriod, index: currentPeriodIndex } = getCurrentPricePeriod(prices);
  
  // Calculate time until next price change
  const timeUntilNextPrice = nextPeriod ? calculateTimeRemaining(nextPeriod.starts) : null;
  
  // Get the last price period for registration closing info
  const lastPeriod = prices && prices.length > 0 ? prices[prices.length - 1] : null;
  const registrationEndDate = lastPeriod?.ends || null;
  
  // Calculate time until registration closes
  const timeUntilClose = registrationEndDate ? calculateTimeRemaining(registrationEndDate) : null;
  
  // Check if registration closes soon (less than one week)
  const closingSoon = isLessThanOneWeek(registrationEndDate);

  // Determine if we should show the price progression
  const showPriceProgression = prices && prices.length > 1;
  
  return (
    <div className="mx-auto flex flex-col items-center w-full max-w-2xl mt-8 md:mt-16 px-4 sm:px-0">
      {/* Warning Banner */}
      <div className="text-center bg-red-800/80 p-4 pb-6 rounded-xl w-full shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Your gear must match your faction!</h1>
        <p className="mt-4 sm:mt-8 text-sm sm:text-base">
          If you show up in the wrong camo, you will not be allowed to play.
          Your registration fee will not be refunded. Don't be that guy - read
          the rules! Still have questions? Ask on Discord.
        </p>
      </div>
      
      {/* Registration Info Card */}
      <div className="bg-zone-dark-light w-full p-5 sm:p-6 my-6 sm:my-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">
          {regInfo.status === 'open' 
            ? "Registration is now open!"
            : regInfo.status === 'not-open'
              ? "Registration is not yet open"
              : "Registration is closed"}
        </h2>
        
        {/* Price progression timeline - only show if multiple price periods exist */}
        {showPriceProgression && regInfo.status === 'open' && (
          <div className="my-6">
            <div className="mb-4 flex flex-col sm:flex-row items-center sm:justify-between">
              <h3 className="text-amber-400 font-medium mb-2 sm:mb-0">Pricing Timeline</h3>
              {currentPrice !== null && (
                <span className="text-white font-bold text-xl">${currentPrice} USD</span>
              )}
            </div>
            
            {/* Timeline component - improved design with dots on the line */}
            <div className="relative pb-14 my-8">
              {/* Timeline container with proper spacing */}
              <div className="relative h-1 w-full">
                {/* Base timeline line */}
                <div className="absolute h-1 w-full bg-gray-700 rounded-full"></div>
                
                {/* Active progress line */}
                {currentPeriodIndex >= 0 && (
                  <div 
                    className="absolute h-1 bg-amber-400 rounded-full"
                    style={{ 
                      width: `${
                        Math.min(
                          ((new Date().getTime() - new Date(prices[0].starts).getTime()) / 
                          (new Date(registrationEndDate || prices[prices.length - 1].starts).getTime() - 
                          new Date(prices[0].starts).getTime())) * 100,
                          100
                        )
                      }%` 
                    }}
                  ></div>
                )}
                
                {/* Price points directly on the line */}
                {prices.map((period, idx) => {
                  // Calculate position percentage based on time between first and last date
                  const firstDate = new Date(prices[0].starts).getTime();
                  const lastDate = registrationEndDate 
                    ? new Date(registrationEndDate).getTime()
                    : new Date(prices[prices.length - 1].starts).getTime() + (14 * 24 * 60 * 60 * 1000); // Add 2 weeks if no end date
                  
                  const periodDate = new Date(period.starts).getTime();
                  const position = ((periodDate - firstDate) / (lastDate - firstDate)) * 100;
                  
                  const isActive = idx === currentPeriodIndex;
                  
                  return (
                    <div 
                      key={`price-point-${idx}`}
                      className="absolute"
                      style={{ 
                        left: `${Math.min(Math.max(position, 0), 100)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {/* Price point marker on the line */}
                      <div className="relative">
                        <div 
                          className={`relative rounded-full border-2 ${
                            isActive 
                              ? 'w-5 h-5 bg-amber-400 border-amber-500 -top-2' 
                              : 'w-3 h-3 bg-gray-600 border-gray-500 -top-1'
                          } z-10`}
                        ></div>
                        
                        {/* Price and date labels below the line */}
                        <div className={`absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center`}>
                          <div 
                            className={`mt-1 ${isActive 
                              ? 'text-amber-400 font-bold' 
                              : 'text-gray-400'} text-sm whitespace-nowrap`}
                          >
                            ${period.price}
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(period.starts)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Registration end indicator on the line */}
                {registrationEndDate && (
                  <div 
                    className="absolute"
                    style={{ 
                      left: '100%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="relative">
                      <div className="relative rounded-full w-3 h-3 bg-red-500 border-2 border-red-600 -top-1 z-10"></div>
                      
                      {/* End label below the line */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="mt-1 text-red-400 text-sm font-medium whitespace-nowrap">
                          Closes
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(registrationEndDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Time until next price change */}
            {timeUntilNextPrice && (
              <div className="mt-2 bg-amber-900/30 border border-amber-500/30 rounded-md p-3 shadow-inner">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-gray-300">Price increases in </span>
                    <span className="text-amber-400 font-bold">{timeUntilNextPrice.text}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {regInfo.status === 'open' && (
          <>
            {regInfo.link && (
              <a
                href={regInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-zone-gold-lite text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors mb-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
              >
                Register Now
              </a>
            )}
            
            {/* Warning about registration closing soon (less than one week) */}
            {timeUntilClose && closingSoon && (
              <div className="bg-red-700/50 p-4 rounded-lg mb-4 mt-5 border border-red-600/50 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-center sm:text-left">
                    <p className="text-white font-medium text-base">
                      Registration closes soon!
                    </p>
                    <p className="text-lg font-bold text-white">Only {timeUntilClose.text} remaining</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Normal display of time until registration closes */}
            {timeUntilClose && !closingSoon && (
              <p className="text-gray-400 text-sm mt-3 mb-4">
                Registration closes in {timeUntilClose.text}
              </p>
            )}
          </>
        )}

        {/* Slot progress bar */}
        <div className="mb-4 mt-6">
          <p className="text-gray-300 font-medium mb-2">
            Total player slots: {total}
          </p>
          <div className="relative w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-zone-gold-lite h-4 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {filled} / {total} slots filled
          </p>
        </div>

        {/* Details section */}
        {regInfo.details && (
          <div className="mt-6 text-left px-1 sm:px-2">
            <MarkdownRenderer content={regInfo.details} />
          </div>
        )}
      </div>
      
      {/* Footer note */}
      <p className="text-gray-400 mt-4 text-center text-sm sm:text-base px-2 sm:px-0">
        Registration will close when factions become full or when the registration period ends,
        whichever comes first. Only online registration. No walk-in registration whatsoever!
      </p>
    </div>
  );
}
