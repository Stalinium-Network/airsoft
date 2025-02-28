'use client'
import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="container w-screen"
    >
      {children}
    </motion.div>
  );
}
