// Payment Failed Email Template

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PaymentFailedEmailProps {
  recipientName: string;
  companyName: string;
  planName: string;
  amountDue: number;
  currency: string;
  invoiceUrl: string;
  portalUrl: string;
  attemptNumber: number;
  nextAttemptDate?: string;
  reason?: string;
}

export const PaymentFailedEmail = ({
  recipientName = 'Jane',
  companyName = 'Acme Corp',
  planName = 'Core Plan',
  amountDue = 4995,
  currency = 'usd',
  invoiceUrl = 'https://invoice.stripe.com/i/inv_123',
  portalUrl = 'https://billing.stripe.com/p/session_123',
  attemptNumber = 1,
  nextAttemptDate = 'in 3 days',
  reason = 'Your card was declined. Please update your payment method.',
}: PaymentFailedEmailProps) => {
  const previewText = `Action required: Payment for ${planName} failed`;
  const formattedAmount = (amountDue / 100).toFixed(2);
  const currencySymbol = currency === 'usd' ? '$' : currency.toUpperCase();
  const isFirstAttempt = attemptNumber === 1;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>DesignDream</Heading>
          </Section>

          {/* Alert Badge */}
          <Section style={alertBadge}>
            <Text style={alertText}>
              ⚠️ Payment Failed - Action Required
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              We were unable to process your recent payment for your {planName} subscription.
            </Text>

            {/* Payment Details */}
            <Section style={detailsBox}>
              <Heading as="h2" style={h2}>
                Payment Details
              </Heading>

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Company:</td>
                    <td style={valueCell}>{companyName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Plan:</td>
                    <td style={valueCell}>{planName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Amount Due:</td>
                    <td style={{ ...valueCell, fontWeight: '600', color: '#dc2626' }}>
                      {currencySymbol}{formattedAmount}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Attempt:</td>
                    <td style={valueCell}>#{attemptNumber}</td>
                  </tr>
                  {nextAttemptDate && (
                    <tr>
                      <td style={labelCell}>Next Retry:</td>
                      <td style={valueCell}>{nextAttemptDate}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* Reason Box */}
            {reason && (
              <Section style={reasonBox}>
                <Heading as="h3" style={h3}>
                  Why did this happen?
                </Heading>
                <Text style={reasonText}>{reason}</Text>
              </Section>
            )}

            {/* Action Buttons */}
            <Section style={buttonContainer}>
              <Button style={button} href={portalUrl}>
                Update Payment Method
              </Button>
            </Section>

            <Section style={secondaryButtonContainer}>
              <Button style={secondaryButton} href={invoiceUrl}>
                View Invoice
              </Button>
            </Section>

            {/* What Happens Next */}
            <Section style={nextStepsBox}>
              <Heading as="h3" style={h3}>
                What happens next?
              </Heading>
              {isFirstAttempt ? (
                <>
                  <Text style={nextStepsText}>
                    Don't worry - your account is still active. We'll automatically retry the payment {nextAttemptDate}.
                  </Text>
                  <ul style={list}>
                    <li style={listItem}>Update your payment method now to avoid service interruption</li>
                    <li style={listItem}>If the payment fails after all retry attempts, your subscription may be paused</li>
                    <li style={listItem}>No work will be lost - we'll hold your requests and data</li>
                  </ul>
                </>
              ) : (
                <>
                  <Text style={{ ...nextStepsText, color: '#dc2626', fontWeight: '500' }}>
                    ⚠️ This is attempt #{attemptNumber}. Please update your payment method immediately to avoid service interruption.
                  </Text>
                  <ul style={list}>
                    <li style={listItem}>Update your payment method now to maintain access</li>
                    <li style={listItem}>After final retry, your subscription will be paused</li>
                    <li style={listItem}>Your data and requests will be preserved</li>
                  </ul>
                </>
              )}
            </Section>

            {/* Help Section */}
            <Section style={helpBox}>
              <Text style={helpText}>
                <strong>Need help?</strong> Reply to this email or contact our support team. We're here to help resolve any payment issues.
              </Text>
            </Section>

            {/* Common Reasons */}
            <Section style={tipsBox}>
              <Heading as="h3" style={h3}>
                Common reasons for payment failures:
              </Heading>
              <ul style={list}>
                <li style={listItem}>Insufficient funds in account</li>
                <li style={listItem}>Expired credit card</li>
                <li style={listItem}>Card security settings blocking the charge</li>
                <li style={listItem}>Billing address doesn't match card records</li>
              </ul>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because a payment for your DesignDream subscription failed.
            </Text>
            <Text style={footerText}>
              Update your payment method to continue enjoying uninterrupted service.
            </Text>
            <Text style={footerText}>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`} style={link}>
                Manage email preferences
              </a>
              {' | '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/unsubscribe?token={unsubscribe_token}&type=all`} style={link}>
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentFailedEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const h3 = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const alertBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid #f59e0b',
  margin: '0 24px 24px',
  borderRadius: '4px',
  backgroundColor: '#fffbeb',
};

const alertText = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  color: '#b45309',
};

const content = {
  padding: '0 24px',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
  color: '#4b5563',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#6b7280',
  width: '40%',
};

const valueCell = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '500',
};

const reasonBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const reasonText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#991b1b',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0 16px',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const secondaryButtonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  color: '#4b5563',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 24px',
};

const nextStepsBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const nextStepsText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0 0 12px',
};

const list = {
  margin: '0',
  paddingLeft: '20px',
};

const listItem = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#4b5563',
  marginBottom: '8px',
};

const helpBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const helpText = {
  fontSize: '13px',
  lineHeight: '18px',
  color: '#4b5563',
  margin: '0',
};

const tipsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#9ca3af',
  margin: '4px 0',
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
};
