/**
 * Supabase Client Utilities
 *
 * This module provides type-safe Supabase clients for different contexts:
 * - Client Components: Use client.ts
 * - Server Components/Actions: Use server.ts
 * - Middleware: Use middleware.ts
 *
 * @example Client Component
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 *
 * export default function Component() {
 *   const supabase = createClient()
 *   // Use supabase client...
 * }
 * ```
 *
 * @example Server Component
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Component() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('table').select()
 *   // Use data...
 * }
 * ```
 *
 * @example Middleware
 * ```tsx
 * import { updateSession } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 * ```
 */

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient, createAdminClient } from './server'
export { updateSession } from './middleware'
