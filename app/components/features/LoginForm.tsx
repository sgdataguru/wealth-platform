/**
 * @file LoginForm.tsx
 * @description Premium login form with Kairos Capital branding for Cockpit
 * @module components/features
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authenticateUser } from '@/lib/auth/mock-auth';
import { getDefaultDashboardRoute, setStoredAuth } from '@/lib/auth/session';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const session = authenticateUser(data.email, data.password);

    if (session) {
      setStoredAuth(session, Boolean(data.rememberMe));
      router.push(getDefaultDashboardRoute(session.user.role));
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          Welcome to Cockpit
        </h1>
        <p className="text-base" style={{ color: 'var(--text-muted)' }}>
          Your command center for revenue triggers and relationship timing.
        </p>
      </div>

      {/* Form Card */}
      <div 
        className="p-8 rounded-2xl shadow-lg border transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'rgba(217, 180, 114, 0.2)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--input-surface)',
                borderColor: 'var(--input-border)',
                color: 'var(--text-primary)',
              }}
              placeholder="rm_user@nuvama.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 pr-12"
                style={{
                  backgroundColor: 'var(--input-surface)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: 'var(--accent-gold)',
                }}
              />
              <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-sm transition-colors"
              style={{ color: 'var(--accent-gold)' }}
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset functionality will be available in production.');
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div 
              className="px-4 py-3 rounded-lg text-sm border"
              style={{
                backgroundColor: 'var(--error-light)',
                borderColor: 'var(--error)',
                color: 'var(--error)',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-soft) 100%)',
              color: '#0A1628',
              boxShadow: '0 4px 12px rgba(217, 180, 114, 0.3)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Demo credentials hint */}
          <div 
            className="mt-6 p-4 border rounded-lg"
            style={{
              backgroundColor: 'var(--control-surface)',
              borderColor: 'var(--control-border)',
            }}
          >
            <p className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
              Demo Credentials
            </p>
            <div className="text-xs space-y-1 text-center" style={{ color: 'var(--text-secondary)' }}>
              <p><span style={{ color: 'var(--text-muted)' }}>RM:</span> rm_user@nuvama.com</p>
              <p><span style={{ color: 'var(--text-muted)' }}>Executive:</span> exec_user@nuvama.com</p>
              <p><span style={{ color: 'var(--text-muted)' }}>Password:</span> cockpit2025</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
