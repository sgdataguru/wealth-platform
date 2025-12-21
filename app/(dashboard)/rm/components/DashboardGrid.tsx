/**
 * @file app/(dashboard)/rm/components/DashboardGrid.tsx
 * @description 4-column responsive grid layout for Morning Cockpit
 */

'use client';

import { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

export default function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {children}
    </div>
  );
}

interface ColumnWrapperProps {
  title: string;
  icon?: ReactNode;
  badge?: number;
  children: ReactNode;
}

export function ColumnWrapper({ title, icon, badge, children }: ColumnWrapperProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#E85D54]">{icon}</span>}
          <h2 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
            {title}
          </h2>
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#E85D54] text-white text-xs font-bold rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Column Content */}
      <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-400px)]">
        {children}
      </div>
    </div>
  );
}
