import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { RWLogo } from './RWLogo.js';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid Gmail / email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    if (mode === 'register') {
      const res = await register(email, password, name);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Account registered successfully! You are now logged in permanently.');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Failed to register account.');
      }
    } else {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101426] border border-[#252D54] rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#7857FF] to-[#37D9F5]" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7857FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <RWLogo size="md" />
          <h2 className="text-2xl font-bold tracking-tight mt-3 text-white">
            {mode === 'login' ? 'Welcome Back!' : 'Create Aspirant Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {mode === 'login'
              ? 'Enter your Gmail & password to access your persistent study account.'
              : 'Sign up once with Gmail & password — no OTP needed! Your session stays saved forever.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#171C34] p-1 rounded-2xl border border-[#252D54] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register (No OTP)
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Password-Based Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name (e.g. Rahul, Sneha)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171C34] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Gmail / Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171C34] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[10px] text-slate-400">Min. 4 characters</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#171C34] border border-[#252D54] focus:border-[#7857FF] focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-lg shadow-[#7857FF]/30 hover:shadow-[#7857FF]/50 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{mode === 'register' ? 'Registering Account...' : 'Logging In...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'register' ? 'Create Account & Stay Logged In' : 'Log In & Stay Logged In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-400">
              New aspirant?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-[#37D9F5] hover:underline font-bold"
              >
                Register with Password (No OTP)
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#37D9F5] hover:underline font-bold"
              >
                Log In with Password
              </button>
            </p>
          )}
        </div>

        {/* Privacy Note */}
        <div className="mt-5 pt-4 border-t border-[#252D54]/50 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#37D9F5] shrink-0" />
          <span>Session is saved permanently on your device. Zero repeated logins.</span>
        </div>
      </div>
    </div>
  );
};
