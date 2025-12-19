/**
 * @file hooks/useUserRole.ts
 * @description Hook for managing user role and profile (mock data for POC)
 */

'use client';

import { useState, useEffect } from 'react';
import type { UserRole, UserProfile } from '@/types';

// Mock user profiles for POC
const MOCK_RM_PROFILE: UserProfile = {
    id: 'rm-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@nuvama.com',
    role: 'rm',
    rmId: 'RM-MUM-001',
    photoUrl: undefined,
};

const MOCK_EXECUTIVE_PROFILE: UserProfile = {
    id: 'exec-001',
    name: 'Ashish Kehair',
    email: 'ashish.kehair@nuvama.com',
    role: 'executive',
    territories: ['Mumbai', 'Delhi', 'Bangalore'],
    teamIds: ['team-west', 'team-north', 'team-south'],
    photoUrl: undefined,
};

export function useUserRole() {
    // Start with RM role as default
    const [currentRole, setCurrentRole] = useState<UserRole>('rm');
    const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_RM_PROFILE);

    // Load role from localStorage on mount
    useEffect(() => {
        const savedRole = localStorage.getItem('nuvama_user_role') as UserRole;
        if (savedRole && (savedRole === 'rm' || savedRole === 'executive' || savedRole === 'admin')) {
            switchRole(savedRole);
        }
    }, []);

    const switchRole = (newRole: UserRole) => {
        setCurrentRole(newRole);

        // Update profile based on role
        if (newRole === 'rm') {
            setUserProfile(MOCK_RM_PROFILE);
        } else if (newRole === 'executive') {
            setUserProfile(MOCK_EXECUTIVE_PROFILE);
        }

        // Save to localStorage
        localStorage.setItem('nuvama_user_role', newRole);
    };

    return {
        role: currentRole,
        userProfile,
        switchRole,
        isRM: currentRole === 'rm',
        isExecutive: currentRole === 'executive',
        isAdmin: currentRole === 'admin',
    };
}
