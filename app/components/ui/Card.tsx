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
        bg-[var(--surface-card)] rounded-2xl border border-[var(--header-border)] backdrop-blur-md
        shadow-[var(--shadow-md)] text-[var(--text-primary)]
        ${hover ? 'transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
