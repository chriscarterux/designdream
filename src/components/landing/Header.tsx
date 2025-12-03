'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Design Dream"
            width={150}
            height={40}
            className="h-8 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="#pricing"
            className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#how-it-works"
            className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/subscribe">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
