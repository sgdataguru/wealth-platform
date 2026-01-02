/**
 * @file LiveTransactionStream.tsx
 * @description Real-time transaction monitoring component
 * @module components/features/compliance
 */

'use client';

import { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import ComplianceStatusBadge from './ComplianceStatusBadge';
import type { MonitoredTransaction } from '@/types/compliance.types';

export default function LiveTransactionStream() {
  const [transactions, setTransactions] = useState<MonitoredTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate live transaction updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mockTransaction: MonitoredTransaction = {
        id: `txn-${Date.now()}`,
        clientId: `client-${Math.floor(Math.random() * 10)}`,
        portfolioId: `port-${Math.floor(Math.random() * 10)}`,
        transactionType: ['BUY', 'SELL', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT'][Math.floor(Math.random() * 5)] as any,
        amount: Math.floor(Math.random() * 500000) + 10000,
        currency: ['SAR', 'USD', 'AED'][Math.floor(Math.random() * 3)],
        isCrossBorder: Math.random() > 0.7,
        complianceStatus: ['COMPLIANT', 'FLAGGED', 'UNDER_REVIEW'][Math.floor(Math.random() * 3)] as any,
        flagReasons: Math.random() > 0.7 ? ['Threshold exceeded', 'High-risk client'] : [],
        clientRiskRating: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
        enhancedDueDiligence: Math.random() > 0.8,
        politicallyExposed: Math.random() > 0.9,
        transactionDate: new Date(),
        monitoredAt: new Date(),
        updatedAt: new Date(),
      };

      setTransactions((prev) => [mockTransaction, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Live Transaction Monitoring</h2>
          {isConnected && (
            <span className="flex items-center gap-2 text-xs text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="mb-2">🔄 Monitoring transactions...</p>
            <p className="text-xs">New transactions will appear here in real-time</p>
          </div>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all animate-fadeIn"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{txn.transactionType}</span>
                    {txn.isCrossBorder && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                        Cross-Border
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {txn.amount.toLocaleString()} {txn.currency}
                    </span>
                    <span>Risk: {txn.clientRiskRating}</span>
                    <span>{new Date(txn.transactionDate).toLocaleTimeString()}</span>
                  </div>
                  {txn.flagReasons.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      {txn.flagReasons.join(', ')}
                    </div>
                  )}
                </div>
                <ComplianceStatusBadge status={txn.complianceStatus} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
