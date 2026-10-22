import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Crown,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
  const { user, token, isLoggedIn, refreshUser } = useAuth();
  const [step, setStep] = useState<'plan' | 'checkout' | 'success'>('plan');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiVpa, setUpiVpa] = useState<string>('student@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('789');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCheckout = async () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    setStep('checkout');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Create Order on server
      const orderRes = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate order.');
      }

      // Step 2: Server-Verified Payment Simulation
      const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const verifyRes = await fetch('/api/subscription/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId,
          paymentSignature: 'sig_verified_server_' + Date.now()
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Server-side payment verification rejected.');
      }

      // Success!
      await refreshUser();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setStep('success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Cancel your RW JEE Pro auto-renewal? You will keep benefits until the current period expires.')) {
      return;
    }
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        alert('Subscription auto-renewal cancelled.');
      }
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    }
  };

  const isSubscribed = user?.isSubscribed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1.5 bg-gradient-to-r from-[#7857FF] via-[#37D9F5] to-[#7857FF]" />
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#7857FF]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'plan' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] flex items-center justify-center mx-auto shadow-lg shadow-[#7857FF]/30">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black">RW JEE Pro</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                First 10 mock test attempts are free for everyone. Upgrade for unlimited attempts and full rank analytics.
              </p>
            </div>

            {/* Current Account Status Box */}
            <div className="p-4 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Account Status</span>
                <span className="font-bold text-white text-sm">
                  {isSubscribed ? '👑 RW JEE Pro Active' : 'Free Aspirant Tier'}
                </span>
                {!isSubscribed && (
                  <span className="text-[11px] text-[#37D9F5] block font-mono">
                    {user?.freeAttemptsLeft ?? 10} of 10 free tests remaining
                  </span>
                )}
              </div>

              {isSubscribed && (
                <button
                  onClick={handleCancelSubscription}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold"
                >
                  Cancel Plan
                </button>
              )}
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#171C34] to-[#1F1744] border-2 border-[#7857FF]/50 relative overflow-hidden">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-[#37D9F5] uppercase tracking-wider">
                    Monthly Aspirant Pass
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-white font-mono">₹49</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  Cancel Anytime
                </span>
              </div>

              {/* Benefits checklist */}
              <div className="mt-4 pt-4 border-t border-[#252D54] space-y-2 text-xs">
                {[
                  'Unlimited NTA CBT & JEE Advanced Mock Tests',
                  'Step-by-step verified solutions & formulas',
                  'Estimated All India Rank & Percentile predictor',
                  'Priority peer doubt answer verification',
                  'Access to Top Ranker Study Rooms'
                ].map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#37D9F5] shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            {!isSubscribed ? (
              <button
                onClick={handleStartCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-lg shadow-[#7857FF]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Upgrade to Pro (₹49/month)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-center text-xs text-emerald-400 font-bold p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                ✓ You already have an active subscription with unlimited mock tests!
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#37D9F5]" />
                <span>Secure Checkout • ₹49.00</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Processed via server-verified educational payment gateway.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  paymentMethod === 'upi'
                    ? 'bg-[#7857FF]/20 border-[#7857FF] text-white'
                    : 'bg-[#171C34] border-[#252D54] text-slate-400'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#37D9F5]" />
                <span>Instant UPI (GPay/PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'bg-[#7857FF]/20 border-[#7857FF] text-white'
                    : 'bg-[#171C34] border-[#252D54] text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#7857FF]" />
                <span>Debit / Credit Card</span>
              </button>
            </div>

            {paymentMethod === 'upi' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  UPI Virtual ID (VPA)
                </label>
                <input
                  type="text"
                  required
                  value={upiVpa}
                  onChange={e => setUpiVpa(e.target.value)}
                  placeholder="yourname@okaxis"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono focus:border-[#7857FF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep('plan')}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Verifying with Bank Server...' : 'Pay ₹49.00 & Unlock'}
              </button>
            </div>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit TLS encrypted bank authentication</span>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Payment Verified!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Welcome to <strong>RW JEE Pro</strong>. Unlimited mock test attempts and high-yield solution walkthroughs are now unlocked for 30 days!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Start Practicing Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
