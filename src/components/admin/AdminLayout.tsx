'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSignOutAlt, FaHome, FaImages, FaCalendarAlt, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import useAdminAuth from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { userEmail, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // For small screens, close sidebar when a link is clicked
  const handleNavClick = (path: string) => {
    setIsSidebarOpen(false);
    router.push(path);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-gray-800 text-gray-200"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-10
      `}>
        <div className="flex flex-col h-full">
          {/* Admin header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-green-500">Admin Panel</h2>
            {userEmail && <p className="text-sm text-gray-400">{userEmail}</p>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            <NavLink href="/admin" icon={<FaHome />} label="Dashboard" onClick={() => handleNavClick('/admin')} />
            <NavLink href="/admin/gallery" icon={<FaImages />} label="Gallery" onClick={() => handleNavClick('/admin/gallery')} />
            <NavLink href="/admin/console" icon={<FaCalendarAlt />} label="Events" onClick={() => handleNavClick('/admin/console')} />
            <NavLink href="/admin/users" icon={<FaUsers />} label="Users" onClick={() => handleNavClick('/admin/users')} />
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="flex w-full items-center px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        <main className="flex-1 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="flex items-center px-4 py-3 text-gray-300 rounded-md hover:bg-gray-700 hover:text-green-500 transition-colors"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
}