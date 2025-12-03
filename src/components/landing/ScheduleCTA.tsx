'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { usePlausible } from '@/hooks/use-plausible';

interface ScheduleCTAProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  source?: string;
  className?: string;
  showIcon?: boolean;
}

export function ScheduleCTA({
  children = 'Book a 15-minute intro',
  variant = 'outline',
  size = 'lg',
  source = 'unknown',
  className,
  showIcon = true,
}: ScheduleCTAProps) {
  const { trackEvent } = usePlausible();

  const handleClick = () => {
    trackEvent('Book Intro Click', { props: { source } });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      data-cal-link="designdream/15min"
      data-cal-namespace="15min"
      data-cal-config='{"layout":"month_view"}'
      onClick={handleClick}
    >
      {showIcon && <Calendar className="mr-2 h-5 w-5" />}
      {children}
    </Button>
  );
}
