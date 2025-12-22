/**
 * @file Button.tsx
 * @description Premium button component with Nuvama-inspired styling
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
      bg-gradient-to-r from-[rgba(217,180,114,0.95)] via-[rgba(202,161,100,0.95)] to-[rgba(176,134,69,0.95)]
      text-[#0b0f1b] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]
      focus:ring-[rgba(217,180,114,0.35)] focus:ring-offset-0
      hover:from-[rgba(223,191,132,0.98)] hover:to-[rgba(185,146,79,0.98)]
    `,
    secondary: `
      bg-[rgba(255,255,255,0.04)] border border-[rgba(217,180,114,0.5)]
      text-[var(--text-primary)] hover:bg-[rgba(217,180,114,0.08)]
      focus:ring-[rgba(217,180,114,0.35)]
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]
      focus:ring-[rgba(217,180,114,0.35)]
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
