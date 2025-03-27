'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamMemberProps {
  member: {
    _id: string;      // Настоящее имя игрока 
    name: string;     // Прозвище/позывной
    description: string; // Информация об игроке
    imageUrl: string;  // URL изображения
  };
  index: number;
}

export default function TeamMemberClientComponent({ member, index }: TeamMemberProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.3)",
        transition: { duration: 0.3 }
      }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 group"
    >
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 4} // Приоритетная загрузка для первых 4 изображений
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80"></div>
        
        {/* Эффект свечения при наведении */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 transition-opacity"
        />
        
        {/* Прозвище/позывной на фото */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="flex items-center">
            <div className="h-8 w-1 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-md inline-block">
                <p className="text-green-400 font-mono text-lg font-semibold tracking-wider">"{member.name}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 relative">
        {/* Декоративная полоса */}
        <div className="absolute -top-12 left-0 w-full flex justify-center">
          <div className="h-[3px] w-24 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full md:hidden"></div>
        </div>
        
        {/* Настоящее имя */}
        <h3 className="text-2xl font-bold mb-2 text-white">{member._id}</h3>
        
        {/* Описание игрока */}
        {member.description && (
          <div className="mt-3 border-t border-gray-700/50 pt-3">
            <p className="text-gray-300 leading-relaxed">{member.description}</p>
          </div>
        )}
        
        {/* Декоративный элемент */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-500/5 rounded-tl-full -mb-6 -mr-6 z-0"></div>
      </div>
    </motion.div>
  );
}