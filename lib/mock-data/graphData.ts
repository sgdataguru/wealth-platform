/**
 * @file lib/mock-data/graphData.ts
 * @description Mock graph data for relationship visualization
 */

import type { GraphNode, GraphEdge } from '@/types/graph';

// Mock Relationship Manager
export const mockRM: GraphNode = {
  id: 'rm-001',
  type: 'rm',
  label: 'Priya Mehta',
  properties: {
    name: 'Priya Mehta',
    email: 'priya.mehta@nuvama.com',
    role: 'Relationship Manager'
  }
};

// Mock People (UHNW Clients and Prospects)
export const mockPeople: GraphNode[] = [
  {
    id: 'person-001',
    type: 'person',
    label: 'Rajesh Sharma',
    properties: {
      name: 'Rajesh Sharma',
      designation: 'CEO',
      netWorth: 15000000000,
      isClient: true,
      isInfluencer: true,
      sector: 'Fintech'
    },
    metadata: { clientId: 'client-001' }
  },
  {
    id: 'person-002',
    type: 'person',
    label: 'Amit Patel',
    properties: {
      name: 'Amit Patel',
      designation: 'Founder',
      netWorth: 8500000000,
      isClient: true,
      isInfluencer: false,
      sector: 'E-commerce'
    },
    metadata: { clientId: 'client-002' }
  },
  {
    id: 'person-003',
    type: 'person',
    label: 'Sneha Kapoor',
    properties: {
      name: 'Sneha Kapoor',
      designation: 'CFO',
      netWorth: 3200000000,
      isClient: false,
      isInfluencer: true,
      sector: 'Fintech'
    }
  },
  {
    id: 'person-004',
    type: 'person',
    label: 'Vikram Singh',
    properties: {
      name: 'Vikram Singh',
      designation: 'Angel Investor',
      netWorth: 12000000000,
      isClient: true,
      isInfluencer: true,
      sector: 'Renewable Energy'
    },
    metadata: { clientId: 'client-003' }
  },
  {
    id: 'person-005',
    type: 'person',
    label: 'Neha Reddy',
    properties: {
      name: 'Neha Reddy',
      designation: 'Co-Founder',
      netWorth: 5500000000,
      isClient: false,
      isInfluencer: false,
      sector: 'E-commerce'
    }
  },
  {
    id: 'person-006',
    type: 'person',
    label: 'Arjun Malhotra',
    properties: {
      name: 'Arjun Malhotra',
      designation: 'Managing Director',
      netWorth: 6800000000,
      isClient: false,
      isInfluencer: true,
      sector: 'Healthcare'
    }
  }
];

// Mock Companies
export const mockCompanies: GraphNode[] = [
  {
    id: 'company-001',
    type: 'company',
    label: 'TechCorp India',
    properties: {
      name: 'TechCorp India',
      cin: 'U72900DL2015PTC123456',
      sector: 'Fintech',
      founded: '2015-03-15',
      valuation: 45000000000
    },
    metadata: { companyId: 'comp-001' }
  },
  {
    id: 'company-002',
    type: 'company',
    label: 'E-Commerce Solutions',
    properties: {
      name: 'E-Commerce Solutions',
      cin: 'U52100MH2018PTC234567',
      sector: 'E-commerce',
      founded: '2018-06-20',
      valuation: 25000000000
    },
    metadata: { companyId: 'comp-002' }
  },
  {
    id: 'company-003',
    type: 'company',
    label: 'GreenEnergy Ventures',
    properties: {
      name: 'GreenEnergy Ventures',
      cin: 'U40109KA2020PTC345678',
      sector: 'Renewable Energy',
      founded: '2020-01-10',
      valuation: 18000000000
    },
    metadata: { companyId: 'comp-003' }
  },
  {
    id: 'company-004',
    type: 'company',
    label: 'HealthTech Innovations',
    properties: {
      name: 'HealthTech Innovations',
      cin: 'U85100TN2019PTC456789',
      sector: 'Healthcare',
      founded: '2019-09-05',
      valuation: 12000000000
    },
    metadata: { companyId: 'comp-004' }
  }
];

// Mock Networks/Clubs
export const mockNetworks: GraphNode[] = [
  {
    id: 'network-001',
    type: 'network',
    label: 'TiE Mumbai',
    properties: {
      name: 'TiE Mumbai',
      type: 'industry_body',
      memberCount: 450
    },
    metadata: { networkId: 'net-001' }
  },
  {
    id: 'network-002',
    type: 'network',
    label: 'YPO India',
    properties: {
      name: 'YPO India',
      type: 'club',
      memberCount: 280
    },
    metadata: { networkId: 'net-002' }
  }
];

// Mock Liquidity Events
export const mockEvents: GraphNode[] = [
  {
    id: 'event-001',
    type: 'liquidity_event',
    label: 'IPO Filing',
    properties: {
      type: 'ipo_filing',
      amount: 8500000000,
      date: '2025-02-15',
      source: 'SEBI Filing',
      company: 'TechCorp India'
    },
    metadata: { eventId: 'evt-001' }
  },
  {
    id: 'event-002',
    type: 'liquidity_event',
    label: 'Series C Funding',
    properties: {
      type: 'series_c_funding',
      amount: 3500000000,
      date: '2025-01-10',
      source: 'Private Circle',
      company: 'E-Commerce Solutions'
    },
    metadata: { eventId: 'evt-002' }
  },
  {
    id: 'event-003',
    type: 'liquidity_event',
    label: 'Acquisition',
    properties: {
      type: 'acquisition',
      amount: 15000000000,
      date: '2025-03-01',
      source: 'Market Intelligence',
      company: 'GreenEnergy Ventures'
    },
    metadata: { eventId: 'evt-003' }
  }
];

// All nodes combined
export const mockNodes: GraphNode[] = [
  mockRM,
  ...mockPeople,
  ...mockCompanies,
  ...mockNetworks,
  ...mockEvents
];

// Mock Edges/Relationships
export const mockEdges: GraphEdge[] = [
  // RM manages clients
  { id: 'edge-001', source: 'rm-001', target: 'person-001', type: 'manages', label: 'Manages' },
  { id: 'edge-002', source: 'rm-001', target: 'person-002', type: 'manages', label: 'Manages' },
  { id: 'edge-003', source: 'rm-001', target: 'person-004', type: 'manages', label: 'Manages' },
  
  // Promoter relationships
  { id: 'edge-004', source: 'person-001', target: 'company-001', type: 'promoter_of', label: 'Promoter (35.5%)', properties: { stake: 35.5 } },
  { id: 'edge-005', source: 'person-002', target: 'company-002', type: 'promoter_of', label: 'Promoter (42%)', properties: { stake: 42.0 } },
  { id: 'edge-006', source: 'person-004', target: 'company-003', type: 'promoter_of', label: 'Promoter (28%)', properties: { stake: 28.0 } },
  
  // Director relationships
  { id: 'edge-007', source: 'person-001', target: 'company-001', type: 'director_of', label: 'Director' },
  { id: 'edge-008', source: 'person-003', target: 'company-001', type: 'director_of', label: 'Director' },
  { id: 'edge-009', source: 'person-002', target: 'company-002', type: 'director_of', label: 'Director' },
  { id: 'edge-010', source: 'person-005', target: 'company-002', type: 'director_of', label: 'Director' },
  { id: 'edge-011', source: 'person-006', target: 'company-004', type: 'director_of', label: 'Director' },
  
  // Investor relationships
  { id: 'edge-012', source: 'person-004', target: 'company-001', type: 'investor_in', label: 'Investor (₹250Cr)', properties: { amount: 2500000000 } },
  { id: 'edge-013', source: 'person-004', target: 'company-004', type: 'investor_in', label: 'Investor (₹180Cr)', properties: { amount: 1800000000 } },
  { id: 'edge-014', source: 'person-001', target: 'company-003', type: 'investor_in', label: 'Investor (₹300Cr)', properties: { amount: 3000000000 } },
  
  // Network memberships
  { id: 'edge-015', source: 'person-001', target: 'network-001', type: 'member_of', label: 'Member' },
  { id: 'edge-016', source: 'person-002', target: 'network-001', type: 'member_of', label: 'Member' },
  { id: 'edge-017', source: 'person-004', target: 'network-001', type: 'member_of', label: 'Member' },
  { id: 'edge-018', source: 'person-001', target: 'network-002', type: 'member_of', label: 'Member' },
  { id: 'edge-019', source: 'person-003', target: 'network-002', type: 'member_of', label: 'Member' },
  { id: 'edge-020', source: 'person-006', target: 'network-002', type: 'member_of', label: 'Member' },
  
  // Personal connections (knows)
  { id: 'edge-021', source: 'person-001', target: 'person-002', type: 'knows', label: 'Knows', properties: { strength: 0.9 } },
  { id: 'edge-022', source: 'person-001', target: 'person-003', type: 'knows', label: 'Knows', properties: { strength: 0.85 } },
  { id: 'edge-023', source: 'person-002', target: 'person-004', type: 'knows', label: 'Knows', properties: { strength: 0.7 } },
  { id: 'edge-024', source: 'person-003', target: 'person-004', type: 'knows', label: 'Knows', properties: { strength: 0.8 } },
  { id: 'edge-025', source: 'person-004', target: 'person-005', type: 'knows', label: 'Knows', properties: { strength: 0.75 } },
  { id: 'edge-026', source: 'person-001', target: 'person-005', type: 'knows', label: 'Knows', properties: { strength: 0.6 } },
  { id: 'edge-027', source: 'person-003', target: 'person-006', type: 'knows', label: 'Knows', properties: { strength: 0.7 } },
  
  // Liquidity events
  { id: 'edge-028', source: 'event-001', target: 'person-001', type: 'affects', label: 'Affects' },
  { id: 'edge-029', source: 'event-001', target: 'company-001', type: 'involves', label: 'Involves' },
  { id: 'edge-030', source: 'event-002', target: 'person-002', type: 'affects', label: 'Affects' },
  { id: 'edge-031', source: 'event-002', target: 'company-002', type: 'involves', label: 'Involves' },
  { id: 'edge-032', source: 'event-003', target: 'person-004', type: 'affects', label: 'Affects' },
  { id: 'edge-033', source: 'event-003', target: 'company-003', type: 'involves', label: 'Involves' },
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
