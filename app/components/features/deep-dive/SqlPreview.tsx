/**
 * @file SqlPreview.tsx
 * @description Display generated SQL query preview
 * @module components/features/deep-dive
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface SqlPreviewProps {
  sqlQuery: string | null;
}

export default function SqlPreview({ sqlQuery }: SqlPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!sqlQuery) return;
    
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!sqlQuery) {
    return (
      <Card className="h-full">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          💾 SQL Query Preview
        </h2>
        <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
          <p>SQL query will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          💾 SQL Query Preview
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy SQL to clipboard'}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </Button>
      </div>

      {/* SQL Display */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-[#0A1628] rounded-lg p-4 border border-[#007B7A]/20">
          <pre 
            className="text-sm text-green-400 font-mono leading-relaxed overflow-x-auto"
            aria-label="SQL query"
          >
            <code>{sqlQuery}</code>
          </pre>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-[var(--header-border)]">
        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
          <span>ℹ️</span>
          <span>This SQL is auto-generated for demo purposes and does not execute against a real database.</span>
        </p>
      </div>
    </Card>
  );
}
