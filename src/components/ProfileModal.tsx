import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  User as UserIcon,
  X,
  Target,
  Flame,
  Shield,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Award,
  Camera,
  Sparkles
} from 'lucide-react';
import { UserAvatar, PRESET_AVATARS } from './UserAvatar.js';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'avatar:iit');
  const [dreamIit, setDreamIit] = useState(user?.dreamIit || 'IIT Bombay - CSE');
  const [targetYear, setTargetYear] = useState(user?.targetYear || '2025');
  const [targetExam, setTargetExam] = useState<'JEE Main' | 'JEE Advanced' | 'Both'>(
    user?.targetExam || 'Both'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const success = await updateProfile({
      name,
      bio,
      avatar,
      dreamIit,
      targetYear,
      targetExam
    });

    setIsSaving(false);
    if (success) {
      setSaveMessage('Profile & Logo updated successfully!');
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to permanently delete your REEL WALLAH account? This action cannot be undone and your coin ledger will be cleared.'
      )
    ) {
      const ok = await deleteAccount();
      if (ok) {
        onClose();
        alert('Your account has been deleted.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header & Avatar Selector */}
        <div className="pb-5 border-b border-[#252D54] space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={avatar}
              name={name || user.name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white truncate">{name || user.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#7857FF]/20 text-[#A388FF] text-[10px] font-bold shrink-0">
                  IIT-JEE ASPIRANT
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">{user.email}</div>
              <div className="text-[11px] text-[#37D9F5] font-semibold mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Choose your Aspirant Avatar / Logo below:</span>
              </div>
            </div>
          </div>

          {/* Preset Avatars Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Your Aspirant Logo:
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-[#37D9F5] hover:underline flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map(preset => {
                const isSelected = avatar === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatar(preset.id)}
                    className={`relative p-2 rounded-2xl flex flex-col items-center justify-center transition-all bg-gradient-to-br ${preset.bg} ${
                      isSelected
                        ? 'ring-4 ring-white scale-110 shadow-xl'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={preset.label}
                  >
                    <span className="text-xl">{preset.emoji}</span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#101426] flex items-center justify-center text-[9px] text-black font-black">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges Overview */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="p-3.5 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7857FF]/15 text-[#37D9F5]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Dream Goal</div>
              <div className="text-xs font-bold text-[#37D9F5] truncate max-w-[120px]">
                {user.dreamIit || 'IIT Bombay'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Streak</div>
              <div className="text-sm font-bold text-orange-400 font-mono">
                {user.studyStreak} Days Active
              </div>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dream IIT & Branch
              </label>
              <input
                type="text"
                value={dreamIit}
                onChange={e => setDreamIit(e.target.value)}
                placeholder="e.g. IIT Bombay CSE"
                className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none focus:border-[#7857FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target JEE Year
              </label>
              <select
                value={targetYear}
                onChange={e => setTargetYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
              >
                <option value="2025">JEE 2025</option>
                <option value="2026">JEE 2026</option>
                <option value="2027">JEE 2027</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Examination
            </label>
            <select
              value={targetExam}
              onChange={e => setTargetExam(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
            >
              <option value="Both">Both JEE Main & JEE Advanced</option>
              <option value="JEE Main">JEE Main Only</option>
              <option value="JEE Advanced">JEE Advanced Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Aspirant Bio / Study Motto
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="e.g. Solving 50 physics problems daily • Grinding for AIR < 500"
              className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </form>

        {/* Minor-Safety & Account Deletion */}
        <div className="mt-6 pt-5 border-t border-[#252D54] space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-[#252D54] flex items-start gap-2.5 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-[#37D9F5] shrink-0 mt-0.5" />
            <p>
              <strong>Minor Safety Safeguards:</strong> Under our student protection charter, any bullying, harassment or non-academic solicitations lead to instantaneous account termination and reporting.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account Permanently</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
