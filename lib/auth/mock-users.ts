import type { UserProfile } from '@/types';

export type MockUser = {
  email: string;
  password: string;
  profile: UserProfile;
};

export const MOCK_USERS: MockUser[] = [
  {
    email: 'rm_user@kairoscapital.ae',
    password: 'cockpit2025',
    profile: {
      id: 'rm-001',
      name: 'Faisal Al-Nuaimi',
      email: 'rm_user@kairoscapital.ae',
      role: 'rm',
      rmId: 'RM-DXB-001',
      photoUrl: undefined,
    },
  },
  {
    email: 'exec_user@kairoscapital.ae',
    password: 'cockpit2025',
    profile: {
      id: 'exec-001',
      name: 'Omar Al-Fadl',
      email: 'exec_user@kairoscapital.ae',
      role: 'executive',
      territories: ['Dubai', 'Riyadh', 'Doha'],
      teamIds: ['team-west', 'team-north', 'team-south'],
      photoUrl: undefined,
    },
  },
];
