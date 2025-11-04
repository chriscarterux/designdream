import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { validateEnv } from '@/lib/env';

// Validate environment variables at application startup
// This will throw an error with helpful messages if anything is missing or invalid
validateEnv();

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Design Dreams - Unlimited Design & Development',
  description: 'One-person subscription-based agency offering unlimited design and full-stack development',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
