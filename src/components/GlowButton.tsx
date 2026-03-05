import React from 'react';

interface GlowButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  /** 'cyan-indigo' (default) | 'green-cyan' | 'indigo-violet' */
  variant?: 'cyan-indigo' | 'green-cyan' | 'indigo-violet';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GRADIENTS = {
  'cyan-indigo':   'conic-gradient(from 0deg, #06b6d4, #6366f1, #8b5cf6, #06b6d4)',
  'green-cyan':    'conic-gradient(from 0deg, #10b981, #06b6d4, #0ea5e9, #10b981)',
  'indigo-violet': 'conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1)',
};

const SIZES = {
  sm:  { padding: '8px 18px',  fontSize: '13px', borderRadius: '10px', gap: '6px'  },
  md:  { padding: '11px 26px', fontSize: '14px', borderRadius: '12px', gap: '8px'  },
  lg:  { padding: '14px 36px', fontSize: '15px', borderRadius: '14px', gap: '10px' },
};

const GlowButton: React.FC<GlowButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = 'cyan-indigo',
  size = 'md',
  className = '',
}) => {
  const gradient = GRADIENTS[variant];
  const sz = SIZES[size];

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderRadius: sz.borderRadius,
        padding: '2px',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      className={className}
    >
      {/* Spinning conic-gradient border */}
      <div
        style={{
          position: 'absolute',
          inset: '-60%',
          background: gradient,
          animation: disabled ? 'none' : 'border-spin 3s linear infinite',
        }}
      />

      {/* Button body */}
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sz.gap,
          padding: sz.padding,
          fontSize: sz.fontSize,
          fontWeight: 800,
          letterSpacing: '0.02em',
          color: disabled ? '#9ca3af' : '#ffffff',
          background: '#0f172a',
          borderRadius: `calc(${sz.borderRadius} - 2px)`,
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          animation: disabled ? 'none' : 'glow-pulse 2.5s ease-in-out infinite',
          transition: 'background 0.2s',
          width: '100%',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
        onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: sz.gap,
            animation: disabled ? 'none' : 'text-glow 2.5s ease-in-out infinite',
          }}
        >
          {children}
        </span>
      </button>
    </div>
  );
};

export default GlowButton;
