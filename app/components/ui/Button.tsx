/**
 * @file Button.tsx
 * @description Premium button component with Kairos Capital-inspired styling
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-full transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-[0_10px_30px_rgba(0,0,0,0.35)]
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[var(--primary-accent)] to-[var(--primary-gold)]
      text-[var(--primary-deep-blue)] hover:shadow-[0_4px_12px_rgba(201,162,39,0.3)]
      focus:ring-[var(--primary-accent)] focus:ring-offset-0
      hover:from-[var(--primary-gold)] hover:to-[var(--primary-accent)]
    `,
    secondary: `
      bg-transparent border border-[var(--primary-royal-blue)]
      text-[var(--primary-royal-blue)] hover:bg-[var(--primary-royal-blue)] hover:text-white
      focus:ring-[var(--primary-royal-blue)]
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]
      focus:ring-[var(--primary-accent)]
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
