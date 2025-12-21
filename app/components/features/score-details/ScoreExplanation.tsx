/**
 * @file ScoreExplanation.tsx
 * @description Display AI-generated score explanation
 */

'use client';

interface ScoreExplanationProps {
  explanation: string;
  compact?: boolean;
}

export default function ScoreExplanation({
  explanation,
  compact = false,
}: ScoreExplanationProps) {
  if (compact) {
    // Show first 2 sentences only
    const sentences = explanation.split('. ').slice(0, 2).join('. ');
    const truncated = sentences.endsWith('.') ? sentences : `${sentences}.`;
    
    return (
      <div className="text-sm text-[#5A6C7D] leading-relaxed">
        {truncated}
      </div>
    );
  }
  
  return (
    <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E85D54] flex items-center justify-center text-white">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-2">
            AI Analysis
          </h3>
          <p className="text-sm text-[#5A6C7D] leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
