/**
 * E2E Tests for HOW-250: Stripe Checkout Integration
 * Tests the complete checkout flow including:
 * - Subscribe page rendering
 * - Form validation
 * - Checkout session creation
 * - Success/cancel handling
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubscribePage from '@/app/subscribe/page'
import { stripe } from '@/lib/stripe'

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    customers: {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
  stripeConfig: {
    products: {
      subscription: {
        name: 'DesignDream Monthly',
        description: 'Unlimited design and development',
        priceAmount: 449500,
        currency: 'usd',
        interval: 'month',
      },
    },
    urls: {
      success: 'http://localhost:3000/subscribe/success',
      cancel: 'http://localhost:3000/subscribe/cancel',
    },
  },
  formatStripeAmount: (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  },
  SERVER_PRICE_CONSTANTS: {
    MONTHLY_SUBSCRIPTION: 449500,
  },
  retryStripeOperation: jest.fn((fn) => fn()),
  generateIdempotencyKey: jest.fn(() => 'test-idempotency-key'),
  getStripeErrorMessage: jest.fn(),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('HOW-250: Stripe Checkout Integration E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('Subscribe Page Rendering', () => {
    it('should render the subscribe page with pricing', () => {
      render(<SubscribePage />)

      // Check main heading
      expect(screen.getByText(/Subscribe to DesignDream/i)).toBeInTheDocument()

      // Check pricing display
      expect(screen.getByText(/\$4,495\.00/i)).toBeInTheDocument()
      expect(screen.getByText(/\/month/i)).toBeInTheDocument()

      // Check features list
      expect(screen.getByText(/Unlimited projects/i)).toBeInTheDocument()
      expect(screen.getByText(/Priority support/i)).toBeInTheDocument()

      // Check form exists
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Continue to Payment/i })).toBeInTheDocument()
    })

    it('should render FAQ section', () => {
      render(<SubscribePage />)

      expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
      expect(screen.getByText(/Can I cancel anytime\?/i)).toBeInTheDocument()
      expect(screen.getByText(/What payment methods do you accept\?/i)).toBeInTheDocument()
    })

    it('should show security badge', () => {
      render(<SubscribePage />)

      expect(screen.getByText(/Secure checkout powered by Stripe/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should require email address', async () => {
      const user = userEvent.setup()
      render(<SubscribePage />)

      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })
      await user.click(submitButton)

      // HTML5 validation should prevent submission
      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
      expect(emailInput.validity.valid).toBe(false)
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()
      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      // Enter invalid email
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should accept optional name field', async () => {
      const user = userEvent.setup()
      render(<SubscribePage />)

      const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
      expect(nameInput.required).toBe(false)
    })
  })

  describe('Checkout Session Creation', () => {
    it('should create checkout session with valid email', async () => {
      const user = userEvent.setup()
      const mockCheckoutUrl = 'https://checkout.stripe.com/test-session'

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'test-session-id',
          url: mockCheckoutUrl,
        }),
      })

      // Mock window.location
      delete (window as any).location
      window.location = { href: '' } as any

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      // Fill form with valid email
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Wait for API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/stripe/create-checkout-session',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              customerName: undefined,
              userId: 'user_placeholder',
            }),
          })
        )
      })

      // Should redirect to Stripe
      await waitFor(() => {
        expect(window.location.href).toBe(mockCheckoutUrl)
      })
    })

    it('should include customer name if provided', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'test-session-id',
          url: 'https://checkout.stripe.com/test',
        }),
      })

      delete (window as any).location
      window.location = { href: '' } as any

      render(<SubscribePage />)

      const nameInput = screen.getByLabelText(/Full Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/stripe/create-checkout-session',
          expect.objectContaining({
            body: JSON.stringify({
              email: 'john@example.com',
              customerName: 'John Doe',
              userId: 'user_placeholder',
            }),
          })
        )
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()

      // Delay the response
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/Processing\.\.\./i)).toBeInTheDocument()
      })
    })

    it('should disable form during submission', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Inputs should be disabled
      await waitFor(() => {
        expect(emailInput).toBeDisabled()
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error when API call fails', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Failed to create checkout session',
        }),
      })

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to create checkout session/i)).toBeInTheDocument()
      })

      // Form should be re-enabled
      expect(emailInput).not.toBeDisabled()
      expect(submitButton).not.toBeDisabled()
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByRole('button', { name: /Continue to Payment/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const nameInput = screen.getByLabelText(/Full Name/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(nameInput).toHaveAttribute('type', 'text')
    })

    it('should indicate required fields', () => {
      render(<SubscribePage />)

      // Email should have required indicator
      expect(screen.getByText('*', { selector: '.text-red-500' })).toBeInTheDocument()
    })

    it('should have accessible error messages', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Test error' }),
      })

      render(<SubscribePage />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      await user.type(emailInput, 'test@example.com')
      await user.click(screen.getByRole('button', { name: /Continue to Payment/i }))

      await waitFor(() => {
        const errorMessage = screen.getByText(/Test error/i)
        expect(errorMessage).toBeInTheDocument()
        // Error should be in a visible container
        expect(errorMessage.closest('div')).toHaveClass('bg-red-50')
      })
    })
  })
})
