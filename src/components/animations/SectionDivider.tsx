'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface SectionDividerProps {
  variant?: 'gradient' | 'glow' | 'subtle';
  className?: string;
}

/**
 * Animated section divider
 * Smooth gradient line that fades in as you scroll past
 */
export function SectionDivider({
  variant = 'gradient',
  className = ''
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  if (variant === 'gradient') {
    return (
      <div ref={ref} className={`relative h-px w-full overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(1,84,80,0.5) 50%, transparent 100%)',
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(1,84,80,0.8) 50%, transparent 100%)',
            filter: 'blur(4px)',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div ref={ref} className={`relative h-px w-full overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 h-[2px] -top-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(1,84,80,0.3) 20%, rgba(139,92,246,0.3) 50%, rgba(1,84,80,0.3) 80%, transparent 100%)',
            boxShadow: '0 0 20px rgba(1,84,80,0.5)',
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
    );
  }

  // subtle variant
  return (
    <div ref={ref} className={`relative h-px w-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-border"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 0.3, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * Animated gradient border for sections
 * Creates a subtle glow effect around section containers
 */
export function GradientBorder({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
}
