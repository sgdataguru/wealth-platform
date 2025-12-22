/**
 * @file IntelligenceForm.tsx
 * @description Main form for adding manual intelligence
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { intelligenceFormSchema, type IntelligenceFormInput } from '@/lib/validators/intelligence';
import type { CreateIntelligenceResponse } from '@/types/intelligence';
import Button from '@/app/components/ui/Button';

interface IntelligenceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function IntelligenceForm({
  onSuccess,
  onCancel,
}: IntelligenceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntelligenceFormInput>({
    resolver: zodResolver(intelligenceFormSchema),
    defaultValues: {
      severity: 'high',
      expectedTimeline: '30_60_days',
      informationSource: 'client_conversation',
    },
  });

  const onSubmit = async (data: IntelligenceFormInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: CreateIntelligenceResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to add intelligence');
      }

      // Show success notification (in production, use toast)
      alert('Intelligence added successfully! Lead score updated.');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Selection */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Client / Prospect *
        </label>
        <input
          {...register('clientId')}
          type="text"
          placeholder="Enter client ID (e.g., 1, 2, 3)"
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent"
        />
        {errors.clientId && (
          <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
        )}
        <p className="mt-1 text-xs text-[#8E99A4]">
          In production, this would be a searchable dropdown
        </p>
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Event Type *
        </label>
        <div className="space-y-2">
          {[
            { value: 'ipo', label: 'IPO Filing' },
            { value: 'funding', label: 'Series Funding (A/B/C/D)' },
            { value: 'acquisition', label: 'Acquisition / M&A' },
            { value: 'merger', label: 'Merger' },
            { value: 'board', label: 'Board Change' },
            { value: 'director_change', label: 'Director Change' },
            { value: 'corporate_action', label: 'Corporate Action' },
            { value: 'margin_pledge', label: 'Margin/Pledge Activity' },
            { value: 'early_exit', label: 'Early Exit / Secondary Sale' },
          ].map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('eventType')}
                type="radio"
                value={type.value}
                className="w-4 h-4 text-[#2A2447] focus:ring-[#2A2447]"
              />
              <span className="text-sm text-[#1A1A2E]">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.eventType && (
          <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
        )}
      </div>

      {/* Event Details */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Event Details *
        </label>
        <textarea
          {...register('eventDetails')}
          rows={4}
          placeholder="Describe the liquidity event, including any relevant details..."
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent resize-none"
        />
        {errors.eventDetails && (
          <p className="mt-1 text-sm text-red-600">{errors.eventDetails.message}</p>
        )}
        <p className="mt-1 text-xs text-[#8E99A4]">
          Minimum 20 characters, maximum 1000
        </p>
      </div>

      {/* Expected Timeline */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Expected Timeline *
        </label>
        <select
          {...register('expectedTimeline')}
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent"
        >
          <option value="30_days">0-30 days</option>
          <option value="30_60_days">30-60 days</option>
          <option value="60_90_days">60-90 days</option>
          <option value="3_6_months">3-6 months</option>
          <option value="6_plus_months">6+ months</option>
        </select>
        {errors.expectedTimeline && (
          <p className="mt-1 text-sm text-red-600">{errors.expectedTimeline.message}</p>
        )}
      </div>

      {/* Estimated Amount */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Estimated Amount (optional)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-[#5A6C7D]">₹</span>
          <input
            {...register('estimatedAmount', {
              setValueAs: (v) => v === '' ? undefined : parseFloat(v),
            })}
            type="number"
            placeholder="0"
            className="w-full pl-8 pr-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent"
          />
        </div>
        {errors.estimatedAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.estimatedAmount.message}</p>
        )}
        <p className="mt-1 text-xs text-[#8E99A4]">Amount in rupees</p>
      </div>

      {/* Information Source */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Source of Information *
        </label>
        <select
          {...register('informationSource')}
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent"
        >
          <option value="client_conversation">Client Conversation</option>
          <option value="network_contact">Network Contact</option>
          <option value="industry_event">Industry Event</option>
          <option value="news_mention">News Mention</option>
          <option value="public_filing">Public Filing</option>
          <option value="other">Other</option>
        </select>
        {errors.informationSource && (
          <p className="mt-1 text-sm text-red-600">{errors.informationSource.message}</p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Additional Notes (optional)
        </label>
        <textarea
          {...register('additionalNotes')}
          rows={3}
          placeholder="Any additional context or notes..."
          className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A2447] focus:border-transparent resize-none"
        />
        {errors.additionalNotes && (
          <p className="mt-1 text-sm text-red-600">{errors.additionalNotes.message}</p>
        )}
        <p className="mt-1 text-xs text-[#8E99A4]">Maximum 500 characters</p>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
          Severity / Urgency *
        </label>
        <div className="flex gap-4">
          {[
            { value: 'critical', label: 'Critical', color: 'bg-red-500' },
            { value: 'high', label: 'High', color: 'bg-orange-500' },
            { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
            { value: 'low', label: 'Low', color: 'bg-blue-500' },
          ].map((severity) => (
            <label key={severity.value} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('severity')}
                type="radio"
                value={severity.value}
                className="w-4 h-4 text-[#2A2447] focus:ring-[#2A2447]"
              />
              <span className={`w-3 h-3 rounded-full ${severity.color}`}></span>
              <span className="text-sm text-[#1A1A2E]">{severity.label}</span>
            </label>
          ))}
        </div>
        {errors.severity && (
          <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Adding...' : 'Add Event + Score Client'}
        </Button>
      </div>
    </form>
  );
}
