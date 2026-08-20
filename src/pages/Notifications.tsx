import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, MessageSquare, Calendar, Settings, ChevronRight } from 'lucide-react';
import { notificationsApi } from '@/services/api';
import { useNotifications } from '@/stores/notifications-context';
import { Card, Button, EmptyState, Tabs } from '@/components/ui/Toast';
import type { Notification } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  success: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  warning: { icon: Alert, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  error: { icon: Alert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  chat: { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  event: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  system: { icon: Settings, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800/50' },
};

function Alert({ className }: { className: string }) {
  return (
    <svg className={cn('w-5 h-5', className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', user_id: 'u1', type: 'info', title: 'Event Reminder', message: 'Tech Conference 2026 starts in 1 hour. Don\'t forget to check in!', is_read: false, created_at: new Date(Date.now() - 120000).toISOString(), link: '/events/e1' },
  { id: '2', user_id: 'u1', type: 'chat', title: 'New message', message: 'Sarah Chen sent you a message in Tech Conference chat', is_read: false, created_at: new Date(Date.now() - 300000).toISOString(), link: '/chat' },
  { id: '3', user_id: 'u1', type: 'info', title: 'Ticket Confirmed', message: 'Your ticket for Summer Festival 2026 has been confirmed. Ticket ID: #TKT-8821', is_read: false, created_at: new Date(Date.now() - 600000).toISOString(), link: '/tickets' },
  { id: '4', user_id: 'u1', type: 'event', title: 'Speaker confirmed', message: 'Dr. Emily Watson confirmed as keynote speaker for AI Summit', is_read: true, created_at: new Date(Date.now() - 1800000).toISOString(), link: '/speakers' },
  { id: '5', user_id: 'u1', type: 'info', title: 'Payment received', message: 'Payment of $299 received for VIP Pass - Tech Conference 2026', is_read: true, created_at: new Date(Date.now() - 3600000).toISOString(), link: '/analytics' },
  { id: '6', user_id: 'u1', type: 'event', title: 'New attendee', message: 'Michael Chen registered for your event: Startup Summit 2026', is_read: true, created_at: new Date(Date.now() - 7200000).toISOString(), link: '/events/e3' },
  { id: '7', user_id: 'u1', type: 'system', title: 'Profile updated', message: 'Your profile information has been updated successfully', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications: ctxNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [_deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (ctxNotifications.length > 0) {
      setNotifications(ctxNotifications);
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, [ctxNotifications]);

  const unread = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await new Promise((r) => setTimeout(r, 300));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeleting(null);
  };

  const filtered = notifications.filter((n) =>
    filter === 'all' ? true : filter === 'unread' ? !n.is_read : n.type === filter
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <Button variant="secondary" size="sm" className="gap-1.5" onClick={handleMarkAllRead}>
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unread },
          { id: 'event', label: 'Events' },
          { id: 'chat', label: 'Messages' },
        ]}
        activeTab={filter}
        onChange={setFilter}
      />

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'all' ? 'No notifications' : filter === 'unread' ? 'All caught up!' : 'No notifications'}
          description={filter === 'unread' ? "You've read all your notifications" : 'You\'re all caught up!'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
            const Icon = config.icon;
            const isUnread = !notif.is_read;

            return (
              <Card
                key={notif.id}
                hover
                className={cn(
                  'transition-all duration-200 group',
                  isUnread && 'border-l-4 border-l-purple-500 shadow-sm'
                )}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105', config.bg)}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      if (!isUnread) return;
                      handleMarkAsRead(notif.id);
                      if (notif.link) navigate(notif.link);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm', isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300')}>
                            {notif.title}
                          </p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(notif.created_at)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {notif.link && (
                          <button
                            onClick={() => { if (!isUnread) handleMarkAsRead(notif.id); navigate(notif.link!); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-300 hover:text-gray-500 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
