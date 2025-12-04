'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface RadialGlowProps {
  color?: 'primary' | 'purple' | 'cyan' | 'mixed';
  intensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animated?: boolean;
  className?: string;
}

/**
 * Enhanced radial glow component with animations
 * Adds beautiful gradient glows that pulse and breathe
 */
export function RadialGlow({
  color = 'primary',
  intensity = 'medium',
  size = 'lg',
  position = 'center',
  animated = true,
  className = '',
}: RadialGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
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

  const colors = {
    primary: 'rgba(1,84,80,0.4)',
    purple: 'rgba(139,92,246,0.4)',
    cyan: 'rgba(6,182,212,0.4)',
    mixed: 'rgba(1,84,80,0.3), rgba(139,92,246,0.3)',
  };

  const intensityValues = {
    low: 0.1,
    medium: 0.2,
    high: 0.3,
  };

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
  };

  const positions = {
    top: 'top-0 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2',
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const glowStyle = {
    width: sizes[size],
    height: sizes[size],
    background: color === 'mixed'
      ? `radial-gradient(circle, ${colors.mixed}, transparent 70%)`
      : `radial-gradient(circle, ${colors[color]}, transparent 70%)`,
    filter: 'blur(100px)',
  };

  if (!animated) {
    return (
      <div ref={ref} className={`absolute -z-10 ${className}`} style={{ opacity: intensityValues[intensity] }}>
        <div className={`absolute ${positions[position]}`} style={glowStyle} />
      </div>
    );
  }

  return (
    <div ref={ref} className={`absolute -z-10 ${className}`} style={{ opacity: intensityValues[intensity] }}>
      <motion.div
        className={`absolute ${positions[position]}`}
        style={glowStyle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? {
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1.2, 0.8],
        } : { opacity: 0, scale: 0.8 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Secondary glow for depth */}
      <motion.div
        className={`absolute ${positions[position]}`}
        style={{
          ...glowStyle,
          width: `calc(${sizes[size]} * 0.7)`,
          height: `calc(${sizes[size]} * 0.7)`,
          filter: 'blur(60px)',
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={isInView ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        } : { opacity: 0, scale: 1 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </div>
  );
}

/**
 * Scroll-following glow effect
 * Teal glow that subtly follows scroll position
 */
export function ScrollGlow() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate glow position based on scroll (0-100%)
  const glowPosition = typeof window !== 'undefined'
    ? Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)
    : 50; // Default to middle during SSR

  return (
    <motion.div
      className="fixed left-1/2 w-[800px] h-[800px] pointer-events-none -z-40"
      style={{
        background: 'radial-gradient(circle, rgba(1,84,80,0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        x: '-50%',
      }}
      animate={{
        top: `${glowPosition}%`,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    />
  );
}
