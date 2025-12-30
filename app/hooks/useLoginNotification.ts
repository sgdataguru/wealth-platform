/**
 * @file hooks/useLoginNotification.ts
 * @description Hook for displaying a timed notification after login for RM and Executive roles
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/types';

export interface LoginNotificationConfig {
  delay?: number; // in milliseconds
  message?: string;
  enabled?: boolean;
}

const DEFAULT_DELAY = 15000; // 15 seconds
const DEFAULT_MESSAGE = 'Equity Flow Signal: Belrise Industries Block Sale surged ~13% click more for detail report';
const NOTIFICATION_SHOWN_KEY = 'kairos_notification_shown';

/**
 * Custom hook to manage login notification for RM and Executive users
 * Shows notification after specified delay on first dashboard load
 */
export function useLoginNotification(
  userRole: UserRole,
  config: LoginNotificationConfig = {}
) {
  const {
    delay = DEFAULT_DELAY,
    message = DEFAULT_MESSAGE,
    enabled = true,
  } = config;

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Only show for RM and Executive roles
    if (!enabled || (userRole !== 'rm' && userRole !== 'executive')) {
      return;
    }

    // Check if notification was already shown in this session
    const sessionKey = `${NOTIFICATION_SHOWN_KEY}_${userRole}`;
    const wasShown = sessionStorage.getItem(sessionKey);

    if (wasShown === 'true') {
      return;
    }

    // Set timer to show notification after delay
    const timer = setTimeout(() => {
      setShowNotification(true);
      sessionStorage.setItem(sessionKey, 'true');
    }, delay);

    return () => clearTimeout(timer);
  }, [userRole, delay, enabled]);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  const resetNotification = useCallback(() => {
    const sessionKey = `${NOTIFICATION_SHOWN_KEY}_${userRole}`;
    sessionStorage.removeItem(sessionKey);
    setShowNotification(false);
  }, [userRole]);

  return {
    showNotification,
    message,
    dismissNotification,
    resetNotification,
  };
}
