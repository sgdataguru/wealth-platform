/**
 * @file ShariahDriftAlert.tsx
 * @description Alert component for Shariah compliance portfolio drift
 * @module components/features/shariah
 */

'use client';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import type { ShariahDriftAlert as ShariahDriftAlertType } from '@/types/compliance.types';

interface ShariahDriftAlertProps {
  alert: ShariahDriftAlertType;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string, notes: string) => void;
}

export default function ShariahDriftAlert({ alert, onAcknowledge, onResolve }: ShariahDriftAlertProps) {
  const severityColors = {
    HIGH: 'bg-red-50 border-red-500',
    MEDIUM: 'bg-amber-50 border-amber-500',
    LOW: 'bg-blue-50 border-blue-500',
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700',
    ACKNOWLEDGED: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className={`p-6 border-l-4 ${severityColors[alert.severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">Shariah Compliance Alert</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[alert.status]}`}>
              {alert.status}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {alert.alertType === 'NEW_NON_COMPLIANT' && 'Non-compliant holdings detected'}
            {alert.alertType === 'STATUS_CHANGED' && 'Compliance status changed'}
            {alert.alertType === 'CERTIFICATION_EXPIRED' && 'Shariah certification expired'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          alert.severity === 'HIGH' ? 'bg-red-600' :
          alert.severity === 'MEDIUM' ? 'bg-amber-600' :
          'bg-blue-600'
        } text-white`}>
          {alert.severity}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Affected Holdings:</p>
          <div className="space-y-2">
            {alert.affectedHoldings.map((holding, index) => (
              <div key={index} className="p-3 bg-white rounded border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-slate-900">{holding.productName}</p>
                  <p className="text-sm text-slate-600">{holding.holdingPercentage.toFixed(1)}%</p>
                </div>
                <p className="text-sm text-slate-600">
                  Value: ${holding.holdingValue.toLocaleString()}
                </p>
                <p className="text-xs text-red-600 mt-1">{holding.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {alert.status === 'ACKNOWLEDGED' && alert.acknowledgedBy && (
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm text-slate-700">
              <strong>Acknowledged by:</strong> {alert.acknowledgedBy}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {new Date(alert.acknowledgedAt!).toLocaleString()}
            </p>
          </div>
        )}

        {alert.status === 'RESOLVED' && alert.resolutionNotes && (
          <div className="p-3 bg-emerald-50 rounded">
            <p className="text-sm font-medium text-slate-900 mb-1">Resolution Notes:</p>
            <p className="text-sm text-slate-700">{alert.resolutionNotes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {alert.status === 'PENDING' && (
            <>
              <Button size="sm" onClick={() => onAcknowledge?.(alert.id)}>
                Acknowledge
              </Button>
              <Button size="sm" variant="secondary">
                View Portfolio
              </Button>
            </>
          )}
          {alert.status === 'ACKNOWLEDGED' && (
            <>
              <Button size="sm" onClick={() => onResolve?.(alert.id, 'Resolved')}>
                Mark Resolved
              </Button>
              <Button size="sm" variant="secondary">
                Add Notes
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
