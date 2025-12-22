/**
 * @file Header.tsx
 * @description Main header with search, notifications, role switcher, and user avatar
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';
import { useUserRole } from '@/app/hooks/useUserRole';
import ThemeToggle from './ThemeToggle';
import type { UserRole } from '@/types';

interface HeaderProps {
  userName?: string;
  userInitials?: string;
}

export default function Header({ userName, userInitials }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const { role, userProfile, switchRole } = useUserRole();
  const router = useRouter();

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);

    // Navigate to appropriate dashboard
    if (newRole === 'rm') {
      router.push('/rm');
    } else if (newRole === 'executive') {
      router.push('/executive');
    }
  };

  const displayName = userName || userProfile.name;
  const displayInitials = userInitials || userProfile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="sticky top-0 z-50">
      <div className="h-11 px-8 flex items-center justify-between bg-[var(--header-strip-bg)] border-b border-[var(--header-border)] backdrop-blur-[6px] transition-colors duration-300">
        <div className="flex items-center gap-3 text-[11px] tracking-wide text-[var(--text-secondary)]">
          <span className="flex h-7 items-center gap-2 rounded-full px-3 bg-[rgba(217,180,114,0.08)] text-[var(--text-primary)] border border-[rgba(217,180,114,0.25)] shadow-[var(--shadow-sm)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-gold)] shadow-[0_0_12px_rgba(217,180,114,0.85)]" />
            Signals refreshed 2m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--text-primary)]">
            <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Live feed ON
          </span>
        </div>

        <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span>Silent mode</span>
          <button
            type="button"
            onClick={() => setSilentMode(!silentMode)}
            className={`relative inline-flex h-9 w-16 items-center rounded-full border transition-all duration-200 ease-out ${silentMode ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.22)]' : 'bg-[rgba(217,180,114,0.14)] border-[rgba(217,180,114,0.4)] shadow-[0_10px_28px_rgba(217,180,114,0.35)]'}`}
            aria-pressed={silentMode}
            aria-label="Toggle silent mode for alerts"
          >
            <span
              className={`absolute left-1 h-6 w-6 rounded-full bg-gradient-to-br from-white/90 via-[#f7e0b5] to-[#d9b472] shadow-[0_10px_25px_rgba(217,180,114,0.55)] transition-transform duration-200 ease-out ${silentMode ? 'translate-x-6 bg-[rgba(255,255,255,0.7)] shadow-[var(--shadow-md)]' : ''}`}
            />
            <span className={`ml-auto pr-3 text-[10px] font-semibold ${silentMode ? 'text-[var(--text-muted)]' : 'text-[#0a0f1e]'}`}>
              {silentMode ? 'Off' : 'On'}
            </span>
          </button>
        </div>
      </div>

      <header className="h-20 px-8 flex items-center justify-between bg-[var(--header-main-bg)] border-b border-[var(--header-border)] shadow-[var(--shadow-lg)] transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image
            src="/nuvamalogo.jpg"
            alt="Nuvama Wealth"
            width={150}
            height={48}
            className="h-12 w-auto object-contain rounded-lg shadow-[var(--shadow-md)]"
            priority
          />

          {/* Role Badge */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-primary)] hover:bg-[rgba(217,180,114,0.1)] transition-colors"
            >
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {role === 'rm' ? 'RM' : role === 'executive' ? 'Executive' : 'Admin'}
              </span>
              <svg className="w-3 h-3 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-[var(--surface-card)] rounded-xl shadow-[var(--shadow-md)] border border-[var(--header-border)] py-3 backdrop-blur-md">
                <button
                  onClick={() => handleRoleSwitch('rm')}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${role === 'rm' ? 'bg-[rgba(217,180,114,0.14)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(217,180,114,0.08)]'}`}
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 20l-8-8 3-3 5 5 7-7 3 3z" />
                  </svg>
                  Relationship Manager
                </button>
                <button
                  onClick={() => handleRoleSwitch('executive')}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${role === 'executive' ? 'bg-[rgba(217,180,114,0.14)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(217,180,114,0.08)]'}`}
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 13v5m7-9v9m7-13v13M3 20h18" />
                  </svg>
                  Executive View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search prospects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-[var(--input-surface)] border border-[var(--input-border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[rgba(217,180,114,0.6)] transition-colors shadow-[var(--shadow-sm)]"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-3 rounded-xl bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-sm)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--accent-gold)] rounded-full shadow-[0_0_12px_rgba(217,180,114,0.9)]" />
          </button>

          {/* Settings */}
          <button className="p-3 rounded-xl bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-sm)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-4 pl-5 border-l border-[var(--header-border)]">
            <Avatar initials={displayInitials} size="sm" />
            <div className="hidden md:block">
              <p className="text-[var(--text-primary)] text-sm font-medium">{displayName}</p>
              <p className="text-[var(--text-muted)] text-xs">{userProfile.role === 'rm' ? 'Relationship Manager' : 'Executive'}</p>
            </div>
            <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
}
