# Billing Management Feature

A comprehensive billing dashboard for DesignDream subscription management.

## Features

### 1. Current Plan Display
- Plan name and price ($4,495/month)
- Subscription status badge with color coding
- Next billing date countdown
- Billing cycle visualization
- Trial period indicator (if applicable)
- Cancelation warnings

### 2. Payment Method Management
- Display current payment method (card/bank account)
- Shows last 4 digits and expiration
- One-click access to Stripe Customer Portal
- Add/update payment methods securely

### 3. Invoice History
- Comprehensive table of past invoices
- Displays: date, amount, status, period
- Download PDF invoices
- View invoices in Stripe hosted page
- Filter and search capabilities
- Year-to-date totals

### 4. Subscription Actions
- **Cancel Subscription**: Cancel at end of billing period
- **Resume Subscription**: Undo cancelation
- **Pause Subscription**: Temporarily pause billing
- **Update Payment Method**: Via Stripe Customer Portal
- All actions have confirmation dialogs

### 5. Usage Statistics
- Requests this month counter
- All-time requests tracker
- Average turnaround time
- Total value delivered calculation

## Technical Stack

### UI Components (shadcn/ui)
- `Table` - Invoice history display
- `Dialog` - Confirmation modals
- `Badge` - Status indicators
- `Button` - Action triggers
- `Card` - Content sections

### Type Safety
All components are fully typed with TypeScript:
- `billing.types.ts` - Complete type definitions
- Strict typing for Stripe objects
- Type-safe API responses

### State Management
- `use-billing.ts` hook with SWR
- Automatic revalidation
- Optimistic updates
- Error handling

### Stripe Integration
- `stripe-billing.ts` - Helper functions
- Customer Portal sessions
- Subscription management
- Invoice retrieval
- Payment method handling

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── billing/
│   │       ├── route.ts                    # GET billing data
│   │       ├── actions/route.ts            # POST subscription actions
│   │       └── customer-portal/route.ts    # Create portal session
│   └── dashboard/
│       └── billing/
│           └── page.tsx                    # Main billing page
├── components/
│   ├── billing/
│   │   ├── current-plan.tsx               # Plan display component
│   │   ├── payment-method.tsx             # Payment info component
│   │   ├── invoice-table.tsx              # Invoice history table
│   │   ├── subscription-actions.tsx       # Action buttons/modals
│   │   └── usage-stats.tsx                # Usage metrics display
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── table.tsx
├── hooks/
│   └── use-billing.ts                      # Billing state hook
├── lib/
│   ├── stripe.ts                           # Stripe client config
│   └── stripe-billing.ts                   # Billing helpers
└── types/
    └── billing.types.ts                    # Type definitions
```

## API Routes

### GET /api/billing
Fetch complete billing data for a customer.

**Query Parameters:**
- `customerId` (required) - Stripe customer ID

**Response:**
```typescript
{
  subscription: SubscriptionInfo;
  paymentMethod: PaymentMethodInfo | null;
  invoices: Invoice[];
  usage: UsageStats;
}
```

### POST /api/billing/customer-portal
Create a Stripe Customer Portal session.

**Body:**
```typescript
{
  customerId: string;
  returnUrl?: string;
}
```

**Response:**
```typescript
{
  url: string; // Portal URL to redirect to
}
```

### POST /api/billing/actions
Execute subscription actions.

**Body:**
```typescript
{
  action: 'cancel' | 'resume' | 'pause' | 'update_payment';
  customerId: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

## Component Usage

### Basic Usage

```tsx
import { BillingPage } from '@/app/dashboard/billing/page';

// The page handles all state management internally
<BillingPage />
```

### Using Individual Components

```tsx
import { CurrentPlan } from '@/components/billing/current-plan';
import { InvoiceTable } from '@/components/billing/invoice-table';

function CustomBillingPage() {
  const { billingData } = useBilling({ customerId: 'cus_123' });

  return (
    <div>
      <CurrentPlan subscription={billingData.subscription} />
      <InvoiceTable invoices={billingData.invoices} />
    </div>
  );
}
```

### Using the Hook

```tsx
import { useBilling } from '@/hooks/use-billing';

function MyComponent() {
  const {
    billingData,
    isLoading,
    executeAction,
    refresh
  } = useBilling({
    customerId: 'cus_123',
    refreshInterval: 60000 // Refresh every minute
  });

  const handleCancel = async () => {
    const result = await executeAction('cancel');
    if (result.success) {
      console.log('Subscription canceled');
    }
  };

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## Subscription Status Display

The billing system supports all Stripe subscription statuses with appropriate visual indicators:

- **Active** - Green badge, normal operations
- **Trialing** - Blue badge, trial period active
- **Past Due** - Yellow badge, payment needed
- **Canceled** - Red badge, subscription ended
- **Unpaid** - Red badge, payment failed
- **Paused** - Gray badge, temporarily paused
- **Canceling** - Yellow badge, set to cancel at period end

## Security Considerations

### Authentication
All API routes should verify user authentication:

```typescript
// Example authentication check
const session = await getServerSession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Verify user owns the customer account
if (session.user.stripeCustomerId !== customerId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Environment Variables
Required environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Responsive Design

All components are fully responsive:
- Mobile-first approach
- Stacked layouts on small screens
- Grid layouts on larger screens
- Touch-friendly buttons and actions
- Optimized table scrolling on mobile

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast status badges
- Focus indicators on all interactive elements

## Error Handling

- Loading states for all async operations
- Error boundaries for component failures
- User-friendly error messages
- Fallback UI for missing data
- Retry mechanisms for failed requests

## Performance Optimizations

- SWR for intelligent caching
- Automatic revalidation
- Optimistic UI updates
- Lazy loading for large invoice lists
- Memoized components
- Efficient re-renders

## Testing Recommendations

### Unit Tests
- Test individual components in isolation
- Mock Stripe API responses
- Test error states
- Validate type safety

### Integration Tests
- Test full billing flow
- Test subscription actions
- Test portal redirect
- Test data fetching

### E2E Tests
- Complete user journeys
- Payment method updates
- Subscription cancelation/resume
- Invoice downloads

## Future Enhancements

Potential features to add:
- Usage-based billing metrics
- Multiple payment methods
- Invoice payment retry
- Billing email preferences
- Tax information management
- Team/multi-seat billing
- Upgrade/downgrade flows
- Proration handling
- Coupon/discount codes
- Referral credits
- Export billing data

## Stripe Customer Portal Configuration

The Customer Portal should be configured in Stripe Dashboard with:
- Payment method updates enabled
- Subscription cancelation allowed
- Invoice history access
- Custom branding
- Return URL configured

## Support

For issues or questions:
1. Check Stripe logs in dashboard
2. Review browser console errors
3. Verify environment variables
4. Check API route responses
5. Review Stripe webhook logs

## License

MIT
