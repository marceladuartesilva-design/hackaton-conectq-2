import { cn } from '../lib/utils';

interface LogoBolivarProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
}

function FamilyIcon({ size = 40, theme = 'dark' }: { size?: number; theme?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      {/* Golden square background */}
      <rect x="4" y="4" width="40" height="40" rx="2" fill="#F2C94C" />
      {/* Family silhouette - parent figures embracing child */}
      {/* Large figure (left parent) */}
      <ellipse cx="22" cy="13" rx="5" ry="5.5" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="2.2" />
      <path d="M14 42 C14 30 16 24 22 22 C26 24 30 28 30 34 L30 42" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="2.2" strokeLinecap="round" />
      {/* Second figure (right parent) */}
      <ellipse cx="32" cy="15" rx="4" ry="4.5" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="2" />
      <path d="M32 20 C36 22 38 28 38 34 L38 42" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="2" strokeLinecap="round" />
      {/* Child figure (center bottom) */}
      <ellipse cx="25" cy="28" rx="3" ry="3" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="1.8" />
      <path d="M25 31 C25 34 24 38 22 42" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 31 C25 34 26 38 28 42" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="1.8" strokeLinecap="round" />
      {/* Embracing arm */}
      <path d="M18 28 C20 26 22 26 25 28" fill="none" stroke={theme === 'light' ? '#fff' : '#006838'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LogoBolivar({ className, variant = 'full', theme = 'dark' }: LogoBolivarProps) {
  const textColor = theme === 'light' ? 'text-white' : 'text-[#006838]';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <FamilyIcon size={variant === 'full' ? 44 : 38} theme={theme} />
      {variant === 'full' && (
        <div className={cn('flex flex-col leading-tight', textColor)}>
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase">Seguros</span>
          <span className="text-xl font-bold -mt-0.5 tracking-tight">Bolívar</span>
        </div>
      )}
    </div>
  );
}
