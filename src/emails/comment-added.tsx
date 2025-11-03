// Comment Added Email Template

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

interface CommentAddedEmailProps {
  requestTitle: string;
  commentPreview: string;
  commentContent: string;
  authorName: string;
  authorType: 'client' | 'admin';
  requestUrl: string;
  recipientName: string;
}

export const CommentAddedEmail = ({
  requestTitle = 'Website Redesign',
  commentPreview = 'Love the initial design! Just a few minor adjustments needed on the homepage hero section...',
  commentContent = 'Love the initial design! Just a few minor adjustments needed on the homepage hero section. Can we make the CTA button larger and change the background to a gradient?',
  authorName = 'Jane Smith',
  authorType = 'client',
  requestUrl = 'https://app.designdream.is/dashboard/requests/123#comments',
  recipientName = 'John',
}: CommentAddedEmailProps) => {
  const previewText = `New comment from ${authorName} on "${requestTitle}"`;
  const isClient = authorType === 'client';
  const authorBadgeColor = isClient ? { bg: '#dbeafe', color: '#1e40af' } : { bg: '#f3e8ff', color: '#6b21a8' };

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

          {/* Comment Badge */}
          <Section style={commentBadge}>
            <Text style={commentBadgeText}>
              💬 New Comment
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {recipientName},</Text>

            <Text style={paragraph}>
              {isClient ? 'Your client' : 'A team member'} has left a new comment on a request.
            </Text>

            {/* Request Info */}
            <Section style={requestBox}>
              <Text style={requestLabel}>On Request:</Text>
              <Heading as="h2" style={h2}>
                {requestTitle}
              </Heading>
            </Section>

            {/* Comment Box */}
            <Section style={commentBox}>
              {/* Author Header */}
              <div style={authorHeader}>
                <div style={avatarCircle}>
                  <span style={avatarText}>{authorName.charAt(0).toUpperCase()}</span>
                </div>
                <div style={authorInfo}>
                  <Text style={authorName_style}>{authorName}</Text>
                  <span style={{ ...authorBadge, backgroundColor: authorBadgeColor.bg, color: authorBadgeColor.color }}>
                    {isClient ? 'Client' : 'Team'}
                  </span>
                </div>
              </div>

              {/* Comment Content */}
              <Section style={commentContent_style}>
                <Text style={commentText}>{commentContent}</Text>
              </Section>
            </Section>

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={requestUrl}>
                View Comment & Reply
              </Button>
            </Section>

            {/* Response Tips */}
            <Section style={tipsBox}>
              <Heading as="h3" style={h3}>
                💡 Quick Tips
              </Heading>
              <ul style={list}>
                {isClient ? (
                  <>
                    <li style={listItem}>Respond promptly to show you're on top of the request</li>
                    <li style={listItem}>Ask clarifying questions if needed</li>
                    <li style={listItem}>Set clear expectations for when you'll implement feedback</li>
                  </>
                ) : (
                  <>
                    <li style={listItem}>Review the comment and coordinate with your team</li>
                    <li style={listItem}>Update the request status if needed</li>
                    <li style={listItem}>Tag relevant team members for visibility</li>
                  </>
                )}
              </ul>
            </Section>

            {/* Help */}
            <Text style={helpText}>
              Reply directly from the request page to keep all communication in one place.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you're involved with this request.
            </Text>
            <Text style={footerText}>
              <a href="#" style={link}>Manage notification preferences</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CommentAddedEmail;

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
};

const h3 = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const commentBadge = {
  padding: '16px 24px',
  borderLeft: '4px solid #8b5cf6',
  margin: '0 24px 24px',
  borderRadius: '4px',
  backgroundColor: '#f3e8ff',
};

const commentBadgeText = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  color: '#6b21a8',
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

const requestBox = {
  marginBottom: '24px',
  paddingBottom: '16px',
  borderBottom: '1px solid #e5e7eb',
};

const requestLabel = {
  fontSize: '12px',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
};

const commentBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
};

const authorHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
};

const avatarCircle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#4f46e5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const avatarText = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
};

const authorInfo = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
};

const authorName_style = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0',
  lineHeight: '20px',
};

const authorBadge = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '11px',
  fontWeight: '500',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.3px',
  width: 'fit-content',
};

const commentContent_style = {
  padding: '0',
};

const commentText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1a1a1a',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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

const tipsBox = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fef3c7',
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

const helpText = {
  fontSize: '13px',
  lineHeight: '18px',
  color: '#6b7280',
  textAlign: 'center' as const,
  marginTop: '16px',
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
