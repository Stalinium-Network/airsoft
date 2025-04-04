// components/GameFeatures.tsx
import React from 'react';

const GameFeatures: React.FC = () => {
  return (
    <div className="px-4 py-12 bg-black/70">
      {/* Main Title */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 md:mb-12 lg:mb-16 text-center md:text-left">
        Game <span className="text-zone-gold-lite">Items</span>
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* Column 1: Artifacts */}
        <div className="bg-card-bg rounded-xl p-6 md:p-8 flex flex-col h-full bg-zone-dark">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Artifacts
          </h3>
          <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed flex-grow">
            Artifacts are collectibles that can be found in Zone 37. These artifacts can be used to complete contracts, fulfill missions, or for the sake of exploiting its power. Artifacts can be sold to the Trader for Doubloons.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            But don’t rush to sell them! Each artifact has a unique property that can help you on the battlefield.
          </p>
        </div>

        <div className="flex gap-6 md:gap-8 flex-row md:flex-col">
          <div className="bg-card-bg rounded-xl p-6 md:p-8 bg-zone-dark">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Lockboxes
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              A protected container that cannot be looted from a "downed" or "dead" player. You can carry artifacts or BB's in your lockbox.
            </p>
          </div>

          {/* Stashes Card */}
          <div className="bg-card-bg rounded-xl p-6 md:p-8 bg-zone-dark">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Stashes
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              There are hidden chests on the field that can contain ammo, medic water, airsoft replicas, food, and artifacts.
            </p>
          </div>
        </div>

        {/* Column 3: Doubloons */}
        <div className="bg-card-bg rounded-xl p-6 md:p-8 flex flex-col h-full bg-zone-dark">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Doubloons
          </h3>
          <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed flex-grow">
            Doubloons (DB) are an in-game currency. Since paper money was very ineffective in Zone 37, the locals decided to use physical crypto-coins for all transactions in Zone 37.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            With this money, you can buy ammo, grenades, artifacts, access to closed areas, or bribe opponents to achieve your personal goals.
          </p>
        </div>

      </div>
    </div>
  );
};

export default GameFeatures;