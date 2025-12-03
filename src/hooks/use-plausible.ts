/**
 * Plausible Analytics Hook
 *
 * Provides type-safe access to Plausible custom events.
 * Gracefully handles missing Plausible script (e.g., in development).
 *
 * Usage:
 *   const { trackEvent } = usePlausible();
 *   trackEvent('CTA Click', { props: { location: 'hero' } });
 */

import { useCallback } from 'react';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, string | number> }) => void;
  }
}

export type PlausibleEventName =
  // CTA Events
  | 'Hero CTA Click'
  | 'Pricing CTA Click'
  | 'Final CTA Click'
  | 'Book Intro Click'
  // Form Events
  | 'Subscribe Form Submit'
  | 'Booking Completed'
  // Engagement Events
  | 'FAQ Item Opened'
  | 'Hero Video Played'
  | 'Section View'
  // Scroll Tracking
  | 'Scroll 25%'
  | 'Scroll 50%'
  | 'Scroll 75%'
  | 'Scroll 100%';

interface PlausibleOptions {
  props?: Record<string, string | number>;
}

export function usePlausible() {
  const trackEvent = useCallback((eventName: PlausibleEventName, options?: PlausibleOptions) => {
    if (typeof window !== 'undefined' && window.plausible) {
      try {
        // Only pass options if props are defined
        if (options?.props) {
          window.plausible(eventName, { props: options.props });
        } else {
          window.plausible(eventName);
        }
      } catch (error) {
        console.warn('Plausible tracking error:', error);
      }
    } else {
      // In development or if script failed to load
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Plausible] ${eventName}`, options?.props || '');
      }
    }
  }, []);

  return { trackEvent };
}
