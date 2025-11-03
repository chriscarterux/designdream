'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function RequestsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
          <p className="mt-2 text-gray-600">
            View and manage your design and development requests
          </p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>
            All your submitted requests will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500">No requests yet</p>
            <Link href="/dashboard/requests/new">
              <Button variant="outline" className="mt-4">
                Create your first request
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
