'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { usePlausible } from '@/hooks/use-plausible';

export function WebVitals() {
  const { trackEvent } = usePlausible();

  useReportWebVitals((metric) => {
    // Track Core Web Vitals to Plausible
    // This helps monitor real-world performance in production
    if (process.env.NODE_ENV === 'production') {
      trackEvent('Web Vitals' as any, {
        props: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating || 'good',
        },
      });
    }
  });

  return null;
}
