'use client';

import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopBarProps {
  onMenuClick: () => void;
}

const routeNames: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/clients': 'Clients',
  '/admin/queue': 'Global Queue',
  '/admin/sla': 'SLA Dashboard',
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always start with Admin
  breadcrumbs.push({ name: 'Admin', href: '/admin' });

  // Add subsequent segments
  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === 'admin') continue;
    currentPath += `/${segments[i]}`;
    const fullPath = `/admin${currentPath}`;
    breadcrumbs.push({
      name: routeNames[fullPath] || segments[i],
      href: fullPath,
    });
  }

  // If we're on /admin exactly, return just Admin
  if (pathname === '/admin') {
    return [{ name: 'Overview', href: '/admin' }];
  }

  return breadcrumbs;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      {/* Left side: Menu button and breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-2 h-4 w-4 text-slate-400" />
              )}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-500'
                }
              >
                {crumb.name}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: User menu */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar-placeholder.png" alt="User" />
                <AvatarFallback className="bg-purple-600 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@designdreams.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
