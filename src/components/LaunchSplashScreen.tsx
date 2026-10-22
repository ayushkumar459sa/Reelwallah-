import React, { useEffect, useState } from 'react';
import { RWLogo } from './RWLogo.js';

interface LaunchSplashScreenProps {
  onComplete: () => void;
}

export const LaunchSplashScreen: React.FC<LaunchSplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'glow' | 'reveal' | 'fading'>('initial');

  useEffect(() => {
    // Stage 1: Initial entrance
    const t1 = setTimeout(() => setStage('glow'), 400);
    // Stage 2: Reveal tagline
    const t2 = setTimeout(() => setStage('reveal'), 1100);
    // Stage 3: Begin fade out
    const t3 = setTimeout(() => setStage('fading'), 2300);
    // Stage 4: Completed
    const t4 = setTimeout(() => onComplete(), 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101426] transition-opacity duration-500 cursor-pointer overflow-hidden ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic background ambient particles and radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(120,87,255,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(55,217,245,0.12),transparent_50%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#7857FF15_1px,transparent_1px),linear-gradient(to_bottom,#7857FF15_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated RW Logo */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            stage === 'initial'
              ? 'scale-50 opacity-0 translate-y-6'
              : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          <RWLogo size="xl" />
        </div>

        {/* Brand Name */}
        <div
          className={`mt-6 transition-all duration-700 delay-150 transform ${
            stage === 'initial'
              ? 'opacity-0 translate-y-4'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>REEL</span>
            <span className="bg-gradient-to-r from-[#7857FF] via-[#A388FF] to-[#37D9F5] bg-clip-text text-transparent">
              WALLAH
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div
          className={`mt-4 transition-all duration-700 delay-300 transform max-w-sm ${
            stage === 'reveal' || stage === 'fading'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="text-sm md:text-base font-semibold text-[#37D9F5] tracking-wide">
            Learn Together. Solve Doubts. Earn Rewards. Crack JEE.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-[#7857FF] animate-ping" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              IIT-JEE Aspirant Network
            </span>
          </div>
        </div>
      </div>

      {/* Skip button in bottom corner */}
      <button
        onClick={e => {
          e.stopPropagation();
          onComplete();
        }}
        className="absolute bottom-6 right-6 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all"
      >
        Skip ➔
      </button>
    </div>
  );
};
