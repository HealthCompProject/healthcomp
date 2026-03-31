import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  variant?: 'dark' | 'light';
}

export default function Card({
  accent = false,
  variant = 'dark',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseClasses =
    variant === 'dark'
      ? 'bg-navy-900/50 border border-white/10'
      : 'bg-white border border-navy-100';

  return (
    <div
      className={`
        rounded-xl p-6
        ${baseClasses}
        ${accent ? 'border-t-2 border-t-gold-500' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
