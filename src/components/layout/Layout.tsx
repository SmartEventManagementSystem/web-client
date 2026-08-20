import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar, MessageSquare, Users, Settings,
  LayoutDashboard, Bell, Ticket, BarChart3,
  LogOut, Sparkles, Menu, X, ChevronDown,
  Sun, Moon, Monitor, Database,
} from 'lucide-react';
import { useAuth } from '@/stores/auth-context';
import { useTheme } from '@/stores/theme-context';
import { useNotifications } from '@/stores/notifications-context';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Toast';
import { useState, useRef, useEffect } from 'react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/tickets', icon: Ticket, label: 'My Tickets' },
  { to: '/speakers', icon: Users, label: 'Speakers' },
  { to: '/chat', icon: MessageSquare, label: 'Chat Rooms' },
  { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/data-catalog', icon: Database, label: 'Data Catalog' },
];

const BOTTOM_NAV = [
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a1a]">
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[272px] flex flex-col',
          'bg-white/80 dark:bg-[#0f0f23] border-r border-gray-200/80 dark:border-gray-800/80',
          'backdrop-blur-xl',
          'transform transition-transform duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">EMS Platform</h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 tracking-wide">Event Management</p>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200/50 dark:border-purple-800/30'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  )
                }
              >
                <Icon className={cn(
                  'w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200',
                  'group-hover:scale-110'
                )} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-3 space-y-0.5 border-t border-gray-100 dark:border-gray-800/80 pt-3">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200/50 dark:border-purple-800/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                )
              }
            >
              <div className="relative">
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {to === '/notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {label}
            </NavLink>
          ))}
        </div>

        {/* User profile */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800/80">
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors group"
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-gray-400 transition-transform duration-200',
                userMenuOpen && 'rotate-180'
              )} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden animate-scale-in origin-bottom z-50">
                <div className="p-1.5">
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
                  <div className="p-2 space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 mb-1">Theme</p>
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' },
                    ].map(({ id, icon: ThemeIcon, label }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id as 'light' | 'dark' | 'system')}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm transition-colors',
                          theme === id
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <ThemeIcon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search events, speakers, tickets..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                  className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-scale-in origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                          onClick={() => {/* mark all read */}}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {unreadCount === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                          {[
                            { title: 'New event created', desc: 'Summer Festival 2026 is now live', time: '2m ago', dot: 'bg-purple-500' },
                            { title: 'Ticket purchased', desc: 'Someone bought a ticket for TechConf', time: '15m ago', dot: 'bg-emerald-500' },
                            { title: 'Speaker confirmed', desc: 'John Smith confirmed as keynote', time: '1h ago', dot: 'bg-blue-500' },
                          ].map((notif, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', notif.dot)} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{notif.desc}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                        className="w-full text-center text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
