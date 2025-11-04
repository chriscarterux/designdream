'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Inbox,
  Plus,
  CreditCard,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ClientSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/dashboard/requests',
    label: 'My Requests',
    icon: Inbox,
  },
  {
    href: '/dashboard/submit',
    label: 'Submit Request',
    icon: Plus,
  },
  {
    href: '/dashboard/billing',
    label: 'Billing',
    icon: CreditCard,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function ClientSidebar({ isOpen = true, onClose }: ClientSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between p-6 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              DesignDream
            </span>
          </Link>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Support section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">Need help?</p>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <a href="mailto:support@designdream.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
