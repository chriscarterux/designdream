// SLA Warning Email Template

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

interface SLAWarningEmailProps {
  requestTitle: string;
  requestStatus: string;
  requestPriority: string;
  hoursRemaining: number;
  hoursElapsed: number;
  targetHours: number;
  warningLevel: 'yellow' | 'red';
  companyName: string;
  assignedToName?: string;
  requestUrl: string;
  recipientName: string;
}

export const SLAWarningEmail = ({
  requestTitle = 'Website Redesign',
  requestStatus = 'in_progress',
  requestPriority = 'high',
  hoursRemaining = 6,
  hoursElapsed = 42,
  targetHours = 48,
  warningLevel = 'red',
  companyName = 'Acme Corp',
  assignedToName = 'John Doe',
  requestUrl = 'https://app.designdream.is/admin/requests/123',
  recipientName = 'Admin',
}: SLAWarningEmailProps) => {
  const isRedAlert = warningLevel === 'red';
  const warningColor = isRedAlert ? '#dc2626' : '#f59e0b';
  const warningBg = isRedAlert ? '#fef2f2' : '#fffbeb';
  const urgencyText = isRedAlert ? 'URGENT' : 'WARNING';

  const previewText = `${urgencyText}: ${hoursRemaining} hours remaining for "${requestTitle}"`;

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

          {/* Warning Badge */}
          <Section style={{ ...warningBadge, backgroundColor: warningBg, borderLeftColor: warningColor }}>
            <Text style={{ ...warningText, color: warningColor }}>
              {urgencyText}: SLA Deadline Approaching
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              {isRedAlert ? (
                <>
                  <strong style={{ color: warningColor }}>Critical alert:</strong> A request is approaching its SLA deadline
                  and requires immediate attention.
                </>
              ) : (
                <>
                  A request is approaching its SLA deadline and may need priority attention.
                </>
              )}
            </Text>

            {/* Request Details Box */}
            <Section style={detailsBox}>
              <Heading as="h2" style={h2}>
                {requestTitle}
              </Heading>

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Client:</td>
                    <td style={valueCell}>{companyName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Status:</td>
                    <td style={valueCell}>
                      <span style={badge}>{requestStatus.replace('_', ' ')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Priority:</td>
                    <td style={valueCell}>
                      <span style={{ ...badge, ...priorityBadge }}>{requestPriority}</span>
                    </td>
                  </tr>
                  {assignedToName && (
                    <tr>
                      <td style={labelCell}>Assigned To:</td>
                      <td style={valueCell}>{assignedToName}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* SLA Progress */}
            <Section style={slaSection}>
              <Heading as="h3" style={h3}>
                SLA Progress
              </Heading>

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Hours Elapsed:</td>
                    <td style={valueCell}>{hoursElapsed.toFixed(1)} business hours</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Hours Remaining:</td>
                    <td style={{ ...valueCell, color: warningColor, fontWeight: '600' }}>
                      {hoursRemaining.toFixed(1)} business hours
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Target Deadline:</td>
                    <td style={valueCell}>{targetHours} business hours</td>
                  </tr>
                </tbody>
              </table>

              {/* Progress Bar */}
              <div style={progressContainer}>
                <div
                  style={{
                    ...progressBar,
                    width: `${Math.min((hoursElapsed / targetHours) * 100, 100)}%`,
                    backgroundColor: warningColor,
                  }}
                />
              </div>
              <Text style={progressLabel}>
                {Math.round((hoursElapsed / targetHours) * 100)}% of SLA time used
              </Text>
            </Section>

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={requestUrl}>
                View Request Details
              </Button>
            </Section>

            {/* Recommended Actions */}
            <Section style={recommendationsBox}>
              <Heading as="h3" style={h3}>
                Recommended Actions
              </Heading>
              <ul style={list}>
                {isRedAlert ? (
                  <>
                    <li style={listItem}>Prioritize this request immediately</li>
                    <li style={listItem}>Communicate with the client about progress</li>
                    <li style={listItem}>Consider escalating if blocked</li>
                    <li style={listItem}>Update the request status if near completion</li>
                  </>
                ) : (
                  <>
                    <li style={listItem}>Review the current status and timeline</li>
                    <li style={listItem}>Ensure no blockers are preventing progress</li>
                    <li style={listItem}>Update the client on expected completion</li>
                  </>
                )}
              </ul>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated SLA monitoring alert from DesignDream.
            </Text>
            <Text style={footerText}>
              You're receiving this because you're assigned to this request or are an admin.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SLAWarningEmail;

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

const warningBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid',
  margin: '0 24px 24px',
  borderRadius: '4px',
};

const warningText = {
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

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const slaSection = {
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

const badge = {
  display: 'inline-block',
  padding: '4px 12px',
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '500',
  textTransform: 'capitalize' as const,
};

const priorityBadge = {
  backgroundColor: '#fee2e2',
  color: '#991b1b',
};

const progressContainer = {
  width: '100%',
  height: '8px',
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '16px',
};

const progressBar = {
  height: '8px',
  transition: 'width 0.3s ease',
};

const progressLabel = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '8px',
  textAlign: 'center' as const,
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

const recommendationsBox = {
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
