/**
 * @file ProspectProfile.tsx
 * @description Top section of detail panel showing prospect identity and contact info
 */

'use client';

import Avatar from '@/app/components/ui/Avatar';
import type { Prospect } from '@/types';

interface ProspectProfileProps {
  prospect: Prospect;
}

export default function ProspectProfile({ prospect }: ProspectProfileProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar initials={prospect.initials} size="xl" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            {prospect.firstName} {prospect.lastName}
          </h2>
          <p className="text-base text-[#5A6C7D] mt-1">{prospect.title}</p>
          <p className="text-base text-[#5A6C7D]">{prospect.company}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <a
          href={`mailto:${prospect.email}`}
          className="flex items-center gap-2 text-sm text-[#2A2447] hover:text-[#E85D54] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {prospect.email}
        </a>
        <a
          href={`tel:${prospect.phone}`}
          className="flex items-center gap-2 text-sm text-[#2A2447] hover:text-[#E85D54] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {prospect.phone}
        </a>
      </div>

      {/* Metadata Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8F9FA] text-sm text-[#5A6C7D] rounded-full">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {prospect.location}
        </span>
        <span className="px-3 py-1 bg-[#F8F9FA] text-sm text-[#5A6C7D] rounded-full">
          {prospect.sector}
        </span>
        <span className="px-3 py-1 bg-[#F8F9FA] text-sm text-[#5A6C7D] rounded-full">
          {prospect.network}
        </span>
      </div>

      {/* Last Contacted */}
      <div className="mt-4 text-xs text-[#8E99A4]">
        Last contacted: {formatDate(prospect.lastContacted)}
      </div>
    </div>
  );
}
