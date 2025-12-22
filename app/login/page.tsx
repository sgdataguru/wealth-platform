/**
 * @file login/page.tsx
 * @description Premium login page with shooting stars animation for Cockpit
 * @module app/login
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShootingStarsBackground from '../components/ui/ShootingStarsBackground';
import LoginForm from '../components/features/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authData = localStorage.getItem('nuvama_auth') || sessionStorage.getItem('nuvama_auth');
      
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          if (auth.isAuthenticated) {
            // Redirect to appropriate dashboard based on role
            const role = localStorage.getItem('nuvama_user_role') || 'rm';
            router.push(role === 'executive' ? '/executive' : '/rm');
            return;
          }
        } catch {
          // Invalid auth data, clear it
          localStorage.removeItem('nuvama_auth');
          sessionStorage.removeItem('nuvama_auth');
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <svg className="w-16 h-16 animate-spin text-[#E85D54]" viewBox="0 0 24 24">
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <ShootingStarsBackground />

      {/* Login form */}
      <div className="relative z-10 w-full animate-fade-in">
        <LoginForm />
      </div>
    </div>
  );
}
