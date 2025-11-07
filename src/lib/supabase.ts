import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock authenticated user for now
export async function getAuthenticatedUser() {
  // In production, this would check actual Supabase auth
  return {
    id: 'user_123',
    email: 'client@example.com',
    name: 'John Doe',
    avatar: null,
  };
}
