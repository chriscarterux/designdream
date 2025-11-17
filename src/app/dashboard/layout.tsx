'use client';

import { useState, useEffect } from 'react';
import { ClientSidebar } from '@/components/client/ClientSidebar';
import { ClientTopBar } from '@/components/client/ClientTopBar';

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user - in production this would come from auth context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined,
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

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
          user={user}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
