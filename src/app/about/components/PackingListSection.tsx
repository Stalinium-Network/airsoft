'use client'
import { motion } from 'framer-motion';

export default function PackingListSection() {
  // Массивы с обязательными и рекомендуемыми предметами
  const mandatoryItems = [
    'Uniform and gear: Top, bottom, boots, plate carrier, etc. - correct for the faction you signed up for.',
    'Picture ID (keep on you at all times)',
    'Medical Card: Name, allergies, conditions, etc.',
    'Primary Airsoft Replica',
    'Eye protection: MUST BE WORN ON THE FIELD AT ALL TIMES. Eye protection needs to meet ANSI Z87.1-1989 standards!',
    'Sleeping bag',
    'Enough food and water for two days of the game',
    'Cold/Wet Weather Gear',
    '3x pair of socks',
    'Enough batteries, gas, or air for your replicas!'
  ];

  const recommendedItems = [
    'Face and mouth protection (Strongly recommended).',
    'Assault Backpack (Strongly recommended).',
    'Tent, tarp, and sleeping pad.',
    'Stove and camping equipment.',
    'A dry set of extra clothes stored in a waterproof bag or garbage pack for safety reasons.',
    'Personal Hygiene Kit: toothbrush, deodorant.',
    'Flashlight/head lamp. Must have red lens/light mode during the night phase of the game.',
    'Replica repair kit or spare parts.',
    '3-day Backpack for all your items.',
    'Personal items and medications.'
  ];

  return (
    <section className="py-20 px-4 w-screen bg-[#111827] relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-[600px] h-[600px] -bottom-[300px] -right-[300px] rounded-full bg-green-500/30 blur-3xl"></div>
        <div className="absolute w-[400px] h-[400px] top-[20%] -left-[200px] rounded-full bg-green-600/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="relative inline-block">
              PACKING <span className="text-green-500">LIST</span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              ></motion.span>
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            This is a list of items you need to have. Print this page and make sure you have everything you need to ensure you get the most out of the event.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mandatory Items */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-800/10 rounded-2xl transform -rotate-1 scale-[0.98] blur-sm"></div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl relative z-10 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Mandatory Items</h3>
              </div>
              
              <ul className="space-y-3 pl-2">
                {mandatoryItems.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="min-w-6 pt-1">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 ml-3">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Recommended Items */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-800/10 rounded-2xl transform rotate-1 scale-[0.98] blur-sm"></div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl relative z-10 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Recommended Items</h3>
              </div>
              
              <ul className="space-y-3 pl-2">
                {recommendedItems.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="min-w-6 pt-1">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 ml-3">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}