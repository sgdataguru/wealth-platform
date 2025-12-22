'use client';

import { useThemeStore } from '@/store/theme-store';

export default function ThemeToggle() {
  const { theme, toggleTheme, initialized } = useThemeStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    initialized: state.initialized,
  }));

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      className="relative p-3 rounded-xl border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent bg-[var(--control-surface)] border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
      disabled={!initialized}
    >
      <span className="sr-only">{label}</span>
      {isDark ? (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      ) : (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636" />
        </svg>
      )}
    </button>
  );
}
