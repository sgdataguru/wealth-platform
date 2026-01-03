'use client';

import { useThemeStore } from '@/store/theme-store';
import { NavigationIcons } from '@/app/components/icons';

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initialized = useThemeStore((state) => state.initialized);

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      className="relative p-3 rounded-xl border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent bg-[var(--control-surface)] border-[var(--control-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
      disabled={!initialized}
    >
      <span className="sr-only">{label}</span>
      {isDark ? (
        <NavigationIcons.Moon className="w-6 h-6" strokeWidth={1.8} />
      ) : (
        <NavigationIcons.Sun className="w-6 h-6" strokeWidth={1.8} />
      )}
    </button>
  );
}
