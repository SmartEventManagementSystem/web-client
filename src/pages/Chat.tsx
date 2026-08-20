import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Plus, Send, Search, MoreVertical, Phone, Video, Image, Smile, ArrowLeft, Hash } from 'lucide-react';
import { chatApi } from '@/services/api';
import { Card, Button, Input, Avatar, EmptyState, Modal } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { ChatRoom, ChatMessage } from '@/types';
import { useAuth } from '@/stores/auth-context';

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: '1', name: 'Tech Conference 2026', event_id: 'e1',
    participants: [], unread_count: 3,
    last_message: { id: 'm1', room_id: '1', sender_id: 'u2', content: 'See you all tomorrow!', type: 'text', created_at: new Date(Date.now() - 300000).toISOString() },
    created_at: new Date().toISOString(),
  },
  {
    id: '2', name: 'Summer Festival Chat', event_id: 'e2',
    participants: [], unread_count: 12,
    last_message: { id: 'm2', room_id: '2', sender_id: 'u3', content: 'Lineup looks amazing!', type: 'text', created_at: new Date(Date.now() - 1800000).toISOString() },
    created_at: new Date().toISOString(),
  },
  {
    id: '3', name: 'Startup Summit', event_id: 'e3',
    participants: [], unread_count: 0,
    last_message: { id: 'm3', room_id: '3', sender_id: 'u4', content: "Don't forget to register", type: 'text', created_at: new Date(Date.now() - 3600000).toISOString() },
    created_at: new Date().toISOString(),
  },
  {
    id: '4', name: 'AI Summit 2026', event_id: 'e4',
    participants: [], unread_count: 7,
    last_message: { id: 'm4', room_id: '4', sender_id: 'u5', content: 'The speaker lineup is incredible', type: 'text', created_at: new Date(Date.now() - 7200000).toISOString() },
    created_at: new Date().toISOString(),
  },
];

export default function Chat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>(MOCK_ROOMS);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<'rooms' | 'chat'>('rooms');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = useCallback(async (roomId: string) => {
    setLoading(true);
    try {
      const res = await chatApi.getMessages(roomId, { page_size: 50 });
      setMessages(res.data.data as unknown as ChatMessage[]);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    loadMessages(room.id);
    setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, unread_count: 0 } : r));
    setMobileView('chat');
  };

  const handleSend = async () => {
    if (!input.trim() || !activeRoom) return;
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      room_id: activeRoom.id,
      sender_id: user?.id || 'u1',
      sender: user || undefined,
      content: input.trim(),
      type: 'text',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    const text = input;
    setInput('');
    try {
      const res = await chatApi.sendMessage({ room_id: activeRoom.id, content: text });
      setMessages((prev) => prev.map((m) => m.id === tempMsg.id ? res.data as unknown as ChatMessage : m));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const res = await chatApi.createRoom({ name: newRoomName });
      setRooms((prev) => [res.data as unknown as ChatRoom, ...prev]);
      setShowCreateModal(false);
      setNewRoomName('');
    } catch {}
  };

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 animate-fade-in">
      {/* Rooms List */}
      <div className={cn(
        'lg:w-80 flex-shrink-0 flex flex-col',
        mobileView === 'chat' ? 'hidden lg:flex' : 'flex',
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Chat Rooms</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{rooms.length} rooms</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-1.5" size="sm">
            <Plus className="w-4 h-4" />
            New Room
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
          />
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => openRoom(room)}
              className={cn(
                'w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left',
                activeRoom?.id === room.id
                  ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
              )}
            >
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                activeRoom?.id === room.id
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                  : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10'
              )}>
                <Hash className={cn('w-5 h-5', activeRoom?.id === room.id ? 'text-white' : 'text-purple-500')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'text-sm font-semibold truncate',
                    activeRoom?.id === room.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {room.name}
                  </p>
                  {room.unread_count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {room.unread_count > 9 ? '9+' : room.unread_count}
                    </span>
                  )}
                </div>
                {room.last_message && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {room.last_message.sender_id === user?.id ? 'You: ' : ''}{room.last_message.content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className={cn(
        'flex-1 flex flex-col min-h-0',
        mobileView === 'rooms' ? 'hidden lg:flex' : 'flex',
      )}>
        {activeRoom ? (
          <Card className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => { setActiveRoom(null); setMobileView('rooms'); }}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{activeRoom.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {activeRoom.participants?.length || 0} members
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="text-center">
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  Messages are end-to-end encrypted
                </span>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <div key={d} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isOwn = msg.sender_id === user?.id;
                  const showAvatar = !isOwn && (i === 0 || messages[i - 1]?.sender_id !== msg.sender_id);
                  return (
                    <div key={msg.id} className={cn('flex gap-3', isOwn ? 'flex-row-reverse' : '')}>
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar name={msg.sender?.name} src={msg.sender?.avatar} size="sm" />
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                      <div className={cn('max-w-[70%] space-y-1', isOwn ? 'items-end' : 'items-start')}>
                        {showAvatar && !isOwn && (
                          <p className="text-xs font-medium text-gray-500 ml-1">{msg.sender?.name || 'User'}</p>
                        )}
                        <div className={cn(
                          'px-4 py-2.5 rounded-2xl max-w-full',
                          isOwn
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                        )}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <p className={cn('text-[10px] text-gray-400', isOwn ? 'text-right mr-1' : 'ml-1')}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a chat room"
              description="Choose a room from the left to start messaging"
            />
          </Card>
        )}
      </div>

      {/* Create Room Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Chat Room" size="sm">
        <div className="space-y-4">
          <Input
            label="Room Name"
            placeholder="e.g., Tech Conference Chat"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreateRoom} className="flex-1">Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
