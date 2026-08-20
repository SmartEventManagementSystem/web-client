import { useState, useEffect } from 'react';
import { Calendar, Users, Ticket, TrendingUp, Clock, ArrowRight, Plus, Zap, Eye, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth-context';
import { eventsApi, analyticsApi } from '@/services/api';
import { Card, CardContent, Badge, Skeleton } from '@/components/ui/Toast';
import type { Event, DashboardStats, ChartDataPoint } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from 'recharts';

const CHART_COLORS = {
  primary: '#9333ea',
  secondary: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
};

const MOCK_STATS: DashboardStats = {
  total_events: 248,
  total_attendees: 12500,
  total_tickets_sold: 34200,
  total_revenue: 89400,
  events_change: 12,
  attendees_change: 8,
  tickets_change: 23,
  revenue_change: 18,
};

const MOCK_MONTHLY = [
  { label: 'Jan', value: 12000, events: 45, attendees: 2400, revenue: 12000 },
  { label: 'Feb', value: 15500, events: 52, attendees: 3100, revenue: 15500 },
  { label: 'Mar', value: 21000, events: 68, attendees: 4200, revenue: 21000 },
  { label: 'Apr', value: 25500, events: 74, attendees: 5100, revenue: 25500 },
  { label: 'May', value: 31000, events: 85, attendees: 6200, revenue: 31000 },
  { label: 'Jun', value: 35400, events: 92, attendees: 7100, revenue: 35400 },
];

const MOCK_ACTIVITIES = [
  { id: '1', type: 'registration' as const, text: 'Sarah Chen registered for Tech Conference 2026', time: '2m ago', color: 'bg-emerald-500' },
  { id: '2', type: 'payment' as const, text: 'Payment received — $299 for VIP Pass', time: '15m ago', color: 'bg-amber-500' },
  { id: '3', type: 'speaker' as const, text: 'Dr. Emily Watson confirmed as keynote speaker', time: '1h ago', color: 'bg-purple-500' },
  { id: '4', type: 'event' as const, text: 'Summer Festival 2026 published successfully', time: '2h ago', color: 'bg-blue-500' },
  { id: '5', type: 'ticket' as const, text: '50 tickets sold for AI Summit 2026', time: '3h ago', color: 'bg-rose-500' },
];

const TYPE_LABELS: Record<string, string> = {
  registration: 'Registration',
  payment: 'Payment',
  speaker: 'Speaker',
  event: 'Event',
  ticket: 'Ticket',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-600 dark:text-gray-400">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData] = useState<ChartDataPoint[]>(MOCK_MONTHLY);
  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    eventsApi.list({ page_size: 6, status: 'published' })
      .then((res) => setEvents(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    analyticsApi.getDashboard()
      .then((res) => setStats(res.data as unknown as DashboardStats))
      .catch(() => setStats(MOCK_STATS));
  }, []);

  const displayStats = stats || MOCK_STATS;

  const statCards = [
    {
      label: 'Total Events',
      value: formatNumber(displayStats.total_events),
      change: `+${displayStats.events_change}%`,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      label: 'Active Attendees',
      value: formatNumber(displayStats.total_attendees),
      change: `+${displayStats.attendees_change}%`,
      icon: Users,
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      label: 'Tickets Sold',
      value: formatNumber(displayStats.total_tickets_sold),
      change: `+${displayStats.tickets_change}%`,
      icon: Ticket,
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(displayStats.total_revenue),
      change: `+${displayStats.revenue_change}%`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-amber-700',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Here's what's happening with your events
          </p>
        </div>
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} hover className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5.5 h-5.5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart - Events & Attendees */}
        <Card className="xl:col-span-2">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Growth Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Events & attendees over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }} />
                <span className="text-gray-500">Events</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.secondary }} />
                <span className="text-gray-500">Attendees</span>
              </div>
            </div>
          </div>
          <CardContent className="p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="attendees" name="Attendees" stroke={CHART_COLORS.secondary} strokeWidth={2} fill="url(#gradSecondary)" />
                  <Area type="monotone" dataKey="events" name="Events" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#gradPrimary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Revenue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly earnings</p>
          </div>
          <CardContent className="p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Upcoming Events */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest updates across your platform</p>
            </div>
            <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium transition-colors">
              View all
            </button>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {MOCK_ACTIVITIES.map((activity) => (
                <div
                  key={activity.id}
                  className="px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.color} mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">{activity.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="xs">{TYPE_LABELS[activity.type]}</Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="text-xs text-gray-400 mt-0.5">Your next scheduled events</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium flex items-center gap-0.5 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="px-5 py-3.5 flex items-center gap-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.location}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge variant={event.status === 'published' ? 'success' : event.status === 'ongoing' ? 'info' : 'default'} size="sm" dot>
                        {event.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                        <Users className="w-3 h-3" />
                        {event.current_attendees}/{event.max_attendees}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No upcoming events</p>
                <button
                  onClick={() => navigate('/events')}
                  className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Create your first event
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Quick Stats', icon: Eye, desc: 'View analytics', gradient: 'from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-800/30' },
          { label: 'AI Assistant', icon: Zap, desc: 'Get help instantly', gradient: 'from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-800/30' },
          { label: 'My Tickets', icon: Ticket, desc: 'View your tickets', gradient: 'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-800/30' },
          { label: 'Revenue', icon: DollarSign, desc: 'Track earnings', gradient: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-800/30' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(`/${action.label.toLowerCase().replace(' ', '-')}`)}
            className={`group flex items-center gap-3 p-4 rounded-xl border bg-gradient-to-br ${action.gradient} hover:shadow-md transition-all duration-200 text-left`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <action.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
              <p className="text-xs text-gray-400">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
