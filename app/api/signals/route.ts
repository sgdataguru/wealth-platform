/**
 * @file app/api/signals/route.ts
 * @description API route for listing liquidity signals
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Signal, PaginatedResponse, SignalSeverity, DataSource, SignalTimeline } from '@/types';

// Mock data for signals - in production, this would come from Supabase
const mockSignals: Signal[] = [
  {
    id: 's1',
    type: 'ipo',
    severity: 'critical',
    title: 'IPO Filing Detected',
    description: 'Tech Innovations Pvt Ltd filed DRHP with SEBI',
    source: 'Exchange Data',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    prospectId: '1',
    prospectName: 'Rajesh Kumar',
    estimatedLiquidity: 500,
    confidence: 92,
  },
  {
    id: 's2',
    type: 'funding',
    severity: 'high',
    title: 'Series C Funding Round',
    description: 'GreenEnergy Ltd raised $50M from Sequoia Capital',
    source: 'PrivateCircle',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_60_days',
    prospectId: '3',
    prospectName: 'Vikram Rao',
    estimatedLiquidity: 250,
    confidence: 85,
  },
  {
    id: 's3',
    type: 'acquisition',
    severity: 'high',
    title: 'Acquisition Discussions',
    description: 'FinServ Holdings in talks with PE firms for potential acquisition',
    source: 'VCCircle',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isActioned: false,
    isRead: true,
    expectedTimeline: '60_90_days',
    prospectId: '2',
    prospectName: 'Anita Patel',
    estimatedLiquidity: 800,
    confidence: 78,
  },
  {
    id: 's4',
    type: 'board',
    severity: 'medium',
    title: 'Board Restructuring',
    description: 'New independent director appointed at MediCare Solutions',
    source: 'Zauba Corp',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isActioned: true,
    isRead: true,
    expectedTimeline: '3_6_months',
    prospectId: '4',
    prospectName: 'Priya Sharma',
    estimatedLiquidity: 150,
    confidence: 65,
  },
  {
    id: 's5',
    type: 'funding',
    severity: 'medium',
    title: 'Series B Extension',
    description: 'EdTech Ventures secured additional $20M in Series B extension',
    source: 'PrivateCircle',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_60_days',
    prospectId: '5',
    prospectName: 'Amit Singh',
    estimatedLiquidity: 180,
    confidence: 88,
  },
  {
    id: 's6',
    type: 'merger',
    severity: 'critical',
    title: 'Merger Announcement',
    description: 'LogiTech and SupplyChain Co announcing merger next quarter',
    source: 'NewsAPI',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    prospectId: '6',
    prospectName: 'Sanjay Mehta',
    estimatedLiquidity: 1200,
    confidence: 95,
  },
  {
    id: 's7',
    type: 'corporate_action',
    severity: 'low',
    title: 'Share Buyback Program',
    description: 'RetailHub announced share buyback program worth ₹100 Cr',
    source: 'Exchange Data',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    isActioned: false,
    isRead: true,
    expectedTimeline: '60_90_days',
    prospectId: '7',
    prospectName: 'Neha Gupta',
    estimatedLiquidity: 75,
    confidence: 70,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const timeline = searchParams.get('timeline') as SignalTimeline | 'all' | null;
    const priority = searchParams.get('priority')?.split(',') as SignalSeverity[] | undefined;
    const source = searchParams.get('source')?.split(',') as DataSource[] | undefined;
    const isActioned = searchParams.get('isActioned') === 'true' ? true : 
                       searchParams.get('isActioned') === 'false' ? false : undefined;
    const sortBy = (searchParams.get('sortBy') || 'detectedAt') as 'detectedAt' | 'priority' | 'timeline';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Filter signals
    let filteredSignals = [...mockSignals];
    
    if (timeline && timeline !== 'all') {
      filteredSignals = filteredSignals.filter(s => s.expectedTimeline === timeline);
    }
    
    if (priority && priority.length > 0) {
      filteredSignals = filteredSignals.filter(s => priority.includes(s.severity));
    }
    
    if (source && source.length > 0) {
      filteredSignals = filteredSignals.filter(s => source.includes(s.source));
    }
    
    if (isActioned !== undefined) {
      filteredSignals = filteredSignals.filter(s => s.isActioned === isActioned);
    }
    
    // Sort signals
    filteredSignals.sort((a, b) => {
      if (sortBy === 'detectedAt') {
        const comparison = b.createdAt.getTime() - a.createdAt.getTime();
        return sortOrder === 'asc' ? -comparison : comparison;
      } else if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const comparison = priorityOrder[a.severity] - priorityOrder[b.severity];
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
    
    // Paginate
    const total = filteredSignals.length;
    const paginatedSignals = filteredSignals.slice(offset, offset + limit);
    
    const response: PaginatedResponse<Signal> = {
      success: true,
      data: paginatedSignals,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch signals',
        },
      },
      { status: 500 }
    );
  }
}
