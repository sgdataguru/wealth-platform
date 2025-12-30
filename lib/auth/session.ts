import type { UserProfile, UserRole } from '@/types';

export type AuthSession = {
  isAuthenticated: boolean;
  user: UserProfile;
};

const AUTH_STORAGE_KEY = 'kairos_auth';

const ROLE_ROUTES: Record<UserRole, string> = {
  rm: '/rm',
  executive: '/executive',
  admin: '/rm',
};

const isValidRole = (role: unknown): role is UserRole =>
  role === 'rm' || role === 'executive' || role === 'admin';

export const getDefaultDashboardRoute = (role: UserRole) => ROLE_ROUTES[role] ?? '/rm';

export const getStoredAuth = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.isAuthenticated || !parsed.user || !isValidRole(parsed.user.role)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const setStoredAuth = (session: AuthSession, rememberMe: boolean) => {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};
