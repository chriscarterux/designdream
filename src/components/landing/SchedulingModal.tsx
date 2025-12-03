'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { usePlausible } from '@/hooks/use-plausible';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  calUrl?: string;
  source?: string;
}

export function SchedulingModal({
  isOpen,
  onClose,
  calUrl,
  source = 'unknown',
}: SchedulingModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [openTime, setOpenTime] = useState<number | null>(null);
  const { trackEvent } = usePlausible();

  // Get Cal.com URL from environment variable
  const schedulingUrl = calUrl || process.env.NEXT_PUBLIC_CAL_COM_URL;

  // Track when modal opens
  useEffect(() => {
    if (isOpen) {
      setOpenTime(Date.now());
      trackEvent('Book Intro Click', { props: { source } });
    }
  }, [isOpen, source, trackEvent]);

  // Track when modal closes
  const handleClose = () => {
    if (openTime) {
      const duration = Math.floor((Date.now() - openTime) / 1000);
      // Note: We can't detect if booking was completed from iframe
      // Cal.com would need webhook integration for that
      console.log(`[Analytics] Modal closed after ${duration}s from ${source}`);
    }
    setOpenTime(null);
    setIsLoading(true);
    onClose();
  };

  if (!schedulingUrl) {
    console.error('Cal.com URL not configured. Set NEXT_PUBLIC_CAL_COM_URL environment variable.');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[85vh] sm:h-[600px] p-0">
        <DialogTitle className="sr-only">Schedule a 15-minute intro call</DialogTitle>

        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="text-sm text-gray-600">Loading calendar...</p>
            </div>
          </div>
        )}

        <iframe
          src={schedulingUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
          className={isLoading ? 'hidden' : 'block rounded-lg'}
          title="Schedule a 15-minute intro call"
        />
      </DialogContent>
    </Dialog>
  );
}
