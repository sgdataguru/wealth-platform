/**
 * @file app/(dashboard)/rm/components/AlertCard.tsx
 * @description Individual alert card for critical and warning alerts
 */

'use client';

import { useState } from 'react';
import type { Alert } from '@/types/dashboard.types';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
}

export default function AlertCard({ alert, onDismiss, onAcknowledge }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      titleColor: 'text-red-900',
      badge: 'bg-red-600 text-white',
      icon: '🔴',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      titleColor: 'text-amber-900',
      badge: 'bg-amber-600 text-white',
      icon: '🟡',
    },
  };

  const config = severityConfig[alert.severity];

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(alert.id);
    }
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge(alert.id);
    }
  };

  const getDaysUntilDue = () => {
    if (!alert.dueDate) return null;
    const now = new Date();
    const due = new Date(alert.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div
      className={`rounded-lg border-l-4 ${config.border} ${config.bg} shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{config.icon}</span>
            <div className="flex-1">
              <h3 className={`font-bold text-sm ${config.titleColor}`}>
                {alert.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {alert.clientName}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${config.badge} whitespace-nowrap`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {alert.details}
          </p>
        </div>

        {/* Action Required */}
        <div className={`p-2 rounded ${alert.severity === 'critical' ? 'bg-red-100' : 'bg-amber-100'} mb-3`}>
          <p className="text-xs font-semibold text-gray-800 mb-1">
            Action Required
          </p>
          <p className="text-xs text-gray-700">
            {alert.actionRequired}
          </p>
        </div>

        {/* Due Date */}
        {daysUntilDue !== null && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="text-gray-600">Due:</span>
            <span className={`font-semibold ${
              daysUntilDue <= 1 ? 'text-red-600' :
              daysUntilDue <= 3 ? 'text-amber-600' :
              'text-gray-700'
            }`}>
              {daysUntilDue === 0 ? 'Today' :
               daysUntilDue === 1 ? 'Tomorrow' :
               daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
               `in ${daysUntilDue} days`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!alert.isAcknowledged && (
            <button
              onClick={handleAcknowledge}
              className="flex-1 px-3 py-1.5 bg-[#1A1332] text-white text-xs font-semibold rounded hover:bg-[#2A2447] transition-colors"
            >
              Acknowledge
            </button>
          )}
          {alert.isAcknowledged && (
            <span className="flex-1 text-center px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
              ✓ Acknowledged
            </span>
          )}
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 bg-white text-gray-700 text-xs font-semibold rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Created: {new Date(alert.createdAt).toLocaleString('en-AE')}
            </p>
          </div>
        )}

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-center text-xs text-gray-500 hover:text-gray-700 mt-2"
        >
          {isExpanded ? '▲ Show less' : '▼ Show more'}
        </button>
      </div>
    </div>
  );
}
