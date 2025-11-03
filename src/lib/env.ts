/**
 * Environment variable validation and type-safe access
 * This ensures all required environment variables are present at runtime
 * with format validation to catch configuration errors early
 */

interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates URL format
 */
function isValidUrl(value: string): ValidationResult {
  try {
    const url = new URL(value)
    if (!url.protocol.startsWith('http')) {
      return {
        isValid: false,
        error: 'URL must use http or https protocol'
      }
    }
    return { isValid: true }
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format (expected: https://example.com)'
    }
  }
}

/**
 * Validates JWT format (basic check for Supabase keys)
 */
function isValidJWT(value: string): ValidationResult {
  if (!value.startsWith('eyJ')) {
    return {
      isValid: false,
      error: 'Invalid JWT format (Supabase keys should start with "eyJ")'
    }
  }

  const parts = value.split('.')
  if (parts.length !== 3) {
    return {
      isValid: false,
      error: 'Invalid JWT structure (expected 3 parts separated by dots)'
    }
  }

  return { isValid: true }
}

/**
 * Validates Stripe key format
 */
function isValidStripeKey(value: string, type: 'secret' | 'publishable'): ValidationResult {
  const expectedPrefixes = type === 'secret'
    ? ['sk_test_', 'sk_live_']
    : ['pk_test_', 'pk_live_']

  const hasValidPrefix = expectedPrefixes.some(prefix => value.startsWith(prefix))

  if (!hasValidPrefix) {
    return {
      isValid: false,
      error: `Invalid Stripe ${type} key format (expected: ${expectedPrefixes.join(' or ')})`
    }
  }

  return { isValid: true }
}

/**
 * Validates Resend API key format
 */
function isValidResendKey(value: string): ValidationResult {
  if (!value.startsWith('re_')) {
    return {
      isValid: false,
      error: 'Invalid Resend API key format (expected: re_...)'
    }
  }

  return { isValid: true }
}

/**
 * Environment variable configuration with validation rules
 */
interface EnvVarConfig {
  key: string
  required: boolean
  validate?: (value: string) => ValidationResult
  description: string
  example?: string
}

const ENV_CONFIG: EnvVarConfig[] = [
  // Supabase (Critical - Required)
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    validate: isValidUrl,
    description: 'Supabase project URL',
    example: 'https://xxxxxxxxxxxxx.supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    validate: isValidJWT,
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: false, // Optional but recommended for admin operations
    validate: isValidJWT,
    description: 'Supabase service role key (for admin operations)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },

  // Stripe (Required for payment features)
  {
    key: 'STRIPE_SECRET_KEY',
    required: false, // Will be required when Stripe features are enabled
    validate: (value) => isValidStripeKey(value, 'secret'),
    description: 'Stripe secret key for server-side operations',
    example: 'sk_test_... or sk_live_...'
  },
  {
    key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: false,
    validate: (value) => isValidStripeKey(value, 'publishable'),
    description: 'Stripe publishable key for client-side',
    example: 'pk_test_... or pk_live_...'
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    required: false,
    description: 'Stripe webhook signing secret',
    example: 'whsec_...'
  },

  // Email (Required for notifications)
  {
    key: 'RESEND_API_KEY',
    required: false, // Will be required when email features are enabled
    validate: isValidResendKey,
    description: 'Resend API key for sending emails',
    example: 're_...'
  },

  // App Configuration
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: false,
    validate: isValidUrl,
    description: 'Application URL (for redirects and emails)',
    example: 'https://yourdomain.com or http://localhost:3000'
  },

  // Basecamp (Optional)
  {
    key: 'BASECAMP_CLIENT_ID',
    required: false,
    description: 'Basecamp OAuth client ID',
  },
  {
    key: 'BASECAMP_CLIENT_SECRET',
    required: false,
    description: 'Basecamp OAuth client secret',
  },
  {
    key: 'BASECAMP_ACCOUNT_ID',
    required: false,
    description: 'Basecamp account ID',
  },
]

interface ValidationError {
  key: string
  issue: 'missing' | 'invalid'
  message: string
  example?: string
}

/**
 * Validates that all required environment variables are present and properly formatted
 * Call this during application initialization to fail fast
 *
 * @throws Error if any required environment variables are missing or invalid
 */
export function validateEnv() {
  const errors: ValidationError[] = []
  const warnings: string[] = []

  ENV_CONFIG.forEach(config => {
    const value = process.env[config.key]

    // Check if required variable is missing
    if (config.required && !value) {
      errors.push({
        key: config.key,
        issue: 'missing',
        message: config.description,
        example: config.example
      })
      return
    }

    // Skip validation if optional and not provided
    if (!config.required && !value) {
      if (process.env.NODE_ENV === 'development') {
        warnings.push(`${config.key} - ${config.description}`)
      }
      return
    }

    // Validate format if value exists and validator is defined
    if (value && config.validate) {
      const result = config.validate(value)
      if (!result.isValid) {
        errors.push({
          key: config.key,
          issue: 'invalid',
          message: result.error || 'Invalid format',
          example: config.example
        })
      }
    }
  })

  // Report errors
  if (errors.length > 0) {
    const errorMessage = [
      '\n========================================',
      'ENVIRONMENT CONFIGURATION ERROR',
      '========================================\n',
      'The following environment variables have issues:\n'
    ]

    errors.forEach(error => {
      errorMessage.push(`\n${error.issue === 'missing' ? 'MISSING' : 'INVALID'}: ${error.key}`)
      errorMessage.push(`  Description: ${error.message}`)
      if (error.example) {
        errorMessage.push(`  Example: ${error.example}`)
      }
    })

    errorMessage.push('\n----------------------------------------')
    errorMessage.push('HOW TO FIX:')
    errorMessage.push('----------------------------------------')
    errorMessage.push('1. Copy .env.local.example to .env.local')
    errorMessage.push('2. Fill in the required values')
    errorMessage.push('3. Restart your development server')
    errorMessage.push('4. Verify values at: https://supabase.com/dashboard')
    errorMessage.push('   and https://dashboard.stripe.com/apikeys')
    errorMessage.push('========================================\n')

    throw new Error(errorMessage.join('\n'))
  }

  // Report warnings for optional variables in development
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n----------------------------------------')
    console.warn('Optional environment variables not set:')
    console.warn('----------------------------------------')
    warnings.forEach(warning => {
      console.warn(`  - ${warning}`)
    })
    console.warn('----------------------------------------\n')
  }

  // Success message in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment variables validated successfully')
  }
}

/**
 * Safely gets an environment variable with optional default
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]

  if (!value && defaultValue === undefined) {
    throw new Error(
      `Environment variable ${key} is not set. ` +
      `This should have been caught by validateEnv(). ` +
      `Make sure to call validateEnv() at application startup.`
    )
  }

  return value || defaultValue || ''
}

/**
 * Type-safe environment variables
 * Access these instead of process.env directly for better type safety
 *
 * Note: Call validateEnv() before accessing these values
 */
export const env = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
  },

  // Stripe
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', ''),
  },

  // Email
  email: {
    resendApiKey: getEnvVar('RESEND_API_KEY', ''),
  },

  // Basecamp
  basecamp: {
    clientId: getEnvVar('BASECAMP_CLIENT_ID', ''),
    clientSecret: getEnvVar('BASECAMP_CLIENT_SECRET', ''),
    accountId: getEnvVar('BASECAMP_ACCOUNT_ID', ''),
  },

  // App
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },

  // Runtime
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const
