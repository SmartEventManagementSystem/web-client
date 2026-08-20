import { useState } from 'react';
import {
  Database, Table, GitBranch, Activity, HardDrive, Network,
  ChevronRight, Search, RefreshCw, ExternalLink, Layers, Zap
} from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// Mock data catalog information
const DATA_SOURCES = [
  {
    id: 'postgres-events',
    name: 'PostgreSQL - Events',
    type: 'postgres',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    tables: 12,
    rows: '2.4M',
    lastSync: '5 min ago',
    status: 'healthy',
    connection: 'postgres-events:5432',
  },
  {
    id: 'mongodb-analytics',
    name: 'MongoDB - Analytics',
    type: 'mongodb',
    icon: Database,
    color: 'from-emerald-500 to-green-500',
    tables: 8,
    rows: '15.8M',
    lastSync: '3 min ago',
    status: 'healthy',
    connection: 'mongodb:27017',
  },
  {
    id: 'oracle-legacy',
    name: 'Oracle XE - Legacy',
    type: 'oracle',
    icon: Database,
    color: 'from-red-500 to-orange-500',
    tables: 24,
    rows: '890K',
    lastSync: '1 hour ago',
    status: 'warning',
    connection: 'oracle-xe:1521',
  },
  {
    id: 'kafka-streams',
    name: 'Kafka - Event Streams',
    type: 'kafka',
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    tables: 15,
    rows: '1.2B',
    lastSync: 'Real-time',
    status: 'healthy',
    connection: 'kafka:29092',
  },
  {
    id: 'iceberg-warehouse',
    name: 'Iceberg - Data Lake',
    type: 'iceberg',
    icon: HardDrive,
    color: 'from-amber-500 to-yellow-500',
    tables: 18,
    rows: '45.2M',
    lastSync: '2 min ago',
    status: 'healthy',
    connection: 'minio:9000',
  },
  {
    id: 'bigquery-analytics',
    name: 'BigQuery - Analytics',
    type: 'bigquery',
    icon: Layers,
    color: 'from-indigo-500 to-blue-500',
    tables: 32,
    rows: '156M',
    lastSync: '15 min ago',
    status: 'healthy',
    connection: 'bigquery:9050',
  },
];

const ICEBERG_TABLES = [
  { name: 'ems.events', type: 'Iceberg', size: '12.5 GB', rows: '2.4M', partitions: 12, lastModified: '2 min ago', format: 'Parquet' },
  { name: 'ems.users', type: 'Iceberg', size: '4.2 GB', rows: '890K', partitions: 8, lastModified: '5 min ago', format: 'Parquet' },
  { name: 'ems.analytics_events', type: 'Iceberg', size: '28.1 GB', rows: '45.2M', partitions: 24, lastModified: '1 min ago', format: 'Parquet' },
  { name: 'ems.revenue', type: 'Iceberg', size: '1.8 GB', rows: '156K', partitions: 4, lastModified: '10 min ago', format: 'Parquet' },
  { name: 'ems.tickets', type: 'Iceberg', size: '2.1 GB', rows: '340K', partitions: 6, lastModified: '3 min ago', format: 'Parquet' },
];

const PIPELINES = [
  { name: 'event_analytics_pipeline', status: 'running', schedule: '@hourly', lastRun: '10 min ago', nextRun: '50 min', success: 2847, failed: 3 },
  { name: 'daily_ingestion_pipeline', status: 'running', schedule: '0 2 * * *', lastRun: '4 hours ago', nextRun: '2 hours', success: 156, failed: 0 },
  { name: 'reporting_pipeline', status: 'paused', schedule: '0 6 * * *', lastRun: '1 day ago', nextRun: 'Paused', success: 89, failed: 1 },
  { name: 'cdc_postgres_to_kafka', status: 'running', schedule: 'Continuous', lastRun: 'Real-time', nextRun: 'Continuous', success: 1560000, failed: 12 },
];

export default function DataCatalog() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('sources');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'sources', label: 'Data Sources', icon: Database, count: DATA_SOURCES.length },
    { id: 'tables', label: 'Iceberg Tables', icon: Table, count: ICEBERG_TABLES.length },
    { id: 'pipelines', label: 'Pipelines', icon: GitBranch, count: PIPELINES.length },
    { id: 'lineage', label: 'Lineage', icon: Network, count: null },
  ];

  const filteredSources = DATA_SOURCES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Data Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OpenMetadata + Iceberg Integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={refresh} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button size="sm" className="gap-2" onClick={() => window.open('http://localhost:8585', '_blank')}>
            <ExternalLink className="w-4 h-4" />
            OpenMetadata
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sources', value: '6', icon: Database, color: 'from-blue-500 to-cyan-500', trend: '+2 this week' },
          { label: 'Total Tables', value: '89', icon: Table, color: 'from-purple-500 to-pink-500', trend: '+5 this week' },
          { label: 'Active Pipelines', value: '3', icon: Zap, color: 'from-emerald-500 to-green-500', trend: '100% uptime' },
          { label: 'Total Records', value: '1.2B', icon: Layers, color: 'from-amber-500 to-orange-500', trend: '+45M today' },
        ].map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs',
                activeTab === tab.id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search data sources, tables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSources.map((source) => {
            const Icon = source.icon;
            return (
              <Card key={source.id} hover className="group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform', source.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant={source.status === 'healthy' ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {source.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{source.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{source.connection}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Tables</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{source.tables}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Rows</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{source.rows}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Sync</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{source.lastSync}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'tables' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Table</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rows</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partitions</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {ICEBERG_TABLES.map((table) => (
                  <tr key={table.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/10 to-yellow-500/10 flex items-center justify-center">
                          <Table className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {table.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="default" size="sm">{table.format}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{table.size}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{table.rows}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{table.partitions}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-500">{table.lastModified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'pipelines' && (
        <div className="space-y-4">
          {PIPELINES.map((pipeline) => (
            <Card key={pipeline.name} hover>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      pipeline.status === 'running' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'
                    )}>
                      <GitBranch className={cn(
                        'w-5 h-5',
                        pipeline.status === 'running' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{pipeline.name}</h3>
                      <p className="text-sm text-gray-500">Schedule: {pipeline.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last Run</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{pipeline.lastRun}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Next Run</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{pipeline.nextRun}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Success / Failed</p>
                      <p className="text-sm font-medium">
                        <span className="text-emerald-600 dark:text-emerald-400">{pipeline.success.toLocaleString()}</span>
                        {' / '}
                        <span className="text-red-500">{pipeline.failed}</span>
                      </p>
                    </div>
                    <Badge
                      variant={pipeline.status === 'running' ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {pipeline.status}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'lineage' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Network className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Lineage</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Visualize the flow of data across your platforms. Track how data moves from source to destination.
            </p>
            <Button onClick={() => window.open('http://localhost:8585/lineage', '_blank')} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View in OpenMetadata
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
