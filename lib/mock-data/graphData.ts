/**
 * @file lib/mock-data/graphData.ts
 * @description Mock graph data for Middle East UHNW relationship visualization
 */

import type { GraphNode, GraphEdge } from '@/types/graph';

// Mock Relationship Manager
export const mockRM: GraphNode = {
  id: 'rm-001',
  type: 'rm',
  label: 'Priya Mehta',
    properties: {
    name: 'Priya Mehta',
    email: 'priya.mehta@kairoscapital.mu',
    role: 'Relationship Manager - MENA Desk'
  }
};

// Mock People (UHNW Clients and Prospects) - Middle East focused
export const mockPeople: GraphNode[] = [
  {
    id: 'person-001',
    type: 'person',
    label: 'Sheikh Ahmed Al-Maktoum',
    properties: {
      name: 'Sheikh Ahmed Al-Maktoum',
      designation: 'Chairman & Patriarch',
      netWorth: 8500000000,
      isClient: true,
      isInfluencer: true,
      sector: 'Real Estate & Hospitality'
    },
    metadata: { clientId: 'client-001' },
    conversations: [
      {
        id: 'conv-001',
        date: '2025-12-18',
        type: 'meeting',
        summary: 'Discussed Q4 portfolio performance. Strong returns in Dubai property sector (18% YoY).',
        outcome: 'Client satisfied with diversification strategy',
        nextSteps: 'Explore European luxury hotels acquisition'
      },
      {
        id: 'conv-002',
        date: '2025-11-22',
        type: 'call',
        summary: 'Family succession planning discussion. Interested in setting up additional trusts for grandchildren.',
        nextSteps: 'Schedule meeting with estate planning specialist'
      }
    ]
  },
  {
    id: 'person-002',
    type: 'person',
    label: 'Khalid bin Rashid',
    properties: {
      name: 'Khalid bin Rashid',
      designation: 'CEO',
      netWorth: 4200000000,
      isClient: true,
      isInfluencer: true,
      sector: 'Technology & Innovation'
    },
    metadata: { clientId: 'client-002' },
    conversations: [
      {
        id: 'conv-003',
        date: '2025-12-10',
        type: 'meeting',
        summary: 'Reviewed tech startup portfolio. Discussed Series C funding for AI-driven logistics platform.',
        outcome: 'Approved $50M allocation to Series C round',
        nextSteps: 'Coordinate with venture capital team'
      }
    ]
  },
  {
    id: 'person-003',
    type: 'person',
    label: 'Fatima Al-Qassimi',
    properties: {
      name: 'Fatima Al-Qassimi',
      designation: 'Family Patriarch',
      netWorth: 12000000000,
      isClient: true,
      isInfluencer: true,
      sector: 'Energy & Infrastructure'
    },
    metadata: { clientId: 'client-003' },
    conversations: [
      {
        id: 'conv-004',
        date: '2025-12-20',
        type: 'meeting',
        summary: 'Annual portfolio review. Discussed renewable energy transition strategy.',
        outcome: 'Approved rebalancing: reduce oil exposure by 15%, increase green energy investments',
        nextSteps: 'Present shortlist of renewable energy opportunities by Q1 2026'
      },
      {
        id: 'conv-005',
        date: '2025-10-15',
        type: 'event',
        summary: 'Attended Abu Dhabi Sustainability Forum together. Introduced to Minister of Energy.',
        nextSteps: 'Follow up on sovereign wealth fund collaboration'
      }
    ]
  },
  {
    id: 'person-004',
    type: 'person',
    label: 'Mohammed Al-Thani',
    properties: {
      name: 'Mohammed Al-Thani',
      designation: 'Investment Director',
      netWorth: 2800000000,
      isClient: false,
      isInfluencer: true,
      sector: 'Sovereign Wealth'
    }
  },
  {
    id: 'person-005',
    type: 'person',
    label: 'Layla bin Sultan',
    properties: {
      name: 'Layla bin Sultan',
      designation: 'Founder & Chairwoman',
      netWorth: 3500000000,
      isClient: false,
      isInfluencer: true,
      sector: 'Luxury Retail'
    }
  }
];

// Mock Family Offices - Key Middle East entities
export const mockFamilyOffices: GraphNode[] = [
  {
    id: 'fo-001',
    type: 'family_office',
    label: 'Al-Maktoum Family Office',
    properties: {
      name: 'Al-Maktoum Family Office',
      aum: 15000000000, // Assets Under Management
      established: '1995',
      location: 'Dubai, UAE',
      focus: 'Real Estate, Hospitality, Private Equity'
    }
  },
  {
    id: 'fo-002',
    type: 'family_office',
    label: 'Al-Qassimi Investment Office',
    properties: {
      name: 'Al-Qassimi Investment Office',
      aum: 18000000000,
      established: '1988',
      location: 'Abu Dhabi, UAE',
      focus: 'Energy Transition, Infrastructure, ESG Investments'
    }
  }
];

// Mock Holding Companies
export const mockHoldingCompanies: GraphNode[] = [
  {
    id: 'holding-001',
    type: 'holding_company',
    label: 'Al-Maktoum Holdings',
    properties: {
      name: 'Al-Maktoum Holdings',
      cin: 'AE-DXB-1995-FIN-789012',
      sector: 'Diversified Conglomerate',
      subsidiaries: 23,
      valuation: 35000000000
    }
  },
  {
    id: 'holding-002',
    type: 'holding_company',
    label: 'Rashid Ventures Group',
    properties: {
      name: 'Rashid Ventures Group',
      cin: 'AE-DXB-2010-TEC-123789',
      sector: 'Technology & Innovation',
      subsidiaries: 12,
      valuation: 8500000000
    }
  }
];

// Mock Advisors - Trusted external advisors
export const mockAdvisors: GraphNode[] = [
  {
    id: 'advisor-001',
    type: 'advisor',
    label: 'Dr. Rashid Al-Farsi',
    properties: {
      name: 'Dr. Rashid Al-Farsi',
      designation: 'Strategic Advisor',
      specialty: 'Energy Transition & ESG',
      firm: 'MENA Strategic Consultants'
    }
  },
  {
    id: 'advisor-002',
    type: 'advisor',
    label: 'Sarah Williams',
    properties: {
      name: 'Sarah Williams',
      designation: 'Tax & Estate Planning Advisor',
      specialty: 'Cross-border Wealth Structuring',
      firm: 'Williams & Partners, Geneva'
    }
  }
];

// Mock Companies - Fewer but more prominent
export const mockCompanies: GraphNode[] = [
  {
    id: 'company-001',
    type: 'company',
    label: 'Emirates Luxury Hotels',
    properties: {
      name: 'Emirates Luxury Hotels',
      cin: 'AE-DXB-2005-HOS-456123',
      sector: 'Hospitality',
      founded: '2005-03-15',
      valuation: 12000000000
    }
  },
  {
    id: 'company-002',
    type: 'company',
    label: 'Gulf Tech Innovations',
    properties: {
      name: 'Gulf Tech Innovations',
      cin: 'AE-DXB-2018-TEC-789456',
      sector: 'Technology',
      founded: '2018-06-20',
      valuation: 5500000000
    }
  },
  {
    id: 'company-003',
    type: 'company',
    label: 'Renewable Arabia',
    properties: {
      name: 'Renewable Arabia',
      cin: 'AE-AUH-2020-ENE-321654',
      sector: 'Renewable Energy',
      founded: '2020-01-10',
      valuation: 8000000000
    }
  }
];

// Mock Networks/Clubs - Exclusive Middle East networks
export const mockNetworks: GraphNode[] = [
  {
    id: 'network-001',
    type: 'network',
    label: 'Gulf CEO Council',
    properties: {
      name: 'Gulf CEO Council',
      type: 'executive_club',
      memberCount: 45,
      description: 'Exclusive forum for GCC business leaders'
    }
  }
];

// Mock Liquidity Events - Reduced focus, more meaningful events
export const mockEvents: GraphNode[] = [
  {
    id: 'event-001',
    type: 'liquidity_event',
    label: 'IPO - Gulf Tech Innovations',
    properties: {
      type: 'ipo_filing',
      amount: 5500000000,
      date: '2026-03-15',
      source: 'DFM Filing',
      company: 'Gulf Tech Innovations'
    }
  }
];

// All nodes combined
export const mockNodes: GraphNode[] = [
  mockRM,
  ...mockPeople,
  ...mockFamilyOffices,
  ...mockHoldingCompanies,
  ...mockAdvisors,
  ...mockCompanies,
  ...mockNetworks,
  ...mockEvents
];

// Mock Edges/Relationships - Fewer but stronger connections
export const mockEdges: GraphEdge[] = [
  // RM manages clients (PRIMARY connections)
  { id: 'edge-001', source: 'rm-001', target: 'person-001', type: 'manages', label: 'Manages', strength: 'primary' },
  { id: 'edge-002', source: 'rm-001', target: 'person-002', type: 'manages', label: 'Manages', strength: 'primary' },
  { id: 'edge-003', source: 'rm-001', target: 'person-003', type: 'manages', label: 'Manages', strength: 'primary' },
  
  // Family Office relationships (PRIMARY - key structure)
  { id: 'edge-004', source: 'person-001', target: 'fo-001', type: 'controls', label: 'Controls', strength: 'primary' },
  { id: 'edge-005', source: 'person-003', target: 'fo-002', type: 'controls', label: 'Controls', strength: 'primary' },
  
  // Holding Company relationships (PRIMARY)
  { id: 'edge-006', source: 'fo-001', target: 'holding-001', type: 'controls', label: 'Owns 100%', strength: 'primary' },
  { id: 'edge-007', source: 'person-002', target: 'holding-002', type: 'controls', label: 'Owns 75%', strength: 'primary' },
  
  // Company ownership through holdings (PRIMARY)
  { id: 'edge-008', source: 'holding-001', target: 'company-001', type: 'promoter_of', label: 'Owns 85%', properties: { stake: 85.0 }, strength: 'primary' },
  { id: 'edge-009', source: 'holding-002', target: 'company-002', type: 'promoter_of', label: 'Owns 68%', properties: { stake: 68.0 }, strength: 'primary' },
  { id: 'edge-010', source: 'fo-002', target: 'company-003', type: 'promoter_of', label: 'Owns 55%', properties: { stake: 55.0 }, strength: 'primary' },
  
  // Advisory relationships (PRIMARY - trusted advisors)
  { id: 'edge-011', source: 'advisor-001', target: 'person-003', type: 'advises', label: 'Energy Advisor', strength: 'primary' },
  { id: 'edge-012', source: 'advisor-002', target: 'fo-001', type: 'advises', label: 'Estate Planning', strength: 'primary' },
  
  // Strategic cross-investments (PRIMARY)
  { id: 'edge-013', source: 'fo-002', target: 'company-002', type: 'investor_in', label: 'Investor ($120M)', properties: { amount: 120000000 }, strength: 'primary' },
  
  // Family connections (PRIMARY)
  { id: 'edge-014', source: 'person-001', target: 'person-005', type: 'family_of', label: 'Sister', strength: 'primary' },
  
  // Network memberships (SECONDARY - less prominent)
  { id: 'edge-015', source: 'person-001', target: 'network-001', type: 'member_of', label: 'Member', strength: 'secondary' },
  { id: 'edge-016', source: 'person-002', target: 'network-001', type: 'member_of', label: 'Member', strength: 'secondary' },
  { id: 'edge-017', source: 'person-003', target: 'network-001', type: 'member_of', label: 'Member', strength: 'secondary' },
  
  // Professional relationships (SECONDARY)
  { id: 'edge-018', source: 'person-001', target: 'person-002', type: 'knows', label: 'Business Partner', properties: { strength: 0.95 }, strength: 'secondary' },
  { id: 'edge-019', source: 'person-002', target: 'person-003', type: 'knows', label: 'Co-investor', properties: { strength: 0.85 }, strength: 'secondary' },
  { id: 'edge-020', source: 'person-003', target: 'person-004', type: 'knows', label: 'Strategic Connection', properties: { strength: 0.9 }, strength: 'secondary' },
  
  // Liquidity event
  { id: 'edge-021', source: 'event-001', target: 'person-002', type: 'affects', label: 'Affects', strength: 'primary' },
  { id: 'edge-022', source: 'event-001', target: 'company-002', type: 'involves', label: 'Involves', strength: 'primary' },
];

// Get stats for the graph
export function getGraphStats() {
  const nodeTypeCounts = mockNodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalNodes: mockNodes.length,
    totalEdges: mockEdges.length,
    nodeTypeCounts
  };
}
