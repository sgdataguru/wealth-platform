'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const initialized = useThemeStore((state) => state.initialized);

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
