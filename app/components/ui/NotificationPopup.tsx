/**
 * @file NotificationPopup.tsx
 * @description Notification popup component that displays timed notifications near target elements
 */

'use client';

import { useEffect, useState } from 'react';

export interface NotificationPopupProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  autoHideDuration?: number; // in milliseconds
  anchorElement?: HTMLElement | null;
}

export default function NotificationPopup({
  message,
  visible,
  onDismiss,
  autoHideDuration = 10000, // 10 seconds default
  anchorElement,
}: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setIsVisible(visible);

    if (visible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDuration, onDismiss]);

  useEffect(() => {
    if (visible && anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [visible, anchorElement]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className="fixed z-[100] animate-fade-in"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      data-testid="notification-popup"
    >
      <div className="relative w-80 bg-[var(--bg-card)] border border-[var(--accent-gold)] rounded-xl shadow-[0_8px_32px_rgba(217,180,114,0.3)] overflow-hidden">
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--primary-gold)]" />
        
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] shadow-[0_0_12px_rgba(217,180,114,0.9)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--accent-gold)] uppercase tracking-wider">
                New Signal
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-3">
            {message}
          </p>

          {/* Action */}
          <button
            onClick={handleDismiss}
            className="w-full px-4 py-2 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--primary-gold)] text-[var(--text-primary)] text-sm font-medium rounded-lg hover:shadow-[0_4px_16px_rgba(217,180,114,0.4)] transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
