'use client';

import {
  CreditCard,
  Download,
  ExternalLink,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/types/client';

export default function BillingPage() {
  // Mock data - in production, fetch from API
  const subscription = {
    plan: 'Pro Plan',
    status: 'active',
    amount: 9900,
    currency: 'usd',
    billingPeriod: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  };

  const paymentMethod = {
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
  };

  const invoices = [
    {
      id: 'inv_1',
      number: 'INV-2024-001',
      amount: 9900,
      currency: 'usd',
      status: 'paid',
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      hostedInvoiceUrl: '#',
    },
    {
      id: 'inv_2',
      number: 'INV-2024-002',
      amount: 9900,
      currency: 'usd',
      status: 'paid',
      created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      hostedInvoiceUrl: '#',
    },
  ];

  const usage = {
    requestsUsed: 8,
    requestsLimit: 20,
    storageUsed: 2.4,
    storageLimit: 10,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-2xl font-bold">{subscription.plan}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Billed {subscription.billingPeriod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </p>
                <p className="text-sm text-gray-600 mt-1">per month</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next billing date</span>
              <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1">
                Change Plan
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('https://billing.stripe.com', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage via Stripe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your default payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <p className="font-medium">
                    {paymentMethod.brand} •••• {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your resource usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Requests</span>
                <span className="font-medium">
                  {usage.requestsUsed} / {usage.requestsLimit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${(usage.requestsUsed / usage.requestsLimit) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium">
                  {usage.storageUsed} GB / {usage.storageLimit} GB
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(usage.storageUsed / usage.storageLimit) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.number}</p>
                    <p className="text-sm text-gray-600">
                      Paid on {formatDate(invoice.paidAt || invoice.created)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Need more requests?</h3>
              <p className="text-sm text-gray-600">
                Upgrade to Enterprise for unlimited requests and priority support
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
