/**
 * @file ComplianceAlertPanel.tsx
 * @description Alert management panel for compliance notifications
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { mockComplianceAlerts } from '@/lib/mock-data/compliance-mock-data';
import type { ComplianceAlert } from '@/types/compliance.types';

export default function ComplianceAlertPanel() {
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | ComplianceAlert['severity']>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | ComplianceAlert['status']>('ALL');

  const filteredAlerts = mockComplianceAlerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'ALL' || alert.status === selectedStatus;
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="FALSE_POSITIVE">False Positive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => {
          const count = mockComplianceAlerts.filter((a) => a.severity === severity).length;
          const colors = {
            CRITICAL: 'bg-red-50 text-red-700 border-red-200',
            HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
            MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
            LOW: 'bg-slate-50 text-slate-700 border-slate-200',
          };
          return (
            <Card key={severity} className={`p-4 border ${colors[severity as keyof typeof colors]}`}>
              <p className="text-xs font-medium mb-1">{severity}</p>
              <p className="text-2xl font-bold">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {filteredAlerts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No alerts match your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: ComplianceAlert }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewTriggered, setReviewTriggered] = useState(false);

  const handleTriggerReview = async () => {
    setIsReviewing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsReviewing(false);
    setReviewTriggered(true);
    alert(`Review triggered for alert: ${alert.title}\nAssigned to compliance team at ${new Date().toLocaleTimeString()}`);
  };

  const severityConfig = {
    CRITICAL: { color: 'bg-red-50 border-red-500', icon: '🔴', badge: 'bg-red-600 text-white' },
    HIGH: { color: 'bg-orange-50 border-orange-500', icon: '🟠', badge: 'bg-orange-600 text-white' },
    MEDIUM: { color: 'bg-amber-50 border-amber-500', icon: '🟡', badge: 'bg-amber-600 text-white' },
    LOW: { color: 'bg-slate-50 border-slate-300', icon: '🟢', badge: 'bg-slate-600 text-white' },
  };

  const statusConfig = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    ACKNOWLEDGED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    FALSE_POSITIVE: 'bg-slate-100 text-slate-700',
  };

  const config = severityConfig[alert.severity];

  return (
    <Card className={`p-6 border-l-4 ${config.color}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{config.icon}</span>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{alert.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                {alert.severity}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[alert.status]}`}>
                {alert.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-4">
            <div>
              <span className="font-medium">Type:</span> {alert.alertType.replace(/_/g, ' ')}
            </div>
            {alert.authority && (
              <div>
                <span className="font-medium">Authority:</span> {alert.authority}
              </div>
            )}
            <div>
              <span className="font-medium">Triggered:</span>{' '}
              {new Date(alert.triggeredAt).toLocaleString()}
            </div>
            {alert.dueDate && (
              <div>
                <span className="font-medium">Due:</span>{' '}
                {new Date(alert.dueDate).toLocaleString()}
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Entity</p>
                <p className="text-sm text-slate-900">
                  {alert.relatedEntityType}: {alert.relatedEntityId}
                </p>
              </div>
              {alert.assignedTo && (
                <div>
                  <p className="text-xs text-slate-500">Assigned To</p>
                  <p className="text-sm text-slate-900">{alert.assignedTo}</p>
                </div>
              )}
              {alert.acknowledgedAt && (
                <div>
                  <p className="text-xs text-slate-500">Acknowledged At</p>
                  <p className="text-sm text-slate-900">
                    {new Date(alert.acknowledgedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {alert.resolutionNotes && (
                <div>
                  <p className="text-xs text-slate-500">Resolution Notes</p>
                  <p className="text-sm text-slate-900">{alert.resolutionNotes}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {alert.status === 'ACTIVE' && (
              <>
                <Button size="sm">Acknowledge</Button>
                <Button size="sm" variant="secondary">
                  Assign
                </Button>
              </>
            )}
            {alert.status === 'ACKNOWLEDGED' || alert.status === 'IN_PROGRESS' ? (
              <Button size="sm">Mark Resolved</Button>
            ) : null}
            <Button
              size="sm"
              variant={reviewTriggered ? 'secondary' : 'primary'}
              onClick={handleTriggerReview}
              disabled={isReviewing || reviewTriggered}
            >
              {isReviewing ? 'Triggering...' : reviewTriggered ? '✓ Review Triggered' : '🔔 Trigger Review'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
