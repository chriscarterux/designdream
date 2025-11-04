import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
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
      </body>
    </html>
  );
}
