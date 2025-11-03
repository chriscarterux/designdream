'use client';

import { useAuthContext } from '@/components/providers/auth-provider';

/**
 * Hook to access authentication state and methods
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 * // Sign in with email/password
 * await signIn('user@example.com', 'password');
 *
 * // Sign out
 * await signOut();
 * ```
 */
export function useAuth() {
  return useAuthContext();
}
