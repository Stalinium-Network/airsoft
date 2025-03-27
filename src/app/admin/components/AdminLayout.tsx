'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaHome, FaImages, FaCalendarAlt, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import useAdminAuth from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { userEmail, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide main navigation when admin pages load
  useEffect(() => {
    // Find the main navigation element and hide it
    const mainNavigation = document.getElementById('navigation');
    if (mainNavigation) {
      mainNavigation.style.display = 'none';
    }

    // Cleanup - restore navigation when component unmounts
    return () => {
      const mainNavigation = document.getElementById('navigation');
      if (mainNavigation) {
        mainNavigation.style.display = '';
      }
    };
  }, []);

  // For small screens, close sidebar when a link is clicked
  const handleNavClick = (path: string) => {
    setIsSidebarOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      router.push('/admin');
    }
  };

  const navItems = [
    { label: 'Games', href: '/admin/console' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Locations', href: '/admin/locations' },
    { label: 'Fractions', href: '/admin/fractions' },
    { label: 'News', href: '/admin/news' },
    { label: 'Content', href: '/admin/content' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-500 font-bold">Admin Console</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* Add back to site link */}
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  >
                    <FaHome className="mr-1.5 text-green-500" />
                    Back to Site
                  </Link>
                  
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Log Out
              </button>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Add back to site link in mobile menu */}
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
            >
              <FaHome className="mr-1.5 text-green-500" />
              Back to Site
            </Link>
            
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <main>{children}</main>
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