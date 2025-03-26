'use client'
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Realistic Scenarios",
    description: "Experience meticulously crafted missions based on the STALKER universe, complete with artifacts, anomalies, and faction warfare.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    )
  },
  {
    title: "Atmospheric Locations",
    description: "Play in carefully selected venues that recreate the post-apocalyptic feel of the Zone, from abandoned facilities to dense forests.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Immersive Prop Design",
    description: "Encounter anomalies, artifacts, and specialized equipment that bring the STALKER universe to life in our meticulously designed games.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    )
  },
];

export default function FeatureSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Subtle background animation */}
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"
        initial={{ opacity: 0.5 }}
        animate={{ 
          opacity: [0.5, 0.6, 0.5],
          backgroundPosition: ['0% 0%', '100% 100%'] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
            />
            <h2 className="text-4xl font-bold my-2">OUR <span className="text-green-500">WORLD</span></h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
            />
          </div>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Immerse yourself in the atmosphere of a post-apocalyptic world, where danger lurks around every corner, and anomalies and artifacts have become part of everyday reality.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl font-bold mb-6">ARE YOU READY TO ENTER THE ZONE?</h3>
          <motion.button
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)" 
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors relative overflow-hidden group"
          >
            <span className="relative z-10">JOIN THE STALKERS</span>
            <motion.span 
              className="absolute inset-0 bg-green-400 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature, index: number }) {
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  // Icon animation variants
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2 + index * 0.15,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.1,
      color: "#22c55e", // green-500
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.div 
      className="relative rounded-lg p-6 backdrop-blur-sm"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Card background with gradient border */}
      <div className="absolute inset-0 rounded-lg bg-gray-800/70 -z-10" />
      <div className="absolute inset-0 rounded-lg border border-gray-700 -z-10" />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent opacity-80 -z-10" />
      
      {/* Content wrapper with hover animation */}
      <div className="relative z-10">
        <motion.div 
          className="text-green-500 mb-4"
          variants={iconVariants}
        >
          {feature.icon}
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold mb-3"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
          viewport={{ once: true }}
        >
          {feature.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
          viewport={{ once: true }}
        >
          {feature.description}
        </motion.p>
        
        {/* Animated subtle highlight line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
}
