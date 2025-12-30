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
        bg-[var(--bg-card)] rounded-lg border border-[var(--header-border)]
        shadow-[var(--shadow-sm)] text-[var(--text-primary)]
        ${hover ? 'transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
