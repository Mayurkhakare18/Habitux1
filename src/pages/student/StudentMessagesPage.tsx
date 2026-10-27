import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Conversation, ChatMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Search, 
  PhoneCall, 
  ExternalLink, 
  Building2, 
  CalendarCheck, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  CheckCheck
} from 'lucide-react';

export const StudentMessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoadingConvs(true);
    try {
      const list = await HabituxAPI.getConversations(user.id, 'student');
      setConversations(list);

      const targetId = conversationId || activeConv?.id;
      if (targetId) {
        const found = list.find((c) => c.id === targetId);
        if (found) {
          setActiveConv(found);
          loadMessages(found.id, isBackground);
        } else {
          const direct = await HabituxAPI.getConversationById(targetId);
          if (direct) {
            setActiveConv(direct);
            loadMessages(direct.id, isBackground);
          }
        }
      } else if (list.length > 0 && !activeConv) {
        setActiveConv(list[0]);
        loadMessages(list[0].id, isBackground);
      }
    } finally {
      if (!isBackground) setLoadingConvs(false);
    }
  };

  const loadMessages = async (convId: string, isBackground = false) => {
    const msgs = await HabituxAPI.getMessages(convId);
    setMessages(msgs);
    await HabituxAPI.markMessagesAsRead(convId, 'student');
    if (!isBackground) {
      scrollToBottom();
    }
  };

  useEffect(() => {
    loadConversations();

    const handleUpdate = () => {
      loadConversations(true);
    };

    window.addEventListener('habitux_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Live chat polling every 2 seconds
    const interval = setInterval(() => {
      loadConversations(true);
    }, 2000);

    return () => {
      window.removeEventListener('habitux_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user, conversationId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    navigate(`/student/messages/${conv.id}`);
    loadMessages(conv.id);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || newMessageText).trim();
    if (!text || !activeConv || !user) return;

    setSending(true);
    try {
      const sent = await HabituxAPI.sendMessage({
        conversationId: activeConv.id,
        senderId: user.id,
        senderRole: 'student',
        senderName: user.full_name || 'Student Resident',
        senderAvatar: user.avatar_url,
        text,
      });

      setMessages((prev) => [...prev, sent]);
      setNewMessageText('');
      scrollToBottom();

      // Refresh conversations list to update preview
      const updated = await HabituxAPI.getConversations(user.id, 'student');
      setConversations(updated);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.hostel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickPrompts = [
    'Can I schedule an in-person visit tomorrow at 4 PM?',
    'Is daily meal plan and high-speed Wi-Fi included?',
    'What is the security deposit & move-in notice period?',
    'Are parents allowed to visit the guest lounge?',
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Direct Owner Messages
          </h1>
          <p className="text-xs text-slate-500">
            Real-time chat with verified hostel managers & zero-brokerage landlords
          </p>
        </div>

        <button
          onClick={() => navigate('/student/explore')}
          className="px-3.5 py-1.5 bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold rounded-xl border border-[#FFE4DC] hover:bg-[#FFE4DC] transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" /> Find More Stays
        </button>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-xs overflow-hidden flex flex-col md:flex-row h-[75vh] min-h-[550px]">
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-80 border-r border-[#EDE8DF] flex flex-col ${activeConv && 'hidden md:flex'}`}>
          {/* Search bar */}
          <div className="p-4 border-b border-[#EDE8DF]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConvs ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading messages...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No conversations yet</p>
                <p className="text-[11px] text-slate-400">
                  Explore verified accommodations and click &ldquo;Contact Owner&rdquo; to start chatting.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FFF1ED]/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={conv.hostel_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=120&q=80'}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate font-heading">
                          {conv.hostel_name}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate">
                        {conv.owner_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {conv.last_message}
                      </p>
                    </div>

                    {conv.student_unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#FF4B26] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                        {conv.student_unread}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Thread */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Chat Top Banner */}
            <div className="px-5 py-3.5 border-b border-[#EDE8DF] bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveConv(null)}
                  className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <img
                  src={activeConv.hostel_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=120&q=80'}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                />

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate font-heading">
                      {activeConv.hostel_name}
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" /> Verified Owner
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Manager: {activeConv.owner_name} • {activeConv.hostel_locality}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {activeConv.owner_phone && (
                  <button
                    onClick={() => {
                      const cleanNumber = activeConv.owner_phone!.replace(/\D/g, '');
                      window.open(`https://wa.me/91${cleanNumber}`, '_blank');
                    }}
                    title="Chat on WhatsApp"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden lg:inline">WhatsApp</span>
                  </button>
                )}

                <Link
                  to={`/hostels/${activeConv.hostel_id}`}
                  className="px-3 py-1.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Book Bed</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAF8F5]/60">
              {/* Notice Badge */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Brokerage Protection Active • Never pay cash without official Habitux receipt
                </span>
              </div>

              {messages.map((msg) => {
                const isMine = msg.sender_role === 'student';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {activeConv.owner_name.charAt(0)}
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs space-y-1 ${
                        isMine
                          ? 'bg-[#FF4B26] text-white rounded-br-xs'
                          : 'bg-white border border-[#EDE8DF] text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 text-[9px] ${isMine ? 'text-white/80' : 'text-slate-400'}`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMine && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Quick Ask:
              </span>
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#FF4B26] hover:border-[#FF4B26] hover:bg-[#FFF1ED] text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-white border-t border-[#EDE8DF] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message to the property owner..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
              />
              <button
                type="submit"
                disabled={sending || !newMessageText.trim()}
                className="px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm font-heading">
              Select a conversation to start messaging
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Directly coordinate check-in times, room amenities, and move-in requirements with property managers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
