/**
 * @file Avatar.tsx
 * @description User avatar component with initials fallback
 */

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

  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full bg-[#0A1628] text-white
        flex items-center justify-center font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
