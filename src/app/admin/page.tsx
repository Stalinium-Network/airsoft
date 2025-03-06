'use client'

import { useRouter } from 'next/navigation';
import { FaImages, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();

  const adminModules = [
    {
      title: "Gallery Management",
      description: "Upload, edit, and delete images in your gallery",
      icon: <FaImages className="text-3xl" />,
      path: "/admin/gallery",
      color: "bg-green-500"
    },
    {
      title: "Event Management",
      description: "Create and manage upcoming airsoft events",
      icon: <FaCalendarAlt className="text-3xl" />,
      path: "/admin/events", 
      color: "bg-blue-500"
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: <FaUsers className="text-3xl" />,
      path: "/admin/users",
      color: "bg-purple-500"
    }
  ];

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome to the STALKER Airsoft admin panel</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
              onClick={() => router.push(module.path)}
            >
              <div className="p-6 cursor-pointer">
                <div className={`inline-flex items-center justify-center p-3 ${module.color} rounded-full mb-4`}>
                  {module.icon}
                </div>
                <h2 className="text-xl font-bold mb-2">{module.title}</h2>
                <p className="text-gray-400">{module.description}</p>
              </div>
              <div className={`${module.color} p-4 flex justify-end`}>
                <button className="text-sm font-medium">
                  Go to {module.title.split(" ")[0]} →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
