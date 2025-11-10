'use client';

import { useState, useEffect } from 'react';
import { ClientSidebar } from '@/components/client/ClientSidebar';
import { ClientTopBar } from '@/components/client/ClientTopBar';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useUser();
  const router = useRouter();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, router]);

  // Show loading state while checking auth
  if (user === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Format user data for components
  const formattedUser = {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        <ClientTopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          user={formattedUser}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
