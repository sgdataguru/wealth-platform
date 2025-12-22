/**
 * @file Card.tsx
 * @description Premium card component with subtle shadow and hover effects
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-gradient-to-br from-[rgba(17,25,42,0.92)] via-[rgba(14,21,35,0.92)] to-[rgba(10,15,26,0.96)]
        rounded-2xl border border-[rgba(217,180,114,0.25)] backdrop-blur-md
        shadow-[0_14px_40px_rgba(0,0,0,0.45)] text-[var(--text-primary)]
        ${hover ? 'transition-all duration-300 hover:shadow-[0_20px_52px_rgba(0,0,0,0.55)] hover:-translate-y-1' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
