// components/IntroSection.tsx
import React from "react";

const IntroSection: React.FC = () => {
  // Helper function for splitting text to color the last word
  const splitLastWord = (text: string) => {
    const words = text.trim().split(" ");
    if (words.length <= 1) {
      return { base: "", last: text };
    }
    const last = words.pop() || "";
    const base = words.join(" ");
    return { base, last };
  };

  const mandatoryItems = [
    "Uniform and gear: Top, bottom, boots, plate carrier, etc. - correct for the faction you signed up for.",
    "Picture ID (keep on you at all times)",
    "Medical Card: Name, allergies, conditions, etc.",
    "Primary Airsoft Replica",
    "Eye protection: MUST BE WORN ON THE FIELD AT ALL TIMES. Eye protection needs to meet ANSI Z87.1-1989 standards!",
    "Sleeping bag",
    "Enough food and water for two days of the game",
    "Cold/Wet Weather Gear",
    "3x pair of socks",
    "Enough batteries, gas, or air for your replicas!",
    "Power bank for your smartphone (Ares Alpha app uses GPS)",
  ];

  const recommendedItems = [
    "Face and mouth protection (Strongly recommended).",
    "Assault Backpack (Strongly recommended).",
    "Tent, tarp, and sleeping pad.",
    "Stove and camping equipment.",
    "A dry set of extra clothes stored in a waterproof bag or garbage pack for safety reasons.",
    "Personal Hygiene Kit: toothbrush, deodorant.",
    "Flashlight/head lamp. Must have red lens/light mode during the night phase of the game.",
    "Replica repair kit or spare parts.",
    "3-day Backpack for all your items.",
    "Personal items and medications.",
  ];

  return (
    // Section container - assuming parent provides black background
    <div className="text-white">
      {/* Top Hero Section */}
      <div className="text-center pt-36 pb-20 px-4 bg-black/70">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
          Are you ready to conquer the zone?
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          Here you will find guides and information you need to prepare for your
          deployment in Zone 37.
        </p>
      </div>

      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 text-left">
          Packing List
        </h2>

        <div className="bg-zone-dark-light p-6 md:p-8 lg:p-10 rounded-xl">
          <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
            This is a list of items you need to have. Print this page and make
            sure you have everything you need to ensure you get the most out of
            the event.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-zone-gold-lite-2">
                Mandatory Items
              </h3>
              <ul className="list-disc list-inside space-y-2 text-zone-gold-lite-2">
                {mandatoryItems.map((item, index) => (
                  <li
                    key={`mandatory-${index}`}
                    className="text-base leading-snug"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Recommended Items
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white">
                {recommendedItems.map((item, index) => (
                  <li
                    key={`recommended-${index}`}
                    className="text-gray-300 text-base leading-snug"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
