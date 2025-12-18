/**
 * @file SignalBadge.tsx
 * @description Color-coded signal badge component
 */

import type { SignalSeverity } from '@/types';

interface SignalBadgeProps {
  severity: SignalSeverity;
  label: string;
  timestamp?: string;
  compact?: boolean;
}

export default function SignalBadge({
  severity,
  label,
  timestamp,
  compact = false,
}: SignalBadgeProps) {
  const severityStyles = {
    critical: {
      bg: 'bg-[#F8D7DA]',
      border: 'border-[#DC3545]',
      text: 'text-[#721C24]',
      icon: '🔴',
    },
    high: {
      bg: 'bg-[#FFE5CC]',
      border: 'border-[#FF8C00]',
      text: 'text-[#8B4513]',
      icon: '🟠',
    },
    medium: {
      bg: 'bg-[#FFF3CD]',
      border: 'border-[#FFC107]',
      text: 'text-[#856404]',
      icon: '🟡',
    },
    low: {
      bg: 'bg-[#D4EDDA]',
      border: 'border-[#28A745]',
      text: 'text-[#155724]',
      icon: '🟢',
    },
  };

  const styles = severityStyles[severity];

  if (compact) {
    return (
      <span
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
          ${styles.bg} ${styles.text} border ${styles.border}
        `}
      >
        <span className="text-[10px]">{styles.icon}</span>
        {label}
      </span>
    );
  }

  return (
    <div
      className={`
        inline-flex flex-col gap-0.5 px-3 py-2 rounded-lg
        ${styles.bg} ${styles.text} border ${styles.border}
      `}
    >
      <div className="flex items-center gap-1 font-medium text-sm">
        <span className="text-xs">{styles.icon}</span>
        {label}
      </div>
      {timestamp && (
        <span className="text-xs opacity-75">{timestamp}</span>
      )}
    </div>
  );
}
