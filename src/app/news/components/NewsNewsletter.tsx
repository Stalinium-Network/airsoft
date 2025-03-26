"use client";

import { motion } from "framer-motion";

export default function NewsNewsletter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20 bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-lg"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-gray-400">
            Subscribe to our newsletter to receive the latest news, event announcements, and exclusive offers.
          </p>
        </div>
        <div>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-gray-900 border border-gray-700 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-r-lg font-medium"
            >
              Subscribe
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
