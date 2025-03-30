'use client'
import { motion } from 'framer-motion';

export default function OurStorySection() {
  return (
    <section id="story" className="py-24 px-4 w-screen relative">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute w-[600px] h-[600px] top-[10%] -right-[300px] rounded-full bg-green-500/30 blur-3xl"></div>
        <div className="absolute w-[400px] h-[400px] bottom-[10%] -left-[200px] rounded-full bg-green-600/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            WHERE IT ALL <span className="text-green-500">BEGAN</span>...
          </motion.h2>
          
          <motion.div 
            className="h-1 w-40 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div 
            className="lg:col-span-12 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative space-y-8 px-4">
              {/* Декоративный элемент слева */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0"></div>
              
              <motion.p 
                className="text-lg leading-relaxed text-gray-300 pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                In 2020, a series of unprecedented solar flares dramatically altered life on Earth. These colossal flares unleashed intense radiation, sparking the formation of multiple anomalous zones across the planet. While many of these zones were swiftly controlled by governments worldwide, some were mobile and far more perilous than their stationary counterparts.
              </motion.p>
              
              <motion.p 
                className="text-lg leading-relaxed text-gray-300 pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                The emergence of these zones quickly attracted the attention of private military companies, who began monitoring them closely. The areas were found to harbor valuable, otherworldly artifacts—items of immense scientific importance that promised to unlock the secrets of the universe. Alongside military companies, treasure hunters also flocked to these regions, eager to claim the strange and powerful relics.
              </motion.p>
              
              <motion.p 
                className="text-lg leading-relaxed text-gray-300 pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Among the most infamous of these zones is Zone 37, a mysterious and hazardous area that has captivated the interest of all who hear of it. Known for its enigmatic artifacts, Zone 37 also poses a deadly risk to anyone who dares to enter without proper preparation. By 2025, tensions reached a boiling point, as two powerful private military companies clashed in an all-out war for control over the zone.
              </motion.p>
              
              <motion.p 
                className="text-lg leading-relaxed text-gray-300 pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                As the battle for dominance in Zone 37 continues, the world watches closely, uncertain of the dangers that lie ahead — and the extraordinary discoveries that might still be hidden within.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
