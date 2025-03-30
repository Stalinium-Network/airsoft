'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GameFeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: "Objectives",
      description: "Our games are based on achieving specific objectives for each faction. It is quite possible that you will not use even one mag during the entire game or vice versa. It all depends on you."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Role Playing",
      description: "We extremely welcoming quality role-playing. This is the basis of our games. Forget who you were in real life and become your character for the next 40 hours. Your progress will be saved for the next game!"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "NPC",
      description: "As you dive into our world, you will interact with non-player characters (our staff and other players) who will give you missions, be your guides, buy and sell in-game items."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Changing Environment",
      description: "By achieving the first objective, you trigger a sequence of events that create new goals for you. Each faction has a global objective, as well as a number of internal objectives. It won't be boring!"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Perks",
      description: "During the game you'll be able to find and purchase perks that will add variety to your gameplay and can play a key role in achieving your objectives. We use the Ares Alpha app to create more immersion."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "In-game Economy",
      description: "An important part of the game is the economy. You can sell and buy ammo, game items, bribe, spy and much more. The money left in your hands at the end of the game will be counted towards the next one."
    },
  ];

  return (
    <section className="py-16 px-4 w-screen bg-gray-800 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[400px] rounded-full bg-green-500/30 blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] top-[20%] -left-[300px] rounded-full bg-green-600/20 blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bottom-[10%] right-[10%] rounded-full bg-green-400/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="relative inline-block">
              GAME <span className="text-green-500">FEATURES</span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              ></motion.span>
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Explore the unique elements that make our STALKER-themed airsoft experience stand out from the ordinary.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-800/30 rounded-xl transform -rotate-1 scale-[0.98] opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              
              <div className="h-full bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700 shadow-xl relative z-10 overflow-hidden group-hover:border-green-500/50 transition-colors duration-300">
                {/* Decorative Elements - уменьшены */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent opacity-60 rounded-bl-full"></div>
                
                {/* Icon with circle background - уменьшен */}
                <div className="relative mb-4 z-10">
                  <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-green-400/10 to-green-600/5 rounded-full blur-md"></div>
                  <div className={`relative inline-flex items-center justify-center p-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-inner text-green-400 group-hover:text-green-300 transition-all duration-500 transform ${hoveredFeature === index ? 'scale-110' : ''}`}>
                    <div className="w-10 h-10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content - уменьшен */}
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300 leading-relaxed line-clamp-4">{feature.description}</p>
                </div>
                
                {/* Bottom design element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}