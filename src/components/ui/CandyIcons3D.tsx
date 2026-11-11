import React from 'react';
import { TaskKind } from '../../types/game';

export const Star3DIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({
  active = true,
  size = 28,
  className = '',
}) => {
  const uid = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={`starGrad-${uid}`} x1="16" y1="6" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={active ? '#FFF7AE' : '#475569'} />
          <stop offset="48%" stopColor={active ? '#FFC700' : '#334155'} />
          <stop offset="100%" stopColor={active ? '#D97706' : '#1E293B'} />
        </linearGradient>
      </defs>
      <path
        d="M32 5L39.8 21.2L57.6 23.6L44.6 36.1L47.8 53.8L32 45.3L16.2 53.8L19.4 36.1L6.4 23.6L24.2 21.2L32 5Z"
        fill={`url(#starGrad-${uid})`}
        stroke={active ? '#FEF08A' : '#64748B'}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {active && (
        <ellipse
          cx="26"
          cy="21"
          rx="6"
          ry="3"
          transform="rotate(-28 26 21)"
          fill="white"
          fillOpacity="0.72"
        />
      )}
    </svg>
  );
};

export const Hammer3DIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="hamWood" x1="20" y1="24" x2="48" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="hamHead" x1="10" y1="10" x2="44" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF7597" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <rect
      x="28"
      y="26"
      width="10"
      height="32"
      rx="5"
      transform="rotate(-35 28 26)"
      fill="url(#hamWood)"
      stroke="#FEF3C7"
      strokeWidth="2"
    />
    <rect
      x="10"
      y="16"
      width="34"
      height="20"
      rx="8"
      transform="rotate(-35 10 16)"
      fill="url(#hamHead)"
      stroke="#FFE4E6"
      strokeWidth="2.5"
    />
    <ellipse cx="22" cy="16" rx="6" ry="2.5" transform="rotate(-35 22 16)" fill="white" fillOpacity="0.7" />
  </svg>
);

export const Frost3DIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="frostGem" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <polygon
      points="32,6 48,18 48,46 32,58 16,46 16,18"
      fill="url(#frostGem)"
      stroke="#BAE6FD"
      strokeWidth="3"
    />
    <polygon points="32,14 41,22 41,42 32,50 23,42 23,22" fill="#FFFFFF" fillOpacity="0.35" />
    <ellipse cx="26" cy="20" rx="5" ry="2.5" transform="rotate(-30 26 20)" fill="white" fillOpacity="0.85" />
  </svg>
);

export const Shuffle3DIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="shufOrb" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5D0FE" />
        <stop offset="52%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#581C87" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="24" fill="url(#shufOrb)" stroke="#F3E8FF" strokeWidth="2.5" />
    <path
      d="M20 26H38L33 21M44 38H26L31 43"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="24" cy="19" rx="6" ry="2.5" transform="rotate(-25 24 19)" fill="white" fillOpacity="0.7" />
  </svg>
);

export const SerpentDanger3DIcon: React.FC<{ frozen?: boolean; size?: number }> = ({
  frozen = false,
  size = 24,
}) => {
  if (frozen) return <Frost3DIcon size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="serpHead" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="55%" stopColor="#4D9C11" />
          <stop offset="100%" stopColor="#1A3B04" />
        </linearGradient>
      </defs>
      <path
        d="M14 36C14 20 24 10 38 12C50 14 54 26 52 38C50 48 40 54 28 52C18 50 14 44 14 36Z"
        fill="url(#serpHead)"
        stroke="#D9F99D"
        strokeWidth="2.5"
      />
      <circle cx="28" cy="28" r="5" fill="#FDE047" />
      <rect x="27" y="24" width="2.4" height="8" rx="1" fill="#7F1D1D" />
      <circle cx="42" cy="28" r="5" fill="#FDE047" />
      <rect x="41" y="24" width="2.4" height="8" rx="1" fill="#7F1D1D" />
      <path d="M24 43L28 48L32 43L36 48L40 43" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const Crown3DIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="crownG" x1="12" y1="14" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF7AE" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <path
      d="M10 48L14 20L26 31L32 14L38 31L50 20L54 48H10Z"
      fill="url(#crownG)"
      stroke="#FEF08A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="38" r="5" fill="#FF1744" stroke="white" strokeWidth="1.5" />
  </svg>
);

export const Task3DIcon: React.FC<{ kind: TaskKind; size?: number }> = ({ kind, size = 22 }) => {
  switch (kind) {
    case 'marbles':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <defs>
            <radialGradient id="marbG" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FF9EBB" />
              <stop offset="50%" stopColor="#FF1E56" />
              <stop offset="100%" stopColor="#880E4F" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#marbG)" stroke="#FFE4E6" strokeWidth="2.5" />
          <ellipse cx="24" cy="21" rx="7" ry="3.5" transform="rotate(-30 24 21)" fill="white" fillOpacity="0.8" />
        </svg>
      );
    case 'crates':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <rect x="10" y="10" width="44" height="44" rx="9" fill="#D97706" stroke="#FDE68A" strokeWidth="3" />
          <path d="M16 16L48 48M48 16L16 48" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'keys':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="24" cy="24" r="13" fill="#FACC15" stroke="#FEF08A" strokeWidth="3" />
          <circle cx="24" cy="24" r="5" fill="#FF1744" />
          <path d="M33 33L52 52M44 44L50 38M49 49L55 43" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'bridge_candies':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M8 44C18 22 46 22 56 44" stroke="#F97316" strokeWidth="9" strokeLinecap="round" />
          <path d="M8 44C18 22 46 22 56 44" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'ice':
      return <Frost3DIcon size={size} />;
    case 'chains':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <rect x="14" y="24" width="22" height="16" rx="8" stroke="#E2E8F0" strokeWidth="5" />
          <rect x="28" y="24" width="22" height="16" rx="8" stroke="#94A3B8" strokeWidth="5" />
        </svg>
      );
    case 'specials':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="34" r="20" fill="#311042" stroke="#F472B6" strokeWidth="3" />
          <circle cx="32" cy="34" r="9" fill="#FF6D00" />
          <path d="M32 14L38 6" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'cannon_charge':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="23" fill="#2E1065" stroke="#FDE047" strokeWidth="3" />
          <circle cx="24" cy="24" r="5" fill="#FF1E4D" />
          <circle cx="40" cy="24" r="5" fill="#38BDF8" />
          <circle cx="32" cy="39" r="5" fill="#4ADE80" />
          <circle cx="22" cy="38" r="4" fill="#FACC15" />
          <circle cx="42" cy="38" r="4" fill="#C084FC" />
        </svg>
      );
  }
};
