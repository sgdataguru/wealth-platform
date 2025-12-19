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
        bg-white rounded-lg border border-gray-100
        shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]
        ${hover ? 'transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
