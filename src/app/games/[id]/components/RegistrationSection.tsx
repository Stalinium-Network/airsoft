import { calculateAvailableSlots } from "@/components/home/calculateAvailableSlots";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { GameFaction, RegistrationInfo } from "@/services/gameService";

interface RegistrationSectionProps {
  regInfo: RegistrationInfo;
  factions: GameFaction[];
}

// Серверная функция для расчета и форматирования оставшегося времени
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

// Проверка, осталось ли менее 2 недель до закрытия
function isLessThanTwoWeeks(closeDateStr: string | null): boolean {
  if (!closeDateStr) return false;
  
  const closeDate = new Date(closeDateStr);
  const now = new Date();
  const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 2 недели в миллисекундах
  
  return closeDate.getTime() - now.getTime() < twoWeeks;
}

export default function RegistrationSection({
  regInfo,
  factions,
}: RegistrationSectionProps) {
  const { total, available, filled } = calculateAvailableSlots(factions);
  const progressPercentage = (filled / total) * 100;
  
  // Рассчитываем время до открытия регистрации
  const timeUntilOpen = regInfo.status === 'not-open' && regInfo.opens 
    ? calculateTimeRemaining(regInfo.opens) 
    : null;
    
  // Рассчитываем время до закрытия регистрации
  const timeUntilClose = regInfo.closes 
    ? calculateTimeRemaining(regInfo.closes) 
    : null;
    
  // Проверяем, меньше ли 2 недель осталось до конца регистрации
  const closingSoon = isLessThanTwoWeeks(regInfo.closes);

  return (
    <div className="mx-auto flex flex-col items-center max-w-2xl mt-16">
      <div className="text-center bg-red-800/80 p-4 pb-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Your gear must match your faction!</h1>
        <p className="mt-8">
          If you show up in the wrong camo, you will not be allowed to play.
          Your registration fee will not be refunded. Don't be that guy - read
          the rules! Still have questions? Ask on Discord.
        </p>
      </div>
      
      <div className="bg-zone-dark-light w-full p-6 my-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">
          {regInfo.status === 'open' 
            ? "Registration is now open!"
            : regInfo.status === 'not-open'
              ? "Registration is not yet open"
              : "Registration is closed"}
        </h2>
        
        {/* Информация о начале регистрации, если она еще не открыта */}
        {regInfo.status === 'not-open' && timeUntilOpen && (
          <div className="bg-zone-dark p-3 rounded-lg mb-4">
            <p className="text-zone-gold-lite font-medium">
              Registration will open in:
            </p>
            <p className="text-xl font-bold text-white mt-1">{timeUntilOpen.text}</p>
          </div>
        )}
        
        {regInfo.status === 'open' && (
          <>
            {regInfo.link && (
              <a
                href={regInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-zone-gold-lite text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors mb-4"
              >
                Register Now
              </a>
            )}
            
            {/* Предупреждение о скором закрытии регистрации (менее 2 недель) */}
            {timeUntilClose && closingSoon && (
              <div className="bg-red-700/50 p-3 rounded-lg mb-4 mt-4 border border-red-600/50">
                <p className="text-white font-medium text-base">
                  Registration closes soon!
                </p>
                <p className="text-lg font-bold text-white">Only {timeUntilClose.text} remaining</p>
              </div>
            )}
            
            {/* Обычное отображение времени до закрытия регистрации */}
            {timeUntilClose && !closingSoon && (
              <p className="text-gray-400 text-sm mt-2 mb-4">
                Registration closes in {timeUntilClose.text}
              </p>
            )}
          </>
        )}

        <div className="mb-4 mt-4">
          <p className="text-gray-300 font-medium mb-2">
            Total player slots: {total}
          </p>
          <div className="relative w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-zone-gold-lite h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {filled} / {total} slots filled
          </p>
        </div>

        {regInfo.details && (
          <div className="mt-4 text-left">
            <MarkdownRenderer content={regInfo.details} />
          </div>
        )}
      </div>
      <p className="text-gray-400 mt-4 text-center">
        Registration will close when factions become full or two weeks before
        the event, whichever comes first. Only online registration. No walk-in
        registration whatsoever!
      </p>
    </div>
  );
}
