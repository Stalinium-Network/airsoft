'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function OurStorySection() {
  return (
    <section id="story" className="py-20 px-4 w-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">OUR <span className="text-green-500">STORY</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From humble beginnings to becoming Ukraine's premier STALKER-themed airsoft community, our journey has been as unpredictable as the Zone itself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-lg overflow-hidden shadow-2xl shadow-green-500/10"
          >
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/about-story.jpg"
                alt="Stalkers in the Zone"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-gray-900 to-transparent">
              <h3 className="text-2xl font-bold text-green-400">EST. 2015</h3>
              <p className="text-white">The Zone Awaits</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-6">From Fans to Creators</h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              What began as a small group of friends passionate about the STALKER game series transformed into Ukraine's largest themed airsoft community. We've dedicated ourselves to recreating the atmosphere, tension, and camaraderie found in the virtual Zone.
            </p>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Our attention to detail and commitment to authenticity has made our events legendary among airsoft enthusiasts. From custom-designed anomalies to faction-specific missions, we bring the Zone to life in ways that honor the source material while creating new stories among our stalkers.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Through years of experience and continuous refinement, we've created a unique gaming environment that challenges players both physically and mentally. The Zone is always evolving, and so are we.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
