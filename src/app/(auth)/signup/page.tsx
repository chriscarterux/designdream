'use client';

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
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { validatePassword, type PasswordValidationResult } from '@/lib/password-validation';

interface RateLimitError {
  isRateLimited: boolean;
  retryAfter?: number;
  message?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

  const handlePasswordValidation = (result: PasswordValidationResult) => {
    setPasswordValidation(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password strength
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError('Password does not meet security requirements. Please check the requirements below.');
      return;
    }

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, {
        full_name: fullName,
      });

      setSuccess(true);

      // If session was created immediately (email confirmation disabled),
      // redirect to dashboard
      setTimeout(() => {
        router.push(redirectTo);
      }, 2000);
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
            'Too many signup attempts. Please try again later.',
        });
      } else {
        setError(error.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle>Account created!</CardTitle>
            <CardDescription>
              Check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              We sent a confirmation email to <strong>{email}</strong>. Please
              click the link in the email to verify your account.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Redirecting you to the dashboard...
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Go to login
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
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
                  'You have exceeded the maximum number of signup attempts.'}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={12}
                />
                <PasswordStrengthMeter
                  password={password}
                  onValidationChange={handlePasswordValidation}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={12}
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (passwordValidation !== null && !passwordValidation.isValid && password.length > 0)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={`/login${redirectTo !== '/dashboard' ? `?redirect=${redirectTo}` : ''}`}
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
