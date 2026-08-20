import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Users, Search, Plus, Grid, List, ExternalLink } from 'lucide-react';
import { eventsApi } from '@/services/api';
import { Card, CardContent, Badge, Button, EmptyState, Modal, Input, Textarea, Select } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Toast';
import type { Event } from '@/types';
import { formatDate, formatCurrency, cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  published: 'success',
  draft: 'default',
  ongoing: 'info',
  completed: 'warning',
  cancelled: 'error',
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    max_attendees: 100,
    price: 0,
    currency: 'USD',
    tags: '',
    is_public: true,
  });
  const [creating, setCreating] = useState(false);
  const [total, setTotal] = useState(0);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page_size: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await eventsApi.list(params);
      setEvents(res.data.data);
      setTotal(res.data.total);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await eventsApi.create(payload as any);
      setEvents((prev) => [res.data as unknown as Event, ...prev]);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', location: '', start_time: '', end_time: '', max_attendees: 100, price: 0, currency: 'USD', tags: '', is_public: true });
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  const filtered = events.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {total > 0 ? `${total} events found` : 'Browse and manage your events'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2" size="lg">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-all',
              viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
            )}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-all',
              viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
            )}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-3'}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-44 rounded-none" />
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Try adjusting your search or filters, or create a new event."
          action={{ label: 'Create Event', onClick: () => setShowCreateModal(true) }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((event) => (
            <Card
              key={event.id}
              hover
              className="overflow-hidden group"
              onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                {event.cover ? (
                  <img src={event.cover} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-purple-400/40 mx-auto" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant={STATUS_BADGE[event.status] || 'default'} size="md">
                    {event.status}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant={STATUS_BADGE[event.status] || 'default'} size="md" dot>
                    {event.status}
                  </Badge>
                </div>
                {event.price === 0 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg">Free</span>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{event.current_attendees} / {event.max_attendees} attendees</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {event.price === 0 ? 'Free' : formatCurrency(event.price, event.currency)}
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 ml-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (event.current_attendees / event.max_attendees) * 100)}%` }}
                    />
                  </div>
                </div>
                {event.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <Card key={event.id} hover onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}>
              <div className="flex">
                <div className="w-56 h-36 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {event.cover ? (
                    <img src={event.cover} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <Calendar className="w-12 h-12 text-purple-400/40" />
                  )}
                </div>
                <CardContent className="flex-1 p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{event.title}</h3>
                      <Badge variant={STATUS_BADGE[event.status] || 'default'} size="sm" dot>{event.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(event.start_time)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{event.current_attendees} attendees</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {event.price === 0 ? 'Free' : formatCurrency(event.price, event.currency)}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Event" size="lg">
        <div className="space-y-4">
          <Input label="Event Title" placeholder="Tech Conference 2026" value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Description" placeholder="Describe your event..." rows={3} value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" placeholder="San Francisco, CA" value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <Input label="Max Attendees" type="number" value={formData.max_attendees}
              onChange={(e) => setFormData({ ...formData, max_attendees: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="datetime-local" value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
            <Input label="End Time" type="datetime-local" value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (USD)" type="number" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            <Select label="Currency" value={formData.currency} options={[
              { value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'VND', label: 'VND' },
            ]} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} />
            <Input label="Tags" placeholder="tech, ai, conference" value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })} hint="Comma separated" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_public" checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-purple-600" />
            <label htmlFor="is_public" className="text-sm text-gray-700 dark:text-gray-300">Public event</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} loading={creating} className="flex-1">Create Event</Button>
          </div>
        </div>
      </Modal>

      {/* Event Detail Modal */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title={selectedEvent?.title} size="xl">
        {selectedEvent && (
          <div className="space-y-6">
            <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              {selectedEvent.cover && (
                <img src={selectedEvent.cover} alt={selectedEvent.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedEvent.start_time)}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(selectedEvent.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEvent.location}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-1">Attendees</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEvent.current_attendees} / {selectedEvent.max_attendees}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-1">Price</p>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {selectedEvent.price === 0 ? 'Free' : formatCurrency(selectedEvent.price, selectedEvent.currency)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Description</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{selectedEvent.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowDetailModal(false)} className="flex-1">Close</Button>
              <Button className="flex-1 gap-1">
                View Details
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
