/**
 * @file Avatar.tsx
 * @description User avatar component with initials fallback
 */

import Image from 'next/image';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  className?: string;
}

export default function Avatar({
  initials,
  size = 'md',
  src,
  className = '',
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const sizeDimensions: Record<NonNullable<AvatarProps['size']>, number> = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={initials}
        width={sizeDimensions[size]}
        height={sizeDimensions[size]}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full bg-[#1A1332] text-white
        flex items-center justify-center font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
