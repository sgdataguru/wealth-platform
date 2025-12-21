/**
 * @file LoginForm.tsx
 * @description Premium login form with glass-morphism styling for Cockpit
 * @module components/features
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'demo@nuvama.com',
  password: 'cockpit2025',
};

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

    // Validate credentials
    if (
      data.email === DEMO_CREDENTIALS.email &&
      data.password === DEMO_CREDENTIALS.password
    ) {
      // Store authentication state
      const authData = {
        isAuthenticated: true,
        user: {
          email: data.email,
          name: 'Demo User',
          role: 'rm',
        },
        timestamp: Date.now(),
      };

      // Store in localStorage if remember me is checked
      if (data.rememberMe) {
        localStorage.setItem('nuvama_auth', JSON.stringify(authData));
      } else {
        // Store in sessionStorage for session-only
        sessionStorage.setItem('nuvama_auth', JSON.stringify(authData));
      }

      // Set default role
      localStorage.setItem('nuvama_user_role', 'rm');

      // Redirect to dashboard
      router.push('/rm');
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Glass-morphism card */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E85D54]/20 via-transparent to-[#C9A227]/20 -z-10" />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E85D54] to-[#C9A227] mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Nuvama Wealth
          </h1>
          <p className="text-white/70 text-sm">Relationship Manager Cockpit</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E85D54] focus:border-transparent transition-all"
              placeholder="demo@nuvama.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E85D54] focus:border-transparent transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
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
              <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#E85D54] focus:ring-[#E85D54] focus:ring-offset-0 cursor-pointer"
              />
              <span className="ml-2 text-sm text-white/90">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-[#E85D54] hover:text-[#C9A227] transition-colors"
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
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#E85D54] to-[#C9A227] text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#E85D54]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs text-white/60 text-center mb-2">Demo Credentials</p>
            <div className="text-xs text-white/80 space-y-1 text-center">
              <p><span className="text-white/60">Email:</span> demo@nuvama.com</p>
              <p><span className="text-white/60">Password:</span> cockpit2025</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
