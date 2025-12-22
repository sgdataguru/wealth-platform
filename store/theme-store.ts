import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  initialized: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  initialized: false,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
  initializeTheme: () => {
    if (get().initialized) return;

    let preferredTheme = 'light' as Theme;

    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('uhnw-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        preferredTheme = storedTheme;
      } else {
        preferredTheme = getSystemTheme();
      }
      window.localStorage.setItem('uhnw-theme', preferredTheme);
    }

    set({ theme: preferredTheme, initialized: true });
  },
}));
