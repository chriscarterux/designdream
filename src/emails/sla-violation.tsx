// SLA Violation Email Template

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

interface SLAViolationEmailProps {
  requestTitle: string;
  requestStatus: string;
  requestPriority: string;
  hoursElapsed: number;
  targetHours: number;
  hoursOverdue: number;
  companyName: string;
  assignedToName?: string;
  requestUrl: string;
  recipientName: string;
}

export const SLAViolationEmail = ({
  requestTitle = 'Website Redesign',
  requestStatus = 'in_progress',
  requestPriority = 'high',
  hoursElapsed = 52,
  targetHours = 48,
  hoursOverdue = 4,
  companyName = 'Acme Corp',
  assignedToName = 'John Doe',
  requestUrl = 'https://app.designdream.is/admin/requests/123',
  recipientName = 'Admin',
}: SLAViolationEmailProps) => {
  const previewText = `SLA VIOLATED: "${requestTitle}" has exceeded the ${targetHours}-hour deadline`;

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

          {/* Critical Alert Badge */}
          <Section style={criticalBadge}>
            <Text style={criticalText}>
              🚨 CRITICAL: SLA DEADLINE VIOLATED
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              <strong style={{ color: '#dc2626' }}>A request has exceeded its SLA deadline and requires immediate escalation.</strong>
            </Text>

            <Text style={paragraph}>
              This violation affects our service commitment to the client and must be addressed urgently.
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

            {/* Violation Details */}
            <Section style={violationSection}>
              <Heading as="h3" style={h3}>
                Violation Details
              </Heading>

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>SLA Target:</td>
                    <td style={valueCell}>{targetHours} business hours</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Actual Time:</td>
                    <td style={{ ...valueCell, color: '#dc2626', fontWeight: '600' }}>
                      {hoursElapsed.toFixed(1)} business hours
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Time Overdue:</td>
                    <td style={{ ...valueCell, color: '#dc2626', fontWeight: '600' }}>
                      {hoursOverdue.toFixed(1)} business hours
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Overdue Percentage:</td>
                    <td style={{ ...valueCell, color: '#dc2626', fontWeight: '600' }}>
                      {Math.round((hoursOverdue / targetHours) * 100)}% over deadline
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Violation Progress Bar */}
              <div style={progressContainer}>
                <div
                  style={{
                    ...progressBar,
                    width: `${Math.min((hoursElapsed / targetHours) * 100, 100)}%`,
                    backgroundColor: '#dc2626',
                  }}
                />
              </div>
              <Text style={progressLabel}>
                {Math.round((hoursElapsed / targetHours) * 100)}% of SLA time elapsed
              </Text>
            </Section>

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={requestUrl}>
                Take Immediate Action
              </Button>
            </Section>

            {/* Required Actions */}
            <Section style={actionsBox}>
              <Heading as="h3" style={h3}>
                Required Immediate Actions
              </Heading>
              <ol style={orderedList}>
                <li style={listItem}>
                  <strong>Escalate:</strong> Notify team lead or project manager immediately
                </li>
                <li style={listItem}>
                  <strong>Communicate:</strong> Update the client on status and revised timeline
                </li>
                <li style={listItem}>
                  <strong>Investigate:</strong> Identify root cause of delay (blockers, resource constraints, etc.)
                </li>
                <li style={listItem}>
                  <strong>Action Plan:</strong> Create concrete plan to complete the request ASAP
                </li>
                <li style={listItem}>
                  <strong>Document:</strong> Record the violation details and resolution steps
                </li>
              </ol>
            </Section>

            {/* Impact Note */}
            <Section style={impactBox}>
              <Text style={impactText}>
                <strong>Impact:</strong> SLA violations affect client satisfaction, retention rates, and our service reliability metrics.
                Please treat this with the highest priority.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This is a critical automated alert from DesignDream SLA monitoring system.
            </Text>
            <Text style={footerText}>
              You're receiving this because you're an admin or assigned to this request.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SLAViolationEmail;

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

const criticalBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid #dc2626',
  margin: '0 24px 24px',
  borderRadius: '4px',
  backgroundColor: '#fee2e2',
};

const criticalText = {
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  color: '#dc2626',
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
  margin: '0 0 16px',
  color: '#4b5563',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const violationSection = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
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
  width: '45%',
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
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const actionsBox = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fef3c7',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const orderedList = {
  margin: '0',
  paddingLeft: '20px',
};

const listItem = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#4b5563',
  marginBottom: '12px',
};

const impactBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
};

const impactText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#1e40af',
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
