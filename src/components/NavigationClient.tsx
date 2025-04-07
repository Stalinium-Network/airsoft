"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  navItems,
  DesktopNavItem,
  MobileNavItem,
  UpcomingEventButton,
} from "./Navigation";

export default function NavigationClient({
  upcomingEventLink,
}: {
  upcomingEventLink: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith("/admin");

  // Handle scroll effect for navbar background
  useEffect(() => {
    if (isAdminPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        ${
          isScrolled
            ? "bg-zone-dark/85 backdrop-blur-lg py-2 shadow-lg shadow-black/20"
            : "bg-transparent py-4"
        }`}
    >
      <div className="md:mx-10 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-24 overflow-hidden mr-3 transition-transform group-hover:scale-110">
              <Image
                src="/logo-header.svg"
                alt="Zone 37 Logo"
                fill
                className="object-cover p-1"
              />
            </div>
          </Link>

          {/* Right side container for desktop */}
          <div className="hidden md:flex items-center justify-end space-x-4 flex-grow">
            {/* Desktop Navigation */}
            <nav className="flex space-x-1">
              {navItems.map((item) => (
                <DesktopNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>

            <UpcomingEventButton link={upcomingEventLink} />
          </div>

          {/* Mobile: Right-aligned container */}
          <div className="flex items-center space-x-2 md:hidden">
            <UpcomingEventButton link={upcomingEventLink} />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-zone-dark-brown/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                {/* Hamburger icon bars with animation */}
                {[0, 1, 2].map((index) => {
                  const isMiddle = index === 1;
                  const positionClass =
                    index === 0
                      ? "top-0"
                      : index === 1
                      ? "top-1/2"
                      : "bottom-0";

                  return (
                    <motion.span
                      key={index}
                      className={`absolute ${positionClass} left-0 w-full h-0.5 bg-current rounded`}
                      animate={{
                        opacity: isOpen && isMiddle ? 0 : 1,
                        top: isOpen && index === 0 ? "50%" : undefined,
                        bottom: isOpen && index === 2 ? "50%" : undefined,
                        transform: isOpen
                          ? index === 0
                            ? "translateY(-50%) rotate(45deg)"
                            : index === 2
                            ? "translateY(50%) rotate(-45deg)"
                            : "none"
                          : isMiddle
                          ? "translateY(-50%)"
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                })}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.nav
              className="py-3 bg-zone-dark/95 backdrop-blur-lg border-t border-zone-dark-brown/50 shadow-lg"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="px-4 space-y-3 max-h-[60vh] overflow-y-auto pb-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <MobileNavItem
                      href={item.href}
                      label={item.label}
                      isActive={pathname === item.href}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
