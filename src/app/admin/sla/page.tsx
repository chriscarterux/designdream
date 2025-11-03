import { Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SLADashboardPage() {
  const metrics = [
    {
      label: 'Overall SLA Compliance',
      value: '98.2%',
      trend: '+2.1%',
      status: 'good',
      icon: CheckCircle2,
    },
    {
      label: 'Avg First Response Time',
      value: '2.4h',
      trend: '-0.3h',
      status: 'good',
      icon: Clock,
    },
    {
      label: 'Avg Resolution Time',
      value: '18.5h',
      trend: '+1.2h',
      status: 'warning',
      icon: TrendingUp,
    },
    {
      label: 'SLA Violations (30d)',
      value: '3',
      trend: '-2',
      status: 'good',
      icon: AlertTriangle,
    },
  ];

  const recentViolations = [
    {
      id: 'REQ-145',
      title: 'Mobile app UI improvements',
      client: 'Tech Startup',
      violationType: 'Response Time',
      date: 'Oct 28, 2024',
      delay: '4.2 hours',
    },
    {
      id: 'REQ-132',
      title: 'E-commerce checkout flow',
      client: 'Acme Corp',
      violationType: 'Resolution Time',
      date: 'Oct 25, 2024',
      delay: '6.5 hours',
    },
    {
      id: 'REQ-118',
      title: 'Dashboard analytics integration',
      client: 'Design Studio',
      violationType: 'Response Time',
      date: 'Oct 22, 2024',
      delay: '2.1 hours',
    },
  ];

  const clientCompliance = [
    { name: 'Acme Corp', compliance: 99.1, requests: 45 },
    { name: 'Tech Startup', compliance: 97.8, requests: 32 },
    { name: 'Design Studio', compliance: 98.5, requests: 28 },
    { name: 'Beta Inc', compliance: 96.2, requests: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          SLA Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Monitor service level agreement compliance and response times
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {metric.value}
                  </p>
                  <p
                    className={`mt-2 flex items-center text-sm ${
                      metric.status === 'good'
                        ? 'text-green-600'
                        : metric.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    <span>{metric.trend} from last period</span>
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    metric.status === 'good'
                      ? 'bg-green-100'
                      : metric.status === 'warning'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      metric.status === 'good'
                        ? 'text-green-600'
                        : metric.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent SLA Violations */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent SLA Violations
          </h2>
          <div className="mt-4 space-y-3">
            {recentViolations.length > 0 ? (
              recentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="rounded-lg border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {violation.id}
                        </span>
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          {violation.violationType}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {violation.title}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>{violation.client}</span>
                        <span>•</span>
                        <span>{violation.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        +{violation.delay}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="mt-2 text-sm font-medium text-slate-900">
                  No recent violations
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  All SLAs are being met
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Client Compliance */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Client SLA Compliance
          </h2>
          <div className="mt-4 space-y-4">
            {clientCompliance.map((client) => (
              <div key={client.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">
                    {client.name}
                  </span>
                  <span
                    className={`font-semibold ${
                      client.compliance >= 98
                        ? 'text-green-600'
                        : client.compliance >= 95
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {client.compliance}%
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all ${
                        client.compliance >= 98
                          ? 'bg-green-500'
                          : client.compliance >= 95
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${client.compliance}%` }}
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {client.requests} requests completed
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Targets */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">SLA Targets</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 p-4">
            <p className="text-sm font-medium text-slate-600">
              First Response Time
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{'< 4h'}</p>
            <p className="mt-1 text-xs text-green-600">
              Currently meeting target
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-4">
            <p className="text-sm font-medium text-slate-600">
              Resolution Time (Simple)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{'< 24h'}</p>
            <p className="mt-1 text-xs text-green-600">
              Currently meeting target
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-4">
            <p className="text-sm font-medium text-slate-600">
              Resolution Time (Complex)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{'< 48h'}</p>
            <p className="mt-1 text-xs text-yellow-600">
              Average: 42h (within range)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
