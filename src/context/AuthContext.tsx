import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  verifyOtp: (email: string, code: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Permanent session persistence via localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('reelwallah_token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('reelwallah_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(!user && Boolean(token));

  const saveSession = (authToken: string, authUser: User) => {
    localStorage.setItem('reelwallah_token', authToken);
    localStorage.setItem('reelwallah_user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const clearSession = () => {
    localStorage.removeItem('reelwallah_token');
    localStorage.removeItem('reelwallah_user');
    setToken(null);
    setUser(null);
  };

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(authToken, data.user);
      } else if (res.status === 401 || res.status === 403) {
        // Token genuinely expired or invalidated by server
        clearSession();
      }
    } catch (err) {
      console.warn('Network issue restoring session, keeping cached user session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Direct Password Login (No OTP needed!)
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed. Please check credentials.' };
      }

      saveSession(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to auth server.' };
    }
  };

  // Direct Password Registration (No OTP needed!)
  const register = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name?.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      saveSession(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to auth server.' };
    }
  };

  // Optional OTP fallback methods
  const sendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to send OTP.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error connecting to auth service.' };
    }
  };

  const verifyOtp = async (email: string, code: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, name })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      saveSession(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error verifying code.' };
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const body = await res.json();
        saveSession(token, body.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        logout();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const ADMIN_EMAILS = ['ayush459sa@gmail.com', 'ushakannaujiya90@gmail.com'];
  const isAdmin = Boolean(
    user && (user.role === 'admin' || ADMIN_EMAILS.includes(user.email.toLowerCase()))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn: Boolean(user),
        isAdmin,
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
        deleteAccount,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
