import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Copy, ThumbsUp, ThumbsDown, Trash2, Plus, MessageSquare, ChevronDown, Cpu, BookOpen } from 'lucide-react';
import { aiApi } from '@/services/api';
import { Avatar } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { AIMessage, AISource } from '@/types';

const QUICK_PROMPTS = [
  { label: '📅 What events are available?', query: 'What events are available this week? Can you recommend some for me?' },
  { label: '🎟️ How to register?', query: 'How do I register for an event? What is the process?' },
  { label: '💡 Event recommendations', query: 'Can you recommend some events based on my interests?' },
  { label: '💰 Pricing information', query: 'What is the pricing for premium events? Do you have any discounts?' },
];

interface Message extends AIMessage {
  sources?: AISource[];
  thinking?: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome! I'm your AI assistant for the Event Management Platform. I can help you with:\n\n• Finding events and getting personalized recommendations\n• Understanding registration and ticketing processes\n• Learning about event details, schedules, and speakers\n• Answering questions about pricing and features\n\nHow can I help you today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [_conversations, _setConversations] = useState<Array<{ id: string; title: string }>>([]);
  const [_showHistory, _setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSources, setShowSources] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await aiApi.chat({
        messages: messages.concat(userMsg).map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      });

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: res.data.content || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toISOString(),
        sources: [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback demo response
      const fallback: Message = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: `Thank you for your message: "${userMsg.content}"\n\nI received your query but I'm currently unable to connect to the AI service. In production, I would provide intelligent, contextually relevant responses about events, registration, and more.\n\nPlease ensure the AI platform service is running.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: messages[0].content,
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">AI Assistant</h1>
            <p className="text-sm text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Powered by advanced language models
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Sidebar - Conversations */}
        <div className="w-64 flex-shrink-0 hidden xl:flex flex-col">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/50 dark:border-purple-800/30 text-sm font-medium text-purple-600 dark:text-purple-400 hover:from-purple-500/20 hover:to-blue-500/20 transition-all mb-3"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {[
              { id: '1', title: 'Event recommendations' },
              { id: '2', title: 'Registration help' },
              { id: '3', title: 'Pricing questions' },
              { id: '4', title: 'Speaker info' },
            ].map((conv) => (
              <button
                key={conv.id}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white transition-colors text-left group"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 mb-2">
              <Cpu className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Capabilities</span>
            </div>
            <div className="space-y-1.5 px-1">
              {[
                'Event search & recommendations',
                'RAG-powered knowledge base',
                'Contextual responses',
                'Multi-language support',
              ].map((cap) => (
                <div key={cap} className="flex items-center gap-2 px-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs text-gray-400">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => { setInput(prompt.query); }}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all font-medium"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', { 'flex-row-reverse': msg.role === 'user' })}>
                {/* Avatar */}
                <Avatar
                  name={msg.role === 'user' ? 'User' : 'AI'}
                  size="md"
                  className={cn(
                    'flex-shrink-0',
                    msg.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-blue-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                  )}
                />

                {/* Message content */}
                <div className={cn('flex-1 max-w-[82%]', msg.role === 'user' ? 'text-right' : '')}>
                  {/* Name & time */}
                  <div className={cn('flex items-center gap-2 mb-1.5', msg.role === 'user' ? 'justify-end' : '')}>
                    <span className="text-xs font-medium text-gray-500">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      'inline-block p-4 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm text-left'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm shadow-sm'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* Sources */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => setShowSources(showSources === msg.id ? null : msg.id)}
                        className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {msg.sources.length} sources
                        <ChevronDown className={cn('w-3 h-3 transition-transform', showSources === msg.id && 'rotate-180')} />
                      </button>
                      {showSources === msg.id && (
                        <div className="mt-2 space-y-2 text-left">
                          {msg.sources.map((source) => (
                            <div key={source.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                              <p className="text-xs text-gray-600 dark:text-gray-400">{source.content}</p>
                              <p className="text-[10px] text-gray-400 mt-1">Score: {source.score.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {msg.role === 'assistant' && (
                    <div className={cn('flex items-center gap-1 mt-1.5')}>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Copy"
                      >
                        {copiedId === msg.id ? (
                          <span className="text-xs text-emerald-500">Copied!</span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors" title="Good response">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors" title="Bad response">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-3">
                <Avatar name="AI" size="md" className="bg-gradient-to-br from-violet-500 to-indigo-600" />
                <div className="inline-block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map((d) => (
                      <div key={d} className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="mt-4 flex-shrink-0">
            <div className="relative flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about events..."
                rows={1}
                className="flex-1 px-4 py-3 pr-14 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all text-sm"
                style={{ minHeight: '48px', maxHeight: '160px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 bottom-2 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-gray-400">
                AI responses may be inaccurate. Verify important information.
              </p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-[10px] text-gray-400">RAG enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
