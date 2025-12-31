/**
 * @file hooks/useUserRole.ts
 * @description Hook for managing user role and profile (mock data for POC)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStoredAuth } from '@/lib/auth/session';
import type { UserRole, UserProfile } from '@/types';

// Mock user profiles for POC
const MOCK_RM_PROFILE: UserProfile = {
    id: 'rm-001',
    name: 'Rajesh Kumar',
    email: 'rm_user@kairoscapital.mu',
    role: 'rm',
    rmId: 'RM-MUM-001',
    photoUrl: undefined,
};

const MOCK_EXECUTIVE_PROFILE: UserProfile = {
    id: 'exec-001',
    name: 'Amit Saxena',
    email: 'exec_user@kairoscapital.mu',
    role: 'executive',
    territories: ['Dubai', 'Abu Dhabi', 'Riyadh'],
    teamIds: ['team-west', 'team-north', 'team-south'],
    photoUrl: undefined,
};

export function useUserRole() {
    const [currentRole, setCurrentRole] = useState<UserRole>('rm');
    const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_RM_PROFILE);

    useEffect(() => {
        const session = getStoredAuth();
        if (session?.user) {
            setCurrentRole(session.user.role);
            setUserProfile(session.user);
            return;
        }
        setCurrentRole('rm');
        setUserProfile(MOCK_RM_PROFILE);
    }, []);

    const switchRole = useCallback((newRole: UserRole) => {
        setCurrentRole(newRole);

        if (newRole === 'rm') {
            setUserProfile(MOCK_RM_PROFILE);
        } else if (newRole === 'executive') {
            setUserProfile(MOCK_EXECUTIVE_PROFILE);
        }
    }, []);

    return {
        role: currentRole,
        userProfile,
        switchRole,
        isRM: currentRole === 'rm',
        isExecutive: currentRole === 'executive',
        isAdmin: currentRole === 'admin',
    };
}
