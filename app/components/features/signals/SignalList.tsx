/**
 * @file SignalList.tsx
 * @description List component with filtering and infinite scroll for signals
 * @module components/features/signals
 */

'use client';

import { useState, useEffect } from 'react';
import SignalCard from './SignalCard';
import SignalFilters from './SignalFilters';
import type { Signal, SignalSeverity, SignalTimeline, DataSource } from '@/types';

interface SignalListProps {
  onSignalClick?: (signal: Signal) => void;
}

export default function SignalList({ onSignalClick }: SignalListProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Filter state
  const [timeline, setTimeline] = useState<SignalTimeline | 'all'>('all');
  const [priority, setPriority] = useState<SignalSeverity[]>([]);
  const [source, setSource] = useState<DataSource[]>([]);

  // Fetch signals
  const fetchSignals = async (append = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '20',
        offset: append ? offset.toString() : '0',
      });

      if (timeline !== 'all') params.append('timeline', timeline);
      if (priority.length > 0) params.append('priority', priority.join(','));
      if (source.length > 0) params.append('source', source.join(','));

      const response = await fetch(`/api/signals?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setSignals(prev => [...prev, ...data.data]);
        } else {
          setSignals(data.data);
          setOffset(0);
        }
        setHasMore(data.pagination.hasMore);
        setOffset(prev => append ? prev + data.data.length : data.data.length);
      } else {
        setError(data.error?.message || 'Failed to fetch signals');
      }
    } catch (err) {
      console.error('Error fetching signals:', err);
      setError('Failed to fetch signals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch signals on mount and when filters change
  useEffect(() => {
    fetchSignals(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, priority, source]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/signals/${id}/read`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (data.success) {
        setSignals(prev =>
          prev.map(signal =>
            signal.id === id ? { ...signal, isRead: true } : signal
          )
        );
      }
    } catch (err) {
      console.error('Error marking signal as read:', err);
    }
  };

  const handleMarkAsActioned = async (id: string) => {
    try {
      const response = await fetch(`/api/signals/${id}/action`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (data.success) {
        setSignals(prev =>
          prev.map(signal =>
            signal.id === id ? { ...signal, isActioned: true } : signal
          )
        );
      }
    } catch (err) {
      console.error('Error marking signal as actioned:', err);
    }
  };

  const handleClearFilters = () => {
    setTimeline('all');
    setPriority([]);
    setSource([]);
  };

  const handleLoadMore = () => {
    fetchSignals(true);
  };

  return (
    <div>
      <SignalFilters
        timeline={timeline}
        priority={priority}
        source={source}
        onTimelineChange={setTimeline}
        onPriorityChange={setPriority}
        onSourceChange={setSource}
        onClearFilters={handleClearFilters}
      />

      {/* Signals count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#5A6C7D]">
          {loading && signals.length === 0
            ? 'Loading signals...'
            : `Showing ${signals.length} signal${signals.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#F8D7DA] border border-[#DC3545] text-[#721C24] px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Signals list */}
      <div className="space-y-4">
        {signals.map(signal => (
          <SignalCard
            key={signal.id}
            signal={signal}
            onClick={onSignalClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsActioned={handleMarkAsActioned}
          />
        ))}
      </div>

      {/* Empty state */}
      {!loading && signals.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
            No signals found
          </h3>
          <p className="text-[#5A6C7D] mb-4">
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-[#2A2447] text-white rounded hover:bg-[#1A1332] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load more button */}
      {hasMore && signals.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="
              px-8 py-3 bg-[#F8F9FA] text-[#1A1A2E] rounded
              hover:bg-[#EFF1F3] transition-colors font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Loading...' : 'Load More Signals'}
          </button>
        </div>
      )}
    </div>
  );
}
