import React, { useState, useEffect } from 'react';
import { CommunityFeed } from './CommunityFeed.js';
import { HomeLiveChat } from './HomeLiveChat.js';
import { MessageSquare, FileText, Plus, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { UserAvatar } from './UserAvatar.js';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  autoOpenCreatePost?: boolean;
  onResetAutoOpenCreatePost?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenAuth,
  autoOpenCreatePost,
  onResetAutoOpenCreatePost
}) => {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'chat'>('posts');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  useEffect(() => {
    if (autoOpenCreatePost) {
      if (!isLoggedIn) {
        onOpenAuth();
      } else {
        setActiveTab('posts');
        setShowCreateModal(true);
      }
      onResetAutoOpenCreatePost?.();
    }
  }, [autoOpenCreatePost, isLoggedIn]);

  const handleOpenPostModal = () => {
    if (!isLoggedIn) {
      onOpenAuth();
    } else {
      setActiveTab('posts');
      setShowCreateModal(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-4">
      {/* 1. Dedicated Quick Post Bar (Prominent at top so post option is ALWAYS visible) */}
      <div
        onClick={handleOpenPostModal}
        className="cursor-pointer rounded-3xl bg-gradient-to-r from-[#171C34] via-[#151a32] to-[#1c183d] border-2 border-[#7857FF]/40 hover:border-[#37D9F5] p-3.5 sm:p-4 shadow-xl flex items-center gap-3 transition-all group hover:shadow-[#7857FF]/20"
      >
        <UserAvatar
          src={user?.avatar}
          name={user?.name}
          size="sm"
          className="shrink-0 group-hover:scale-105 transition-transform"
        />

        <div className="flex-1 bg-[#101426] hover:bg-[#13172e] rounded-2xl px-4 py-2.5 border border-[#252D54] text-xs text-slate-300 group-hover:text-white transition-colors flex items-center justify-between min-w-0">
          <span className="truncate">
            {isLoggedIn
              ? `What are you studying, ${user?.name?.split(' ')[0]}? Share notes, formulas or doubt...`
              : 'Write study notes, formulas, or ask doubts (Sign in to post)...'}
          </span>
          <span className="shrink-0 ml-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-[11px] font-black shadow-md flex items-center gap-1">
            <Plus className="w-3 h-3 stroke-[3]" />
            <span>Post</span>
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPostModal();
          }}
          className="p-2.5 rounded-2xl bg-white/5 group-hover:bg-[#37D9F5]/20 text-[#37D9F5] shrink-0 transition-colors"
          title="Upload Study Photo / Formula Notes"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Top Segmented Switcher & Quick Post Button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[#171C34] p-1.5 rounded-2xl border border-[#252D54] flex items-center shadow-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Study Posts & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Quick Post Action Button */}
        <button
          onClick={handleOpenPostModal}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-lg shadow-[#7857FF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          title="Create New Post"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create Post</span>
        </button>
      </div>

      {/* 3. Main Content Area: Posts or Live Chat */}
      {activeTab === 'posts' ? (
        <CommunityFeed
          onOpenAuth={onOpenAuth}
          showCreateModal={showCreateModal}
          onCloseCreateModal={() => setShowCreateModal(false)}
        />
      ) : (
        <HomeLiveChat onOpenAuth={onOpenAuth} />
      )}
    </div>
  );
};

