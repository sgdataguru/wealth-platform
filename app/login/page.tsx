/**
 * @file login/page.tsx
 * @description Premium login page for North Star — Cockpit
 * @module app/login
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginShell from '../components/auth/LoginShell';
import LoginForm from '../components/features/LoginForm';
import { clearStoredAuth, getDefaultDashboardRoute, getStoredAuth } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const auth = getStoredAuth();

      if (auth?.isAuthenticated) {
        router.push(getDefaultDashboardRoute(auth.user.role));
        return;
      }

      clearStoredAuth();
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <svg 
          className="w-16 h-16 animate-spin" 
          viewBox="0 0 24 24"
          style={{ color: 'var(--accent-gold)' }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <LoginShell>
      <LoginForm />
    </LoginShell>
  );
}
