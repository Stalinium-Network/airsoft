'use client'

import { motion } from 'framer-motion';

export default function TeamJoinSection() {
  return (
    <motion.div 
      className="mt-20 text-center bg-gray-800/80 backdrop-blur-sm p-10 rounded-lg shadow-lg border-t-4 border-green-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6">JOIN OUR FACTION</h3>
      <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg">
        We're always looking for passionate stalkers to join our team. If you have skills in prop-making, scenario design, or event management, reach out to us.
      </p>
      <motion.a
        href="#contact"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="inline-block px-10 py-4 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors shadow-lg"
      >
        CONTACT US
      </motion.a>
    </motion.div>
  );
}