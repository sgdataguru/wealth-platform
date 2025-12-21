/**
 * @file SignalFilters.tsx
 * @description Filter controls for signals list
 * @module components/features/signals
 */

'use client';

import type { SignalSeverity, SignalTimeline, DataSource } from '@/types';

interface SignalFiltersProps {
  timeline: SignalTimeline | 'all';
  priority: SignalSeverity[];
  source: DataSource[];
  onTimelineChange: (timeline: SignalTimeline | 'all') => void;
  onPriorityChange: (priority: SignalSeverity[]) => void;
  onSourceChange: (source: DataSource[]) => void;
  onClearFilters: () => void;
}

export default function SignalFilters({
  timeline,
  priority,
  source,
  onTimelineChange,
  onPriorityChange,
  onSourceChange,
  onClearFilters,
}: SignalFiltersProps) {
  const timelineOptions: { value: SignalTimeline | 'all'; label: string }[] = [
    { value: 'all', label: 'All Signals' },
    { value: '30_days', label: '30 Days' },
    { value: '30_60_days', label: '30-60 Days' },
    { value: '60_90_days', label: '60-90 Days' },
    { value: '3_6_months', label: '3-6 Months' },
    { value: '6_plus_months', label: '6+ Months' },
  ];

  const priorityOptions: { value: SignalSeverity; label: string; color: string }[] = [
    { value: 'critical', label: 'Critical', color: 'bg-[#DC3545] text-white' },
    { value: 'high', label: 'High', color: 'bg-[#FFC107] text-[#1A1A2E]' },
    { value: 'medium', label: 'Medium', color: 'bg-[#17A2B8] text-white' },
    { value: 'low', label: 'Low', color: 'bg-[#6C757D] text-white' },
  ];

  const sourceOptions: DataSource[] = [
    'PrivateCircle',
    'Zauba Corp',
    'Exchange Data',
    'VCCircle',
    'NewsAPI',
    'Manual Intelligence',
  ];

  const togglePriority = (value: SignalSeverity) => {
    if (priority.includes(value)) {
      onPriorityChange(priority.filter(p => p !== value));
    } else {
      onPriorityChange([...priority, value]);
    }
  };

  const toggleSource = (value: DataSource) => {
    if (source.includes(value)) {
      onSourceChange(source.filter(s => s !== value));
    } else {
      onSourceChange([...source, value]);
    }
  };

  const hasActiveFilters = timeline !== 'all' || priority.length > 0 || source.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg border border-[#E1E5EB] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A2E]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#5A6C7D] hover:text-[#1A1A2E] underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Timeline Filter */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
            Timeline Window
          </label>
          <div className="flex flex-wrap gap-2">
            {timelineOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onTimelineChange(option.value)}
                className={`
                  px-4 py-2 rounded text-sm font-medium transition-colors
                  ${timeline === option.value
                    ? 'bg-[#2A2447] text-white'
                    : 'bg-[#F8F9FA] text-[#5A6C7D] hover:bg-[#EFF1F3]'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
            Priority Level
          </label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => togglePriority(option.value)}
                className={`
                  px-4 py-2 rounded text-sm font-medium transition-all
                  ${priority.includes(option.value)
                    ? option.color + ' shadow-sm'
                    : 'bg-[#F8F9FA] text-[#5A6C7D] hover:bg-[#EFF1F3]'
                  }
                `}
              >
                {priority.includes(option.value) && '✓ '}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
            Data Source
          </label>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map(option => (
              <button
                key={option}
                onClick={() => toggleSource(option)}
                className={`
                  px-4 py-2 rounded text-sm font-medium transition-colors
                  ${source.includes(option)
                    ? 'bg-[#E85D54] text-white'
                    : 'bg-[#F8F9FA] text-[#5A6C7D] hover:bg-[#EFF1F3]'
                  }
                `}
              >
                {source.includes(option) && '✓ '}
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
