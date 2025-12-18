/**
 * @file app/api/signals/recent/route.ts
 * @description API route for fetching recent signals (last 24 hours)
 */

import { NextResponse } from 'next/server';
import type { Signal, ApiResponse } from '@/types';

// Mock data - reusing the same signals from the main route
const mockSignals: Signal[] = [
  {
    id: 's1',
    type: 'ipo',
    severity: 'critical',
    title: 'IPO Filing Detected',
    description: 'Tech Innovations Pvt Ltd filed DRHP with SEBI',
    source: 'Exchange Data',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
    description: 'FinServ Holdings in talks with PE firms',
    source: 'VCCircle',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isActioned: false,
    isRead: true,
    expectedTimeline: '60_90_days',
    prospectId: '2',
    prospectName: 'Anita Patel',
    estimatedLiquidity: 800,
    confidence: 78,
  },
];

export async function GET() {
  try {
    // Filter for signals within last 24 hours
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentSignals = mockSignals.filter(
      signal => signal.createdAt.getTime() > twentyFourHoursAgo
    );
    
    // Sort by most recent first
    recentSignals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const response: ApiResponse<Signal[]> = {
      success: true,
      data: recentSignals,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching recent signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch recent signals',
        },
      },
      { status: 500 }
    );
  }
}
