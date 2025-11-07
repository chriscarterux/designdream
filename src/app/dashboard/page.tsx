'use client';

import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Loader2, ExternalLink, CreditCard, FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface ClientData {
  basecamp_project_id: string | null;
  stripe_customer_id: string | null;
  company_name: string | null;
  subscription_status: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { signOut, isLoading } = useAuth();
  const user = useUser();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const [creatingBillingSession, setCreatingBillingSession] = useState(false);

  useEffect(() => {
    async function fetchClientData() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('basecamp_project_id, stripe_customer_id, company_name, subscription_status')
          .eq('auth_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching client data:', error);
        } else {
          setClientData(data);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoadingClient(false);
      }
    }

    fetchClientData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleManageBilling = async () => {
    if (!clientData?.stripe_customer_id) {
      alert('No billing information found. Please contact support.');
      return;
    }

    setCreatingBillingSession(true);
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: clientData.stripe_customer_id,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      alert('Failed to open billing portal. Please try again or contact support.');
    } finally {
      setCreatingBillingSession(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email}
          </p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">User ID</p>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Your auth method</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm font-medium">Provider</p>
              <p className="text-sm text-muted-foreground">
                {user.app_metadata.provider || 'email'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Project</CardTitle>
            <CardDescription>Access your workspace and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingClient ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {clientData?.basecamp_project_id ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={`https://3.basecamp.com/${process.env.NEXT_PUBLIC_BASECAMP_ACCOUNT_ID || ''}/projects/${clientData.basecamp_project_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FolderKanban className="mr-2 h-4 w-4" />
                      Open Basecamp Project
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Your Basecamp project is being set up
                    </p>
                  </div>
                )}

                {clientData?.stripe_customer_id ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleManageBilling}
                    disabled={creatingBillingSession}
                  >
                    {creatingBillingSession ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Manage Billing
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="/subscribe">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </a>
                  </Button>
                )}

                {clientData?.subscription_status && (
                  <div className="pt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      Status:{' '}
                      <span className="font-medium capitalize">
                        {clientData.subscription_status}
                      </span>
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
