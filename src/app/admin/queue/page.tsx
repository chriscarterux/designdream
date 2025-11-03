import { ListTodo, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalQueuePage() {
  const requests = [
    {
      id: 'REQ-001',
      title: 'Homepage redesign',
      client: 'Acme Corp',
      priority: 'High',
      status: 'In Progress',
      dueIn: '2 hours',
      type: 'Design',
    },
    {
      id: 'REQ-002',
      title: 'API integration for payment system',
      client: 'Tech Startup',
      priority: 'Critical',
      status: 'In Progress',
      dueIn: '30 mins',
      type: 'Development',
    },
    {
      id: 'REQ-003',
      title: 'Logo variations',
      client: 'Design Studio',
      priority: 'Medium',
      status: 'In Queue',
      dueIn: '1 day',
      type: 'Design',
    },
    {
      id: 'REQ-004',
      title: 'Database optimization',
      client: 'Acme Corp',
      priority: 'Low',
      status: 'In Queue',
      dueIn: '3 days',
      type: 'Development',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'In Queue':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <ListTodo className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Global Queue
        </h1>
        <p className="mt-2 text-slate-600">
          All requests across all clients in one unified view
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm" className="bg-purple-600">
          All Requests
        </Button>
        <Button variant="outline" size="sm">
          In Progress (2)
        </Button>
        <Button variant="outline" size="sm">
          In Queue (2)
        </Button>
        <Button variant="outline" size="sm">
          Design
        </Button>
        <Button variant="outline" size="sm">
          Development
        </Button>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Requests</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">34</p>
            </div>
            <ListTodo className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">In Progress</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">8</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">In Queue</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">14</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed Today</p>
              <p className="mt-1 text-2xl font-bold text-green-600">12</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getStatusIcon(request.status)}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {request.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{request.id}</span>
                    <span>•</span>
                    <span>{request.client}</span>
                    <span>•</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                      {request.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Due in</p>
                  <p className="font-medium text-slate-900">{request.dueIn}</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
