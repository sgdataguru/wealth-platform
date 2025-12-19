/**
 * @file components/suggestions/SuggestionsSection.tsx
 * @description Dashboard section for displaying engagement suggestions
 */

'use client';

import { useSuggestions } from '@/hooks/useSuggestions';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SuggestionCard from './SuggestionCard';

interface SuggestionsSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function SuggestionsSection({
  limit = 3,
  showViewAll = true,
}: SuggestionsSectionProps) {
  const { suggestions, isLoading, error, refetch } = useSuggestions({
    filters: { status: ['new', 'viewed'] },
    autoFetch: true,
  });
  
  // Filter to show only active suggestions
  const activeSuggestions = suggestions
    .filter((s) => s.status !== 'dismissed' && s.status !== 'contacted')
    .slice(0, limit);
  
  const newCount = suggestions.filter((s) => s.status === 'new').length;
  
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Engagement Suggestions
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A5F]" />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Engagement Suggestions
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-[#5A6C7D] mb-4">Failed to load suggestions</p>
          <Button variant="secondary" size="sm" onClick={refetch}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }
  
  if (activeSuggestions.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Engagement Suggestions
          </h2>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-[#5A6C7D] mb-2">All caught up!</p>
          <p className="text-sm text-[#8E99A4]">
            No new engagement suggestions at the moment
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Engagement Suggestions
          </h2>
          {newCount > 0 && (
            <span className="px-3 py-1 bg-[#C9A227] text-white text-xs font-semibold rounded-full">
              {newCount} New
            </span>
          )}
        </div>
        {showViewAll && activeSuggestions.length > 0 && (
          <a
            href="/suggestions"
            className="text-sm text-[#1E3A5F] hover:text-[#C9A227] font-medium transition-colors"
          >
            View All ({suggestions.length})
          </a>
        )}
      </div>
      
      <div className="space-y-6">
        {activeSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAction={refetch}
          />
        ))}
      </div>
    </Card>
  );
}
