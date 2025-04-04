// components/GameFeatures.js
import React from 'react';
// Импортируем иконки из разных наборов
import {
  IoLocateOutline,    // Замена для Objectives
  IoSparklesOutline,  // Role playing
  IoShieldOutline,    // NPC
  IoLeafOutline,      // Changing environment
  IoOptionsOutline,   // Perks
} from 'react-icons/io5';
import { LuHandshake } from 'react-icons/lu'; // Иконка для In-game economy из Lucide

const features = [
  {
    icon: IoLocateOutline, // Обновлено
    title: 'Objectives',
    description: 'Our games are based on achieving specific objectives for each faction. It is quite possible that you will not use even one mag during the entire game or vice versa. It all depends on you.',
  },
  {
    icon: IoSparklesOutline,
    title: 'Role playing',
    description: 'We extremely welcoming quality role-playing. This is the basis of our games. Forget who you were in real life and become your character for the next 40 hours. Your progress will be saved for the next game!',
  },
  {
    icon: IoShieldOutline,
    title: 'NPC',
    description: 'As you dive into our world, you will interact with non-player characters (our staff and other players) who will give you missions, be your guides, buy and sell in-game items.',
  },
  {
    icon: IoLeafOutline,
    title: 'Changing environment',
    description: 'You will encounter emissions, radioactive zones, creatures and constantly changing objectives. Challenge yourself and reach your limits. It won\'t be boring!',
  },
  {
    icon: IoOptionsOutline,
    title: 'Perks',
    description: 'During the game you\'ll be able to find and purchase perks that will add variety to your gameplay and can play a key role in achieving your objectives. We use the Ares Alpha app to create more immersion.',
  },
  {
    icon: LuHandshake, // Обновлено
    title: 'In-game economy',
    description: 'An important part of the game is the economy. You can sell and buy ammo, game items, bribe, spy and much more. The money left in your hands at the end of the game will be counted towards the next one.',
  },
];

const GameFeaturesSection = () => {
  return (
    // Use a container div or section - no background color set here
    // Adjust padding/margins as needed to fit into your page layout
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 md:mb-16">
        Game Features
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-16">
        {features.map((feature) => (
          <div key={feature.title}>
            <div className="mb-4">
              {/* Apply the custom gold color and size the icon */}
              <feature.icon className="h-6 w-6 text-zone-gold-lite" aria-hidden="true" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-base text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameFeaturesSection;