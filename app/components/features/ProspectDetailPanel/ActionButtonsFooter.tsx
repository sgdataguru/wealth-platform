/**
 * @file ActionButtonsFooter.tsx
 * @description Sticky footer with CTA buttons for prospect actions
 */

'use client';

import Button from '@/app/components/ui/Button';

interface ActionButtonsFooterProps {
  onCall: () => void;
  onEmail: () => void;
  onAddNote: () => void;
  isSubmitting: boolean;
}

export default function ActionButtonsFooter({
  onCall,
  onEmail,
  onAddNote,
  isSubmitting,
}: ActionButtonsFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-[#E5E4E2] pt-4 -mx-8 px-8 -mb-8 pb-8">
      <div className="flex flex-col gap-3">
        {/* Primary Actions */}
        <Button
          variant="primary"
          size="md"
          onClick={onCall}
          disabled={isSubmitting}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        >
          Call Prospect
        </Button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onEmail}
            disabled={isSubmitting}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            Email
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onAddNote}
            disabled={isSubmitting}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}
