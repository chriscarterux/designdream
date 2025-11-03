import { LayoutDashboard, Users, ListTodo, Clock } from 'lucide-react';

export default function AdminOverviewPage() {
  const stats = [
    {
      name: 'Total Clients',
      value: '12',
      icon: Users,
      change: '+2 this month',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Requests',
      value: '34',
      icon: ListTodo,
      change: '8 in progress',
      changeType: 'neutral' as const,
    },
    {
      name: 'Avg Response Time',
      value: '2.4h',
      icon: Clock,
      change: '-0.3h from last week',
      changeType: 'positive' as const,
    },
    {
      name: 'SLA Compliance',
      value: '98%',
      icon: LayoutDashboard,
      change: '+2% from last month',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-slate-600">
          Welcome back! Here&apos;s what&apos;s happening with your agency.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'neutral'
                      ? 'text-slate-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <stat.icon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent Activity
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 p-4">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                New client onboarded: Acme Corp
              </p>
              <p className="text-xs text-slate-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 p-4">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                Request completed: Logo redesign for Tech Startup
              </p>
              <p className="text-xs text-slate-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 p-4">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                SLA warning: Request #234 approaching deadline
              </p>
              <p className="text-xs text-slate-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
