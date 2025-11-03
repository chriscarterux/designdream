import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Creates a Supabase client for use in Client Components
 * This client automatically handles cookie-based authentication
 *
 * @returns Supabase client instance for browser/client-side usage
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') {
            return undefined;
          }
          const cookies = document.cookie.split('; ');
          const cookie = cookies.find((c) => c.startsWith(`${name}=`));
          return cookie?.split('=')[1];
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') {
            return;
          }
          let cookie = `${name}=${value}`;
          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
          }
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') {
            return;
          }
          const cookie = `${name}=; max-age=0${options?.path ? `; path=${options.path}` : ''}`;
          document.cookie = cookie;
        },
      },
    }
  );
}
