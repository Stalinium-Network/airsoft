import { calculateAvailableSlots } from "@/components/home/calculateAvailableSlots";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  GameFaction,
  PricePeriod,
  RegistrationInfo,
} from "@/services/gameService";
import { useMemo } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { LuCalendarDays, LuClock8, LuInfo } from "react-icons/lu";

interface RegistrationSectionProps {
  regInfo: RegistrationInfo;
  factions: GameFaction[];
  prices: PricePeriod[];
  currentPrice: number | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  text: string;
}

function calculateTimeRemaining(targetDateStr: string | null): TimeRemaining | null {
  if (!targetDateStr) return null;
  try {
    const targetDate = new Date(targetDateStr);
    if (isNaN(targetDate.getTime())) throw new Error("Invalid date");
    const diff = targetDate.getTime() - new Date().getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    let text = "";
    if (days > 0) text += `${days} ${days === 1 ? "day" : "days"}`;
    if (days > 0 && hours > 0) text += " and ";
    if (hours > 0) text += `${hours} ${hours === 1 ? "hour" : "hours"}`;
    if (text === "") text = "less than an hour";
    return { days, hours, text };
  } catch (error) {
    console.error("Error calculating time remaining:", targetDateStr, error);
    return null;
  }
}

function isLessThanOneWeek(dateStr: string | null): boolean {
  if (!dateStr) return false;
  try {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) return false;
    const oneWeek = 604800000; // 7 * 24 * 60 * 60 * 1000
    return targetDate.getTime() - new Date().getTime() < oneWeek;
  } catch {
    return false;
  }
}

function findPricePeriods(prices: PricePeriod[]): {
  current: PricePeriod | null;
  next: PricePeriod | null;
  currentIndex: number;
} {
  if (!prices || prices.length === 0) {
    return { current: null, next: null, currentIndex: -1 };
  }
  const now = new Date().getTime();
  let current: PricePeriod | null = null;
  let next: PricePeriod | null = null;
  let currentIndex = -1;

  // Ensure prices are sorted by start date
  const sortedPrices = prices.slice().sort((a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime());

  for (let i = 0; i < sortedPrices.length; i++) {
    const period = sortedPrices[i];
    const start = new Date(period.starts).getTime();
    const end = period.ends ? new Date(period.ends).getTime() : Infinity;

    if (isNaN(start)) continue; // Skip invalid periods

    // Check if 'now' is within the current period
    if (now >= start && now < end) {
      current = period;
      currentIndex = i;
      // Find the next period if it exists
      if (i + 1 < sortedPrices.length) {
        next = sortedPrices[i + 1];
      }
      break; // Found the current period, no need to check further
    }

    // If we haven't found the current period yet and 'now' is before this period's start,
    // this period is the 'next' one (assuming no earlier period becomes 'current')
    if (current === null && now < start) {
      if (next === null) { // Only set the first future period as 'next'
        next = period;
      }
    }
  }

  // Edge case: If no period was found as 'current' or 'next' (e.g., time is before the very first period starts)
  if (current === null && next === null && sortedPrices.length > 0 && now < new Date(sortedPrices[0].starts).getTime()) {
    next = sortedPrices[0];
  }

  // Edge case: Handle situation where 'now' might be exactly on or after the last period's start but before its end (if defined)
  // This is technically covered by the main loop, but good to be mindful of.
  // The original code had a check here, but it seems redundant with the sorted array logic.

  return { current, next, currentIndex };
}


function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (error) {
    console.error("Error formatting date:", dateStr, error);
    return "Invalid Date";
  }
}

export default function RegistrationSection({
  regInfo,
  factions,
  prices,
  currentPrice,
}: RegistrationSectionProps) {
  const {
    totalSlots,
    filledSlots,
    progressPercentage,
    sortedPrices,
    nextPeriod,
    currentPeriodIndex,
    registrationEndDate,
    timeUntilNextPrice,
    timeUntilClose,
    closingSoon,
    showPriceProgression,
    timelineProgressPercent,
  } = useMemo(() => {
    const { total, filled } = calculateAvailableSlots(factions);
    const slotProgress = total > 0 ? (filled / total) * 100 : 0;
    // Sorting is now handled inside findPricePeriods, but we still need the sorted list here
    const sorted = prices.slice().sort((a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime());
    const { current, next, currentIndex } = findPricePeriods(sorted); // Use the sorted list

    const firstPeriod = sorted.length > 0 ? sorted[0] : null;
    const lastPeriod = sorted.length > 0 ? sorted[sorted.length - 1] : null;
    const regStartDate = firstPeriod ? new Date(firstPeriod.starts).getTime() : null;
    // Use the explicit end date of the *last* period if available
    const regEndDate = lastPeriod?.ends ? new Date(lastPeriod.ends).getTime() : null;

    // For timeline calculation, use the end date if defined, otherwise, approximate based on the start of the last period?
    // Let's refine: If the last period has an end date, use that. If not, the timeline conceptually ends when the last period starts.
    // However, for showing *progress*, we need a defined endpoint if the last period doesn't have one.
    // Let's assume if the last period has no end date, registration effectively stays open indefinitely *at that price*
    // until explicitly closed or the game happens. For timeline % calculation, maybe cap it based on the *next* period start if available?
    // Or, if the current period is the last one and has no end date, maybe the timeline should just show 100% once that period starts?

    let timelineProgress = 0;
    const now = new Date().getTime();
    const effectiveTimelineEndDate = regEndDate; // Use the actual end date if available

    if (regStartDate && effectiveTimelineEndDate && regStartDate < effectiveTimelineEndDate) {
      const totalDuration = effectiveTimelineEndDate - regStartDate;
      const elapsed = Math.max(0, now - regStartDate);
      timelineProgress = Math.min(100, (elapsed / totalDuration) * 100);
    } else if (regStartDate && now >= regStartDate && current !== null && !effectiveTimelineEndDate && currentIndex === sorted.length - 1) {
      // If we are in the last period and it has no end date, consider timeline complete for progression visualization
      timelineProgress = 100;
    } else if (regStartDate && now < regStartDate) {
      // Before registration starts
      timelineProgress = 0;
    } else if (effectiveTimelineEndDate && now >= effectiveTimelineEndDate) {
       // After registration ends
       timelineProgress = 100;
    }
    // Case: Registration started, but we are between periods (shouldn't happen with `findPricePeriods` logic)
    // Case: No periods defined (regStartDate is null) -> timelineProgress remains 0

    const regEndDateStr = lastPeriod?.ends || null;

    return {
      totalSlots: total,
      filledSlots: filled,
      progressPercentage: slotProgress,
      sortedPrices: sorted, // return the sorted list for rendering
      nextPeriod: next,
      currentPeriodIndex: currentIndex,
      registrationEndDate: regEndDateStr,
      timeUntilNextPrice: next ? calculateTimeRemaining(next.starts) : null,
      timeUntilClose: regEndDateStr ? calculateTimeRemaining(regEndDateStr) : null,
      closingSoon: isLessThanOneWeek(regEndDateStr),
      showPriceProgression: sorted.length > 0,
      timelineProgressPercent: timelineProgress,
    };
  }, [factions, prices]);

  const StatusPill = ({ text, color = "gray" }: { text: string; color?: "amber" | "red" | "gray" }) => {
    const colorClasses = {
      amber: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
      red: "bg-red-500/10 text-red-400 ring-red-500/30",
      gray: "bg-gray-500/10 text-gray-400 ring-gray-500/30",
    };
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 ml-2 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
        {text}
      </span>
    );
  };

  const InfoLine = ({ icon: Icon, children, className }: { icon: React.ElementType; children: React.ReactNode; className?: string }) => (
    <div className={`flex items-center text-sm text-gray-400 ${className}`}>
      <Icon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );

  // Calculate the correct left offset for the timeline lines
  // Dot size: w-[10px] (w-2.5). Center is at 5px.
  // Container padding: pl-5 (pl-[1.25rem] = 20px).
  // Dot negative margin: -ml-5 (-ml-[1.25rem] = -20px).
  // Effective dot left edge relative to container start (before padding): 20px - 20px = 0px.
  // Effective dot center relative to container start (before padding): 0px + (10px / 2) = 5px.
  // Line width: w-[2px]. Center is at 1px from its left edge.
  // To align line center (1px offset) with dot center (5px offset), line's left edge needs to be at 5px - 1px = 4px.
  // 4px in Tailwind units: left-1 (0.25rem).
  const lineLeftOffset = "left-1"; // Equivalent to left: 0.25rem or 4px

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* Warning Section - unchanged */}
      <div className="text-center bg-red-800/80 p-4 pb-6 rounded-xl w-full shadow-lg mb-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-100 flex items-center justify-center gap-2">
          <IoWarningOutline className="h-6 w-6" /> Your gear must match your faction!
        </h1>
        <p className="mt-4 sm:mt-8 text-sm sm:text-base text-red-200/90">
          If you show up in the wrong camo, you will not be allowed to play. Your registration fee will not be refunded. Don't be that guy - read the rules! Still have questions? Ask on Discord.
        </p>
      </div>

      <div className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-5 sm:p-6 lg:p-8 shadow-md">
        {/* Header Section - unchanged */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Registration</h2>
          {currentPrice !== null && regInfo.status === "open" && (
            <p className="text-2xl font-bold text-white sm:text-right">
              ${currentPrice} <span className="text-base font-medium text-gray-400">USD</span>
            </p>
          )}
          {currentPrice === null && regInfo.status === "closed" && sortedPrices.length > 0 && (
             // Show the price of the *last* defined period when closed
            <p className="text-xl font-semibold text-gray-500 sm:text-right">
              ${sortedPrices[sortedPrices.length - 1].price} <span className="text-sm font-medium">USD (Final Price)</span>
            </p>
          )}
           {/* Add case for not-open? Maybe show first price? */}
           {regInfo.status === "not-open" && sortedPrices.length > 0 && (
            <p className="text-xl font-semibold text-gray-500 sm:text-right">
              Starts at ${sortedPrices[0].price} <span className="text-sm font-medium">USD</span>
            </p>
          )}
        </div>

        {/* Pricing Timeline Section - Updated line positioning */}
        {showPriceProgression && regInfo.status !== "not-open" && (
          <div className="mb-6 border-t border-gray-700/50 py-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Pricing Timeline</h3>
            {/* Container with relative positioning and left padding */}
            <div className="relative pl-5"> {/* Keep pl-5 */}
              {/* Background Line - Updated left offset */}
              <div
                className={`absolute ${lineLeftOffset} top-2 bottom-2 w-[2px] bg-gray-600/50 rounded-full z-0`}
              ></div>
              {/* Progress Line - Updated left offset */}
              <div
                className={`absolute ${lineLeftOffset} top-2 w-[2px] bg-gradient-to-b from-amber-500 to-zone-gold-lite rounded-full z-[1] transition-[height] duration-700 ease-out`}
                style={{ height: `calc(${timelineProgressPercent}% - 1rem)` }} // Adjust height calc if needed based on top/bottom padding/margins
              ></div>
              {/* Price Periods List */}
              <div className="space-y-4 relative z-10">
                {sortedPrices.map((period, idx) => {
                  const isActive = idx === currentPeriodIndex && regInfo.status === "open";
                  const now = new Date().getTime();
                  const starts = new Date(period.starts).getTime();
                  const ends = period.ends ? new Date(period.ends).getTime() : Infinity;
                  // A period is past if its start time is before now AND it's not the active period
                  // OR if its end time is defined and is before now.
                  const isPast = (starts < now && !isActive) || (ends !== Infinity && ends < now);

                  return (
                    <div key={`price-${idx}`} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {/* Dot Indicator - uses negative margin to position correctly relative to padding */}
                        <span
                          className={`flex-shrink-0 -ml-5 mr-3 h-[10px] w-[10px] rounded-full border-2 ${ // Keep -ml-5 and mr-3
                            isActive ? "border-amber-400 bg-gray-800" : isPast ? "border-gray-600 bg-gray-600" : "border-gray-500 bg-gray-800"
                          } ${isActive ? "ring-2 ring-amber-500/50 ring-offset-2 ring-offset-gray-800/30" : ""}`}
                        ></span>
                        <span className={`text-base font-medium ${isActive ? "text-amber-300" : isPast ? "text-gray-500 line-through" : "text-gray-300"}`}>
                          ${period.price}
                        </span>
                        {isActive && <StatusPill text="Current" color="amber" />}
                      </div>
                      <span className={`text-sm ${isActive ? "text-amber-400" : isPast ? "text-gray-500" : "text-gray-400"}`}>
                        {/* Show end date if it's the last period and has one? Or just start date? Sticking with start date for consistency. */}
                        Starts {formatDate(period.starts)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {registrationEndDate && (
              <InfoLine icon={LuCalendarDays} className="mt-4 justify-end text-xs">
                Registration Closes: {formatDate(registrationEndDate)}
              </InfoLine>
            )}
             {!registrationEndDate && sortedPrices.length > 0 && (
                 <InfoLine icon={LuCalendarDays} className="mt-4 justify-end text-xs">
                    Final Price Starts: {formatDate(sortedPrices[sortedPrices.length - 1].starts)} (No explicit end date)
                 </InfoLine>
             )}
          </div>
        )}

        {/* Status Info Section - unchanged */}
        {regInfo.status === "open" && (
          <div className="mb-6 space-y-2">
            {timeUntilNextPrice && nextPeriod && (
              <InfoLine icon={LuClock8} className="text-amber-400">
                Price increases to <strong className="text-white mx-1">${nextPeriod.price}</strong> in
                <strong className="text-white ml-1">{timeUntilNextPrice.text}</strong>
              </InfoLine>
            )}
            {timeUntilClose && closingSoon && (
              <InfoLine icon={IoWarningOutline} className="text-red-400">
                Registration closes soon! Only <strong className="text-white mx-1">{timeUntilClose.text}</strong> remaining.
              </InfoLine>
            )}
             {/* Show general closing time only if there's no price increase soon and it's not closing very soon */}
            {timeUntilClose && !closingSoon && !timeUntilNextPrice && (
              <InfoLine icon={LuClock8}>Registration closes in {timeUntilClose.text}.</InfoLine>
            )}
             {/* Added: Case where there's no next price AND no specific close date */}
             {!timeUntilNextPrice && !timeUntilClose && currentPeriodIndex === sortedPrices.length - 1 && (
                 <InfoLine icon={LuClock8}>Current price period active.</InfoLine>
             )}
          </div>
        )}

        {/* Register Button - unchanged */}
        {regInfo.status === "open" && regInfo.link && (
          <div className="my-6 text-center">
            <a
              href={regInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-zone-gold-lite px-6 py-2.5 text-base font-semibold text-black shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zone-gold-lite"
            >
              Register Now
            </a>
          </div>
        )}
        {regInfo.status === "not-open" && regInfo.link && (
             <div className="my-6 text-center">
               <p className="text-gray-400 text-sm mb-2">Registration opens {sortedPrices.length > 0 ? formatDate(sortedPrices[0].starts) : 'soon'}.</p>
                <a
                href={regInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-gray-600 px-6 py-2.5 text-base font-semibold text-gray-300 shadow-sm cursor-not-allowed"
                onClick={(e) => e.preventDefault()} // Prevent click if needed, or link to info page
                aria-disabled="true"
                >
                Registration Closed
                </a>
             </div>
         )}


        {/* Player Slots Progress - unchanged */}
        {totalSlots > 0 && (
          <div className="my-6 border-t border-gray-700/50 pt-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-300">Player Slots</span>
              <span className="text-gray-400">{filledSlots} / {totalSlots} Filled</span>
            </div>
            <div className="w-full overflow-hidden rounded-full bg-gray-700/60 h-2.5 border border-gray-600/50 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-zone-gold-lite transition-[width] duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Additional Info Section - unchanged */}
        {regInfo.details && (
          <div className="mt-8">
            <div className="prose prose-sm prose-invert max-w-none text-gray-300 prose-p:text-gray-300/90 prose-headings:text-gray-200 prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-strong:text-gray-100">
              <MarkdownRenderer content={regInfo.details} />
            </div>
          </div>
        )}
      </div>
      {/* Footer Text - unchanged */}
      <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
        Registration closes when slots are full or the period ends. Online only, no walk-ins.
      </p>
    </div>
  );
}