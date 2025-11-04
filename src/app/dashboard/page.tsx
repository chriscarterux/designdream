'use client';

import Link from 'next/link';
import { Plus, Inbox, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCards } from '@/components/client/StatsCards';
import { ActivityFeed } from '@/components/client/ActivityFeed';
import { RequestCard } from '@/components/client/RequestCard';
import { useClientDashboard } from '@/hooks/use-client-dashboard';
import { useClientRequests } from '@/hooks/use-client-requests';

export default function ClientDashboardPage() {
  const { stats, activities, isLoading: dashboardLoading } = useClientDashboard();
  const { requests, isLoading: requestsLoading } = useClientRequests();

  // Get active requests (submitted, in-review, in-progress)
  const activeRequests = requests.filter((r) =>
    ['submitted', 'in-review', 'in-progress'].includes(r.status)
  );

  // Show only first 3 requests
  const recentRequests = activeRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s an overview of your requests.</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit Request
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
          <Link href="/dashboard/submit">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Submit Request</CardTitle>
                  <CardDescription className="text-xs">Start a new project</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
          <Link href="/dashboard/requests">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Inbox className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">My Requests</CardTitle>
                  <CardDescription className="text-xs">View all requests</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
          <Link href="/dashboard/billing">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Billing</CardTitle>
                  <CardDescription className="text-xs">Manage subscription</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Stats Cards */}
      <StatsCards
        stats={
          stats || {
            activeRequests: 0,
            completedThisMonth: 0,
            totalCompleted: 0,
            averageTurnaround: '0 days',
            totalSpent: 0,
          }
        }
        isLoading={dashboardLoading}
      />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Requests</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/requests">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {requestsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="space-y-3">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-500">
                  <Inbox className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No active requests</p>
                  <p className="text-xs mt-1">Submit a new request to get started</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/dashboard/submit">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Request
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} isLoading={dashboardLoading} maxItems={10} />
        </div>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold">Pro Plan</p>
              <p className="text-sm text-gray-600">Billed monthly</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/billing">
                Manage Subscription
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
