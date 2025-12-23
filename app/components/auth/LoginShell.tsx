/**
 * @file LoginShell.tsx
 * @description Premium two-column login layout with Nuvama branding and live cockpit preview
 * @module components/auth
 */

'use client';

import Image from 'next/image';

interface CockpitPreviewCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  priority?: 'critical' | 'high' | 'medium';
}

function CockpitPreviewCard({ title, value, trend, trendValue, priority }: CockpitPreviewCardProps) {
  const priorityColors = {
    critical: 'from-red-500/20 to-red-600/20 border-red-500/30',
    high: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    medium: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  };

  return (
    <div 
      className={`
        backdrop-blur-md bg-gradient-to-br ${priority ? priorityColors[priority] : 'from-white/5 to-white/10'}
        border ${priority ? priorityColors[priority].split(' ')[2] : 'border-white/20'}
        rounded-lg p-4 transition-all duration-300
        hover:scale-105 hover:shadow-lg
      `}
    >
      <div className="text-xs text-white/60 mb-1 uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {trend && trendValue && (
        <div className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </div>
  );
}

export default function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Brand Story & Cockpit Preview */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628]">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C9A227] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1E3A5F] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Header with Logo and Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Image
                  src="/brand/nuvama-logo.jpg"
                  alt="Nuvama Wealth"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Nuvama Wealth
                </h1>
                <p className="text-sm text-white/70">Management Limited</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Wealth Intelligence Hub
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
                <span className="text-[#C9A227] text-lg font-semibold">Cockpit</span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#C9A227] via-transparent to-transparent" />
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                Predictive signals. Clean routing. Faster decisions.
              </p>
            </div>
          </div>

          {/* Live Cockpit Preview */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/70 uppercase tracking-wider">Live Cockpit Preview</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CockpitPreviewCard
                title="IPO Trigger"
                value="12"
                priority="critical"
                trend="up"
                trendValue="+3 today"
              />
              <CockpitPreviewCard
                title="PE Exit Signal"
                value="8"
                priority="high"
                trend="up"
                trendValue="+2 today"
              />
              <CockpitPreviewCard
                title="AUM Movement"
                value="₹24.3Cr"
                priority="medium"
                trend="up"
                trendValue="+18%"
              />
              <CockpitPreviewCard
                title="Priority Leads"
                value="31"
                trend="up"
                trendValue="+5 new"
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg className="w-5 h-5 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure access</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg className="w-5 h-5 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Audited signals</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg className="w-5 h-5 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Governance-ready</span>
              </div>
            </div>

            <p className="text-xs text-white/50 mt-4">
              Powered by predictive signals and real-time intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-[var(--bg-primary)]">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Image
              src="/brand/nuvama-logo.jpg"
              alt="Nuvama Wealth"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Nuvama Wealth
            </div>
            <div className="text-xs text-[var(--text-muted)]">Cockpit</div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md mt-20 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
