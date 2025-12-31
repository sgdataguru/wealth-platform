/**
 * @file route.ts
 * @description API endpoint for filter options
 */

import { NextResponse } from 'next/server';
import type { FilterOptions } from '@/types/filter.types';

/**
 * GET /api/filters/options
 * Returns all available filter options
 */
export async function GET() {
  try {
    // Mock data - in production, this would fetch from database
    const filterOptions: FilterOptions = {
      cities: [
        'Dubai',
        'Abu Dhabi',
        'Riyadh',
        'Jeddah',
        'Doha',
        'Kuwait City',
        'Manama',
        'Muscat',
        'Sharjah',
        'Al Ain',
      ],
      sectors: [
        'Technology',
        'Finance',
        'Manufacturing',
        'Real Estate',
        'Retail',
        'Healthcare',
        'Clean Energy',
        'E-commerce',
        'Automotive',
        'Telecommunications',
      ],
      networks: [
        {
          id: 'net_001',
          name: 'TiE (The Indus Entrepreneurs)',
          description: 'Global network of entrepreneurs',
          member_count: 150,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'net_002',
          name: 'YPO (Young Presidents\' Organization)',
          description: 'Global leadership community',
          member_count: 85,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'net_003',
          name: 'EO (Entrepreneurs\' Organization)',
          description: 'High-impact entrepreneurs network',
          member_count: 120,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'net_004',
          name: 'Dubai Business Network',
          description: 'Dubai Chamber of Commerce alumni',
          member_count: 200,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'net_005',
          name: 'NASSCOM',
          description: 'IT industry association',
          member_count: 95,
          created_at: new Date('2020-01-01'),
        },
      ],
      clusters: [
        {
          id: 'cluster_001',
          name: 'Fintech Founders',
          description: 'Financial technology startup founders',
          criteria: { sector: 'fintech', role: 'founder' },
          member_count: 45,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'cluster_002',
          name: 'Second-gen Industrialists',
          description: 'Next generation of industrial families',
          criteria: { generation: 2, sector: 'manufacturing' },
          member_count: 32,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'cluster_003',
          name: 'Tech Unicorn Executives',
          description: 'Leadership from unicorn startups',
          criteria: { company_valuation: '> 1B', sector: 'technology' },
          member_count: 28,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'cluster_004',
          name: 'Real Estate Moguls',
          description: 'High net worth real estate investors',
          criteria: { sector: 'real estate', wealth: '> 100M' },
          member_count: 38,
          created_at: new Date('2020-01-01'),
        },
        {
          id: 'cluster_005',
          name: 'Serial Entrepreneurs',
          description: 'Multi-exit entrepreneurs',
          criteria: { exits: '> 2' },
          member_count: 25,
          created_at: new Date('2020-01-01'),
        },
      ],
      prospectTypes: [
        'Sovereign Wealth Fund (SWF)',
        'Pension Fund',
        'Family Office',
        'Private Equity Fund',
      ],
    };

    return NextResponse.json({
      success: true,
      data: filterOptions,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch filter options',
        },
      },
      { status: 500 }
    );
  }
}
