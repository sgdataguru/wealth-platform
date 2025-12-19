/**
 * @file page.tsx
 * @description Prospects page with enhanced score display
 */

'use client';

import { Header, Sidebar } from '../components/layout';
import { EnhancedProspectCard } from '../components/features';
import type { Prospect } from '@/types';

// Mock data for demonstration
const mockProspects: Prospect[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    initials: 'RK',
    title: 'Director',
    company: 'Tech Innovations Pvt Ltd',
    location: 'Mumbai',
    sector: 'Technology',
    network: 'TiE',
    email: 'rajesh@techinnovations.com',
    phone: '+91 98765 43210',
    leadScore: 92,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's1',
        type: 'ipo',
        severity: 'critical',
        title: 'IPO Filing',
        description: 'Company filed DRHP with SEBI for public listing',
        source: 'Exchange Data',
        createdAt: new Date('2024-12-15'),
        isActioned: false,
        confidence: 0.95,
      },
      {
        id: 's2',
        type: 'funding',
        severity: 'high',
        title: 'Series C Funding',
        description: 'Raised $50M from Sequoia Capital',
        source: 'PrivateCircle',
        createdAt: new Date('2024-12-10'),
        isActioned: true,
        confidence: 0.9,
      },
      {
        id: 's3',
        type: 'board',
        severity: 'medium',
        title: 'Board Change',
        description: 'Appointed new independent director',
        source: 'Zauba Corp',
        createdAt: new Date('2024-11-28'),
        isActioned: true,
        confidence: 0.8,
      },
    ],
    lastContacted: new Date('2024-12-14'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    firstName: 'Anita',
    lastName: 'Patel',
    initials: 'AP',
    title: 'CEO',
    company: 'FinServ Holdings Ltd',
    location: 'Delhi',
    sector: 'Finance',
    network: 'YPO',
    email: 'anita@finservholdings.com',
    phone: '+91 98765 43211',
    leadScore: 87,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's4',
        type: 'acquisition',
        severity: 'high',
        title: 'Acquisition Talks',
        description: 'In advanced discussions with PE firms for acquisition',
        source: 'VCCircle',
        createdAt: new Date('2024-12-12'),
        isActioned: false,
        confidence: 0.85,
      },
      {
        id: 's5',
        type: 'corporate_action',
        severity: 'medium',
        title: 'Corporate Restructuring',
        description: 'Announced corporate restructuring plan',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-05'),
        isActioned: true,
        confidence: 0.75,
      },
    ],
    lastContacted: new Date('2024-12-10'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    id: '3',
    firstName: 'Vikram',
    lastName: 'Singh',
    initials: 'VS',
    title: 'Founder & CEO',
    company: 'GreenEnergy Solutions',
    location: 'Bangalore',
    sector: 'Clean Energy',
    network: 'EO',
    email: 'vikram@greenenergy.com',
    phone: '+91 98765 43212',
    leadScore: 72,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's6',
        type: 'funding',
        severity: 'medium',
        title: 'Series B Funding',
        description: 'Raised $30M in Series B round',
        source: 'PrivateCircle',
        createdAt: new Date('2024-11-20'),
        isActioned: false,
        confidence: 0.9,
      },
    ],
    lastContacted: new Date('2024-11-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: '4',
    firstName: 'Priya',
    lastName: 'Sharma',
    initials: 'PS',
    title: 'Managing Director',
    company: 'Retail Dynamics India',
    location: 'Mumbai',
    sector: 'Retail',
    network: 'TiE',
    email: 'priya@retaildynamics.com',
    phone: '+91 98765 43213',
    leadScore: 45,
    scoreCategory: 'fair',
    scoreBreakdown: [],
    signals: [
      {
        id: 's7',
        type: 'director_change',
        severity: 'low',
        title: 'Director Resignation',
        description: 'CFO resigned from board',
        source: 'Zauba Corp',
        createdAt: new Date('2024-10-15'),
        isActioned: true,
        confidence: 0.7,
      },
    ],
    lastContacted: null,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-15'),
  },
];

export default function ProspectsPage() {
  const handleCall = (prospect: Prospect) => {
    console.log('Calling:', prospect.firstName, prospect.lastName);
  };
  
  const handleEmail = (prospect: Prospect) => {
    console.log('Emailing:', prospect.firstName, prospect.lastName);
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="prospects" />
        
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
              My Prospects
            </h1>
            <p className="text-[#5A6C7D] mt-1">
              View and manage your prospect pipeline with enhanced lead scores
            </p>
          </div>
          
          {/* Prospects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockProspects.map((prospect) => (
              <EnhancedProspectCard
                key={prospect.id}
                prospect={prospect}
                onCall={() => handleCall(prospect)}
                onEmail={() => handleEmail(prospect)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
