'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Loader2, AlertTriangle } from 'lucide-react';

type LoginMethod = 'password' | 'magic-link';

interface RateLimitError {
  isRateLimited: boolean;
  retryAfter?: number;
  message?: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithMagicLink } = useAuth();

  const [method, setMethod] = useState<LoginMethod>('magic-link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<RateLimitError>({
    isRateLimited: false,
  });
  const [retryCountdown, setRetryCountdown] = useState(0);

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitError.isRateLimited && rateLimitError.retryAfter) {
      setRetryCountdown(rateLimitError.retryAfter);

      const interval = setInterval(() => {
        setRetryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setRateLimitError({ isRateLimited: false });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [rateLimitError]);

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push(redirectTo);
    } catch (err) {
      // Check if it's a rate limit error
      const error = err as { status?: number; message?: string; retryAfter?: number };
      if (error.status === 429 || error.message?.includes('rate limit')) {
        const retryAfter = error.retryAfter || 900; // Default to 15 minutes
        setRateLimitError({
          isRateLimited: true,
          retryAfter,
          message:
            error.message ||
            'Too many login attempts. Please try again later.',
        });
      } else {
        setError(error.message || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithMagicLink(email);
      setMagicLinkSent(true);
    } catch (err) {
      // Check if it's a rate limit error
      const error = err as { status?: number; message?: string; retryAfter?: number };
      if (error.status === 429 || error.message?.includes('rate limit')) {
        const retryAfter = error.retryAfter || 900; // Default to 15 minutes
        setRateLimitError({
          isRateLimited: true,
          retryAfter,
          message:
            error.message ||
            'Too many magic link requests. Please try again later.',
        });
      } else {
        setError(error.message || 'Failed to send magic link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a magic link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Click the link in the email to sign in to your account. The link
              will expire in 1 hour.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail('');
              }}
            >
              Use a different email
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rateLimitError.isRateLimited ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold text-destructive">
                Too Many Attempts
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {rateLimitError.message ||
                  'You have exceeded the maximum number of login attempts.'}
              </p>
              {retryCountdown > 0 && (
                <div className="rounded-md bg-background/50 p-3">
                  <p className="text-sm font-medium">
                    Try again in{' '}
                    <span className="font-mono text-destructive">
                      {formatCountdown(retryCountdown)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex gap-2">
                <Button
                  variant={method === 'magic-link' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setMethod('magic-link')}
                  type="button"
                >
                  Magic Link
                </Button>
                <Button
                  variant={method === 'password' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setMethod('password')}
                  type="button"
                >
                  Password
                </Button>
              </div>

              <form
                onSubmit={
                  method === 'magic-link'
                    ? handleMagicLinkLogin
                    : handlePasswordLogin
                }
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {method === 'password' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {method === 'magic-link'
                        ? 'Sending magic link...'
                        : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {method === 'magic-link'
                        ? 'Send magic link'
                        : 'Sign in with password'}
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href={`/signup${redirectTo !== '/dashboard' ? `?redirect=${redirectTo}` : ''}`}
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
