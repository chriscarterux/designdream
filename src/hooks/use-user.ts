'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { User } from '@supabase/supabase-js';

/**
 * Hook to access the current user
 * Returns null if no user is authenticated
 *
 * @example
 * ```tsx
 * const user = useUser();
 *
 * if (!user) {
 *   return <LoginPrompt />;
 * }
 *
 * return <div>Welcome {user.email}</div>;
 * ```
 */
export function useUser(): User | null {
  const { user } = useAuthContext();
  return user;
}

/**
 * Hook that throws an error if no user is authenticated
 * Use this in components that require authentication
 *
 * @example
 * ```tsx
 * const user = useRequireAuth();
 * // user is guaranteed to be non-null or error is thrown
 * return <div>Welcome {user.email}</div>;
 * ```
 */
export function useRequireAuth(): User {
  const { user, isLoading } = useAuthContext();

  if (!isLoading && !user) {
    throw new Error('This component requires authentication');
  }

  return user!;
}

/**
 * Hook to check authentication status
 *
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 *
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
}
