import React, { useState, useEffect, useRef } from 'react';
import type { LiveChatMessage } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Send,
  Image as ImageIcon,
  X,
  Sparkles,
  Users,
  Smile,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserAvatar } from './UserAvatar.js';

interface HomeLiveChatProps {
  onOpenAuth: () => void;
}

export const HomeLiveChat: React.FC<HomeLiveChatProps> = ({ onOpenAuth }) => {
  const { user, token, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/home-chat');
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch home chat:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImage(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (!inputText.trim() && !attachedImage) return;

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/home-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: inputText.trim(),
          image: attachedImage || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages(prev => [...prev, data.message]);
        setInputText('');
        setAttachedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch {
      setError('Network error sending message.');
    } finally {
      setIsSending(false);
    }
  };

  const addQuickReaction = (emoji: string) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    setInputText(prev => (prev ? `${prev} ${emoji}` : emoji));
  };

  return (
    <div className="rounded-3xl bg-[#171C34] border border-[#252D54] shadow-2xl flex flex-col h-[75vh] max-h-[750px] overflow-hidden">
      {/* Top Lounge Bar */}
      <div className="p-4 bg-[#101426]/90 border-b border-[#252D54] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Aspirants Live Study Chat</span>
              <span className="px-2 py-0.5 rounded-full bg-[#7857FF]/20 text-[#37D9F5] text-[10px] font-bold">
                Real-Time
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live discussion, quick doubt hints & peer motivation
            </p>
          </div>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Refresh Messages"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 text-[#7857FF]" />
            <div className="text-sm font-bold text-white">Welcome to Aspirants Live Chat!</div>
            <p className="text-xs max-w-xs">
              Say hello or ask today's study question. Fellow JEE aspirants will reply instantly.
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = user?.id === msg.userId;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <UserAvatar
                  src={msg.userAvatar}
                  name={msg.userName}
                  size="sm"
                />

                <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Info */}
                  <div className={`flex items-center gap-1.5 text-[11px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-slate-300">
                      {isMe ? 'You' : msg.userName}
                    </span>
                    {msg.dreamIit && (
                      <span className="text-[10px] text-[#37D9F5] font-mono">
                        • {msg.dreamIit}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white rounded-tr-none shadow-md'
                        : 'bg-[#101426] text-slate-100 rounded-tl-none border border-[#252D54]'
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden max-h-48 bg-black/40">
                        <img
                          src={msg.image}
                          alt="Shared attachment"
                          className="w-full object-contain"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="p-2 bg-[#101426] border-t border-[#252D54] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={attachedImage} alt="Preview" className="w-12 h-12 object-cover rounded-xl" />
            <span className="text-xs text-[#37D9F5] font-semibold">Photo attached</span>
          </div>
          <button
            onClick={() => {
              setAttachedImage(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="p-1 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Reaction Bar */}
      <div className="px-4 py-1.5 bg-[#101426]/60 border-t border-[#252D54] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">Quick:</span>
        {['🔥', '💯', '📚', '⚡', '💡', '🎯', 'IIT Bombay 🚀'].map((item, idx) => (
          <button
            key={idx}
            onClick={() => addQuickReaction(item)}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 text-xs transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Bottom Input Box */}
      {isLoggedIn ? (
        <form onSubmit={handleSendMessage} className="p-3 bg-[#101426] border-t border-[#252D54] flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Attach Note or Formula Photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message to fellow aspirants..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
          />

          <button
            type="submit"
            disabled={isSending || (!inputText.trim() && !attachedImage)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-3.5 bg-[#101426] border-t border-[#252D54] flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">Sign in with Gmail OTP to chat with fellow aspirants.</span>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-md hover:brightness-110 shrink-0"
          >
            Sign In ➔
          </button>
        </div>
      )}
    </div>
  );
};
