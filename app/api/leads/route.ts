/**
 * @file app/api/leads/route.ts
 * @description API routes for lead management
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Lead, ApiResponse, PaginatedResponse } from '@/types';

// Mock data for demonstration
const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    firstName: 'Faisal',
    lastName: 'Al-Nuaimi',
    email: 'faisal@harbortech.ae',
    phone: '+971 50 321 4567',
    company: 'Harbor Tech Solutions LLC',
    title: 'Director',
    location: 'Dubai',
    sector: 'Technology',
    network: 'DIFC FinTech Circle',
    status: 'engaged',
    source: 'signal',
    assignedRmId: 'rm-1',
    leadScore: 92,
    signals: [],
    lastContacted: new Date('2024-12-14'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'lead-2',
    firstName: 'Aisha',
    lastName: 'Al-Farsi',
    email: 'aisha@amanahcapital.ae',
    phone: '+971 50 678 9012',
    company: 'Amanah Capital Holdings',
    title: 'CEO',
    location: 'Abu Dhabi',
    sector: 'Finance',
    network: 'YPO MENA',
    status: 'qualified',
    source: 'referral',
    assignedRmId: 'rm-1',
    leadScore: 87,
    signals: [],
    lastContacted: new Date('2024-12-10'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    id: 'lead-3',
    firstName: 'Hassan',
    lastName: 'Al-Rashid',
    email: 'hassan@najdgreenenergy.sa',
    phone: '+966 50 234 5678',
    company: 'Najd GreenEnergy Co',
    title: 'Founder & CEO',
    location: 'Riyadh',
    sector: 'Clean Energy',
    network: 'YPO MENA',
    status: 'contacted',
    source: 'signal',
    assignedRmId: 'rm-1',
    leadScore: 78,
    signals: [],
    lastContacted: new Date('2024-12-08'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-08'),
  },
];

/**
 * GET /api/leads - Get all leads with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rmId = searchParams.get('rmId') || 'rm-1';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter leads by RM and status
    let filteredLeads = mockLeads.filter(lead => lead.assignedRmId === rmId);
    
    if (status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }

    // Sort by lead score descending
    filteredLeads.sort((a, b) => b.leadScore - a.leadScore);

    // Paginate
    const paginatedLeads = filteredLeads.slice(offset, offset + limit);

    const response: PaginatedResponse<Lead> = {
      success: true,
      data: paginatedLeads,
      pagination: {
        total: filteredLeads.length,
        limit,
        offset,
        hasMore: offset + limit < filteredLeads.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch leads',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST /api/leads - Create a new lead
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.company) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create new lead
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      company: body.company,
      title: body.title || '',
      location: body.location || '',
      sector: body.sector || '',
      network: body.network,
      status: body.status || 'new',
      source: body.source || 'manual',
      assignedRmId: body.assignedRmId || 'rm-1',
      leadScore: body.leadScore || 0,
      signals: [],
      lastContacted: null,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, save to database
    mockLeads.push(newLead);

    const response: ApiResponse<Lead> = {
      success: true,
      data: newLead,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create lead',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
