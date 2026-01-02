/**
 * @file ComplianceTermsLibrary.tsx  
 * @description Library of compliance terms with search and filtering
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { mockComplianceTerms } from '@/lib/mock-data/compliance-mock-data';
import type { ComplianceTerm, Jurisdiction, ComplianceCategory } from '@/types/compliance.types';

export default function ComplianceTermsLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory | 'ALL'>('ALL');

  const filteredTerms = mockComplianceTerms.filter((term) => {
    const matchesSearch = term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = selectedJurisdiction === 'ALL' || term.jurisdiction === selectedJurisdiction;
    const matchesCategory = selectedCategory === 'ALL' || term.category === selectedCategory;
    return matchesSearch && matchesJurisdiction && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Jurisdiction</label>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value as Jurisdiction | 'ALL')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="SAUDI_ARABIA">Saudi Arabia</option>
              <option value="UAE">UAE</option>
              <option value="KUWAIT">Kuwait</option>
              <option value="QATAR">Qatar</option>
              <option value="BAHRAIN">Bahrain</option>
              <option value="OMAN">Oman</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ComplianceCategory | 'ALL')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All Categories</option>
              <option value="AML">AML</option>
              <option value="KYC">KYC</option>
              <option value="CROSS_BORDER">Cross-Border</option>
              <option value="SHARIAH">Shariah</option>
              <option value="REPORTING">Reporting</option>
              <option value="LICENSING">Licensing</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Terms List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTerms.map((term) => (
          <TermCard key={term.id} term={term} />
        ))}
        {filteredTerms.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No compliance terms match your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function TermCard({ term }: { term: ComplianceTerm }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityColors = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">{term.name}</h3>
            {term.mandatory && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                Mandatory
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{term.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[term.severity]}`}>
          {term.severity}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500">Jurisdiction</p>
          <p className="text-sm font-medium text-slate-900">{term.jurisdiction.replace('_', ' ')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Authority</p>
          <p className="text-sm font-medium text-slate-900">{term.authority}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Category</p>
          <p className="text-sm font-medium text-slate-900">{term.category}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Effective Date</p>
          <p className="text-sm font-medium text-slate-900">
            {new Date(term.effectiveDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div>
            <p className="text-xs text-slate-500">Version</p>
            <p className="text-sm text-slate-900">{term.version}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Documentation</p>
            <p className="text-sm text-slate-900">{term.documentationIds.length} documents</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last Updated</p>
            <p className="text-sm text-slate-900">
              {new Date(term.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-sm text-[#007B7A] hover:text-[#00B3C6] font-medium"
      >
        {isExpanded ? 'Show Less ▲' : 'Show More ▼'}
      </button>
    </Card>
  );
}
