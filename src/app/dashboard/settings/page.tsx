'use client';

import { useState } from 'react';
import { User, Mail, Bell, Shield, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc.',
    phone: '+1 (555) 123-4567',
    avatar: '',
  });

  const [notifications, setNotifications] = useState({
    requestUpdates: true,
    commentReplies: true,
    statusChanges: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Notification preferences updated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Manage how you receive emails from us</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {[
              {
                key: 'requestUpdates',
                label: 'Request Updates',
                description: 'Get notified when there are updates to your requests',
              },
              {
                key: 'commentReplies',
                label: 'Comment Replies',
                description: 'Receive notifications when someone replies to your comments',
              },
              {
                key: 'statusChanges',
                label: 'Status Changes',
                description: 'Get notified when request status changes',
              },
              {
                key: 'weeklyDigest',
                label: 'Weekly Digest',
                description: 'Receive a weekly summary of your activity',
              },
              {
                key: 'marketingEmails',
                label: 'Marketing Emails',
                description: 'Receive updates about new features and offers',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="space-y-0.5">
                  <Label htmlFor={item.key} className="text-base font-medium cursor-pointer">
                    {item.label}
                  </Label>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  id={item.key}
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [item.key]: e.target.checked })
                  }
                  className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSaveNotifications}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Change Password</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 p-4 bg-red-50">
            <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete My Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
