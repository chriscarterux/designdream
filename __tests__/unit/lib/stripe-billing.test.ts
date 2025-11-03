import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  cancelSubscriptionAtPeriodEnd,
  resumeSubscription,
  pauseSubscription,
  unpauseSubscription,
  getSubscriptionStatusDisplay,
  formatCardBrand,
} from '@/lib/stripe-billing';
import type { SubscriptionStatus } from '@/types/billing.types';

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
  stripe: {
    subscriptions: {
      update: vi.fn(),
      list: vi.fn(),
    },
    paymentMethods: {
      list: vi.fn(),
    },
    invoices: {
      list: vi.fn(),
    },
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  formatStripeAmount: vi.fn((amount) => `$${(amount / 100).toFixed(2)}`),
}));

describe('Stripe Billing Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cancelSubscriptionAtPeriodEnd', () => {
    it('should successfully cancel subscription', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockResolvedValue({} as any);

      const result = await cancelSubscriptionAtPeriodEnd('sub_123');

      expect(result).toBe(true);
      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: true,
      });
    });

    it('should handle cancellation errors gracefully', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockRejectedValue(
        new Error('Stripe API error')
      );

      const result = await cancelSubscriptionAtPeriodEnd('sub_123');

      expect(result).toBe(false);
    });
  });

  describe('resumeSubscription', () => {
    it('should successfully resume subscription', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockResolvedValue({} as any);

      const result = await resumeSubscription('sub_123');

      expect(result).toBe(true);
      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: false,
      });
    });

    it('should handle resume errors gracefully', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockRejectedValue(
        new Error('Stripe API error')
      );

      const result = await resumeSubscription('sub_123');

      expect(result).toBe(false);
    });
  });

  describe('pauseSubscription', () => {
    it('should successfully pause subscription', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockResolvedValue({} as any);

      const result = await pauseSubscription('sub_123');

      expect(result).toBe(true);
      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        pause_collection: {
          behavior: 'mark_uncollectible',
        },
      });
    });

    it('should handle pause errors gracefully', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockRejectedValue(
        new Error('Stripe API error')
      );

      const result = await pauseSubscription('sub_123');

      expect(result).toBe(false);
    });
  });

  describe('unpauseSubscription', () => {
    it('should successfully unpause subscription', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockResolvedValue({} as any);

      const result = await unpauseSubscription('sub_123');

      expect(result).toBe(true);
      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        pause_collection: null,
      });
    });

    it('should handle unpause errors gracefully', async () => {
      const { stripe } = await import('@/lib/stripe');
      vi.mocked(stripe.subscriptions.update).mockRejectedValue(
        new Error('Stripe API error')
      );

      const result = await unpauseSubscription('sub_123');

      expect(result).toBe(false);
    });
  });

  describe('getSubscriptionStatusDisplay', () => {
    it('should return canceling status when cancel_at_period_end is true', () => {
      const display = getSubscriptionStatusDisplay('active', true);

      expect(display.label).toBe('Canceling');
      expect(display.variant).toBe('warning');
      expect(display.description).toContain('end at the current period');
    });

    it('should return active status', () => {
      const display = getSubscriptionStatusDisplay('active', false);

      expect(display.label).toBe('Active');
      expect(display.variant).toBe('success');
      expect(display.description).toContain('active and in good standing');
    });

    it('should return trialing status', () => {
      const display = getSubscriptionStatusDisplay('trialing', false);

      expect(display.label).toBe('Trial');
      expect(display.variant).toBe('default');
      expect(display.description).toContain('trial period is active');
    });

    it('should return past_due status', () => {
      const display = getSubscriptionStatusDisplay('past_due', false);

      expect(display.label).toBe('Past Due');
      expect(display.variant).toBe('warning');
      expect(display.description).toContain('update your payment method');
    });

    it('should return canceled status', () => {
      const display = getSubscriptionStatusDisplay('canceled', false);

      expect(display.label).toBe('Canceled');
      expect(display.variant).toBe('destructive');
      expect(display.description).toContain('has been canceled');
    });

    it('should return unpaid status', () => {
      const display = getSubscriptionStatusDisplay('unpaid', false);

      expect(display.label).toBe('Unpaid');
      expect(display.variant).toBe('destructive');
      expect(display.description).toContain('Payment failed');
    });

    it('should return paused status', () => {
      const display = getSubscriptionStatusDisplay('paused', false);

      expect(display.label).toBe('Paused');
      expect(display.variant).toBe('secondary');
      expect(display.description).toContain('is paused');
    });

    it('should return incomplete status', () => {
      const display = getSubscriptionStatusDisplay('incomplete', false);

      expect(display.label).toBe('Incomplete');
      expect(display.variant).toBe('warning');
      expect(display.description).toContain('setup is incomplete');
    });

    it('should return incomplete_expired status', () => {
      const display = getSubscriptionStatusDisplay('incomplete_expired', false);

      expect(display.label).toBe('Expired');
      expect(display.variant).toBe('destructive');
      expect(display.description).toContain('setup expired');
    });

    it('should handle unknown status', () => {
      const display = getSubscriptionStatusDisplay('unknown' as SubscriptionStatus, false);

      expect(display.label).toBe('unknown');
      expect(display.variant).toBe('default');
      expect(display.description).toBe('');
    });
  });

  describe('formatCardBrand', () => {
    it('should format common card brands', () => {
      expect(formatCardBrand('visa')).toBe('Visa');
      expect(formatCardBrand('mastercard')).toBe('Mastercard');
      expect(formatCardBrand('amex')).toBe('American Express');
      expect(formatCardBrand('discover')).toBe('Discover');
      expect(formatCardBrand('diners')).toBe('Diners Club');
      expect(formatCardBrand('jcb')).toBe('JCB');
      expect(formatCardBrand('unionpay')).toBe('UnionPay');
    });

    it('should handle case insensitivity', () => {
      expect(formatCardBrand('VISA')).toBe('Visa');
      expect(formatCardBrand('MasterCard')).toBe('Mastercard');
    });

    it('should return original brand for unknown brands', () => {
      expect(formatCardBrand('unknown-brand')).toBe('unknown-brand');
    });
  });
});
