/**
 * @file ClientComplianceMatrix.tsx
 * @description Matrix view of client compliance status across requirements
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { mockClientComplianceStatuses, mockComplianceTerms } from '@/lib/mock-data/compliance-mock-data';

export default function ClientComplianceMatrix() {
  const clients = mockClientComplianceStatuses;
  const terms = mockComplianceTerms;
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const handleRunCheck = async () => {
    setIsChecking(true);
    // Simulate compliance check
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsChecking(false);
    setLastCheckTime(new Date());
    alert('Compliance check completed!\n\nResults:\n- 156 clients compliant\n- 89 clients with gaps\n- 3 critical issues found');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Client Compliance Matrix</h2>
            <p className="text-sm text-slate-600">
              Overview of compliance status for all clients across key requirements
            </p>
            {lastCheckTime && (
              <p className="text-xs text-slate-500 mt-1">
                Last check: {lastCheckTime.toLocaleString()}
              </p>
            )}
          </div>
          <Button onClick={handleRunCheck} disabled={isChecking}>
            {isChecking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Check...
              </>
            ) : (
              <>
                ⚡ Run Compliance Check
              </>
            )}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left text-sm font-semibold text-slate-900 border border-slate-200 sticky left-0 bg-slate-50 z-10">
                  Client
                </th>
                <th className="p-3 text-center text-sm font-semibold text-slate-900 border border-slate-200">
                  Overall Score
                </th>
                {terms.map((term) => (
                  <th
                    key={term.id}
                    className="p-3 text-center text-xs font-medium text-slate-900 border border-slate-200 min-w-[120px]"
                  >
                    <div className="truncate" title={term.name}>
                      {term.name.substring(0, 20)}...
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.clientId} className="hover:bg-slate-50">
                  <td className="p-3 text-sm font-medium text-slate-900 border border-slate-200 sticky left-0 bg-white z-10">
                    <div>
                      <div>{client.clientName}</div>
                      <div className="text-xs text-slate-500">
                        {client.missingCount} missing
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center border border-slate-200">
                    <ScoreBadge score={client.overallScore} />
                  </td>
                  {terms.map((term) => {
                    const requirement = client.requirements.find((r) => r.termId === term.id);
                    return (
                      <td key={term.id} className="p-3 text-center border border-slate-200">
                        {requirement ? (
                          <StatusIndicator status={requirement.status} />
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <StatusIndicator status="MET" />
            <span className="text-sm text-slate-600">Met</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="PENDING" />
            <span className="text-sm text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="OVERDUE" />
            <span className="text-sm text-slate-600">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="NOT_APPLICABLE" />
            <span className="text-sm text-slate-600">Not Applicable</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700';
    if (score >= 75) return 'bg-blue-100 text-blue-700';
    if (score >= 60) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getColor()}`}>
      {score}%
    </span>
  );
}

function StatusIndicator({ status }: { status: 'MET' | 'PENDING' | 'OVERDUE' | 'NOT_APPLICABLE' }) {
  const config = {
    MET: { bg: 'bg-emerald-500', text: '✓', title: 'Met' },
    PENDING: { bg: 'bg-amber-500', text: '⏳', title: 'Pending' },
    OVERDUE: { bg: 'bg-red-500', text: '!', title: 'Overdue' },
    NOT_APPLICABLE: { bg: 'bg-slate-300', text: '—', title: 'Not Applicable' },
  };

  const { bg, text, title } = config[status];

  return (
    <div
      className={`w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center text-sm font-bold mx-auto`}
      title={title}
    >
      {text}
    </div>
  );
}
