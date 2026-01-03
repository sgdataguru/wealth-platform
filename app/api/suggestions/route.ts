/**
 * @file app/api/suggestions/route.ts
 * @description API route for fetching engagement suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EngagementSuggestion, ApiResponse } from '@/types';

// Mock suggestions data for demonstration
const mockSuggestions: EngagementSuggestion[] = [
  {
    id: 'sug-1',
    rmId: 'rm-1',
    clientId: '1',
    signalId: 's1',
    title: 'Khalid Al-Mansouri - IPO Filing',
    context: 'GulfTech Innovations filed a prospectus with the UAE SCA yesterday. Khalid (35% stake) may realize AED 120M in 60-90 days. This represents a significant liquidity event that requires immediate attention.',
    recommendedAction: 'Call Khalid to discuss tax-efficient exit strategies and post-liquidity wealth management plan. Suggest meeting with tax advisor within the next 3 days.',
    priority: 'critical',
    category: 'liquidity_event',
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    client: {
      id: '1',
      name: 'Khalid Al-Mansouri',
      company: 'GulfTech Innovations LLC',
      estimatedWealth: 1200000000, // AED 120M
      leadScore: 92,
    },
    signal: {
      id: 's1',
      type: 'ipo',
      severity: 'critical',
      detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      timeline: '60-90 days',
    },
    status: 'new',
  },
  {
    id: 'sug-2',
    rmId: 'rm-1',
    clientId: '2',
    signalId: 's4',
    title: 'Aisha Al-Farsi - Series C Funding Announced',
    context: 'Riyadh FinServ Holdings raised AED 90M Series C led by Gulf Capital. Aisha is Founder/CEO and likely to see significant stake dilution but increased company valuation.',
    recommendedAction: 'Congratulate Aisha on the funding and explore opportunities for diversifying wealth beyond the company. Schedule a portfolio review within 2 weeks.',
    priority: 'high',
    category: 'relationship_opportunity',
    generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    client: {
      id: '2',
      name: 'Aisha Al-Farsi',
      company: 'Riyadh FinServ Holdings',
      estimatedWealth: 900000000, // AED 90M
      leadScore: 87,
    },
    signal: {
      id: 's4',
      type: 'funding',
      severity: 'high',
      detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      timeline: '30-60 days',
    },
    status: 'new',
  },
  {
    id: 'sug-3',
    rmId: 'rm-1',
    clientId: '3',
    signalId: 's5',
    title: 'Omar Al-Hassan - Board Change Detected',
    context: 'Desert Manufacturing Solutions appointed three new independent directors. Omar Al-Hassan is the promoter. This could signal preparation for PE investment or an IPO in the next 6-12 months.',
    recommendedAction: 'Reach out to Omar to understand board changes and discuss long-term wealth planning. Good opportunity to position our services for upcoming liquidity event.',
    priority: 'medium',
    category: 'liquidity_event',
    generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    client: {
      id: '3',
      name: 'Omar Al-Hassan',
      company: 'Desert Manufacturing Solutions',
      estimatedWealth: 750000000, // AED 75M
      leadScore: 75,
    },
    signal: {
      id: 's5',
      type: 'board',
      severity: 'medium',
      detectedAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
      timeline: '6+ months',
    },
    status: 'viewed',
    viewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

/**
 * GET /api/suggestions
 * Fetch engagement suggestions for RM
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');
    
    // Filter suggestions based on query params
    let filteredSuggestions = [...mockSuggestions];
    
    if (statusFilter) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.status === statusFilter
      );
    }
    
    if (priorityFilter) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.priority === priorityFilter
      );
    }
    
    // Sort by priority (critical first) and then by generated date (newest first)
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filteredSuggestions.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.generatedAt.getTime() - a.generatedAt.getTime();
    });
    
    const newCount = filteredSuggestions.filter((s) => s.status === 'new').length;
    
    const response: ApiResponse<{
      suggestions: EngagementSuggestion[];
      total: number;
      newCount: number;
    }> = {
      success: true,
      data: {
        suggestions: filteredSuggestions,
        total: filteredSuggestions.length,
        newCount,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch suggestions',
        },
      },
      { status: 500 }
    );
  }
}
