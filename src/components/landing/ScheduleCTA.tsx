'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { SchedulingModal } from './SchedulingModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {showIcon && <Calendar className="mr-2 h-5 w-5" />}
        {children}
      </Button>

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
}
