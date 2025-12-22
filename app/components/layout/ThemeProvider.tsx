'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, initializeTheme, initialized } = useThemeStore((state) => ({
    theme: state.theme,
    initializeTheme: state.initializeTheme,
    initialized: state.initialized,
  }));

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;

    window.localStorage.setItem('uhnw-theme', theme);

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [initialized, theme]);

  return <>{children}</>;
}
