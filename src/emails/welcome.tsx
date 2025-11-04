// Welcome Email Template

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

interface WelcomeEmailProps {
  companyName: string;
  contactName: string;
  planType: string;
  dashboardUrl: string;
  resourcesUrl: string;
}

export const WelcomeEmail = ({
  companyName = 'Acme Corp',
  contactName = 'Jane Smith',
  planType = 'premium',
  dashboardUrl = 'https://app.designdream.is/dashboard',
  resourcesUrl = 'https://designdream.is/resources',
}: WelcomeEmailProps) => {
  const previewText = `Welcome to DesignDream, ${contactName}! Let's get started.`;
  const isPremium = planType.toLowerCase() === 'premium';

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

          {/* Welcome Banner */}
          <Section style={welcomeBanner}>
            <Text style={welcomeEmoji}>🎉</Text>
            <Heading as="h2" style={welcomeHeading}>
              Welcome to DesignDream!
            </Heading>
            <Text style={welcomeSubtext}>
              We're excited to partner with {companyName} on your design journey
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {contactName},</Text>

            <Text style={paragraph}>
              Thank you for subscribing to DesignDream! You now have access to unlimited design and development
              requests with a dedicated team committed to bringing your vision to life.
            </Text>

            {/* Plan Details */}
            <Section style={planBox}>
              <Text style={planLabel}>Your Plan</Text>
              <Heading as="h3" style={planName}>
                {isPremium ? '✨ Premium Plan' : '🚀 Core Plan'}
              </Heading>
              <Text style={planDescription}>
                {isPremium
                  ? 'Premium support with priority queue access, advanced features, and dedicated account management'
                  : 'Full access to design and development services with 48-hour turnaround'}
              </Text>
            </Section>

            {/* What's Included */}
            <Section style={featuresSection}>
              <Heading as="h3" style={h3}>
                What's Included
              </Heading>

              <table style={table}>
                <tbody>
                  <tr>
                    <td style={iconCell}>✅</td>
                    <td style={featureCell}>
                      <strong>Unlimited Requests</strong>
                      <br />
                      <span style={featureDesc}>Submit as many design and development requests as you need</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={iconCell}>⚡</td>
                    <td style={featureCell}>
                      <strong>48-Hour Turnaround</strong>
                      <br />
                      <span style={featureDesc}>Most requests completed within 48 business hours</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={iconCell}>🎨</td>
                    <td style={featureCell}>
                      <strong>Design & Development</strong>
                      <br />
                      <span style={featureDesc}>UI/UX design, web development, AI automation, and more</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={iconCell}>🔄</td>
                    <td style={featureCell}>
                      <strong>Unlimited Revisions</strong>
                      <br />
                      <span style={featureDesc}>We'll iterate until you're completely satisfied</span>
                    </td>
                  </tr>
                  {isPremium && (
                    <tr>
                      <td style={iconCell}>👤</td>
                      <td style={featureCell}>
                        <strong>Dedicated Account Manager</strong>
                        <br />
                        <span style={featureDesc}>Personal point of contact for all your needs</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* Getting Started */}
            <Section style={stepsSection}>
              <Heading as="h3" style={h3}>
                Getting Started in 3 Easy Steps
              </Heading>

              <div style={stepsList}>
                {/* Step 1 */}
                <div style={step}>
                  <div style={stepNumber}>1</div>
                  <div style={stepContent}>
                    <Text style={stepTitle}>Access Your Dashboard</Text>
                    <Text style={stepDesc}>
                      Log in to your personalized dashboard to submit requests and track progress
                    </Text>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={step}>
                  <div style={stepNumber}>2</div>
                  <div style={stepContent}>
                    <Text style={stepTitle}>Submit Your First Request</Text>
                    <Text style={stepDesc}>
                      Tell us what you need - whether it's a new design, feature, or improvement
                    </Text>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={step}>
                  <div style={stepNumber}>3</div>
                  <div style={stepContent}>
                    <Text style={stepTitle}>We Get to Work</Text>
                    <Text style={stepDesc}>
                      Our team starts immediately, and you'll see progress updates in real-time
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Go to Your Dashboard
              </Button>
            </Section>

            {/* Resources */}
            <Section style={resourcesBox}>
              <Heading as="h3" style={h3}>
                Helpful Resources
              </Heading>
              <ul style={resourcesList}>
                <li style={resourceItem}>
                  <a href={`${resourcesUrl}/getting-started`} style={resourceLink}>
                    📘 Getting Started Guide
                  </a>
                </li>
                <li style={resourceItem}>
                  <a href={`${resourcesUrl}/request-tips`} style={resourceLink}>
                    💡 How to Write Great Requests
                  </a>
                </li>
                <li style={resourceItem}>
                  <a href={`${resourcesUrl}/examples`} style={resourceLink}>
                    🎯 Example Requests
                  </a>
                </li>
                <li style={resourceItem}>
                  <a href={`${resourcesUrl}/faq`} style={resourceLink}>
                    ❓ Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </Section>

            {/* Support */}
            <Section style={supportBox}>
              <Text style={supportText}>
                <strong>Need help getting started?</strong>
                <br />
                Our team is here to help! Reply to this email or reach out via the dashboard.
              </Text>
            </Section>

            {/* Closing */}
            <Text style={closing}>
              We're thrilled to have you on board and can't wait to start creating amazing things together!
            </Text>

            <Text style={signature}>
              Cheers,
              <br />
              The DesignDream Team
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you subscribed to DesignDream.
            </Text>
            <Text style={footerText}>
              DesignDream • Unlimited Design & Development
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const welcomeBanner = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 24px',
  textAlign: 'center' as const,
};

const welcomeEmoji = {
  fontSize: '48px',
  margin: '0 0 16px',
};

const welcomeHeading = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const welcomeSubtext = {
  color: '#e9d5ff',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '32px 24px',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px',
  color: '#4b5563',
};

const planBox = {
  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
  border: '2px solid #c4b5fd',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const planLabel = {
  fontSize: '12px',
  color: '#6b21a8',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  letterSpacing: '1px',
  margin: '0 0 8px',
};

const planName = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#581c87',
  margin: '0 0 12px',
};

const planDescription = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#6b21a8',
  margin: '0',
};

const featuresSection = {
  marginBottom: '32px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const iconCell = {
  width: '40px',
  fontSize: '20px',
  verticalAlign: 'top' as const,
  paddingTop: '4px',
  paddingBottom: '16px',
};

const featureCell = {
  paddingBottom: '16px',
  fontSize: '15px',
  lineHeight: '22px',
};

const featureDesc = {
  fontSize: '14px',
  color: '#6b7280',
};

const stepsSection = {
  marginBottom: '32px',
};

const stepsList = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '20px',
};

const step = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
};

const stepNumber = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '700',
  flexShrink: 0,
};

const stepContent = {
  flex: 1,
};

const stepTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 6px',
};

const stepDesc = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#6b7280',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const resourcesBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
};

const resourcesList = {
  margin: '0',
  paddingLeft: '0',
  listStyle: 'none',
};

const resourceItem = {
  marginBottom: '12px',
};

const resourceLink = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
};

const supportBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const supportText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0',
};

const closing = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
  marginBottom: '24px',
};

const signature = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#1a1a1a',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
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
