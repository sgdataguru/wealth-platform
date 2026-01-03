/**
 * @file Header.tsx
 * @description Main header with premium Heroicons 2
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';
import NotificationPopup from '../ui/NotificationPopup';
import { useUserRole } from '@/app/hooks/useUserRole';
import { clearStoredAuth } from '@/lib/auth/session';
import ThemeToggle from './ThemeToggle';
import { NavigationIcons } from '@/app/components/icons';

interface HeaderProps {
  userName?: string;
  userInitials?: string;
  showNotification?: boolean;
  notificationMessage?: string;
  onNotificationDismiss?: () => void;
}

export default function Header({ userName, userInitials, showNotification = false, notificationMessage, onNotificationDismiss }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [silentMode, setSilentMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { role, userProfile } = useUserRole();
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName = userName || userProfile.name;
  const displayInitials = userInitials || userProfile.name.split(' ').map(n => n[0]).join('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  function handleLogout() {
    setIsUserMenuOpen(false);
    clearStoredAuth();
    router.push('/login');
  }

  return (
    <div className="sticky top-0 z-50">
      <div className="h-11 px-8 flex items-center justify-between bg-[var(--header-strip-bg)] border-b border-[var(--header-border)] backdrop-blur-[6px] transition-colors duration-300">
        <div className="flex items-center gap-3 text-[11px] tracking-wide text-[var(--text-secondary)]">
          <span className="flex h-7 items-center gap-2 rounded-full px-3 bg-[rgba(212,175,55,0.08)] text-[var(--text-primary)] border border-[rgba(212,175,55,0.25)] shadow-[var(--shadow-sm)]">
            <span className="h-2 w-2 rounded-full bg-[var(--primary-gold)] shadow-[0_0_12px_rgba(212,175,55,0.85)]" />
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
            className={`relative inline-flex h-9 w-16 items-center rounded-full border transition-all duration-200 ease-out ${silentMode ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.22)]' : 'bg-[rgba(212,175,55,0.14)] border-[rgba(212,175,55,0.4)] shadow-[0_10px_28px_rgba(212,175,55,0.35)]'}`}
            aria-pressed={silentMode}
            aria-label="Toggle silent mode for alerts"
          >
            <span
              className={`absolute left-1 h-6 w-6 rounded-full bg-gradient-to-br from-white/90 via-[#f7e0b5] to-[#d4af37] shadow-[0_10px_25px_rgba(212,175,55,0.55)] transition-transform duration-200 ease-out ${silentMode ? 'translate-x-6 bg-[rgba(255,255,255,0.7)] shadow-[var(--shadow-md)]' : ''}`}
            />
            <span className={`ml-auto pr-3 text-[10px] font-semibold ${silentMode ? 'text-[var(--text-muted)]' : 'text-[var(--primary-deep-blue)]'}`}>
              {silentMode ? 'Off' : 'On'}
            </span>
          </button>
        </div>
      </div>

      <header className="h-20 px-8 flex items-center justify-between bg-[var(--header-main-bg)] border-b border-[var(--header-border)] shadow-[var(--shadow-lg)] transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image
            src="/brand/kairos-logo.png"
            alt="Kairos Capital"
            width={150}
            height={48}
            className="h-12 w-auto object-contain rounded-lg shadow-[var(--shadow-md)] bg-[#0A1628] p-1"
            priority
          />

          {/* Role Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-primary)]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Role</span>
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {role === 'rm' ? 'RM' : role === 'executive' ? 'Executive' : 'Admin'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-10">
          <div className="relative">
            <NavigationIcons.DeepDive
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
              strokeWidth={1.8}
            />
            <input
              type="text"
              placeholder="Search prospects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-[var(--input-surface)] border border-[var(--input-border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[rgba(212,175,55,0.6)] transition-colors shadow-[var(--shadow-sm)]"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <ThemeToggle />

          {/* Notifications */}
          <button
            ref={notificationButtonRef}
            className="relative p-3 rounded-xl bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-sm)]"
            aria-label="Notifications"
          >
            <NavigationIcons.Notifications className="w-6 h-6" strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--accent-gold)] rounded-full shadow-[0_0_12px_rgba(217,180,114,0.9)]" />
          </button>

          {/* Settings */}
          <button className="p-3 rounded-xl bg-[var(--control-surface)] border border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-sm)]">
            <NavigationIcons.Settings className="w-6 h-6" strokeWidth={1.8} />
          </button>

          {/* User Menu */}
          <div className="relative pl-5 border-l border-[var(--header-border)]" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className="flex items-center gap-4"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              <Avatar initials={displayInitials} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-[var(--text-primary)] text-sm font-medium">{displayName}</p>
                <p className="text-[var(--text-muted)] text-xs">{userProfile.role === 'rm' ? 'Relationship Manager' : 'Executive'}</p>
              </div>
              <NavigationIcons.ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={2} />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-44 rounded-xl border border-[var(--control-border)] bg-[var(--control-surface)] shadow-[var(--shadow-lg)] py-2 text-sm text-[var(--text-primary)]"
                role="menu"
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--control-hover)] transition-colors"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Popup */}
      {showNotification && notificationMessage && (
        <NotificationPopup
          message={notificationMessage}
          visible={showNotification}
          onDismiss={onNotificationDismiss}
          anchorElement={notificationButtonRef.current}
        />
      )}
    </div>
  );
}
