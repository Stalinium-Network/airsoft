'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '../MarkdownRenderer';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm"
        >
          <button
            className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
            onClick={() => toggleQuestion(index)}
          >
            <h3 className="text-xl font-medium">{item.question}</h3>
            <motion.div
              animate={{ rotate: activeIndex === index ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-green-500"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </motion.div>
          </button>
          
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-3 pt-2 border-t border-gray-800">
                  <MarkdownRenderer content={item.answer} />
                  {/* <p className="text-gray-300">{item.answer}</p> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
