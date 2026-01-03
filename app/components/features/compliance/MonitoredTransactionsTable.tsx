/**
 * @file MonitoredTransactionsTable.tsx
 * @description Table component for displaying monitored transactions
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import ComplianceStatusBadge from './ComplianceStatusBadge';
import { mockMonitoredTransactions } from '@/lib/mock-data/compliance-mock-data';

export default function MonitoredTransactionsTable() {
  const transactions = mockMonitoredTransactions;
  const [isRechecking, setIsRechecking] = useState(false);
  const [lastRecheckTime, setLastRecheckTime] = useState<Date | null>(null);

  const handleRecheck = async () => {
    setIsRechecking(true);
    // Simulate recheck process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRechecking(false);
    setLastRecheckTime(new Date());
    alert('Compliance re-check completed!\n\nAll transactions have been re-evaluated against latest rules.');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Monitored Transactions</h2>
          {lastRecheckTime && (
            <p className="text-xs text-slate-500 mt-1">
              Last re-check: {lastRecheckTime.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleRecheck} disabled={isRechecking}>
            {isRechecking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Re-checking...
              </>
            ) : (
              <>
                🔄 Re-check All
              </>
            )}
          </Button>
          <Button size="sm" variant="secondary">Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date/Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Risk</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Flags</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm text-slate-900">
                  {new Date(txn.transactionDate).toLocaleDateString()}
                  <br />
                  <span className="text-xs text-slate-500">
                    {new Date(txn.transactionDate).toLocaleTimeString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{txn.transactionType}</span>
                    {txn.isCrossBorder && (
                      <span className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <span>🌍</span> Cross-Border
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {txn.amount.toLocaleString()} {txn.currency}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <ComplianceStatusBadge status={txn.complianceStatus} size="sm" />
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    txn.clientRiskRating === 'HIGH' ? 'bg-red-100 text-red-700' :
                    txn.clientRiskRating === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {txn.clientRiskRating}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {txn.flagReasons.length > 0 ? (
                    <div className="space-y-1">
                      {txn.flagReasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="text-xs text-red-600">• {reason}</div>
                      ))}
                      {txn.flagReasons.length > 2 && (
                        <div className="text-xs text-slate-500">+{txn.flagReasons.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">None</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost">View</Button>
                    {txn.complianceStatus === 'FLAGGED' && (
                      <Button size="sm" variant="secondary">Review</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
