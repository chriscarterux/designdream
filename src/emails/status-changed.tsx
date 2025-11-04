// Status Changed Email Template

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

interface StatusChangedEmailProps {
  requestTitle: string;
  oldStatus: string;
  newStatus: string;
  message?: string;
  nextSteps?: string;
  estimatedCompletion?: string;
  requestUrl: string;
  recipientName: string;
}

export const StatusChangedEmail = ({
  requestTitle = 'Website Redesign',
  oldStatus = 'in_progress',
  newStatus = 'review',
  message = 'Your request is now ready for review. We\'ve completed the initial implementation and would love your feedback.',
  nextSteps = 'Please review the deliverables and provide any feedback or revision requests.',
  estimatedCompletion = 'Final delivery by end of week',
  requestUrl = 'https://app.designdream.is/dashboard/requests/123',
  recipientName = 'Jane',
}: StatusChangedEmailProps) => {
  const previewText = `Status Update: "${requestTitle}" is now ${newStatus.replace('_', ' ')}`;

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; icon: string; description: string }> = {
      backlog: {
        label: 'Backlog',
        color: '#6b7280',
        bg: '#f3f4f6',
        icon: '📋',
        description: 'Request is queued and will be reviewed soon',
      },
      up_next: {
        label: 'Up Next',
        color: '#7c3aed',
        bg: '#f3e8ff',
        icon: '🎯',
        description: 'Request is prioritized and will start soon',
      },
      in_progress: {
        label: 'In Progress',
        color: '#2563eb',
        bg: '#dbeafe',
        icon: '🚀',
        description: 'We\'re actively working on your request',
      },
      blocked: {
        label: 'Blocked',
        color: '#dc2626',
        bg: '#fee2e2',
        icon: '🚫',
        description: 'Waiting for information or dependencies',
      },
      review: {
        label: 'In Review',
        color: '#f59e0b',
        bg: '#fef3c7',
        icon: '👀',
        description: 'Ready for your review and feedback',
      },
      done: {
        label: 'Completed',
        color: '#059669',
        bg: '#d1fae5',
        icon: '✅',
        description: 'Request is complete and delivered',
      },
      cancelled: {
        label: 'Cancelled',
        color: '#6b7280',
        bg: '#f3f4f6',
        icon: '❌',
        description: 'Request has been cancelled',
      },
    };

    return statusMap[status] || statusMap.backlog;
  };

  const oldStatusInfo = getStatusInfo(oldStatus);
  const newStatusInfo = getStatusInfo(newStatus);
  const isCompleted = newStatus === 'done';
  const isBlocked = newStatus === 'blocked';

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

          {/* Status Update Badge */}
          <Section style={{ ...statusBadge, backgroundColor: newStatusInfo.bg, borderLeftColor: newStatusInfo.color }}>
            <Text style={{ ...statusText, color: newStatusInfo.color }}>
              {newStatusInfo.icon} Status Update
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              Great news! Your request has been updated with a new status.
            </Text>

            {/* Request Title */}
            <Heading as="h2" style={requestTitleStyle}>
              {requestTitle}
            </Heading>

            {/* Status Change Visualization */}
            <Section style={statusChangeBox}>
              <div style={statusFlow}>
                {/* Old Status */}
                <div style={statusItem}>
                  <div style={{ ...statusCircle, backgroundColor: oldStatusInfo.bg, borderColor: oldStatusInfo.color }}>
                    <span style={{ fontSize: '24px' }}>{oldStatusInfo.icon}</span>
                  </div>
                  <Text style={statusLabel}>{oldStatusInfo.label}</Text>
                </div>

                {/* Arrow */}
                <div style={arrow}>→</div>

                {/* New Status */}
                <div style={statusItem}>
                  <div style={{ ...statusCircle, backgroundColor: newStatusInfo.bg, borderColor: newStatusInfo.color }}>
                    <span style={{ fontSize: '24px' }}>{newStatusInfo.icon}</span>
                  </div>
                  <Text style={{ ...statusLabel, color: newStatusInfo.color, fontWeight: '600' }}>
                    {newStatusInfo.label}
                  </Text>
                </div>
              </div>

              <Text style={statusDescription}>{newStatusInfo.description}</Text>
            </Section>

            {/* Message */}
            {message && (
              <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </Section>
            )}

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={requestUrl}>
                {isCompleted ? 'View Deliverables' : 'View Request Details'}
              </Button>
            </Section>

            {/* Next Steps */}
            {nextSteps && (
              <Section style={nextStepsBox}>
                <Heading as="h3" style={h3}>
                  {isCompleted ? 'What\'s Included' : isBlocked ? 'Action Required' : 'What\'s Next'}
                </Heading>
                <Text style={nextStepsText}>{nextSteps}</Text>
              </Section>
            )}

            {/* Estimated Completion */}
            {estimatedCompletion && !isCompleted && (
              <Section style={estimateBox}>
                <table style={table}>
                  <tbody>
                    <tr>
                      <td style={labelCell}>📅 Estimated Completion:</td>
                      <td style={valueCell}>{estimatedCompletion}</td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            {/* Special messaging based on status */}
            {isCompleted && (
              <Section style={celebrationBox}>
                <Text style={celebrationText}>
                  🎉 <strong>Congratulations!</strong> Your request is complete. We hope you love what we've created!
                </Text>
              </Section>
            )}

            {isBlocked && (
              <Section style={blockedBox}>
                <Text style={blockedText}>
                  ⚠️ <strong>Action Needed:</strong> We need additional information from you to proceed. Please review the request and provide the requested details.
                </Text>
              </Section>
            )}

            {/* Help Section */}
            <Section style={helpBox}>
              <Text style={helpText}>
                Questions or need to discuss this update? Reply to this email or comment directly on the request.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this update because you're subscribed to notifications for this request.
            </Text>
            <Text style={footerText}>
              Manage your notification preferences in your account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default StatusChangedEmail;

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

const h3 = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const statusBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid',
  margin: '0 24px 24px',
  borderRadius: '4px',
};

const statusText = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
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

const requestTitleStyle = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: '600',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const statusChangeBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
};

const statusFlow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  marginBottom: '16px',
};

const statusItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '8px',
};

const statusCircle = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  border: '3px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const statusLabel = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
};

const arrow = {
  fontSize: '32px',
  color: '#9ca3af',
  fontWeight: '600',
};

const statusDescription = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '0',
};

const messageBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const messageText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1e40af',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
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

const nextStepsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const nextStepsText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#4b5563',
  margin: '0',
};

const estimateBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
};

const table = {
  width: '100%',
};

const labelCell = {
  fontSize: '14px',
  color: '#166534',
  fontWeight: '500',
};

const valueCell = {
  fontSize: '14px',
  color: '#166534',
  fontWeight: '600',
  textAlign: 'right' as const,
};

const celebrationBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #86efac',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
};

const celebrationText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#166534',
  margin: '0',
  textAlign: 'center' as const,
};

const blockedBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
};

const blockedText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#991b1b',
  margin: '0',
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
  color: '#6b7280',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footer = {
  padding: '0 24px',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#9ca3af',
  margin: '4px 0',
};
