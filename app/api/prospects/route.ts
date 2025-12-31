/**
 * @file app/api/prospects/route.ts
 * @description API route for fetching top prospects
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ProspectsResponse, Prospect, SignalType } from '@/types';

// Mock prospect data - in production, this would come from database
const mockProspects: Prospect[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    initials: 'RK',
    title: 'Director',
    company: 'Tech Innovations DMCC',
    location: 'Dubai',
    sector: 'Technology',
    network: 'TiE',
    email: 'rajesh@techinnovations.ae',
    phone: '+971 50 123 4567',
    leadScore: 92,
    scoreCategory: 'excellent',
    scoreBreakdown: [
      { label: 'IPO Filing', points: 40, description: 'Company filed DRHP' },
      { label: 'Series C Funding', points: 30, description: 'Raised $50M from Sequoia' },
      { label: 'Network Strength', points: 15, description: '12 UHNW connections' },
      { label: 'Sector Growth', points: 7, description: '24% YoY growth' },
    ],
    signals: [
      {
        id: 's1',
        type: 'ipo',
        severity: 'critical',
        title: 'IPO Filing',
        description: 'Filed DRHP with SEBI',
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
    location: 'Abu Dhabi',
    sector: 'Finance',
    network: 'YPO',
    email: 'anita@finservholdings.com',
    phone: '+91 98765 43211',
    leadScore: 87,
    scoreCategory: 'good',
    scoreBreakdown: [
      { label: 'Acquisition Talks', points: 35, description: 'In talks with PE firms' },
      { label: 'Revenue Growth', points: 25, description: '35% YoY' },
      { label: 'Network Strength', points: 20, description: '8 UHNW connections' },
      { label: 'Market Position', points: 7, description: 'Top 10 in sector' },
    ],
    signals: [
      {
        id: 's4',
        type: 'acquisition',
        severity: 'high',
        title: 'Acquisition Talks',
        description: 'PE firm discussions',
        source: 'VCCircle',
        createdAt: new Date('2024-12-12'),
        isActioned: false,
        confidence: 0.85,
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
    location: 'Riyadh',
    sector: 'Clean Energy',
    network: 'EO',
    email: 'vikram@greenenergy.com',
    phone: '+91 98765 43212',
    leadScore: 82,
    scoreCategory: 'good',
    scoreBreakdown: [
      { label: 'Government Contract', points: 32, description: 'Won $100M contract' },
      { label: 'Funding Round', points: 28, description: 'Series B at $30M' },
      { label: 'Market Potential', points: 15, description: 'High growth sector' },
      { label: 'Network', points: 7, description: '5 UHNW connections' },
    ],
    signals: [
      {
        id: 's6',
        type: 'funding',
        severity: 'medium',
        title: 'Series B Funding',
        description: 'Raised $30M in Series B',
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
    company: 'Retail Dynamics Gulf',
    location: 'Dubai',
    sector: 'Retail',
    network: 'TiE',
    email: 'priya@retaildynamics.com',
    phone: '+91 98765 43213',
    leadScore: 78,
    scoreCategory: 'good',
    scoreBreakdown: [
      { label: 'Expansion Plans', points: 30, description: 'Opening 50 new stores' },
      { label: 'Profitability', points: 25, description: 'First profitable quarter' },
      { label: 'Network', points: 18, description: '7 UHNW connections' },
      { label: 'Market Share', points: 5, description: 'Gained 3% market share' },
    ],
    signals: [
      {
        id: 's7',
        type: 'corporate_action',
        severity: 'medium',
        title: 'Expansion Announcement',
        description: 'Announced aggressive expansion',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-08'),
        isActioned: false,
        confidence: 0.8,
      },
    ],
    lastContacted: new Date('2024-12-05'),
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    id: '5',
    firstName: 'Arjun',
    lastName: 'Mehta',
    initials: 'AM',
    title: 'Co-founder',
    company: 'HealthTech Ventures',
    location: 'Pune',
    sector: 'Healthcare',
    network: 'EO',
    email: 'arjun@healthtech.com',
    phone: '+91 98765 43214',
    leadScore: 75,
    scoreCategory: 'good',
    scoreBreakdown: [
      { label: 'Strategic Partnership', points: 28, description: 'Partnered with hospital chain' },
      { label: 'Growth Rate', points: 22, description: '45% YoY growth' },
      { label: 'Network', points: 18, description: '6 UHNW connections' },
      { label: 'Innovation', points: 7, description: 'Launched new product' },
    ],
    signals: [
      {
        id: 's8',
        type: 'merger',
        severity: 'high',
        title: 'Merger Discussions',
        description: 'In talks for strategic merger',
        source: 'VCCircle',
        createdAt: new Date('2024-12-01'),
        isActioned: false,
        confidence: 0.75,
      },
    ],
    lastContacted: null,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-12-01'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const signalTypes = searchParams.get('signalTypes')?.split(',') as SignalType[] | undefined;
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined;
    const maxScore = searchParams.get('maxScore') ? parseInt(searchParams.get('maxScore')!) : undefined;
    const cities = searchParams.get('cities')?.split(',');
    const sectors = searchParams.get('sectors')?.split(',');
    
    // Filter prospects
    let filteredProspects = [...mockProspects];
    
    // Filter by signal types
    if (signalTypes && signalTypes.length > 0) {
      filteredProspects = filteredProspects.filter(prospect =>
        prospect.signals.some(signal => signalTypes.includes(signal.type))
      );
    }
    
    // Filter by score range
    if (minScore !== undefined) {
      filteredProspects = filteredProspects.filter(p => p.leadScore >= minScore);
    }
    if (maxScore !== undefined) {
      filteredProspects = filteredProspects.filter(p => p.leadScore <= maxScore);
    }
    
    // Filter by cities
    if (cities && cities.length > 0) {
      filteredProspects = filteredProspects.filter(p => cities.includes(p.location));
    }
    
    // Filter by sectors
    if (sectors && sectors.length > 0) {
      filteredProspects = filteredProspects.filter(p => sectors.includes(p.sector));
    }
    
    // Sort by lead score (descending)
    filteredProspects.sort((a, b) => b.leadScore - a.leadScore);
    
    // Pagination
    const total = filteredProspects.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProspects = filteredProspects.slice(start, end);
    const hasMore = end < total;
    
    const response: ProspectsResponse = {
      success: true,
      data: {
        prospects: paginatedProspects,
        metadata: {
          total,
          page,
          pageSize,
          hasMore,
          lastUpdated: new Date().toISOString(),
        },
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching prospects:', error);
    
    const errorResponse: ProspectsResponse = {
      success: false,
      data: {
        prospects: [],
        metadata: {
          total: 0,
          page: 1,
          pageSize: 20,
          hasMore: false,
          lastUpdated: new Date().toISOString(),
        },
      },
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch prospects',
      },
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
