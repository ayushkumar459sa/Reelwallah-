import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Crown,
  CheckCircle2,
  X,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Send,
  Smartphone,
  CreditCard
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
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number; duration: string }>({
    name: 'RW JEE Pro (Monthly Pass)',
    amount: 49,
    duration: '1 Month'
  });
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmittedUtr, setLastSubmittedUtr] = useState<string>('');
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');

  if (!isOpen) return null;

  const UPI_ID = 'ushakannaujiya90@okhdfcbank';
  const WHATSAPP_NUMBER = '9839530890';
  const PAYEE_NAME = 'Usha Kannaujiya - Reel Wallah';

  // Construct UPI deep-link URL
  const upiIntentUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${selectedPlan.amount}&cu=INR&tn=${encodeURIComponent('Reel Wallah JEE Pro Access')}`;

  // QR Code URL powered by public reliable QR Server
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleStartCheckout = () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    setErrorMessage(null);
    setStep('checkout');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 4) {
      setErrorMessage('Please enter the 12-digit UTR or Transaction reference number from your UPI app.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/subscription/submit-upi-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amountInr: selectedPlan.amount,
          utrNumber: utrNumber.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record payment submission.');
      }

      setLastSubmittedUtr(utrNumber.trim());
      setLastWhatsappUrl(data.whatsappUrl);

      // Open WhatsApp automatically with pre-filled message
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep('success');
      await refreshUser();
    } catch (err: any) {
      console.error('UPI submission error:', err);
      setErrorMessage(err.message || 'Payment submission failed. Please try again or WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubscribed = user?.isSubscribed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-5 sm:p-7 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Glow bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1.5 bg-gradient-to-r from-[#7857FF] via-[#37D9F5] to-[#7857FF]" />
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#7857FF]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PLAN SELECTION & OVERVIEW */}
        {step === 'plan' && (
          <div className="space-y-5">
            <div className="text-center space-y-1.5 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] flex items-center justify-center mx-auto shadow-lg shadow-[#7857FF]/30">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">RW JEE Pro</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                First 10 mock test attempts are free. Upgrade to Pro for unlimited tests & verified rank solutions.
              </p>
            </div>

            {/* Current Account Status Box */}
            <div className="p-3.5 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account Status</span>
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  {isSubscribed ? (
                    <>
                      <Crown className="w-4 h-4 text-amber-400 inline" />
                      <span className="text-emerald-400">RW JEE Pro Active</span>
                    </>
                  ) : (
                    'Free Aspirant Tier'
                  )}
                </span>
                {!isSubscribed && (
                  <span className="text-[11px] text-[#37D9F5] block font-mono mt-0.5">
                    {user?.freeAttemptsLeft ?? 10} of 10 free tests remaining
                  </span>
                )}
              </div>

              {isSubscribed && (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  Unlimited Tests Unlocked
                </span>
              )}
            </div>

            {/* Pricing Cards Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan({ name: 'RW JEE Pro (Monthly Pass)', amount: 49, duration: '1 Month' })}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan.amount === 49
                    ? 'border-[#7857FF] bg-gradient-to-b from-[#1F1744] to-[#171C34] shadow-lg shadow-[#7857FF]/20'
                    : 'border-[#252D54] bg-[#171C34]/60 hover:border-[#3b477e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#37D9F5] uppercase tracking-wider">Monthly Pass</span>
                  {selectedPlan.amount === 49 && <Check className="w-3.5 h-3.5 text-[#37D9F5]" />}
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">₹49</span>
                  <span className="text-[10px] text-slate-400">/mo</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">Full 30-day Pro access</div>
              </div>

              <div
                onClick={() => setSelectedPlan({ name: 'RW JEE Pro (Full Year Pass)', amount: 499, duration: '1 Year' })}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan.amount === 499
                    ? 'border-[#7857FF] bg-gradient-to-b from-[#1F1744] to-[#171C34] shadow-lg shadow-[#7857FF]/20'
                    : 'border-[#252D54] bg-[#171C34]/60 hover:border-[#3b477e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Annual Pass</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">SAVE 15%</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">₹499</span>
                  <span className="text-[10px] text-slate-400">/yr</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">Target 2025/2026 Batch</div>
              </div>
            </div>

            {/* Benefits checklist */}
            <div className="p-4 rounded-2xl bg-[#171C34] border border-[#252D54] space-y-2 text-xs">
              <div className="font-bold text-white text-xs mb-1">What you unlock with Pro:</div>
              {[
                'Unlimited NTA CBT & JEE Advanced Mock Tests (All 20+ Tests)',
                'Step-by-step detailed solutions & key formula memory cards',
                'Estimated All India Rank & Percentile predictor',
                'Verified Peer doubt clearing with priority answer badges',
                'Direct Admin WhatsApp activation support (+91 9839530890)'
              ].map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37D9F5] shrink-0 mt-0.5" />
                  <span className="text-[11px]">{b}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            {!isSubscribed ? (
              <button
                onClick={handleStartCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-lg shadow-[#7857FF]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Pay ₹{selectedPlan.amount} via UPI & Upgrade</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-center text-xs text-emerald-400 font-bold p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                ✓ You already have an active subscription with unlimited mock tests!
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DIRECT UPI PAYMENT & UTR SUBMISSION */}
        {step === 'checkout' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#37D9F5]" />
                  <span>Scan & Pay via UPI</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {selectedPlan.name} • <strong className="text-white font-mono">₹{selectedPlan.amount}.00</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('plan')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Change Plan
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* QR Code Card */}
            <div className="p-4 rounded-3xl bg-[#171C34] border border-[#252D54] flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-2xl bg-white shadow-xl">
                <img
                  src={qrCodeUrl}
                  alt="UPI Payment QR Code"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-300">
                  Scan using Google Pay, PhonePe, Paytm, or any UPI App
                </div>
                <div className="text-[11px] text-[#37D9F5] font-mono">
                  Payee: {PAYEE_NAME}
                </div>
              </div>

              {/* UPI ID Copy Bar */}
              <div className="w-full max-w-sm flex items-center justify-between px-3 py-2 rounded-xl bg-[#101426] border border-[#252D54]">
                <div className="text-left overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Official UPI ID</span>
                  <span className="text-xs font-mono text-white font-bold select-all truncate block">
                    {UPI_ID}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg bg-[#7857FF]/20 hover:bg-[#7857FF]/30 border border-[#7857FF]/40 text-xs font-bold text-[#A388FF] flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct UPI Intent Link for Mobile */}
              <a
                href={upiIntentUrl}
                className="w-full max-w-sm py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#252D54] text-[11px] text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tap to Open UPI App directly on phone</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* STEP 2: UTR Submission Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Enter 12-Digit UPI Ref / UTR Number
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. 412345678901 (from your payment receipt)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono tracking-wider focus:border-[#7857FF] focus:outline-none placeholder:text-slate-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  You can find the 12-digit UTR in your Google Pay, PhonePe, or Paytm transaction details.
                </span>
              </div>

              {/* Submit & WhatsApp Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording payment...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 text-emerald-950" />
                    <span>Send on WhatsApp ({WHATSAPP_NUMBER}) & Submit</span>
                    <Send className="w-3.5 h-3.5 text-emerald-950" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center gap-2.5 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Direct Admin Verification:</span> Once sent, platform owner ({WHATSAPP_NUMBER}) will verify your UTR and activate PRO instantly.
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUBMITTED SUCCESS SCREEN */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Payment Submitted!</h3>
              <p className="text-xs text-emerald-400 font-semibold">
                Details sent to Admin WhatsApp ({WHATSAPP_NUMBER})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171C34] border border-[#252D54] text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="font-bold text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-slate-200">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="font-semibold text-[#37D9F5]">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{selectedPlan.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UTR Reference:</span>
                <span className="font-mono text-white font-bold">{lastSubmittedUtr}</span>
              </div>
            </div>

            <div className="space-y-2 max-w-sm mx-auto pt-2">
              {lastWhatsappUrl && (
                <a
                  href={lastWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Again (9839530890)</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
