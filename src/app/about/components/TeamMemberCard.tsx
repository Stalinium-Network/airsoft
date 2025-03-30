"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TeamMember } from "./TeamSection";

// Component to display a single team member (faction commander) with animations
export default function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-800/30 rounded-xl transform rotate-1 scale-[0.98] opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>

      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 group-hover:border-green-500/50 transition-all duration-300 relative z-10">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent opacity-60 rounded-bl-full z-10"></div>

        {/* Image container */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/team/image/${member.image}`}
            alt={member._id}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        {/* Content container */}
        <div className="p-6 relative">
          {/* Name line decoration */}
          <div className="absolute -top-12 left-0 w-full flex justify-center">
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"
              whileInView={{ width: 80 }}
              initial={{ width: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            ></motion.div>
          </div>

          {/* Names container */}
          <div className="text-center">
            {/* Name */}
            <h3 className="text-2xl font-bold group-hover:text-green-400 transition-colors duration-300">
              {member._id}
            </h3>

            {/* Nickname */}
            <p className="text-green-500/80 mt-1 mb-3 font-medium">
              "{member.name}"
            </p>

            {/* Description */}
            {member.description && (
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {member.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Interactive hover effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300 -z-10"
        whileHover={{ scale: 1.02 }}
      ></motion.div>
    </motion.div>
  );
}
