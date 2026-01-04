/**
 * @file app/api/suggestions/route.ts
 * @description API route for fetching engagement suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EngagementSuggestion, ApiResponse } from '@/types';
import { formatCroreAmount } from '@/lib/utils/currency';

// Mock suggestions data for demonstration
const mockSuggestions: EngagementSuggestion[] = [
  {
    id: 'sug-1',
    rmId: 'rm-1',
    clientId: '1',
    signalId: 's1',
    title: 'Ahmad Al Maktoum - IPO Filing',
    context: `Tech Innovations filed DRHP with SEBI yesterday. Ahmad (35% stake) may realize ${formatCroreAmount(298)} in 60-90 days. This represents a significant liquidity event that requires immediate attention.`,
    recommendedAction: 'Call Ahmad to discuss tax-efficient exit strategies and post-liquidity wealth management plan. Suggest meeting with tax advisor within the next 3 days.',
    priority: 'critical',
    category: 'liquidity_event',
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    client: {
      id: '1',
      name: 'Ahmad Al Maktoum',
      company: 'Tech Innovations Pvt Ltd',
      estimatedWealth: 29800000000, // ₹298Cr
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
    title: 'Layla Al-Mazrouei - Series C Funding Announced',
    context: `FinServ Holdings raised ${formatCroreAmount(350)} Series C led by Sequoia Capital. Layla is Founder/CEO and likely to see significant stake dilution but increased company valuation.`,
    recommendedAction: 'Congratulate Layla on the funding and explore opportunities for diversifying wealth beyond the company. Schedule a portfolio review within 2 weeks.',
    priority: 'high',
    category: 'relationship_opportunity',
    generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    client: {
      id: '2',
      name: 'Anita Patel',
      company: 'FinServ Holdings Ltd',
      estimatedWealth: 15000000000, // ₹150Cr
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
    title: 'Vikram Rao - Board Change Detected',
    context: 'Manufacturing Solutions appointed 3 new independent directors. Vikram Rao is promoter. This could signal preparation for PE investment or IPO in next 6-12 months.',
    recommendedAction: 'Reach out to Vikram to understand board changes and discuss long-term wealth planning. Good opportunity to position our services for upcoming liquidity event.',
    priority: 'medium',
    category: 'liquidity_event',
    generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    client: {
      id: '3',
      name: 'Vikram Rao',
      company: 'Manufacturing Solutions Ltd',
      estimatedWealth: 8500000000, // ₹85Cr
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
