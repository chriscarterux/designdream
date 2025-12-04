import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ClientWelcomeEmailProps {
  firstName: string;
  companyName: string;
  linearProjectUrl: string;
  figmaFileUrl: string;
  repoUrl: string;
  stripePortalUrl: string;
}

export default function ClientWelcomeEmail({
  firstName = 'Alex',
  companyName = 'Acme Corp',
  linearProjectUrl = 'https://linear.app',
  figmaFileUrl = 'https://figma.com',
  repoUrl = 'https://github.com',
  stripePortalUrl = 'https://billing.stripe.com',
}: ClientWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Design Dream! Your design board is ready - access your Linear project, Figma files, and more.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Hero Section */}
          <Section style={hero}>
            <Heading style={h1}>
              Welcome to Design Dream, {firstName}! 🎨
            </Heading>
            <Text style={heroText}>
              Your design board is ready! We're excited to help {companyName} bring your ideas to life.
            </Text>
          </Section>

          {/* Quick Links Section */}
          <Section style={section}>
            <Heading style={h2}>🔗 Quick Links</Heading>
            <Text style={text}>
              Everything you need to get started:
            </Text>

            <table style={linksTable}>
              <tr>
                <td style={linkCell}>
                  <Link href={linearProjectUrl} style={link}>
                    📊 Linear Project Board
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={linkCell}>
                  <Link href={figmaFileUrl} style={link}>
                    🎨 Figma Design File
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={linkCell}>
                  <Link href={repoUrl} style={link}>
                    💻 GitHub Repository
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={linkCell}>
                  <Link href={stripePortalUrl} style={link}>
                    💳 Manage Subscription
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Getting Started Guide */}
          <Section style={section}>
            <Heading style={h2}>🚀 Getting Started (4 Steps)</Heading>

            <div style={stepContainer}>
              <div style={stepNumber}>1</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Access Your Board</Text>
                <Text style={stepDescription}>
                  Click the Linear link above to open your project board.
                </Text>
              </div>
            </div>

            <div style={stepContainer}>
              <div style={stepNumber}>2</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Create Your First Request</Text>
                <Text style={stepDescription}>
                  Click "+ New Issue" and describe what you need designed or developed.
                </Text>
              </div>
            </div>

            <div style={stepContainer}>
              <div style={stepNumber}>3</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Add Details</Text>
                <Text style={stepDescription}>
                  Include title, description, references, and attachments. The more detail, the better!
                </Text>
              </div>
            </div>

            <div style={stepContainer}>
              <div style={stepNumber}>4</div>
              <div style={stepContent}>
                <Text style={stepTitle}>We'll Start Work</Text>
                <Text style={stepDescription}>
                  Your request moves to "Current Request" when we begin. Completed work goes to "Approved" for your review.
                </Text>
              </div>
            </div>

            <Section style={ctaSection}>
              <Button style={button} href={linearProjectUrl}>
                Submit Your First Request →
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* How It Works */}
          <Section style={section}>
            <Heading style={h2}>📋 How It Works</Heading>
            <Text style={text}>
              Your project uses a <strong>3-column workflow</strong>:
            </Text>

            <table style={workflowTable}>
              <tr>
                <td style={workflowColumn}>
                  <Text style={workflowTitle}>Backlog</Text>
                  <Text style={workflowDescription}>
                    Submit unlimited requests here
                  </Text>
                </td>
                <td style={workflowArrow}>→</td>
                <td style={workflowColumn}>
                  <Text style={workflowTitle}>Current Request</Text>
                  <Text style={workflowDescription}>
                    Only 1 active task at a time
                  </Text>
                </td>
                <td style={workflowArrow}>→</td>
                <td style={workflowColumn}>
                  <Text style={workflowTitle}>Approved</Text>
                  <Text style={workflowDescription}>
                    Completed & approved work
                  </Text>
                </td>
              </tr>
            </table>

            <table style={detailsTable}>
              <tr>
                <td style={detailLabel}>⏱️ Turnaround:</td>
                <td style={detailValue}>48 business hours per task</td>
              </tr>
              <tr>
                <td style={detailLabel}>🔄 Revisions:</td>
                <td style={detailValue}>Two rounds included per task</td>
              </tr>
              <tr>
                <td style={detailLabel}>📊 Updates:</td>
                <td style={detailValue}>Daily progress reports via Linear</td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Support Section */}
          <Section style={section}>
            <Heading style={h2}>💬 Need Help?</Heading>
            <Text style={text}>
              We're here to support you:
            </Text>
            <Text style={text}>
              📧 Email: <Link href="mailto:christophercarter@hey.com" style={link}>christophercarter@hey.com</Link><br/>
              ⚡ Response Time: Within 4 business hours<br/>
              📖 FAQ: <Link href="https://designdream.is#faq" style={link}>designdream.is/#faq</Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Design Dream - Unlimited Design & Development<br/>
              <Link href="https://designdream.is" style={footerLink}>designdream.is</Link>
            </Text>
            <Text style={footerText}>
              <Link href={stripePortalUrl} style={footerLink}>Manage Subscription</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const hero = {
  backgroundColor: '#7c3aed',
  padding: '40px 40px',
  color: '#ffffff',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 15px',
  padding: '0',
  lineHeight: '1.2',
};

const heroText = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
};

const section = {
  padding: '0 40px',
  marginTop: '32px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
};

const text = {
  color: '#4a5568',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const linksTable = {
  width: '100%',
  marginTop: '16px',
};

const linkCell = {
  padding: '12px 16px',
  backgroundColor: '#f7fafc',
  borderRadius: '6px',
  marginBottom: '8px',
};

const link = {
  color: '#7c3aed',
  fontSize: '15px',
  textDecoration: 'none',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
};

const stepContainer = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '20px',
};

const stepNumber = {
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
  marginRight: '16px',
  flexShrink: 0,
};

const stepContent = {
  flex: 1,
};

const stepTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const stepDescription = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const workflowTable = {
  width: '100%',
  marginTop: '20px',
  marginBottom: '24px',
};

const workflowColumn = {
  backgroundColor: '#f7fafc',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  verticalAlign: 'top',
};

const workflowArrow = {
  color: '#cbd5e0',
  fontSize: '20px',
  textAlign: 'center' as const,
  padding: '0 8px',
};

const workflowTitle = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const workflowDescription = {
  color: '#718096',
  fontSize: '12px',
  margin: '0',
  lineHeight: '1.4',
};

const detailsTable = {
  width: '100%',
  marginTop: '16px',
};

const detailLabel = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 0',
  width: '40%',
};

const detailValue = {
  color: '#4a5568',
  fontSize: '14px',
  padding: '8px 0',
};

const footer = {
  padding: '0 40px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#718096',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const footerLink = {
  color: '#7c3aed',
  textDecoration: 'none',
  fontSize: '13px',
};
