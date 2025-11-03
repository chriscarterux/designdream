/**
 * Environment variable validation and type-safe access
 * This ensures all required environment variables are present at runtime
 */

function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key]

  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value || ''
}

/**
 * Validates that all required environment variables are present
 * Call this during application initialization to fail fast
 */
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const optionalEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ]

  const missing: string[] = []

  requiredEnvVars.forEach(key => {
    try {
      getEnvVar(key, true)
    } catch {
      missing.push(key)
    }
  })

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}\n\n` +
      'Please check your .env.local file.'
    )
  }

  // Log optional vars that are missing (for debugging)
  if (process.env.NODE_ENV === 'development') {
    const missingOptional = optionalEnvVars.filter(key => !process.env[key])
    if (missingOptional.length > 0) {
      console.warn(
        'Optional environment variables not set:',
        missingOptional.join(', ')
      )
    }
  }
}

/**
 * Type-safe environment variables
 * Access these instead of process.env directly for better type safety
 */
export const env = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false),
  },

  // App
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
  },

  // Runtime
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const
