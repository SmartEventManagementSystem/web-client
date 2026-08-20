import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Ticket, Download, ArrowUp } from 'lucide-react';
import { Card, CardContent, Badge, Tabs } from '@/components/ui/Toast';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const PIE_COLORS = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#6b7280'];

const CHART_COLORS = {
  purple: '#9333ea',
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
};

const MOCK_MONTHLY = [
  { label: 'Jan', registrations: 2400, tickets: 1800, revenue: 12000 },
  { label: 'Feb', registrations: 3100, tickets: 2400, revenue: 15500 },
  { label: 'Mar', registrations: 4200, tickets: 3200, revenue: 21000 },
  { label: 'Apr', registrations: 5100, tickets: 4000, revenue: 25500 },
  { label: 'May', registrations: 6200, tickets: 4800, revenue: 31000 },
  { label: 'Jun', registrations: 7100, tickets: 5600, revenue: 35500 },
];

const MOCK_WEEKLY = [
  { label: 'Mon', registrations: 340, tickets: 280, revenue: 1800 },
  { label: 'Tue', registrations: 420, tickets: 350, revenue: 2200 },
  { label: 'Wed', registrations: 510, tickets: 420, revenue: 2600 },
  { label: 'Thu', registrations: 480, tickets: 390, revenue: 2400 },
  { label: 'Fri', registrations: 620, tickets: 500, revenue: 3100 },
  { label: 'Sat', registrations: 780, tickets: 620, revenue: 3900 },
  { label: 'Sun', registrations: 650, tickets: 510, revenue: 3250 },
];

const PIE_DATA = [
  { name: 'Tech Events', value: 35 },
  { name: 'Music', value: 25 },
  { name: 'Business', value: 20 },
  { name: 'Sports', value: 12 },
  { name: 'Other', value: 8 },
];

const TOP_EVENTS = [
  { id: '1', name: 'Tech Conference 2026', registrations: 3420, tickets: 2800, revenue: 84200, conversion: 81.9 },
  { id: '2', name: 'AI Summit', registrations: 2800, tickets: 2200, revenue: 66000, conversion: 78.6 },
  { id: '3', name: 'Summer Festival', registrations: 5100, tickets: 4100, revenue: 123000, conversion: 80.4 },
  { id: '4', name: 'Startup Summit', registrations: 1800, tickets: 1400, revenue: 42000, conversion: 77.8 },
  { id: '5', name: 'Music Fest', registrations: 4200, tickets: 3500, revenue: 105000, conversion: 83.3 },
];

const CHANNEL_DATA = [
  { channel: 'Direct', visitors: 45000, conversion: 4.2 },
  { channel: 'Organic', visitors: 32000, conversion: 3.8 },
  { channel: 'Social', visitors: 28000, conversion: 2.9 },
  { channel: 'Email', visitors: 15000, conversion: 5.1 },
  { channel: 'Referral', visitors: 10000, conversion: 3.5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-600 dark:text-gray-400">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {p.name === 'revenue' ? formatCurrency(p.value) : formatNumber(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState('monthly');
  const [stats] = useState({
    total_registrations: 24500,
    total_tickets: 18200,
    total_revenue: 187400,
    conversion_rate: 74.3,
  });

  const chartData = period === 'weekly' ? MOCK_WEEKLY : MOCK_MONTHLY;

  const statCards = [
    {
      label: 'Total Registrations',
      value: formatNumber(stats.total_registrations),
      change: '+12%',
      icon: Users,
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      label: 'Tickets Sold',
      value: formatNumber(stats.total_tickets),
      change: '+18%',
      icon: Ticket,
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversion_rate}%`,
      change: '+5%',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      change: '+8%',
      icon: BarChart3,
      gradient: 'from-amber-500 to-amber-700',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your event performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly' },
            ]}
            activeTab={period}
            onChange={setPeriod}
          />
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      <ArrowUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">vs last {period === 'weekly' ? 'week' : 'month'}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5.5 h-5.5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="xl:col-span-2">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Registrations and tickets over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.purple }} />
                <span className="text-gray-500">Registrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.blue }} />
                <span className="text-gray-500">Tickets</span>
              </div>
            </div>
          </div>
          <CardContent className="p-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="registrations" name="Registrations" stroke={CHART_COLORS.purple} strokeWidth={2} fill="url(#gradPurple)" />
                  <Area type="monotone" dataKey="tickets" name="Tickets" stroke={CHART_COLORS.blue} strokeWidth={2} fill="url(#gradBlue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Event Categories</h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribution by category</p>
          </div>
          <CardContent className="p-5">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {PIE_DATA.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value * 3}%`, backgroundColor: PIE_COLORS[i] }} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white w-10 text-right">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Revenue Over Time</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly revenue trends</p>
          </div>
          <CardContent className="p-5">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Traffic Sources</h2>
            <p className="text-xs text-gray-400 mt-0.5">Where your visitors come from</p>
          </div>
          <CardContent className="p-5">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_DATA} layout="vertical" margin={{ top: 4, right: 4, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis type="category" dataKey="channel" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visitors" name="Visitors" fill={CHART_COLORS.purple} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Events Table */}
      <Card>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Performing Events</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your best events by registrations</p>
          </div>
          <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Event', 'Registrations', 'Tickets Sold', 'Revenue', 'Conversion', 'Trend'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {TOP_EVENTS.map((event, i) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center text-xs font-bold text-purple-600">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">{formatNumber(event.registrations)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">{formatNumber(event.tickets)}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(event.revenue)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="success">{event.conversion}%</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 20 + 5) + '%'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
