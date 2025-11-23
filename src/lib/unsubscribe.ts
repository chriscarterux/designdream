import { createHmac } from 'crypto';

/**
 * Generate unsubscribe token for a user
 */
export function generateUnsubscribeToken(userId: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-change-in-production';
  const hmac = createHmac('sha256', secret);
  hmac.update(userId);
  return `${userId}.${hmac.digest('hex')}`;
}

/**
 * Verify unsubscribe token
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const [userId, signature] = token.split('.');
    if (!userId || !signature) return null;

    const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-change-in-production';
    const hmac = createHmac('sha256', secret);
    hmac.update(userId);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) return null;
    return userId;
  } catch {
    return null;
  }
}
