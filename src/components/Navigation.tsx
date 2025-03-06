'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-sm py-2 shadow-xl' : 'bg-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.webp" alt="Zone 37 Logo" className="h-10 w-10 p-1 bg-white rounded-full mr-3" />
          <span className="text-green-500 font-bold text-2xl tracking-wider">ZONE 37</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-green-500 transition-colors">Home</Link>
          <Link href="/gallery" className="text-white hover:text-green-500 transition-colors">Gallery</Link>
          <Link href="/about" className="text-white hover:text-green-500 transition-colors">About Us</Link>
          <Link href="/rules" className="text-white hover:text-green-500 transition-colors">Rules</Link>
          <Link href="/waiver" className="text-white hover:text-green-500 transition-colors">Waiver</Link>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gray-800 px-4 py-2 flex flex-col space-y-3">
          <Link href="/" className="text-white py-2 hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/gallery" className="text-white py-2 hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/about" className="text-white py-2 hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/rules" className="text-white py-2 hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>Rules</Link>
          <Link href="/waiver" className="text-white py-2 hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>Waiver</Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
