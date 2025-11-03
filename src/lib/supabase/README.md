# Supabase Client Utilities

This directory contains properly configured Supabase clients for different Next.js contexts.

## Files

- **client.ts**: Browser/client-side Supabase client for Client Components
- **server.ts**: Server-side Supabase client for Server Components, Server Actions, and Route Handlers
- **middleware.ts**: Supabase client for Next.js middleware (handles session refresh)
- **index.ts**: Barrel export for convenient imports

## Usage

### Client Components

Use the browser client in Client Components (marked with `'use client'`):

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return <div>User: {user?.email}</div>
}
```

### Server Components

Use the server client in Server Components (async by default):

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('items')
    .select('*')

  return (
    <div>
      {items?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Server Actions

Use the server client in Server Actions:

```tsx
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('items')
    .insert({
      name: formData.get('name')
    })

  if (error) {
    throw error
  }

  return data
}
```

### Route Handlers

Use the server client in API routes:

```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('items')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

### Admin Operations

For privileged operations that bypass RLS, use the admin client (server-side only):

```tsx
import { createAdminClient } from '@/lib/supabase/server'

export async function adminOperation() {
  const supabase = createAdminClient()

  // This bypasses Row Level Security policies
  const { data } = await supabase
    .from('sensitive_data')
    .select('*')

  return data
}
```

⚠️ **Warning**: The admin client uses the service role key and bypasses all RLS policies. Use with extreme caution and never expose it to the client.

### Middleware

The middleware automatically refreshes user sessions and is already configured in `/src/middleware.ts`:

```tsx
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request)
  return response
}
```

## Environment Variables

Required environment variables (in `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional, only for admin operations
```

## Testing Connection

To verify your Supabase connection is working:

```bash
curl http://localhost:3000/api/test-connection
```

Or visit `/api/test-connection` in your browser.

## Best Practices

1. **Never use the admin client in client-side code** - It bypasses all security policies
2. **Always use the server client for server-side operations** - It properly manages cookies
3. **Use the browser client only in Client Components** - It handles auth state updates
4. **Let middleware handle session refresh** - It runs on every request automatically
5. **Always handle errors** - Supabase operations can fail for many reasons
6. **Use TypeScript types** - Generate types with `npm run db:types`

## Security Considerations

- The anon key is safe to expose publicly (it's prefixed with `NEXT_PUBLIC_`)
- The service role key must NEVER be exposed to the client
- Always implement Row Level Security (RLS) policies in Supabase
- Use the admin client sparingly and only when absolutely necessary
- Validate all user input before database operations
