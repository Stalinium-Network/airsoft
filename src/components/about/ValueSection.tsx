'use client'
import { motion } from 'framer-motion';

export default function ValueSection() {
  const values = [
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community",
      description: "We foster a supportive atmosphere where stalkers of all experience levels can learn, grow, and form bonds that extend beyond the Zone."
    },
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: "Immersion",
      description: "Every detail of our events is crafted to transport participants into the STALKER universe, from atmospheric props to carefully designed missions."
    },
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Safety",
      description: "While we recreate a dangerous fictional world, the real safety of our participants is always our highest priority through thorough protocols and equipment checks."
    },
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Innovation",
      description: "We constantly develop new methods to enhance the STALKER experience, from custom-built anomalies that react to player proximity to faction-specific equipment."
    },
  ];

  return (
    <section className="py-20 px-4 w-screen bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">OUR <span className="text-green-500">VALUES</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The principles that guide us through the dangers and anomalies of the Zone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-700 p-8 rounded-lg border-b-4 border-green-500"
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.2)" }}
            >
              <div className="text-green-500 mb-6">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-300 text-lg">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 p-8 bg-gray-700 rounded-lg border-l-4 border-green-500 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <span className="bg-green-500 h-8 w-8 rounded-full flex items-center justify-center text-gray-900 mr-3">!</span>
            Our Promise to Stalkers
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Whether you're a seasoned veteran of the Zone or a rookie on their first expedition, we promise an experience that respects the source material while creating new memories and challenges. We are committed to maintaining the delicate balance between authenticity, safety, and enjoyment that has made our community thrive for years.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
