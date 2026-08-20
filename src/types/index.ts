// ===== Core Types =====

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  bio?: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'ongoing';
  avatar?: string;
  cover?: string;
  max_attendees: number;
  current_attendees: number;
  is_public: boolean;
  price: number;
  currency: string;
  tags: string[];
  creator_id: string;
  creator?: User;
  created_at: string;
  updated_at?: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  event?: Event;
  user_id: string;
  ticket_type: string;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  price: number;
  qr_code?: string;
  created_at: string;
  updated_at?: string;
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  company?: string;
  title?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  sessions?: Session[];
}

export interface Session {
  id: string;
  event_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  speaker_id?: string;
  speaker?: Speaker;
  location?: string;
  track?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface ChatRoom {
  id: string;
  name: string;
  event_id?: string;
  event?: Event;
  participants: User[];
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  reactions?: Array<{ emoji: string; user_ids: string[] }>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'chat' | 'event' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  refresh_token?: string;
  user: User;
  expires_at?: string;
}

// ===== API Response Types =====

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// ===== Analytics Types =====

export interface DashboardStats {
  total_events: number;
  total_attendees: number;
  total_tickets_sold: number;
  total_revenue: number;
  events_change: number;
  attendees_change: number;
  tickets_change: number;
  revenue_change: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  views: number;
  registrations: number;
  tickets_sold: number;
  revenue: number;
  conversion_rate: number;
}

export interface AnalyticsOverview {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
  top_events: AnalyticsEvent[];
  recent_activities: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'registration' | 'payment' | 'speaker' | 'event' | 'ticket' | 'chat';
  text: string;
  time: string;
  metadata?: Record<string, unknown>;
}

// ===== AI / RAG Types =====

export interface AIQueryResult {
  query: string;
  answer: string;
  model: string;
  sources: AISource[];
  confidence?: number;
}

export interface AISource {
  id: string;
  content: string;
  score: number;
  metadata: {
    source: string;
    event_id?: string;
    page?: number;
  };
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: AISource[];
  model?: string;
  thinking?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}

// ===== Balance / Wallet Types =====

export interface Balance {
  currency: string;
  amount: number;
  locked?: number;
  available?: number;
}

export interface BalanceTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

// ===== Collection & Items (NFT-like) =====

export interface Collection {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  total_items: number;
  creator_id: string;
  creator?: User;
  items?: Item[];
  created_at: string;
}

export interface Item {
  id: string;
  collection_id: string;
  collection?: Collection;
  name: string;
  description: string;
  image_url?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes?: Record<string, string | number>;
  owner_id?: string;
  owner?: User;
  created_at: string;
}

// ===== Workspace Types =====

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'free' | 'pro' | 'enterprise';
  members_count: number;
  created_at: string;
}

// ===== Settings Types =====

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_enabled: boolean;
}

// ===== Form Types =====

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  max_attendees: number;
  price: number;
  currency: string;
  tags: string[];
  is_public: boolean;
  cover?: File;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  max_attendees: number;
  price: number;
  currency: string;
  tags: string[];
  is_public: boolean;
}
