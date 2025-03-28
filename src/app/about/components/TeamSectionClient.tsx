'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMemberProcessed {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageUrl: string;
}

interface TeamSectionClientProps {
  teamMembers: TeamMemberProcessed[];
}

// Component to display a single team member with animations
function TeamMemberCard({ member, index }: { member: TeamMemberProcessed, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)",
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative h-80 w-full">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>
      <div className="p-6 relative">
        <div className="absolute -top-12 left-0 w-full flex justify-center">
          <div className="h-1 w-20 bg-green-500 rounded-full"></div>
        </div>
        <h3 className="text-2xl font-bold">{member.name}</h3>
        <p className="text-green-400 mb-4 font-medium">{member.role}</p>
        <p className="text-gray-400">{member.bio}</p>
      </div>
    </motion.div>
  );
}

// Client component that receives pre-fetched team members
export default function TeamSectionClient({ teamMembers }: TeamSectionClientProps) {
  return (
    <section className="py-20 px-4 w-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">OUR <span className="text-green-500">TEAM</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the experienced stalkers who make the Zone come alive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard 
              key={member._id} 
              member={member} 
              index={index} 
            />
          ))}
        </div>

        <motion.div 
          className="mt-20 text-center bg-gray-800 p-10 rounded-lg shadow-lg border-t-4 border-green-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">JOIN OUR FACTION</h3>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg">
            We're always looking for passionate stalkers to join our team. If you have skills in prop-making, scenario design, or event management, reach out to us.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors shadow-lg"
          >
            CONTACT US
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}