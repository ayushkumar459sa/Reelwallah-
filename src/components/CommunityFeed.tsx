import React, { useState, useEffect, useRef } from 'react';
import type { CommunityPost } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  MessageSquare,
  Heart,
  Send,
  Trash2,
  X,
  Sparkles,
  AlertCircle,
  Camera,
  Maximize2,
  Search,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  Zap,
  Share2,
  Plus
} from 'lucide-react';
import { UserAvatar } from './UserAvatar.js';

interface CommunityFeedProps {
  onOpenAuth: () => void;
  showCreateModal?: boolean;
  onCloseCreateModal?: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  onOpenAuth,
  showCreateModal,
  onCloseCreateModal
}) => {
  const { user, token, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // New post form state
  const [postContent, setPostContent] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Physics');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Comments state: postId -> active comment input text
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Lightbox modal for enlarged image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableTags = [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Formula Sheet',
    'Doubts',
    'Study Strategy',
    'Motivation'
  ];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (showCreateModal) {
      setIsPostModalOpen(true);
    }
  }, [showCreateModal]);

  // Handle local image file upload & convert to base64 with auto-scaling
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPostError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPostError('Image size should be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // If image is very large, downscale slightly for fast rendering
          const maxDim = 1400;
          if (img.width > maxDim || img.height > maxDim) {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            setAttachedImage(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            setAttachedImage(reader.result as string);
          }
          setPostError(null);
        };
      }
    };
    reader.readAsDataURL(file);
  };

  // Support direct image pasting from clipboard (e.g., screenshots)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              setAttachedImage(reader.result);
              setPostError(null);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Submit new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (!postContent.trim() && !attachedImage) {
      setPostError('Please write something or attach a photo before posting.');
      return;
    }

    setIsPosting(true);
    setPostError(null);
    setPostSuccess(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: postContent.trim() || 'Attached IIT-JEE study photo:',
          image: attachedImage || undefined,
          subjectTag: selectedTag
        })
      });

      const data = await res.json();
      if (res.ok && data.post) {
        setPosts(prev => [data.post, ...prev]);
        setPostContent('');
        setAttachedImage(null);
        setPostSuccess('Your post has been published to the community wall!');
        setTimeout(() => setPostSuccess(null), 4000);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return true;
      } else {
        setPostError(data.error || 'Failed to publish post.');
        return false;
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setPostError('Network error while publishing post.');
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  // Like / Unlike post
  const handleToggleLike = async (postId: string) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = p.likes?.includes(user?.id || '');
          const newLikes = hasLiked
            ? (p.likes || []).filter(id => id !== user?.id)
            : [...(p.likes || []), user?.id || ''];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  // Submit comment on a post
  const handleAddComment = async (postId: string) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setCommentingPostId(postId);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (res.ok && data.comment) {
        setPosts(prev =>
          prev.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                comments: [...(p.comments || []), data.comment]
              };
            }
            return p;
          })
        );
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        // Ensure comments are visible
        setExpandedComments(prev => ({ ...prev, [postId]: true }));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentingPostId(null);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleSharePost = (post: CommunityPost) => {
    navigator.clipboard?.writeText(
      `[REEL WALLAH Study Post by ${post.authorName}]\n${post.content}\n\nJoin 50,000+ JEE aspirants.`
    );
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const formatTimeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Filter and search
  const filteredPosts = posts.filter(post => {
    // 1. Tag / Category filter
    if (activeFilter === 'Photos' && !post.image) return false;
    if (activeFilter === 'Physics' && post.subjectTag !== 'Physics') return false;
    if (activeFilter === 'Chemistry' && post.subjectTag !== 'Chemistry') return false;
    if (activeFilter === 'Mathematics' && post.subjectTag !== 'Mathematics') return false;
    if (activeFilter === 'Doubts' && post.subjectTag !== 'Doubts') return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTag = post.subjectTag?.toLowerCase().includes(q);
      if (!matchContent && !matchAuthor && !matchTag) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7857FF]/20 border border-[#7857FF]/40 text-[#37D9F5] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASPIRANT STUDY WALL & COMMUNITY FEED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>Aspirant Community Wall</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Write posts, share handwritten notes & formula photos, ask conceptual doubts, and discuss with fellow IIT-JEE aspirants!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isLoggedIn) onOpenAuth();
              else setIsPostModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7857FF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create Post</span>
          </button>

          <button
            onClick={fetchPosts}
            disabled={isLoading}
            className="px-3.5 py-2.5 rounded-2xl bg-[#171C34] hover:bg-[#1a203c] text-slate-300 hover:text-white text-xs font-semibold border border-[#252D54] transition-colors flex items-center gap-1.5"
            title="Refresh Feed"
          >
            <span>{isLoading ? '...' : '↻'}</span>
          </button>
        </div>
      </div>

      {/* CREATE POST BOX (PROMINENT AT TOP) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#171C34] to-[#12162a] border-2 border-[#7857FF]/40 p-5 sm:p-7 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7857FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-3.5">
          <UserAvatar
            src={user?.avatar}
            name={user?.name}
            size="md"
          />

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#37D9F5] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Create New Post / Share Photo</span>
              </span>
              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-xs font-bold text-[#A388FF] hover:underline"
                >
                  Sign in to post ➔
                </button>
              )}
            </div>

            <textarea
              ref={textareaRef}
              rows={3}
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              onPaste={handlePaste}
              placeholder={
                isLoggedIn
                  ? `What are you studying today, ${user?.name?.split(' ')[0] || 'Aspirant'}? Write notes, ask a doubt, share today's score, or attach a photo (paste / upload)...`
                  : 'Write your study update, notes, or conceptual doubt here (Click sign in to publish with your name)...'
              }
              className="w-full px-4 py-3 rounded-2xl bg-[#101426] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-sm text-white placeholder-slate-400 transition-colors resize-none leading-relaxed"
            />

            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-[#37D9F5]/70 shadow-xl group bg-black/60">
                <img
                  src={attachedImage}
                  alt="Attached preview"
                  className="max-h-60 rounded-xl object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAttachedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-90"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-[#37D9F5] font-semibold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo Ready to Post</span>
                </div>
              </div>
            )}

            {/* Error or Success feedback */}
            {postError && (
              <div className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{postError}</span>
              </div>
            )}

            {postSuccess && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{postSuccess}</span>
              </div>
            )}

            {/* Action Bar: Tags + Attach Photo + Post Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#252D54]/60">
              {/* Tag Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Subject:</span>
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Upload Picture button & Submit */}
              <div className="flex items-center gap-2.5 ml-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="community-image-input"
                />

                <label
                  htmlFor="community-image-input"
                  className="cursor-pointer px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#252D54] hover:border-[#37D9F5]/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
                  title="Upload handwritten notes, questions, or diagrams"
                >
                  <Camera className="w-4 h-4 text-[#37D9F5]" />
                  <span>{attachedImage ? 'Change Photo' : '📷 Share Photo'}</span>
                </label>

                <button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={isPosting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7857FF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isPosting ? 'Publishing...' : 'Post to Wall'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171C34] border border-[#252D54] p-3.5 rounded-2xl">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
          {[
            { id: 'All', label: 'All Posts' },
            { id: 'Photos', label: '📷 With Photos' },
            { id: 'Physics', label: 'Physics' },
            { id: 'Chemistry', label: 'Chemistry' },
            { id: 'Mathematics', label: 'Mathematics' },
            { id: 'Doubts', label: 'Doubts' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilter === f.id
                  ? 'bg-[#7857FF] text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes, formulas..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#101426] border border-[#252D54] focus:border-[#7857FF] text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* POSTS LIST (WALL FEED) */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-12 text-center space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No posts matching your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first aspirant to share notes, photos of tricky questions, or conceptual doubts above!
            </p>
            {activeFilter !== 'All' && (
              <button
                onClick={() => setActiveFilter('All')}
                className="px-4 py-2 rounded-xl bg-[#7857FF]/20 text-[#A388FF] text-xs font-bold border border-[#7857FF]/40"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map(post => {
            const hasLiked = isLoggedIn && post.likes?.includes(user?.id || '');
            const isAuthor = isLoggedIn && post.authorId === user?.id;
            const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.email === 'ayush459sa@gmail.com');
            const isCommentsOpen = expandedComments[post.id] ?? true; // Open by default for maximum peer interaction

            return (
              <div
                key={post.id}
                className="rounded-3xl bg-[#171C34] border border-[#252D54] p-5 sm:p-6 shadow-xl space-y-4 transition-all hover:border-[#7857FF]/40"
              >
                {/* Post Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={post.authorAvatar}
                      name={post.authorName}
                      size="md"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">
                          {post.authorName}
                        </span>
                        <span className="text-[10px] font-bold text-[#37D9F5] bg-[#37D9F5]/10 px-2 py-0.5 rounded-md border border-[#37D9F5]/30">
                          #{post.subjectTag || 'General'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        {post.authorDreamIit && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300 font-medium">Aiming for {post.authorDreamIit}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSharePost(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Copy post link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {copiedPostId === post.id && (
                      <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                    )}

                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Text Content */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Attached Picture / Formula Sheet */}
                {post.image && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#252D54] group bg-[#0e1222] shadow-inner">
                    <img
                      src={post.image}
                      alt="Study photo"
                      className="w-full max-h-[460px] object-contain rounded-2xl cursor-pointer hover:opacity-95 transition-opacity py-2"
                      onClick={() => setLightboxImage(post.image!)}
                    />
                    <button
                      onClick={() => setLightboxImage(post.image!)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/10 transition-all hover:scale-105"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#37D9F5]" />
                      <span>Click to Enlarge Photo</span>
                    </button>
                  </div>
                )}

                {/* Actions: Likes & Comment Counters */}
                <div className="pt-3 border-t border-[#252D54]/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 font-semibold transition-colors px-2 py-1 rounded-lg ${
                        hasLiked ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                      />
                      <span>{post.likes?.length || 0} Helpful</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments(prev => ({
                          ...prev,
                          [post.id]: !isCommentsOpen
                        }))
                      }
                      className="flex items-center gap-1.5 font-semibold text-slate-300 hover:text-[#37D9F5] px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-[#37D9F5]" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">IIT-JEE Peer Discussion</span>
                </div>

                {/* COMMENTS SECTION (EVERYONE CAN READ & COMMENT) */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-[#252D54]/40 space-y-3 bg-[#12162a]/50 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#37D9F5]" />
                      <span>Discussion & Replies ({post.comments?.length || 0})</span>
                    </div>

                    {/* List of comments */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2.5">
                        {post.comments.map(c => (
                          <div
                            key={c.id}
                            className="p-3.5 rounded-2xl bg-[#101426] border border-[#252D54] flex items-start gap-3"
                          >
                            <UserAvatar
                              src={c.authorAvatar}
                              name={c.authorName}
                              size="sm"
                              className="shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white">
                                    {c.authorName}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                  {formatTimeAgo(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed">
                                {c.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs text-slate-500">
                        No comments yet. Write the first reply below!
                      </div>
                    )}

                    {/* Add Comment Input Box */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={e =>
                          setCommentInputs(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder={
                          isLoggedIn
                            ? 'Write a helpful comment or reply... (Press Enter to post)'
                            : 'Sign in to write a comment...'
                        }
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#101426] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-xs text-white placeholder-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        disabled={commentingPostId === post.id}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button for Instant Posting */}
      <button
        onClick={() => {
          if (!isLoggedIn) onOpenAuth();
          else setIsPostModalOpen(true);
        }}
        className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-[#7857FF]/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20"
        title="Create New Post"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span>+ Create Post</span>
      </button>

      {/* CREATE POST MODAL */}
      {(isPostModalOpen || showCreateModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsPostModalOpen(false);
                onCloseCreateModal?.();
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <UserAvatar src={user?.avatar} name={user?.name} size="md" />
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#37D9F5]" />
                  <span>Create Study Post</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Posting as {user?.name || 'Aspirant'}
                </span>
              </div>
            </div>

            <textarea
              rows={4}
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="What are you studying today? Share your thoughts, notes, tricky formulas, or daily prep progress..."
              className="w-full px-4 py-3 rounded-2xl bg-[#171C34] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-sm text-white placeholder-slate-400 transition-colors resize-none leading-relaxed"
            />

            {/* Tag Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Select Subject Tag:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                        : 'bg-[#171C34] hover:bg-white/10 text-slate-300 border border-[#252D54]'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Attached Photo */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Attach Study Photo / Notes (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="modal-image-input"
              />
              <label
                htmlFor="modal-image-input"
                className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-[#171C34] hover:bg-[#1e2545] border border-dashed border-[#7857FF]/60 hover:border-[#37D9F5] text-xs font-semibold text-[#37D9F5] flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>{attachedImage ? '✓ Photo Attached (Click to Change)' : 'Attach Photo / Textbook Diagram'}</span>
              </label>
              {attachedImage && (
                <div className="relative mt-2 rounded-xl overflow-hidden bg-black/50 border border-[#252D54]">
                  <img src={attachedImage} alt="Attachment" className="max-h-48 w-auto mx-auto object-contain" />
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {postError && (
              <div className="text-xs text-rose-400 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                {postError}
              </div>
            )}

            <button
              type="button"
              onClick={async (e) => {
                const ok = await handleCreatePost(e);
                if (ok) {
                  setIsPostModalOpen(false);
                  onCloseCreateModal?.();
                }
              }}
              disabled={isPosting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-sm shadow-lg shadow-[#7857FF]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isPosting ? 'Publishing...' : 'Publish Post to Wall'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR FULL SCREEN IMAGE PREVIEW */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative max-w-5xl max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-11 right-0 p-2 text-slate-400 hover:text-white bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged study visual"
              className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl border border-[#252D54]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
