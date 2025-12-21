/**
 * @file app/(dashboard)/rm/components/ImmediateActionsColumn.tsx
 * @description Critical alerts and immediate actions column
 */

'use client';

import { ColumnWrapper } from './DashboardGrid';
import AlertCard from './AlertCard';
import type { Alert } from '@/types/dashboard.types';

interface ImmediateActionsColumnProps {
  alerts: Alert[];
  isLoading?: boolean;
  onDismiss?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
}

export default function ImmediateActionsColumn({
  alerts,
  isLoading,
  onDismiss,
  onAcknowledge,
}: ImmediateActionsColumnProps) {
  // Sort alerts: critical first, then by creation date
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  if (isLoading) {
    return (
      <ColumnWrapper title="Immediate Actions" icon="🚨">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper
      title="Immediate Actions"
      icon="🚨"
      badge={criticalCount}
    >
      {sortedAlerts.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-700 font-semibold text-sm">All clear!</p>
          <p className="text-gray-500 text-xs mt-1">
            No urgent actions required at this time.
          </p>
        </div>
      ) : (
        sortedAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onDismiss={onDismiss}
            onAcknowledge={onAcknowledge}
          />
        ))
      )}
    </ColumnWrapper>
  );
}
