'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaHome } from 'react-icons/fa';
import { BiSolidPhotoAlbum } from 'react-icons/bi';
import { GrContactInfo } from 'react-icons/gr';
import { HiOutlineNewspaper } from 'react-icons/hi2';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

// Навигационные элементы вынесены на уровень модуля
const navItems = [
  { href: '/', label: 'Home', svg: FaHome },
  { href: '/gallery', label: 'Gallery', svg: BiSolidPhotoAlbum },
  { href: '/about', label: 'About', svg: GrContactInfo },
  { href: '/news', label: 'News', svg: HiOutlineNewspaper },
  { href: '/faqs', label: 'FAQs', svg: AiOutlineQuestionCircle },
  { href: '/rules', label: 'Rules' },
  { href: '/waiver', label: 'Waiver' },
];

// Отдельный компонент для пункта навигации в десктопной версии
const DesktopNavItem = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => (
  <Link
    href={href}
    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${isActive ? 'text-green-500' : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'}`}
  >
    {label}
    {isActive && (
      <motion.div
        layoutId="nav-underline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )}
  </Link>
);

// Отдельный компонент для пункта навигации в мобильной версии
const MobileNavItem = ({ 
  href, 
  label, 
  isActive, 
  index 
}: { 
  href: string; 
  label: string; 
  isActive: boolean;
  index: number;
}) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 + index * 0.05 }}
  >
    <Link
      href={href}
      className={`block px-3 py-2.5 rounded-md transition-colors ${
        isActive
          ? 'bg-gray-700/70 text-green-500 font-medium border-l-2 border-green-500 pl-4'
          : 'text-gray-300 hover:bg-gray-700/50'
      }`}
    >
      {label}
    </Link>
  </motion.div>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Handle scroll effect for navbar background
  useEffect(() => {
    if (isAdminPage) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPage]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't render navigation on admin pages
  if (isAdminPage) return null;

  return (
    <header 
      id="navigation"
      className={`fixed w-full top-0 z-40 transition-all duration-500 
        ${isScrolled 
          ? 'bg-gray-900/85 backdrop-blur-lg py-2 shadow-lg shadow-black/20' 
          : 'bg-transparent py-4'}`}
    >
      <div className="container md:mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-10 overflow-hidden rounded-full mr-3 border bg-white border-gray-700 transition-transform group-hover:scale-110">
              <Image 
                src="/logo.webp" 
                alt="Zone 37 Logo" 
                fill
                className="object-cover p-1"
              />
            </div>
            <span className="text-2xl font-bold tracking-wider transition-colors group-hover:text-green-500">
              <span className="text-green-500 group-hover:text-white">Zone</span> 37
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <DesktopNavItem 
                key={item.href} 
                href={item.href} 
                label={item.label} 
                isActive={pathname === item.href} 
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              {/* Hamburger icon bars with animation */}
              {[0, 1, 2].map((index) => {
                const isMiddle = index === 1;
                const positionClass = 
                  index === 0 ? 'top-0' : 
                  index === 1 ? 'top-1/2' : 'bottom-0';
                
                return (
                  <motion.span 
                    key={index}
                    className={`absolute ${positionClass} left-0 w-full h-0.5 bg-current rounded`}
                    animate={{ 
                      opacity: isOpen && isMiddle ? 0 : 1,
                      top: isOpen && index === 0 ? '50%' : undefined,
                      bottom: isOpen && index === 2 ? '50%' : undefined,
                      transform: isOpen ? 
                        index === 0 ? 'translateY(-50%) rotate(45deg)' :
                        index === 2 ? 'translateY(50%) rotate(-45deg)' : 'none'
                        : isMiddle ? 'translateY(-50%)' : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.nav
              className="py-3 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700/50 shadow-lg"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="px-4 space-y-3 max-h-[60vh] overflow-y-auto pb-4">
                {navItems.map((item, i) => (
                  <MobileNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    isActive={pathname === item.href}
                    index={i}
                  />
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
