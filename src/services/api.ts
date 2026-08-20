import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  User, Event, AuthResponse, ChatMessage, ChatRoom,
  Notification, Collection, Item, PaginatedResponse,
  AIQueryResult, Session, Speaker, Balance,
  BalanceTransaction, Ticket, AnalyticsOverview, DashboardStats,
  CreateEventPayload, Workspace, UserSettings,
} from '@/types';

// ===== Axios Instance =====

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// ===== Request Interceptor =====
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth API =====
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<User>('/auth/me'),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/profile', data),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post('/auth/change-password', data),
};

// ===== Events API =====
export const eventsApi = {
  list: (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
    tags?: string;
  }) => api.get<PaginatedResponse<Event>>('/events', { params }),

  get: (id: string) => api.get<Event>(`/events/${id}`),

  create: (data: CreateEventPayload) =>
    api.post<Event>('/events', data),

  update: (id: string, data: Partial<Event>) =>
    api.put<Event>(`/events/${id}`, data),

  delete: (id: string) =>
    api.delete(`/events/${id}`),

  search: (query: string) =>
    api.get<PaginatedResponse<Event>>('/events/search', { params: { q: query } }),

  publish: (id: string) =>
    api.post<Event>(`/events/${id}/publish`),

  cancel: (id: string) =>
    api.post<Event>(`/events/${id}/cancel`),

  register: (id: string) =>
    api.post(`/events/${id}/register`),

  attendees: (id: string, params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<User>>(`/events/${id}/attendees`, { params }),
};

// ===== Sessions API =====
export const sessionsApi = {
  list: (eventId?: string) =>
    api.get<PaginatedResponse<Session>>('/sessions', { params: eventId ? { event_id: eventId } : {} }),

  create: (data: Partial<Session>) =>
    api.post<Session>('/sessions', data),

  update: (id: string, data: Partial<Session>) =>
    api.put<Session>(`/sessions/${id}`, data),

  delete: (id: string) =>
    api.delete(`/sessions/${id}`),
};

// ===== Speakers API =====
export const speakersApi = {
  list: (eventId?: string) =>
    api.get<PaginatedResponse<Speaker>>('/speakers', { params: eventId ? { event_id: eventId } : {} }),

  get: (id: string) =>
    api.get<Speaker>(`/speakers/${id}`),

  create: (data: Partial<Speaker>) =>
    api.post<Speaker>('/speakers', data),

  update: (id: string, data: Partial<Speaker>) =>
    api.put<Speaker>(`/speakers/${id}`, data),

  delete: (id: string) =>
    api.delete(`/speakers/${id}`),
};

// ===== Tickets API =====
export const ticketsApi = {
  list: (params?: { page?: number; page_size?: number; status?: string }) =>
    api.get<PaginatedResponse<Ticket>>('/tickets', { params }),

  get: (id: string) =>
    api.get<Ticket>(`/tickets/${id}`),

  create: (data: { event_id: string; ticket_type: string }) =>
    api.post<Ticket>('/tickets', data),

  cancel: (id: string) =>
    api.post(`/tickets/${id}/cancel`),

  verify: (qrCode: string) =>
    api.post<{ valid: boolean; ticket?: Ticket }>('/tickets/verify', { qr_code: qrCode }),
};

// ===== Chat API =====
export const chatApi = {
  sendMessage: (data: { room_id: string; content: string; type?: string }) =>
    api.post<ChatMessage>(`/chat/rooms/${data.room_id}/messages`, data),

  getRooms: () =>
    api.get<PaginatedResponse<ChatRoom>>('/chat/rooms'),

  getRoom: (roomId: string) =>
    api.get<ChatRoom>(`/chat/rooms/${roomId}`),

  createRoom: (data: { name: string; event_id?: string; participant_ids?: string[] }) =>
    api.post<ChatRoom>('/chat/rooms', data),

  getMessages: (roomId: string, params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<ChatMessage>>(`/chat/rooms/${roomId}/messages`, { params }),

  addReaction: (roomId: string, messageId: string, emoji: string) =>
    api.post(`/chat/rooms/${roomId}/messages/${messageId}/reactions`, { emoji }),

  markAsRead: (roomId: string) =>
    api.post(`/chat/rooms/${roomId}/read`),
};

// ===== AI API =====
export const aiApi = {
  chat: (data: {
    messages: Array<{ role: string; content: string }>;
    event_id?: string;
    conversation_id?: string;
  }) => api.post<{ content: string; model: string; conversation_id?: string }>('/ai/chat', data),

  chatStream: (
    data: {
      messages: Array<{ role: string; content: string }>;
      event_id?: string;
      conversation_id?: string;
    },
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: string) => void
  ) => {
    const controller = new AbortController();
    api.post('/ai/chat/stream', data, {
      responseType: 'stream',
      signal: controller.signal,
    })
      .then((res) => {
        const reader = res.data.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        const read = () => {
          reader.read().then(({ done, value }: { done: boolean; value?: Uint8Array }) => {
            if (done) { onDone(); return; }
            const text = decoder.decode(value, { stream: true });
            onChunk(text);
            read();
          });
        };
        read();
      })
      .catch((err) => {
        if (!axios.isCancel(err)) onError(err.message);
      });
    return controller;
  },

  ragQuery: (data: { query: string; event_id?: string; top_k?: number }) =>
    api.post<AIQueryResult>('/ai/rag/query', data),

  ragIngest: (data: { content: string; source?: string; event_id?: string }) =>
    api.post('/ai/rag/ingest', data),

  getConversations: () =>
    api.get<PaginatedResponse<{ id: string; title: string; created_at: string }>>('/ai/conversations'),

  deleteConversation: (id: string) =>
    api.delete(`/ai/conversations/${id}`),
};

// ===== Notifications API =====
export const notificationsApi = {
  getAll: (params?: { page?: number; page_size?: number; unread_only?: boolean }) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),

  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put('/notifications/read-all'),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
};

// ===== User / Balances API =====
export const userApi = {
  getBalances: () =>
    api.get<Balance[]>('/users/balances'),

  getBalanceHistory: (params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<BalanceTransaction>>('/users/balances/history', { params }),

  getSettings: () =>
    api.get<UserSettings>('/users/settings'),

  updateSettings: (data: Partial<UserSettings>) =>
    api.put<UserSettings>('/users/settings', data),
};

// ===== Collections & Items API =====
export const collectionsApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<Collection>>('/collections', { params }),

  get: (id: string) =>
    api.get<Collection>(`/collections/${id}`),

  getItems: (id: string, params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<Item>>(`/collections/${id}/items`, { params }),
};

export const itemsApi = {
  list: (params?: { collection_id?: string; rarity?: string; page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<Item>>('/items', { params }),

  get: (id: string) =>
    api.get<Item>(`/items/${id}`),

  getMyItems: () =>
    api.get<PaginatedResponse<Item>>('/users/items'),
};

// ===== Analytics API =====
export const analyticsApi = {
  getDashboard: () =>
    api.get<DashboardStats>('/analytics/dashboard'),

  getOverview: (params?: { period?: 'daily' | 'weekly' | 'monthly' | 'yearly' }) =>
    api.get<AnalyticsOverview>('/analytics/overview', { params }),

  getEventAnalytics: (eventId: string) =>
    api.get<AnalyticsOverview>(`/analytics/events/${eventId}`),
};

// ===== Tags API =====
export const tagsApi = {
  getAll: () =>
    api.get<string[]>('/tags'),

  create: (data: { name: string; color?: string }) =>
    api.post<{ id: string; name: string; color: string }>('/tags', data),
};

// ===== Workspaces API =====
export const workspacesApi = {
  getCurrent: () =>
    api.get<Workspace>('/workspaces/current'),

  update: (data: Partial<Workspace>) =>
    api.put<Workspace>('/workspaces/current', data),
};

// ===== Upload API =====
export const uploadApi = {
  uploadImage: async (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await api.post<{ url: string; key: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default api;
