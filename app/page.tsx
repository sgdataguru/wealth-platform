/**
 * @file page.tsx
 * @description Main landing page with authentication check
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from './hooks/useUserRole';

export default function LandingPage() {
  const router = useRouter();
  const { role, isRM, isExecutive } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authData = localStorage.getItem('nuvama_auth') || sessionStorage.getItem('nuvama_auth');
      
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          if (auth.isAuthenticated) {
            // Redirect to appropriate dashboard based on role
            if (isRM) {
              router.push('/rm');
            } else if (isExecutive) {
              router.push('/executive');
            } else {
              router.push('/rm'); // Default to RM dashboard
            }
            return;
          }
        } catch (error) {
          // Invalid auth data, clear it
          localStorage.removeItem('nuvama_auth');
          sessionStorage.removeItem('nuvama_auth');
        }
      }
      
      // Not authenticated, redirect to login
      router.push('/login');
    };

    checkAuth();
  }, [router, isRM, isExecutive]);

  // Loading state while checking authentication
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(217,180,114,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(124,199,255,0.08),transparent_32%),linear-gradient(135deg,#060911,#0b1220)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 bg-[rgba(255,255,255,0.04)] px-10 py-8 rounded-2xl border border-[rgba(217,180,114,0.24)] shadow-[0_18px_42px_rgba(0,0,0,0.55)]">
        <svg className="w-16 h-16 animate-spin text-[var(--accent-gold)]" viewBox="0 0 24 24">
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
        <p className="text-[var(--text-secondary)] text-sm tracking-wide">Checking authentication...</p>
      </div>
    </div>
  );
}
