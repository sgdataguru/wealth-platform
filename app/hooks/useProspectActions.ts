/**
 * @file useProspectActions.ts
 * @description Hook for handling prospect action buttons (call, email, note, etc.)
 */

'use client';

import { useState, useCallback } from 'react';
import type { Prospect } from '@/types';

export function useProspectActions(prospect?: Prospect | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCall = useCallback(async () => {
    if (!prospect) return;

    try {
      setIsSubmitting(true);

      // Log the action (in production, this would call an API)
      console.log('Logging call action for:', prospect.id);

      // On mobile, open phone dialer
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        window.location.href = `tel:${prospect.phone}`;
      } else {
        // On desktop, just log and show notification
        alert(`Call logged for ${prospect.firstName} ${prospect.lastName}`);
      }
    } catch (error) {
      console.error('Failed to log call:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [prospect]);

  const handleEmail = useCallback(async () => {
    if (!prospect) return;

    try {
      setIsSubmitting(true);

      // Log the action
      console.log('Logging email action for:', prospect.id);

      // Open email client
      if (typeof window !== 'undefined') {
        window.location.href = `mailto:${prospect.email}?subject=Follow-up with ${prospect.firstName}`;
      }
    } catch (error) {
      console.error('Failed to log email:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [prospect]);

  const handleAddNote = useCallback(async (note: string) => {
    if (!prospect || !note.trim()) return;

    try {
      setIsSubmitting(true);

      // In production, this would call an API endpoint
      console.log('Adding note for:', prospect.id, note);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      alert('Note added successfully');
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [prospect]);

  const handleScheduleFollowUp = useCallback(async (date: Date, type: string) => {
    if (!prospect) return;

    try {
      setIsSubmitting(true);

      // In production, this would call an API endpoint
      console.log('Scheduling follow-up for:', prospect.id, date, type);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`Follow-up scheduled for ${date.toLocaleDateString()}`);
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [prospect]);

  // Generic action creator for any prospect
  const createAction = useCallback(async (
    prospectId: string,
    actionData: { actionType: string; description: string }
  ): Promise<boolean> => {
    try {
      setIsCreating(true);

      // In production, this would call the API endpoint
      const response = await fetch(`/api/prospects/${prospectId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create action');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to create action:', error);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    handleCall,
    handleEmail,
    handleAddNote,
    handleScheduleFollowUp,
    createAction,
    isSubmitting,
    isCreating,
  };
}
