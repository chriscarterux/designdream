/**
 * Scroll Depth Tracking Hook
 *
 * Automatically tracks scroll depth milestones (25%, 50%, 75%, 100%)
 * using Plausible analytics. Fires only once per milestone per session.
 */

import { useEffect, useRef } from 'react';
import { usePlausible } from './use-plausible';

export function useScrollTracking() {
  const { trackEvent } = usePlausible();
  const milestonesReached = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      const percentage = Math.floor(scrollPercentage * 100);

      // Check milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (percentage >= milestone && !milestonesReached.current.has(milestone)) {
          milestonesReached.current.add(milestone);
          trackEvent(`Scroll ${milestone}%` as any);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);
}
