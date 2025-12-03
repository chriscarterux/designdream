import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { validateEnv } from '@/lib/env';
import { WebVitals } from './web-vitals';

// Validate environment variables at application startup
// This will throw an error with helpful messages if anything is missing or invalid
validateEnv();

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Design Dreams - Unlimited Design & Development Subscription',
  description:
    'One-person subscription-based agency offering unlimited design and full-stack development. Ship websites, mobile apps, and AI features in 48 hours. $4,495/mo.',
  keywords: [
    'design subscription',
    'unlimited design',
    'unlimited development',
    'subscription agency',
    'web development',
    'mobile app development',
    'AI development',
    'SaaS development',
    'product design',
    'full-stack development',
  ],
  authors: [{ name: 'Chris Carter' }],
  creator: 'Chris Carter',
  publisher: 'Design Dream',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://designdream.is',
    title: 'Design Dreams - Unlimited Design & Development',
    description:
      'Ship websites, mobile apps, and AI features in 48 hours with unlimited design and development subscription.',
    siteName: 'Design Dreams',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Dreams - Unlimited Design & Development',
    description: 'Ship websites, mobile apps, and AI features in 48 hours.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics - Privacy-friendly, GDPR compliant */}
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            data-domain="designdream.is"
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <WebVitals />
      </body>
    </html>
  );
}
