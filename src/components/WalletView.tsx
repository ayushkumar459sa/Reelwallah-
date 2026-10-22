import React, { useState, useEffect } from 'react';
import type { WalletTransaction, WithdrawalRequest } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalletViewProps {
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenAuth, onNavigate }) => {
  const { user, token, isLoggedIn, refreshUser } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [inrValue, setInrValue] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Withdrawal form
  const [withdrawCoins, setWithdrawCoins] = useState<number>(2000);
  const [upiId, setUpiId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWallet = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setInrValue(data.inrValue);
        setTransactions(data.transactions || []);
        setWithdrawals(data.withdrawals || []);
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [token]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (withdrawCoins < 2000) {
      setStatusMessage({ type: 'error', text: 'Minimum withdrawal is 2,000 RW Coins (₹40.00).' });
      return;
    }

    if (withdrawCoins > balance) {
      setStatusMessage({ type: 'error', text: `Insufficient balance. You have ${balance} RW Coins.` });
      return;
    }

    if (!upiId || !upiId.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid UPI ID (e.g. username@okhdfcbank).' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          coinsAmount: withdrawCoins,
          upiId
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        await fetchWallet();
        await refreshUser();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Withdrawal failed.' });
      }
    } catch (err) {
      console.error('Withdrawal request error:', err);
      setStatusMessage({ type: 'error', text: 'Network error submitting payout request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#7857FF]/20 border border-[#7857FF]/40 text-[#37D9F5] flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">RW Coins Wallet</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Solve IIT-JEE doubts for your peers and earn real cash. 100 RW Coins = ₹2. Withdraw directly to your UPI handle.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-lg shadow-[#7857FF]/30"
        >
          Log In to Access Wallet
        </button>
      </div>
    );
  }

  const calculatedPayout = ((withdrawCoins / 100) * 2).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Wallet Balance Hero Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#171C34] via-[#101426] to-[#1c143c] border border-[#252D54] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <Coins className="w-3.5 h-3.5" />
              <span>RW REWARDS LEDGER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono">
              {balance.toLocaleString()} <span className="text-xl text-[#37D9F5] font-sans">RW Coins</span>
            </h2>
            <div className="text-base text-amber-300 font-bold mt-1">
              ≈ ₹{inrValue.toFixed(2)} Real INR Cash
            </div>
          </div>

          {/* Quick Rate Specs */}
          <div className="bg-[#101426] p-4 rounded-2xl border border-[#252D54] text-xs space-y-1.5 shrink-0">
            <div className="text-slate-400">Fixed Conversion:</div>
            <div className="text-white font-mono font-bold">100 RW Coins = ₹2.00 INR</div>
            <div className="text-[11px] text-[#37D9F5] pt-1 border-t border-[#252D54]">
              Minimum Payout: 2,000 Coins (₹40.00)
            </div>
          </div>
        </div>

        {/* Ways to Earn */}
        <div className="mt-6 pt-6 border-t border-[#252D54] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] flex items-center justify-between">
            <span className="text-xs text-slate-300">Basic Accepted Doubt</span>
            <span className="text-xs font-bold text-amber-400 font-mono">+6 Coins</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] flex items-center justify-between">
            <span className="text-xs text-slate-300">Detailed Step Derivation</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">+10 Coins</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] flex items-center justify-between">
            <span className="text-xs text-slate-300">Clearing Mock Test Cutoff</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">+25-40 Coins</span>
          </div>
        </div>
      </div>

      {/* UPI Withdrawal Request Card */}
      <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Withdraw to UPI (Instant Payout)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Payout processed within 24h
          </span>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Coins to Redeem (Min. 2,000)
              </label>
              <input
                type="number"
                min={2000}
                step={100}
                value={withdrawCoins}
                onChange={e => setWithdrawCoins(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#101426] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
              />
              <div className="text-[11px] text-[#37D9F5] mt-1 font-mono">
                You will receive: <strong>₹{calculatedPayout} INR</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                UPI Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="yourname@okaxis or paytm"
                className="w-full px-4 py-2.5 rounded-xl bg-[#101426] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                Verified genuine Indian bank UPI ID
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-fraud verified transaction ledger</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || balance < 2000}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-black font-bold text-xs shadow-md transition-all disabled:opacity-40"
            >
              {isSubmitting ? 'Submitting...' : `Submit Request for ₹${calculatedPayout}`}
            </button>
          </div>
        </form>
      </div>

      {/* Withdrawal Requests History */}
      {withdrawals.length > 0 && (
        <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#37D9F5]" />
            <span>Withdrawal Requests Status</span>
          </h3>

          <div className="space-y-2">
            {withdrawals.map(w => (
              <div
                key={w.id}
                className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white font-mono">
                    ₹{w.inrAmount.toFixed(2)} ({w.coinsAmount} RW Coins)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    UPI: {w.upiId} • {new Date(w.createdAt).toLocaleDateString()}
                  </div>
                  {w.adminNotes && (
                    <div className="text-[10px] text-[#A388FF] mt-0.5">
                      Note: {w.adminNotes}
                    </div>
                  )}
                </div>

                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    w.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : w.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Ledger */}
      <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Full RW Coins Ledger</span>
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No coin transactions yet. Post solutions in Doubt Zone to start earning!
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {transactions.map(t => {
              const isCredit = t.type === 'credit';
              return (
                <div
                  key={t.id}
                  className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isCredit
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.description}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(t.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-bold font-mono ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCredit ? '+' : '-'}{t.amount} RW
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ₹{t.inrAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
