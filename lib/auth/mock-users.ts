import type { UserProfile } from '@/types';

export type MockUser = {
  email: string;
  password: string;
  profile: UserProfile;
};

export const MOCK_USERS: MockUser[] = [
  {
    email: 'rm_user@kairoscapital.mu',
    password: 'cockpit2025',
    profile: {
      id: 'rm-001',
      name: 'Amira Al-Hashimi',
      email: 'rm_user@kairoscapital.mu',
      role: 'rm',
      rmId: 'RM-MUM-001',
      photoUrl: undefined,
    },
  },
  {
    email: 'exec_user@kairoscapital.mu',
    password: 'cockpit2025',
    profile: {
      id: 'exec-001',
      name: 'Amritan Shua Garwal',
      email: 'exec_user@kairoscapital.mu',
      role: 'executive',
      territories: ['Dubai', 'Riyadh', 'Doha'],
      teamIds: ['team-west', 'team-north', 'team-south'],
      photoUrl: undefined,
    },
  },
];
