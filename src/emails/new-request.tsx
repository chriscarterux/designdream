// New Request Email Template

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

interface NewRequestEmailProps {
  requestTitle: string;
  requestDescription: string;
  requestType: string;
  requestPriority: string;
  companyName: string;
  contactName: string;
  requestUrl: string;
  recipientName: string;
}

export const NewRequestEmail = ({
  requestTitle = 'New Website Design',
  requestDescription = 'We need a complete redesign of our marketing website with a focus on conversion optimization.',
  requestType = 'design',
  requestPriority = 'high',
  companyName = 'Acme Corp',
  contactName = 'Jane Smith',
  requestUrl = 'https://app.designdream.is/admin/queue',
  recipientName = 'Admin',
}: NewRequestEmailProps) => {
  const previewText = `New request from ${companyName}: ${requestTitle}`;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { bg: '#fee2e2', color: '#991b1b' };
      case 'high':
        return { bg: '#fed7aa', color: '#9a3412' };
      case 'normal':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'low':
        return { bg: '#e5e7eb', color: '#4b5563' };
      default:
        return { bg: '#e5e7eb', color: '#4b5563' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'design':
        return '🎨';
      case 'development':
        return '💻';
      case 'ai_automation':
        return '🤖';
      case 'strategy':
        return '📊';
      default:
        return '📝';
    }
  };

  const priorityColors = getPriorityColor(requestPriority);

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

          {/* New Request Badge */}
          <Section style={newBadge}>
            <Text style={newText}>
              📬 New Request Submitted
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              A new request has been submitted and is ready for review in the queue.
            </Text>

            {/* Request Details Box */}
            <Section style={detailsBox}>
              <div style={titleRow}>
                <span style={typeIcon}>{getTypeIcon(requestType)}</span>
                <Heading as="h2" style={h2}>
                  {requestTitle}
                </Heading>
              </div>

              <Text style={description}>{requestDescription}</Text>

              <Hr style={divider} />

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Client:</td>
                    <td style={valueCell}>
                      <strong>{companyName}</strong>
                      <br />
                      <span style={subText}>{contactName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Request Type:</td>
                    <td style={valueCell}>
                      <span style={typeBadge}>{requestType.replace('_', ' ')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Priority:</td>
                    <td style={valueCell}>
                      <span
                        style={{
                          ...priorityBadgeStyle,
                          backgroundColor: priorityColors.bg,
                          color: priorityColors.color,
                        }}
                      >
                        {requestPriority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={requestUrl}>
                View Request in Queue
              </Button>
            </Section>

            {/* Next Steps */}
            <Section style={nextStepsBox}>
              <Heading as="h3" style={h3}>
                Next Steps
              </Heading>
              <ul style={list}>
                <li style={listItem}>Review the request details and client requirements</li>
                <li style={listItem}>Assign the request to an appropriate team member</li>
                <li style={listItem}>Move to "Up Next" when ready to begin</li>
                <li style={listItem}>Communicate with client if any clarification is needed</li>
              </ul>
            </Section>

            {requestPriority === 'urgent' && (
              <Section style={urgentBox}>
                <Text style={urgentText}>
                  ⚡ <strong>Urgent Priority:</strong> This request requires immediate attention and should be reviewed ASAP.
                </Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This notification was sent because a new request was submitted to DesignDream.
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

export default NewRequestEmail;

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
  margin: '0',
  flex: '1',
};

const h3 = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const newBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid #10b981',
  margin: '0 24px 24px',
  borderRadius: '4px',
  backgroundColor: '#d1fae5',
};

const newText = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  color: '#065f46',
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
  padding: '24px',
  marginBottom: '24px',
};

const titleRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
};

const typeIcon = {
  fontSize: '28px',
};

const description = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '0 0 16px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  padding: '10px 0',
  fontSize: '14px',
  color: '#6b7280',
  width: '35%',
  verticalAlign: 'top' as const,
};

const valueCell = {
  padding: '10px 0',
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '500',
  verticalAlign: 'top' as const,
};

const subText = {
  fontSize: '13px',
  color: '#6b7280',
  fontWeight: '400',
};

const typeBadge = {
  display: 'inline-block',
  padding: '4px 12px',
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '500',
  textTransform: 'capitalize' as const,
};

const priorityBadgeStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
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
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
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

const urgentBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
};

const urgentText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#991b1b',
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
