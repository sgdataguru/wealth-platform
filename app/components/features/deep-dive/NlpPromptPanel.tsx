/**
 * @file NlpPromptPanel.tsx
 * @description Left panel with NLP text input and demo phrase selection
 * @module components/features/deep-dive
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { DEMO_PHRASES } from '@/lib/deep-dive/mock-data';
import type { DemoPhrase } from '@/types/deep-dive.types';

interface NlpPromptPanelProps {
  onPromptChange: (prompt: string) => void;
  currentPrompt: string;
}

export default function NlpPromptPanel({ onPromptChange, currentPrompt }: NlpPromptPanelProps) {
  const [selectedPhraseId, setSelectedPhraseId] = useState<string>('');

  const handlePhraseClick = (phrase: DemoPhrase) => {
    setSelectedPhraseId(phrase.id);
    onPromptChange(phrase.text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedPhraseId(''); // Clear selection when manually typing
    onPromptChange(e.target.value);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AML':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CROSS_BORDER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'KYC_GAPS':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        📝 NLP Prompt Input
      </h2>

      {/* Text Input Area */}
      <div className="mb-4">
        <label htmlFor="nlp-input" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Enter your request in natural language:
        </label>
        <textarea
          id="nlp-input"
          value={currentPrompt}
          onChange={handleTextChange}
          placeholder="e.g., Generate SAMA AML flagged transactions report for Q4 2025 as PDF"
          className="w-full h-32 p-3 border border-[var(--input-border)] rounded-lg 
            bg-[var(--input-surface)] text-[var(--text-primary)]
            focus:outline-none focus:ring-2 focus:ring-[#007B7A] focus:border-transparent
            resize-none"
          aria-label="NLP prompt input"
        />
      </div>

      {/* Demo Phrases */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
          💡 Quick Demo Phrases (GCC-Centric):
        </h3>
        <div className="space-y-2">
          {DEMO_PHRASES.map((phrase) => (
            <button
              key={phrase.id}
              onClick={() => handlePhraseClick(phrase)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                ${selectedPhraseId === phrase.id 
                  ? 'border-[#007B7A] bg-[#007B7A]/5 ring-2 ring-[#007B7A]/20' 
                  : 'border-[var(--control-border)] bg-[var(--control-surface)]'}
              `}
              aria-pressed={selectedPhraseId === phrase.id}
              aria-label={`Select demo phrase: ${phrase.text}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded border">
                  {phrase.authority}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded border ${getCategoryColor(phrase.category)}`}>
                  {phrase.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
                {phrase.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-[var(--header-border)]">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onPromptChange(currentPrompt)}
          disabled={!currentPrompt.trim()}
          aria-label="Parse and generate report"
        >
          🔍 Parse & Generate Report
        </Button>
      </div>
    </Card>
  );
}
