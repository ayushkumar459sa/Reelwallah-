import React, { useState } from 'react';

// Preset JEE Aspirant Avatar definitions with rich inline SVGs
export const PRESET_AVATARS = [
  {
    id: 'avatar:iit',
    label: 'IIT Bombay Top Ranker',
    emoji: '🎓',
    bg: 'from-[#7857FF] to-[#37D9F5]'
  },
  {
    id: 'avatar:quantum',
    label: 'Quantum Physicist',
    emoji: '⚛️',
    bg: 'from-[#06B6D4] to-[#3B82F6]'
  },
  {
    id: 'avatar:einstein',
    label: 'Genius Aspirant',
    emoji: '⚡',
    bg: 'from-[#F59E0B] to-[#EF4444]'
  },
  {
    id: 'avatar:maths',
    label: 'Maths Prodigy',
    emoji: '📐',
    bg: 'from-[#10B981] to-[#06B6D4]'
  },
  {
    id: 'avatar:topper',
    label: 'AIR 1 Dreamer',
    emoji: '🏆',
    bg: 'from-[#8B5CF6] to-[#EC4899]'
  },
  {
    id: 'avatar:fire',
    label: 'Focus Beast',
    emoji: '🔥',
    bg: 'from-[#EF4444] to-[#F97316]'
  }
];

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'Aspirant',
  size = 'md',
  className = '',
  showBorder = true
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-24 h-24 text-2xl font-black'
  };

  const getInitials = (str?: string | null) => {
    if (!str) return 'A';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const borderClass = showBorder
    ? 'ring-2 ring-[#7857FF]/80 ring-offset-1 ring-offset-[#101426] shadow-lg shadow-[#7857FF]/30'
    : '';
  const chosenSize = sizeClasses[size] || sizeClasses.md;

  // Check if src is one of our built-in preset avatars
  if (src && src.startsWith('avatar:')) {
    const preset = PRESET_AVATARS.find(p => p.id === src) || PRESET_AVATARS[0];
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${preset.bg} text-white font-extrabold select-none shrink-0 transition-transform ${chosenSize} ${borderClass} ${className}`}
        title={`${name || 'Aspirant'} (${preset.label})`}
      >
        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{preset.emoji}</span>
      </div>
    );
  }

  // If valid image and hasn't errored
  if (src && !hasError && (src.startsWith('data:image') || src.startsWith('http'))) {
    return (
      <div className={`relative inline-block shrink-0 ${chosenSize} ${className}`}>
        <img
          src={src}
          alt={name || 'User'}
          onError={() => setHasError(true)}
          className={`w-full h-full rounded-2xl object-cover bg-[#171C34] ${borderClass}`}
          loading="lazy"
        />
      </div>
    );
  }

  // Deterministic color palette based on user name
  const palettes = [
    'from-[#7857FF] to-[#37D9F5]',
    'from-[#F43F5E] to-[#FB923C]',
    'from-[#10B981] to-[#3B82F6]',
    'from-[#8B5CF6] to-[#EC4899]',
    'from-[#06B6D4] to-[#6366F1]'
  ];
  const charCode = (name || 'A').charCodeAt(0) || 0;
  const gradient = palettes[charCode % palettes.length];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white font-black tracking-wide select-none shrink-0 ${chosenSize} ${borderClass} ${className}`}
      title={name || 'Aspirant'}
    >
      <span className="drop-shadow-md">{getInitials(name)}</span>
    </div>
  );
};

