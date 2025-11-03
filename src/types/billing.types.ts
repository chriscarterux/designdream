import Stripe from 'stripe';

// Subscription status types
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'
  | 'paused';

// Billing data from database/Stripe
export interface BillingData {
  subscription: SubscriptionInfo;
  paymentMethod: PaymentMethodInfo | null;
  invoices: Invoice[];
  usage: UsageStats;
}

// Subscription information
export interface SubscriptionInfo {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  planName: string;
  planPrice: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
  createdAt: Date;
}

// Payment method details
export interface PaymentMethodInfo {
  id: string;
  type: 'card' | 'us_bank_account' | 'other';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  bankAccount?: {
    bankName: string;
    last4: string;
  };
}

// Invoice data
export interface Invoice {
  id: string;
  number: string | null;
  amountDue: number; // in cents
  amountPaid: number; // in cents
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  created: Date;
  dueDate: Date | null;
  pdfUrl: string | null;
  hostedInvoiceUrl: string | null;
  periodStart: Date;
  periodEnd: Date;
}

// Usage statistics
export interface UsageStats {
  requestsThisMonth: number;
  requestsAllTime: number;
  averageTurnaroundHours: number;
  totalValueDelivered: number; // calculated value
  currentMonthStart: Date;
  currentMonthEnd: Date;
}

// Subscription action types
export type SubscriptionAction =
  | 'update_payment'
  | 'pause'
  | 'resume'
  | 'cancel'
  | 'reactivate';

// API response types
export interface BillingAPIResponse {
  success: boolean;
  data?: BillingData;
  error?: string;
}

export interface SubscriptionActionResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Stripe Customer Portal session
export interface CustomerPortalSession {
  url: string;
}

// Helper type for subscription status display
export interface SubscriptionStatusDisplay {
  label: string;
  variant: 'success' | 'warning' | 'destructive' | 'default' | 'secondary';
  description: string;
}
