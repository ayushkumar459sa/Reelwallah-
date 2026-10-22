import React, { useState } from 'react';
import { RWLogo } from './RWLogo.js';
import { useAuth } from '../context/AuthContext.js';
import { UserAvatar } from './UserAvatar.js';
import {
  Flame,
  Shield,
  User as UserIcon,
  LogOut,
  Sparkles,
  Crown
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenSubscription: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenProfile,
  onOpenSubscription,
  onNavigate,
  currentView
}) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#101426]/90 dark:bg-[#101426]/90 backdrop-blur-md border-b border-[#252D54]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <RWLogo size="sm" showText={true} />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Study Wall & Chat' },
              { id: 'tests', label: 'JEE Mock Tests & Quiz' },
              { id: 'rooms', label: 'Study Rooms' },
              { id: 'doubts', label: 'Doubt Zone' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentView === item.id
                    ? 'bg-[#7857FF]/20 text-[#37D9F5] border border-[#7857FF]/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              {/* Study Streak */}
              <div
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400"
                title="Daily Study Streak"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>{user?.studyStreak || 1}d</span>
              </div>

              {/* Pro / Attempts Badge */}
              {user?.isSubscribed ? (
                <button
                  onClick={onOpenSubscription}
                  className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7857FF]/30 to-[#37D9F5]/30 border border-[#37D9F5]/50 text-[11px] font-bold text-cyan-300"
                >
                  <Crown className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                  <span>PRO UNLIMITED</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSubscription}
                  className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7857FF]/15 border border-[#7857FF]/30 hover:bg-[#7857FF]/25 text-[11px] font-bold text-[#A388FF] transition-all"
                >
                  <Sparkles className="w-3 h-3 text-[#37D9F5]" />
                  <span>{user?.freeAttemptsLeft ?? 10}/10 Tests Free</span>
                </button>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-2xl bg-[#171C34] border border-[#252D54] hover:border-[#7857FF] transition-all shadow-md group"
                  title="My JEE Profile & Logo"
                >
                  <UserAvatar
                    src={user?.avatar}
                    name={user?.name}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-white group-hover:text-[#37D9F5] transition-colors leading-tight truncate max-w-[110px]">
                      {user?.name?.split(' ')[0] || 'Aspirant'}
                    </span>
                    <span className="text-[9px] text-[#A388FF] font-semibold leading-none mt-0.5">
                      {user?.dreamIit?.split(' ')[0] || 'IIT-JEE'}
                    </span>
                  </div>
                </button>

                {menuOpen && (
                  <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                )}

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171C34] border border-[#252D54] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                    <div className="px-3 py-2 border-b border-[#252D54]/70">
                      <div className="text-xs font-bold text-white truncate">
                        {user?.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</div>
                      <div className="text-[10px] text-[#37D9F5] font-semibold mt-0.5">
                        {user?.dreamIit || 'IIT Aspirant'}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 text-left"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#37D9F5]" />
                        <span>My JEE Profile</span>
                      </button>


                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenSubscription();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 text-left"
                      >
                        <Crown className="w-3.5 h-3.5 text-[#7857FF]" />
                        <span>RW JEE Pro (₹49/mo)</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl text-amber-300 hover:bg-amber-500/10 flex items-center gap-2 text-left"
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Console</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[#252D54]/70">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md shadow-[#7857FF]/30 hover:shadow-[#7857FF]/50 transition-all"
              >
                Log In / Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
