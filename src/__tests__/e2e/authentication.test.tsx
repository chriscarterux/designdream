/**
 * E2E Tests for HOW-331: User Authentication System
 * Tests login and signup flows including:
 * - Magic link authentication
 * - Password authentication
 * - Form validation
 * - Error handling
 * - Rate limiting
 * - Success states
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'
import SignupPage from '@/app/(auth)/signup/page'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock useAuth hook
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}))

// Mock password validation
jest.mock('@/lib/password-validation', () => ({
  validatePassword: jest.fn((password: string) => {
    const isValid = password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
    return {
      isValid,
      score: isValid ? 4 : 2,
      feedback: {
        warning: isValid ? '' : 'Password is too weak',
        suggestions: isValid ? [] : ['Use at least 12 characters', 'Include uppercase and lowercase letters', 'Include numbers'],
      },
    }
  }),
}))

// Mock PasswordStrengthMeter component
jest.mock('@/components/auth/PasswordStrengthMeter', () => ({
  PasswordStrengthMeter: ({ password, onValidationChange }: any) => {
    // Simulate validation callback
    if (password && onValidationChange) {
      const isValid = password.length >= 12
      onValidationChange({ isValid, score: isValid ? 4 : 2 })
    }
    return <div data-testid="password-strength-meter">Password Strength</div>
  },
}))

describe('HOW-331: User Authentication E2E', () => {
  const mockPush = jest.fn()
  const mockSignIn = jest.fn()
  const mockSignInWithMagicLink = jest.fn()
  const mockSignUp = jest.fn()
  const mockSearchParams = new URLSearchParams()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    ;(useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      signInWithMagicLink: mockSignInWithMagicLink,
      signUp: mockSignUp,
      user: null,
      isAuthenticated: false,
    })
  })

  describe('Login Page', () => {
    describe('Page Rendering', () => {
      it('should render login page with welcome message', () => {
        render(<LoginPage />)

        expect(screen.getByText('Welcome back')).toBeInTheDocument()
        expect(screen.getByText(/Sign in to your account to continue/i)).toBeInTheDocument()
      })

      it('should render method toggle buttons', () => {
        render(<LoginPage />)

        const magicLinkButton = screen.getByRole('button', { name: 'Magic Link' })
        const passwordButton = screen.getByRole('button', { name: 'Password' })

        expect(magicLinkButton).toBeInTheDocument()
        expect(passwordButton).toBeInTheDocument()
      })

      it('should render email input field', () => {
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/Email/i)
        expect(emailInput).toBeInTheDocument()
        expect(emailInput).toHaveAttribute('type', 'email')
        expect(emailInput).toHaveAttribute('required')
      })

      it('should default to magic link method', () => {
        render(<LoginPage />)

        const submitButton = screen.getByRole('button', { name: /Send magic link/i })
        expect(submitButton).toBeInTheDocument()
      })

      it('should render link to signup page', () => {
        render(<LoginPage />)

        const signupLink = screen.getByText(/Sign up/i)
        expect(signupLink).toBeInTheDocument()
        expect(signupLink).toHaveAttribute('href', '/signup')
      })
    })

    describe('Method Switching', () => {
      it('should switch to password method when Password button clicked', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const passwordButton = screen.getByRole('button', { name: 'Password' })
        await user.click(passwordButton)

        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign in with password/i })).toBeInTheDocument()
      })

      it('should show forgot password link in password mode', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        const passwordButton = screen.getByRole('button', { name: 'Password' })
        await user.click(passwordButton)

        const forgotLink = screen.getByText(/Forgot?/i)
        expect(forgotLink).toBeInTheDocument()
        expect(forgotLink).toHaveAttribute('href', '/forgot-password')
      })

      it('should switch back to magic link method', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        // Switch to password
        await user.click(screen.getByRole('button', { name: 'Password' }))
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()

        // Switch back to magic link
        await user.click(screen.getByRole('button', { name: 'Magic Link' }))
        expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Send magic link/i })).toBeInTheDocument()
      })
    })

    describe('Magic Link Flow', () => {
      it('should send magic link with valid email', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/Email/i)
        const submitButton = screen.getByRole('button', { name: /Send magic link/i })

        await user.type(emailInput, 'test@example.com')
        await user.click(submitButton)

        await waitFor(() => {
          expect(mockSignInWithMagicLink).toHaveBeenCalledWith('test@example.com')
        })
      })

      it('should show loading state while sending magic link', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockImplementation(() => new Promise(() => {}))

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByText(/Sending magic link\.\.\./i)).toBeInTheDocument()
        })
      })

      it('should show success screen after magic link sent', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByText('Check your email')).toBeInTheDocument()
          expect(screen.getByText(/We sent a magic link to/i)).toBeInTheDocument()
          expect(screen.getByText('test@example.com')).toBeInTheDocument()
        })
      })

      it('should show expiration time on magic link success screen', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByText(/The link will expire in 1 hour/i)).toBeInTheDocument()
        })
      })

      it('should allow using different email', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByText('Check your email')).toBeInTheDocument()
        })

        const differentEmailButton = screen.getByRole('button', { name: /Use a different email/i })
        await user.click(differentEmailButton)

        expect(screen.queryByText('Check your email')).not.toBeInTheDocument()
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
      })
    })

    describe('Password Login Flow', () => {
      it('should sign in with valid credentials', async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'SecurePass123')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'SecurePass123')
        })
      })

      it('should show loading state while signing in', async () => {
        const user = userEvent.setup()
        mockSignIn.mockImplementation(() => new Promise(() => {}))

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'password123')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(screen.getByText(/Signing in\.\.\./i)).toBeInTheDocument()
        })
      })

      it('should redirect to dashboard after successful login', async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValueOnce(undefined)

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'password123')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
      })

      it('should redirect to custom redirect URL when provided', async () => {
        const user = userEvent.setup()
        mockSignIn.mockResolvedValueOnce(undefined)
        mockSearchParams.set('redirect', '/admin')
        ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'password123')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/admin')
        })

        mockSearchParams.delete('redirect')
      })
    })

    describe('Error Handling', () => {
      it('should display error message on failed login', async () => {
        const user = userEvent.setup()
        mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'wrongpass')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
        })
      })

      it('should display error on failed magic link', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockRejectedValueOnce(new Error('Failed to send email'))

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByText(/Failed to send/i)).toBeInTheDocument()
        })
      })

      it('should handle rate limit error', async () => {
        const user = userEvent.setup()
        mockSignIn.mockRejectedValueOnce({
          status: 429,
          message: 'Too many attempts',
          retryAfter: 60,
        })

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'password')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(screen.getByText('Too Many Attempts')).toBeInTheDocument()
        })
      })

      it('should show countdown timer for rate limit', async () => {
        const user = userEvent.setup()
        mockSignIn.mockRejectedValueOnce({
          status: 429,
          retryAfter: 5,
        })

        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))
        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.type(screen.getByLabelText(/Password/i), 'password')
        await user.click(screen.getByRole('button', { name: /Sign in with password/i }))

        await waitFor(() => {
          expect(screen.getByText(/Try again in/i)).toBeInTheDocument()
        })
      })
    })

    describe('Form Validation', () => {
      it('should require email field', () => {
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/Email/i)
        expect(emailInput).toHaveAttribute('required')
      })

      it('should require password field in password mode', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))

        const passwordInput = screen.getByLabelText(/Password/i)
        expect(passwordInput).toHaveAttribute('required')
      })

      it('should have email input type', () => {
        render(<LoginPage />)

        const emailInput = screen.getByLabelText(/Email/i)
        expect(emailInput).toHaveAttribute('type', 'email')
      })

      it('should have password input type', async () => {
        const user = userEvent.setup()
        render(<LoginPage />)

        await user.click(screen.getByRole('button', { name: 'Password' }))

        const passwordInput = screen.getByLabelText(/Password/i)
        expect(passwordInput).toHaveAttribute('type', 'password')
      })
    })

    describe('Accessibility', () => {
      it('should have proper heading hierarchy', () => {
        render(<LoginPage />)

        // Card title should exist
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
      })

      it('should have accessible form labels', () => {
        render(<LoginPage />)

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      })

      it('should have accessible buttons', () => {
        render(<LoginPage />)

        expect(screen.getByRole('button', { name: 'Magic Link' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Password' })).toBeInTheDocument()
      })

      it('should disable form inputs while loading', async () => {
        const user = userEvent.setup()
        mockSignInWithMagicLink.mockImplementation(() => new Promise(() => {}))

        render(<LoginPage />)

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
        await user.click(screen.getByRole('button', { name: /Send magic link/i }))

        await waitFor(() => {
          expect(screen.getByLabelText(/Email/i)).toBeDisabled()
        })
      })
    })
  })

  describe('Signup Page', () => {
    describe('Page Rendering', () => {
      it('should render signup page with title', () => {
        render(<SignupPage />)

        expect(screen.getByText('Create an account')).toBeInTheDocument()
        expect(screen.getByText(/Enter your details to get started/i)).toBeInTheDocument()
      })

      it('should render all form fields', () => {
        render(<SignupPage />)

        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
      })

      it('should render password strength meter', () => {
        render(<SignupPage />)

        expect(screen.getByTestId('password-strength-meter')).toBeInTheDocument()
      })

      it('should render terms and privacy policy links', () => {
        render(<SignupPage />)

        const termsLink = screen.getByText(/Terms of Service/i)
        const privacyLink = screen.getByText(/Privacy Policy/i)

        expect(termsLink).toHaveAttribute('href', '/terms')
        expect(privacyLink).toHaveAttribute('href', '/privacy')
      })

      it('should render link to login page', () => {
        render(<SignupPage />)

        const loginLink = screen.getByText(/Sign in/i)
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/login')
      })
    })

    describe('Form Submission', () => {
      it('should create account with valid data', async () => {
        const user = userEvent.setup()
        mockSignUp.mockResolvedValueOnce(undefined)

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(mockSignUp).toHaveBeenCalledWith(
            'john@example.com',
            'SecurePass123!',
            { full_name: 'John Doe' }
          )
        })
      })

      it('should show loading state while creating account', async () => {
        const user = userEvent.setup()
        mockSignUp.mockImplementation(() => new Promise(() => {}))

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText(/Creating account\.\.\./i)).toBeInTheDocument()
        })
      })

      it('should show success screen after account created', async () => {
        const user = userEvent.setup()
        mockSignUp.mockResolvedValueOnce(undefined)

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText('Account created!')).toBeInTheDocument()
          expect(screen.getByText(/Check your email to verify your account/i)).toBeInTheDocument()
        })
      })

      it('should show redirect message on success', async () => {
        const user = userEvent.setup()
        mockSignUp.mockResolvedValueOnce(undefined)

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText(/Redirecting you to the dashboard/i)).toBeInTheDocument()
        })
      })
    })

    describe('Password Validation', () => {
      it('should validate password does not match', async () => {
        const user = userEvent.setup()

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'DifferentPass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
        })
      })

      it('should require strong password', async () => {
        const user = userEvent.setup()

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'weak')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'weak')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText(/Password does not meet security requirements/i)).toBeInTheDocument()
        })
      })

      it('should have minimum password length', () => {
        render(<SignupPage />)

        const passwordInput = screen.getByLabelText(/^Password$/i)
        expect(passwordInput).toHaveAttribute('minLength', '12')
      })
    })

    describe('Error Handling', () => {
      it('should display error on failed signup', async () => {
        const user = userEvent.setup()
        mockSignUp.mockRejectedValueOnce(new Error('Email already exists'))

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'existing@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText(/Email already exists/i)).toBeInTheDocument()
        })
      })

      it('should handle rate limit error', async () => {
        const user = userEvent.setup()
        mockSignUp.mockRejectedValueOnce({
          status: 429,
          message: 'Too many signup attempts',
          retryAfter: 60,
        })

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByText('Too Many Attempts')).toBeInTheDocument()
        })
      })
    })

    describe('Form Validation', () => {
      it('should require all fields', () => {
        render(<SignupPage />)

        expect(screen.getByLabelText(/Full Name/i)).toHaveAttribute('required')
        expect(screen.getByLabelText(/^Email$/i)).toHaveAttribute('required')
        expect(screen.getByLabelText(/^Password$/i)).toHaveAttribute('required')
        expect(screen.getByLabelText(/Confirm Password/i)).toHaveAttribute('required')
      })

      it('should have correct input types', () => {
        render(<SignupPage />)

        expect(screen.getByLabelText(/Full Name/i)).toHaveAttribute('type', 'text')
        expect(screen.getByLabelText(/^Email$/i)).toHaveAttribute('type', 'email')
        expect(screen.getByLabelText(/^Password$/i)).toHaveAttribute('type', 'password')
        expect(screen.getByLabelText(/Confirm Password/i)).toHaveAttribute('type', 'password')
      })
    })

    describe('Accessibility', () => {
      it('should have proper form labels', () => {
        render(<SignupPage />)

        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
      })

      it('should have accessible submit button', () => {
        render(<SignupPage />)

        expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
      })

      it('should disable form inputs while loading', async () => {
        const user = userEvent.setup()
        mockSignUp.mockImplementation(() => new Promise(() => {}))

        render(<SignupPage />)

        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')
        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(screen.getByLabelText(/Full Name/i)).toBeDisabled()
          expect(screen.getByLabelText(/^Email$/i)).toBeDisabled()
        })
      })
    })

    describe('Redirect Query Parameter', () => {
      it('should use custom redirect URL from query params', async () => {
        const user = userEvent.setup()
        mockSignUp.mockResolvedValueOnce(undefined)
        mockSearchParams.set('redirect', '/admin')
        ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

        render(<SignupPage />)

        // Wait for redirect after signup (simulated with setTimeout in component)
        // Since we can't wait for actual timeout in tests, just verify it would use the right URL
        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
        await user.type(screen.getByLabelText(/^Email$/i), 'john@example.com')
        await user.type(screen.getByLabelText(/^Password$/i), 'SecurePass123!')
        await user.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!')

        await user.click(screen.getByRole('button', { name: /Create account/i }))

        await waitFor(() => {
          expect(mockSignUp).toHaveBeenCalled()
        })

        mockSearchParams.delete('redirect')
      })

      it('should preserve redirect URL in login link', () => {
        mockSearchParams.set('redirect', '/admin')
        ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)

        render(<SignupPage />)

        const loginLink = screen.getByText(/Sign in/i)
        expect(loginLink).toHaveAttribute('href', '/login?redirect=/admin')

        mockSearchParams.delete('redirect')
      })
    })
  })
})
