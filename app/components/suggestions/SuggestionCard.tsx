/**
 * @file components/suggestions/SuggestionCard.tsx
 * @description Individual engagement suggestion card component
 */

'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { EngagementSuggestion, SnoozeDuration } from '@/types';
import { useSuggestionActions } from '@/hooks/useSuggestionActions';

interface SuggestionCardProps {
  suggestion: EngagementSuggestion;
  onAction?: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-50 border-red-300';
    case 'high':
      return 'bg-orange-50 border-orange-300';
    case 'medium':
      return 'bg-blue-50 border-blue-300';
    case 'low':
      return 'bg-gray-50 border-gray-300';
    default:
      return 'bg-white border-gray-200';
  }
}

function getPriorityBadgeColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function SuggestionCard({ suggestion, onAction }: SuggestionCardProps) {
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const [showOutcomeInput, setShowOutcomeInput] = useState(false);
  const [outcome, setOutcome] = useState('');
  
  const {
    isProcessing,
    markAsContacted,
    snoozeSuggestion,
    dismissSuggestion,
  } = useSuggestionActions();
  
  const handleContact = async () => {
    if (!showOutcomeInput) {
      setShowOutcomeInput(true);
      return;
    }
    
    try {
      await markAsContacted(suggestion.id, outcome || undefined);
      setShowOutcomeInput(false);
      setOutcome('');
      onAction?.();
    } catch (error) {
      console.error('Failed to mark as contacted:', error);
      alert('Failed to mark as contacted. Please try again.');
    }
  };
  
  const handleSnooze = async (duration: SnoozeDuration) => {
    try {
      await snoozeSuggestion(suggestion.id, duration);
      setShowSnoozeMenu(false);
      onAction?.();
    } catch (error) {
      console.error('Failed to snooze:', error);
      alert('Failed to snooze suggestion. Please try again.');
    }
  };
  
  const handleDismiss = async () => {
    if (!confirm('Are you sure you want to dismiss this suggestion?')) {
      return;
    }
    
    try {
      await dismissSuggestion(suggestion.id);
      onAction?.();
    } catch (error) {
      console.error('Failed to dismiss:', error);
      alert('Failed to dismiss suggestion. Please try again.');
    }
  };
  
  // Don't show dismissed or contacted suggestions
  if (suggestion.status === 'dismissed' || suggestion.status === 'contacted') {
    return null;
  }
  
  const priorityColor = getPriorityColor(suggestion.priority);
  const priorityBadgeColor = getPriorityBadgeColor(suggestion.priority);
  
  return (
    <div className={`border-2 rounded-lg ${priorityColor} relative`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${priorityBadgeColor}`}
            >
              {suggestion.status === 'new' ? '🔔 NEW' : suggestion.priority}
            </span>
            <span className="text-sm text-[#8E99A4]">
              {formatTimeAgo(suggestion.generatedAt)}
            </span>
          </div>
          
          <button
            onClick={handleDismiss}
            disabled={isProcessing}
            className="text-[#8E99A4] hover:text-[#1A1A2E] transition-colors"
            aria-label="Dismiss suggestion"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-3">
          {suggestion.title}
        </h3>
        
        {/* Client Info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-[#5A6C7D]">
          <span className="font-medium">{suggestion.client.company}</span>
          <span>•</span>
          <span>Lead Score: {suggestion.client.leadScore}</span>
          <span>•</span>
          <span>
            ₹{(suggestion.client.estimatedWealth / 10000000).toFixed(0)}Cr
          </span>
        </div>
        
        {/* Context */}
        <p className="text-[#1A1A2E] mb-4 leading-relaxed">
          {suggestion.context}
        </p>
        
        {/* Recommended Action */}
        <div className="bg-white border border-[#C9A227] rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
                Suggested Action:
              </p>
              <p className="text-sm text-[#5A6C7D]">
                {suggestion.recommendedAction}
              </p>
            </div>
          </div>
        </div>
        
        {/* Outcome Input (conditional) */}
        {showOutcomeInput && (
          <div className="mb-4">
            <label
              htmlFor={`outcome-${suggestion.id}`}
              className="block text-sm font-medium text-[#1A1A2E] mb-2"
            >
              Outcome Notes (optional):
            </label>
            <textarea
              id={`outcome-${suggestion.id}`}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              rows={3}
              placeholder="E.g., Called and scheduled meeting for next week"
            />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleContact}
            disabled={isProcessing}
          >
            {showOutcomeInput ? 'Confirm Contacted' : 'Mark as Contacted'}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.href = `/prospects/${suggestion.clientId}`}
          >
            View Full Profile
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
              disabled={isProcessing}
            >
              Snooze
            </Button>
            
            {showSnoozeMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => handleSnooze('1d')}
                  className="w-full text-left px-4 py-2 hover:bg-[#F8F9FA] text-sm text-[#1A1A2E]"
                >
                  1 day
                </button>
                <button
                  onClick={() => handleSnooze('3d')}
                  className="w-full text-left px-4 py-2 hover:bg-[#F8F9FA] text-sm text-[#1A1A2E]"
                >
                  3 days
                </button>
                <button
                  onClick={() => handleSnooze('7d')}
                  className="w-full text-left px-4 py-2 hover:bg-[#F8F9FA] text-sm text-[#1A1A2E]"
                >
                  7 days
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
