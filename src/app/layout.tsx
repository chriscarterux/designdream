import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
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

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        {/* Plausible Analytics - Privacy-friendly, GDPR compliant */}
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            data-domain="designdream.is"
            src="https://plausible.io/js/script.js"
          />
        )}
        {/* Cal.com Embed */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "15min", {origin:"https://app.cal.com"});
Cal.ns["15min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${dmSerif.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
        <WebVitals />
      </body>
    </html>
  );
}
