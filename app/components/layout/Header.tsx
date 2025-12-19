/**
 * @file Header.tsx
 * @description Main header with search, notifications, role switcher, and user avatar
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';
import { useUserRole } from '@/app/hooks/useUserRole';
import type { UserRole } from '@/types';

interface HeaderProps {
  userName?: string;
  userInitials?: string;
}

export default function Header({ userName, userInitials }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { role, userProfile, switchRole } = useUserRole();
  const router = useRouter();

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);

    // Navigate to appropriate dashboard
    if (newRole === 'rm') {
      router.push('/rm');
    } else if (newRole === 'executive') {
      router.push('/executive');
    }
  };

  const displayName = userName || userProfile.name;
  const displayInitials = userInitials || userProfile.name.split(' ').map(n => n[0]).join('');

  return (
    <header className="h-16 bg-[#0A1628] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-white font-bold text-xl tracking-wider">
          <span className="text-[#C9A227]">UHNW</span>
        </div>

        {/* Role Badge */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A5F] hover:bg-[#2C4A6F] transition-colors"
          >
            <span className="text-xs font-medium text-[#C9A227]">
              {role === 'rm' ? 'RM' : role === 'executive' ? 'Executive' : 'Admin'}
            </span>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Role Switcher Dropdown */}
          {showRoleMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <button
                onClick={() => handleRoleSwitch('rm')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${role === 'rm' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
              >
                🎯 Relationship Manager
              </button>
              <button
                onClick={() => handleRoleSwitch('executive')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${role === 'executive' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
              >
                📊 Executive View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search prospects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E3A5F] border border-[#2C4A6F] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A227] transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9A227] rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-300 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#2C4A6F]">
          <Avatar initials={displayInitials} size="sm" />
          <div className="hidden md:block">
            <p className="text-white text-sm font-medium">{displayName}</p>
            <p className="text-gray-400 text-xs">{userProfile.role === 'rm' ? 'Relationship Manager' : 'Executive'}</p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
