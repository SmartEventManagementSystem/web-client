import { useState } from 'react';
import { User, Bell, Shield, Palette, Key, Globe, Smartphone, Check, X, Save } from 'lucide-react';
import { Card, CardContent, Button, Input, Avatar, Badge } from '@/components/ui/Toast';
import { useAuth } from '@/stores/auth-context';
import { useTheme } from '@/stores/theme-context';
import { authApi } from '@/services/api';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
];

const NotificationToggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-300',
        checked ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
      )}
    >
      <div
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  </div>
);

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    bio: '',
    timezone: 'America/New_York',
    language: 'en',
  });

  const [notifications, setNotifications] = useState({
    email_event_updates: true,
    email_ticket_sales: true,
    email_weekly_digest: false,
    push_new_attendee: true,
    push_ticket_sold: true,
    push_event_reminder: true,
    marketing_emails: false,
    chat_notifications: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    try {
      await authApi.updateProfile(profile as any);
      if (user) updateUser({ ...user, name: profile.name });
    } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themes = [
    { id: 'light', label: 'Light', bg: 'bg-white', border: 'border-gray-200' },
    { id: 'dark', label: 'Dark', bg: 'bg-gray-900', border: 'border-gray-700' },
    { id: 'system', label: 'System', bg: 'bg-gradient-to-r from-white to-gray-900', border: 'border-gray-300' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs sidebar */}
        <div className="w-56 flex-shrink-0 hidden lg:flex flex-col">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200/50 dark:border-purple-800/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile tabs */}
          <div className="flex lg:hidden gap-1 overflow-x-auto pb-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar name={user?.name} src={user?.avatar} size="xl" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label="Email" type="email" value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  <Input label="Phone" placeholder="+1 (555) 000-0000" value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  <Input label="Company" placeholder="Your company" value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button onClick={handleSave} loading={saving} className="gap-2">
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Notifications</h3>
                  <p className="text-xs text-gray-400 mb-3">Control which emails you receive</p>
                  <NotificationToggle
                    label="Event updates"
                    description="Get notified when your events change"
                    checked={notifications.email_event_updates}
                    onChange={(v) => setNotifications({ ...notifications, email_event_updates: v })}
                  />
                  <NotificationToggle
                    label="Ticket sales"
                    description="Receive alerts when tickets are purchased"
                    checked={notifications.email_ticket_sales}
                    onChange={(v) => setNotifications({ ...notifications, email_ticket_sales: v })}
                  />
                  <NotificationToggle
                    label="Weekly digest"
                    description="Summary of activity every Monday"
                    checked={notifications.email_weekly_digest}
                    onChange={(v) => setNotifications({ ...notifications, email_weekly_digest: v })}
                  />
                  <NotificationToggle
                    label="Marketing emails"
                    description="News, tips and special offers"
                    checked={notifications.marketing_emails}
                    onChange={(v) => setNotifications({ ...notifications, marketing_emails: v })}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Push Notifications</h3>
                  <p className="text-xs text-gray-400 mb-3">Real-time alerts on your devices</p>
                  <NotificationToggle
                    label="New attendees"
                    description="When someone registers for your event"
                    checked={notifications.push_new_attendee}
                    onChange={(v) => setNotifications({ ...notifications, push_new_attendee: v })}
                  />
                  <NotificationToggle
                    label="Ticket sold"
                    description="Instant notification of ticket purchases"
                    checked={notifications.push_ticket_sold}
                    onChange={(v) => setNotifications({ ...notifications, push_ticket_sold: v })}
                  />
                  <NotificationToggle
                    label="Event reminders"
                    description="Reminders before your events start"
                    checked={notifications.push_event_reminder}
                    onChange={(v) => setNotifications({ ...notifications, push_event_reminder: v })}
                  />
                  <NotificationToggle
                    label="Chat messages"
                    description="New messages in your chat rooms"
                    checked={notifications.chat_notifications}
                    onChange={(v) => setNotifications({ ...notifications, chat_notifications: v })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                  <Button className="gap-2">
                    <Key className="w-4 h-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-400 mt-1">Add an extra layer of security</p>
                    </div>
                    <Badge variant="default">Disabled</Badge>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="w-4 h-4" />
                    Enable 2FA
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4">These actions are irreversible</p>
                  <Button variant="danger" className="gap-2">
                    <X className="w-4 h-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all text-center',
                          theme === t.id
                            ? 'border-purple-500 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        )}
                      >
                        <div className={cn('w-full h-14 rounded-lg mb-2 flex items-center justify-center', t.bg)}>
                          {theme === t.id && <Check className="w-5 h-5 text-purple-600" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sidebar</h3>
                  <div className="space-y-3">
                    <NotificationToggle
                      label="Compact mode"
                      description="Reduce spacing in the sidebar"
                      checked={false}
                      onChange={() => {}}
                    />
                    <NotificationToggle
                      label="Show icons only"
                      description="Display icons only, hide labels"
                      checked={false}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Connected Services</h3>
                <p className="text-xs text-gray-400">Manage third-party integrations</p>
                {[
                  { name: 'Google Calendar', desc: 'Sync events with Google Calendar', connected: true, icon: '📅' },
                  { name: 'Slack', desc: 'Get notifications in Slack', connected: false, icon: '💬' },
                  { name: 'Zapier', desc: 'Automate workflows with Zapier', connected: false, icon: '⚡' },
                  { name: 'HubSpot', desc: 'CRM integration for contacts', connected: true, icon: '🔴' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                        {service.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</p>
                        <p className="text-xs text-gray-400">{service.desc}</p>
                      </div>
                    </div>
                    <Button
                      variant={service.connected ? 'secondary' : 'outline'}
                      size="sm"
                      className="gap-1.5"
                    >
                      {service.connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
