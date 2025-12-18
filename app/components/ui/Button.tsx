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
    font-semibold rounded transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#C9A227] to-[#D4AF37]
      text-[#1A1A2E] hover:shadow-lg
      focus:ring-[#C9A227]
      hover:from-[#D4AF37] hover:to-[#E5C448]
    `,
    secondary: `
      bg-transparent border-2 border-[#1E3A5F]
      text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white
      focus:ring-[#1E3A5F]
    `,
    ghost: `
      bg-transparent text-[#1E3A5F]
      hover:bg-[#F8F9FA] hover:underline
      focus:ring-[#1E3A5F]
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
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
