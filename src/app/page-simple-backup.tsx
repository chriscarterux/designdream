import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Always-On Design & Development Partner
            </h1>
            <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
              Ship websites, mobile apps, and AI-powered features—one task at a time, delivered in 48 hours.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/subscribe">
                  Start Your Subscription
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
