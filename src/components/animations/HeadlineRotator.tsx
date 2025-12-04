'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeadlineRotatorProps {
  headlines: React.ReactNode[];
  interval?: number;
  className?: string;
}

export function HeadlineRotator({
  headlines,
  interval = 3500,
  className = ''
}: HeadlineRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, interval);

    return () => clearInterval(timer);
  }, [headlines.length, interval]);

  return (
    <div className={`relative ${className}`}>
      {/* Fixed height container to prevent layout shift */}
      <div className="min-h-[1.2em]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              filter: 'blur(8px)',
              scale: 0.98
            }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1
            }}
            exit={{
              opacity: 0,
              filter: 'blur(8px)',
              scale: 1.02
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] // Custom easing curve for smooth dissolve effect
            }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            {headlines[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
