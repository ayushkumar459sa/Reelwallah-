import React from 'react';

interface RWLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const RWLogo: React.FC<RWLogoProps> = ({ size = 'md', showText = false, className = '' }) => {
  const sizeMap = {
    sm: { box: 32, icon: 20, text: 'text-base' },
    md: { box: 42, icon: 26, text: 'text-xl' },
    lg: { box: 64, icon: 40, text: 'text-3xl' },
    xl: { box: 96, icon: 60, text: 'text-5xl' }
  };

  const { box, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#7857FF] via-[#5b37f2] to-[#37D9F5] shadow-lg shadow-[#7857FF]/30 p-0.5 group transition-transform duration-300 hover:scale-105"
        style={{ width: box, height: box }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-[#37D9F5]/20 blur-md group-hover:bg-[#37D9F5]/40 transition-colors pointer-events-none" />

        <div className="relative w-full h-full bg-[#101426] rounded-[14px] flex items-center justify-center overflow-hidden">
          {/* Futuristic grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7857FF_1px,transparent_1px)] [background-size:6px_6px]" />

          {/* RW stylized monogram with Play Symbol */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer stylized shield contour */}
            <path
              d="M20 22 L70 22 C82 22 88 28 88 38 C88 48 80 54 68 54 L36 54 L36 82"
              stroke="url(#rw-grad-1)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* The W slant and connected JEE arrow */}
            <path
              d="M42 54 L56 82 L70 54 L84 82"
              stroke="url(#rw-grad-2)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Play triangle inside the R upper loop */}
            <polygon
              points="42,30 42,46 56,38"
              fill="#37D9F5"
              className="drop-shadow-[0_0_6px_#37D9F5]"
            />
            <defs>
              <linearGradient id="rw-grad-1" x1="20" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7857FF" />
                <stop offset="1" stopColor="#37D9F5" />
              </linearGradient>
              <linearGradient id="rw-grad-2" x1="40" y1="50" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#37D9F5" />
                <stop offset="1" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-wider leading-none ${text} flex items-center gap-1`}>
            <span className="text-white">REEL</span>
            <span className="bg-gradient-to-r from-[#7857FF] to-[#37D9F5] bg-clip-text text-transparent">
              WALLAH
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#37D9F5]/90 mt-0.5">
            CRACK IIT-JEE
          </span>
        </div>
      )}
    </div>
  );
};
