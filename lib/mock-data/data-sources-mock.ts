/**
 * @file lib/mock-data/data-sources-mock.ts
 * @description Mock data for all external data sources - for demo purposes
 * @category Mock Data
 */

// ==============================================
// TYPE DEFINITIONS
// ==============================================

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'scraper';
  status: 'online' | 'degraded' | 'offline';
  lastSync: Date;
  nextSync: Date;
  reliability: number;
  uptime: number;
  errorRate: number;
  averageLatency: number;
  dataQuality: number;
}

export interface IngestionMetrics {
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  duplicates: number;
  errors: number;
  processingTime: number;
  dataFreshness: number;
}

export interface DataConflict {
  id: string;
  entityType: 'company' | 'person' | 'event';
  entityId: string;
  field: string;
  conflictingValues: {
    source: string;
    value: unknown;
    confidence: number;
    timestamp: Date;
  }[];
  suggestedResolution: {
    value: unknown;
    reasoning: string;
  };
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  sourceId: string;
  sourceName: string;
  action: 'sync' | 'ingest' | 'resolve' | 'error';
  status: 'success' | 'failure' | 'partial';
  recordsProcessed: number;
  errors: string[];
  timestamp: Date;
  duration: number;
}

export interface PrivateCircleEvent {
  companyName: string;
  funding: {
    round: 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Pre-IPO';
    amount: number;
    currency: string;
    date: Date;
  };
  investors: string[];
  promoters: string[];
  source: 'PrivateCircle';
  sourceId: string;
  confidence: number;
}

export interface ZaubaEvent {
  companyName: string;
  cin: string;
  eventType: 'director_change' | 'share_transfer' | 'filing';
  details: {
    directors: { name: string; din: string }[];
    shareCapital: number;
    filingDate: Date;
  };
  source: 'Zauba Corp';
  sourceUrl: string;
  confidence: number;
}

export interface IPOEvent {
  companyName: string;
  exchange: 'NSE' | 'BSE';
  eventType: 'drhp_filed' | 'prospectus_filed' | 'listing_approved';
  details: {
    ipoSize: number;
    priceRange: { min: number; max: number };
    filingDate: Date;
    expectedListing: Date;
  };
  source: 'NSE' | 'BSE';
  sourceUrl: string;
  confidence: number;
}

export interface NewsEvent {
  companyName: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: Date;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

// ==============================================
// MOCK DATA: DATA SOURCES STATUS
// ==============================================

export const mockDataSources: DataSource[] = [
  {
    id: 'privatecircle',
    name: 'PrivateCircle',
    type: 'api',
    status: 'online',
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    nextSync: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    reliability: 92,
    uptime: 98.5,
    errorRate: 1.2,
    averageLatency: 320,
    dataQuality: 88,
  },
  {
    id: 'zauba',
    name: 'Zauba Corp',
    type: 'scraper',
    status: 'online',
    lastSync: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    nextSync: new Date(Date.now() + 7 * 60 * 1000),
    reliability: 95,
    uptime: 99.2,
    errorRate: 0.8,
    averageLatency: 850,
    dataQuality: 95,
  },
  {
    id: 'nse',
    name: 'DFM (Dubai)',
    type: 'api',
    status: 'online',
    lastSync: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    nextSync: new Date(Date.now() + 12 * 60 * 1000),
    reliability: 98,
    uptime: 99.8,
    errorRate: 0.2,
    averageLatency: 180,
    dataQuality: 99,
  },
  {
    id: 'bse',
    name: 'ADX (Abu Dhabi)',
    type: 'api',
    status: 'degraded',
    lastSync: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    nextSync: new Date(Date.now() + 5 * 60 * 1000),
    reliability: 96,
    uptime: 97.5,
    errorRate: 2.5,
    averageLatency: 420,
    dataQuality: 97,
  },
  {
    id: 'newsapi',
    name: 'NewsAPI',
    type: 'api',
    status: 'online',
    lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    nextSync: new Date(Date.now() + 13 * 60 * 1000),
    reliability: 85,
    uptime: 96.0,
    errorRate: 4.0,
    averageLatency: 280,
    dataQuality: 75,
  },
  {
    id: 'public-domain',
    name: 'Public Domain',
    type: 'scraper',
    status: 'online',
    lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    nextSync: new Date(Date.now() + 30 * 60 * 1000),
    reliability: 78,
    uptime: 94.0,
    errorRate: 6.0,
    averageLatency: 1200,
    dataQuality: 70,
  },
];

// ==============================================
// MOCK DATA: INGESTION METRICS
// ==============================================

export const mockIngestionMetrics: IngestionMetrics = {
  totalRecords: 15847,
  newRecords: 234,
  updatedRecords: 89,
  duplicates: 45,
  errors: 7,
  processingTime: 4235, // ms
  dataFreshness: 5, // minutes
};

export const mockIngestionMetricsBySource: Record<string, IngestionMetrics> = {
  privatecircle: {
    totalRecords: 3245,
    newRecords: 67,
    updatedRecords: 23,
    duplicates: 12,
    errors: 2,
    processingTime: 890,
    dataFreshness: 5,
  },
  zauba: {
    totalRecords: 5678,
    newRecords: 89,
    updatedRecords: 34,
    duplicates: 18,
    errors: 1,
    processingTime: 1450,
    dataFreshness: 8,
  },
  nse: {
    totalRecords: 2134,
    newRecords: 45,
    updatedRecords: 12,
    duplicates: 5,
    errors: 0,
    processingTime: 320,
    dataFreshness: 3,
  },
  bse: {
    totalRecords: 1890,
    newRecords: 23,
    updatedRecords: 8,
    duplicates: 4,
    errors: 3,
    processingTime: 780,
    dataFreshness: 25,
  },
  newsapi: {
    totalRecords: 2100,
    newRecords: 78,
    updatedRecords: 34,
    duplicates: 23,
    errors: 5,
    processingTime: 560,
    dataFreshness: 2,
  },
  'public-domain': {
    totalRecords: 800,
    newRecords: 12,
    updatedRecords: 5,
    duplicates: 3,
    errors: 1,
    processingTime: 1230,
    dataFreshness: 15,
  },
};

// ==============================================
// MOCK DATA: DATA CONFLICTS
// ==============================================

export const mockDataConflicts: DataConflict[] = [
  {
    id: 'conflict-001',
    entityType: 'company',
    entityId: 'comp-zomato',
    field: 'funding_amount',
    conflictingValues: [
      {
        source: 'PrivateCircle',
        value: 250000000, // $250M
        confidence: 85,
        timestamp: new Date('2025-12-18T10:30:00Z'),
      },
      {
        source: 'NewsAPI',
        value: 275000000, // $275M
        confidence: 65,
        timestamp: new Date('2025-12-18T11:15:00Z'),
      },
    ],
    suggestedResolution: {
      value: 250000000,
      reasoning: 'PrivateCircle has higher reliability (92 vs 85) and confidence score (85 vs 65)',
    },
    status: 'pending',
    createdAt: new Date('2025-12-18T11:20:00Z'),
  },
  {
    id: 'conflict-002',
    entityType: 'person',
    entityId: 'person-rajesh-kumar',
    field: 'company_role',
    conflictingValues: [
      {
        source: 'Zauba Corp',
        value: 'Managing Director',
        confidence: 95,
        timestamp: new Date('2025-12-17T14:00:00Z'),
      },
      {
        source: 'Public Domain',
        value: 'Director',
        confidence: 70,
        timestamp: new Date('2025-12-17T15:30:00Z'),
      },
    ],
    suggestedResolution: {
      value: 'Managing Director',
      reasoning: 'Zauba Corp data from official MCA filings (reliability: 95)',
    },
    status: 'pending',
    createdAt: new Date('2025-12-17T16:00:00Z'),
  },
  {
    id: 'conflict-003',
    entityType: 'event',
    entityId: 'event-ipo-tech-co',
    field: 'ipo_size',
    conflictingValues: [
      {
        source: 'NSE',
        value: 5000000000, // $5000 Million
        confidence: 99,
        timestamp: new Date('2025-12-16T09:00:00Z'),
      },
      {
        source: 'NewsAPI',
        value: 4800000000, // $4800 Million
        confidence: 60,
        timestamp: new Date('2025-12-16T10:30:00Z'),
      },
    ],
    suggestedResolution: {
      value: 5000000000,
      reasoning: 'NSE official filing data (reliability: 98, confidence: 99)',
    },
    status: 'resolved',
    createdAt: new Date('2025-12-16T11:00:00Z'),
  },
];

// ==============================================
// MOCK DATA: AUDIT LOGS
// ==============================================

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    sourceId: 'privatecircle',
    sourceName: 'PrivateCircle',
    action: 'sync',
    status: 'success',
    recordsProcessed: 67,
    errors: [],
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    duration: 890,
  },
  {
    id: 'log-002',
    sourceId: 'zauba',
    sourceName: 'Zauba Corp',
    action: 'sync',
    status: 'success',
    recordsProcessed: 89,
    errors: [],
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    duration: 1450,
  },
  {
    id: 'log-003',
    sourceId: 'nse',
    sourceName: 'DFM (Dubai)',
    action: 'sync',
    status: 'success',
    recordsProcessed: 45,
    errors: [],
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    duration: 320,
  },
  {
    id: 'log-004',
    sourceId: 'bse',
    sourceName: 'ADX (Abu Dhabi)',
    action: 'sync',
    status: 'partial',
    recordsProcessed: 23,
    errors: [
      'Rate limit exceeded for endpoint /ipo/filings',
      'Timeout on request for company CIN: AE-DXB-2020-COM-123456',
      'Invalid response format for 2 records',
    ],
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    duration: 780,
  },
  {
    id: 'log-005',
    sourceId: 'newsapi',
    sourceName: 'NewsAPI',
    action: 'sync',
    status: 'success',
    recordsProcessed: 78,
    errors: [],
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    duration: 560,
  },
  {
    id: 'log-006',
    sourceId: 'public-domain',
    sourceName: 'Public Domain',
    action: 'sync',
    status: 'success',
    recordsProcessed: 12,
    errors: [],
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    duration: 1230,
  },
  {
    id: 'log-007',
    sourceId: 'privatecircle',
    sourceName: 'PrivateCircle',
    action: 'ingest',
    status: 'success',
    recordsProcessed: 156,
    errors: [],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 2340,
  },
  {
    id: 'log-008',
    sourceId: 'zauba',
    sourceName: 'Zauba Corp',
    action: 'error',
    status: 'failure',
    recordsProcessed: 0,
    errors: ['Connection timeout after 30 seconds', 'Failed to reach zaubacorp.com'],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    duration: 30000,
  },
];

// ==============================================
// MOCK DATA: PRIVATECIRCLE EVENTS
// ==============================================

export const mockPrivateCircleEvents: PrivateCircleEvent[] = [
  {
    companyName: 'TechVenture Solutions Pvt Ltd',
    funding: {
      round: 'Series B',
      amount: 250000000, // $250M USD
      currency: 'USD',
      date: new Date('2025-12-15'),
    },
    investors: ['Sequoia Capital', 'Accel Partners', 'Tiger Global'],
    promoters: ['Amit Sharma', 'Priya Mehta'],
    source: 'PrivateCircle',
    sourceId: 'pc-deal-12345',
    confidence: 88,
  },
  {
    companyName: 'GreenEnergy Innovations',
    funding: {
      round: 'Series A',
      amount: 75000000, // $75M USD
      currency: 'USD',
      date: new Date('2025-12-10'),
    },
    investors: ['Matrix Partners', 'Lightspeed Venture', 'Nexus Venture Partners'],
    promoters: ['Rajesh Verma', 'Sneha Patel'],
    source: 'PrivateCircle',
    sourceId: 'pc-deal-12346',
    confidence: 85,
  },
  {
    companyName: 'FinTech Pro Services',
    funding: {
      round: 'Pre-IPO',
      amount: 500000000, // $500M USD
      currency: 'USD',
      date: new Date('2025-12-08'),
    },
    investors: ['SoftBank Vision Fund', 'Temasek Holdings', 'GIC Private Limited'],
    promoters: ['Vikram Singh', 'Neha Gupta', 'Arjun Khanna'],
    source: 'PrivateCircle',
    sourceId: 'pc-deal-12347',
    confidence: 92,
  },
  {
    companyName: 'HealthTech Diagnostics',
    funding: {
      round: 'Series C',
      amount: 180000000, // $180M USD
      currency: 'USD',
      date: new Date('2025-12-05'),
    },
    investors: ['Kalaari Capital', 'Chiratae Ventures', 'Saif Partners'],
    promoters: ['Dr. Anjali Rao', 'Sanjay Kumar'],
    source: 'PrivateCircle',
    sourceId: 'pc-deal-12348',
    confidence: 87,
  },
  {
    companyName: 'EdTech Learning Platform',
    funding: {
      round: 'Seed',
      amount: 15000000, // $15M USD
      currency: 'USD',
      date: new Date('2025-12-01'),
    },
    investors: ['Wamda Capital', 'Middle East Venture Partners', 'Dubai Angel Investors'],
    promoters: ['Rahul Desai', 'Kavita Nair'],
    source: 'PrivateCircle',
    sourceId: 'pc-deal-12349',
    confidence: 82,
  },
];

// ==============================================
// MOCK DATA: ZAUBA CORP EVENTS
// ==============================================

export const mockZaubaEvents: ZaubaEvent[] = [
  {
    companyName: 'Dubai Infra Developers Ltd',
    cin: 'L45200MH2015PLC267890',
    eventType: 'director_change',
    details: {
      directors: [
        { name: 'Rajesh Kumar Sharma', din: 'DIN00123456' },
        { name: 'Priya Agarwal', din: 'DIN00234567' },
        { name: 'Vikram Singh Rathore', din: 'DIN00345678' },
      ],
      shareCapital: 500000000, // $50 Million
      filingDate: new Date('2025-12-14'),
    },
    source: 'Zauba Corp',
    sourceUrl: 'https://www.zaubacorp.com/company/DUBAI-INFRA-DEVELOPERS-LIMITED/U45200MH2015PLC267890',
    confidence: 95,
  },
  {
    companyName: 'Riyadh Real Estate Holdings Pvt Ltd',
    cin: 'L70100DL2018PTC334455',
    eventType: 'share_transfer',
    details: {
      directors: [
        { name: 'Amit Gupta', din: 'DIN00456789' },
        { name: 'Sneha Kapoor', din: 'DIN00567890' },
      ],
      shareCapital: 750000000, // $75 Million
      filingDate: new Date('2025-12-12'),
    },
    source: 'Zauba Corp',
    sourceUrl: 'https://www.zaubacorp.com/company/RIYADH-REAL-ESTATE-HOLDINGS-PRIVATE-LIMITED/U70100DL2018PTC334455',
    confidence: 93,
  },
  {
    companyName: 'Doha Tech Ventures Ltd',
    cin: 'L72200KA2016PLC098765',
    eventType: 'filing',
    details: {
      directors: [
        { name: 'Karthik Ramesh', din: 'DIN00678901' },
        { name: 'Lakshmi Venkatesh', din: 'DIN00789012' },
        { name: 'Ravi Kumar Yadav', din: 'DIN00890123' },
      ],
      shareCapital: 320000000, // $32 Million
      filingDate: new Date('2025-12-10'),
    },
    source: 'Zauba Corp',
    sourceUrl: 'https://www.zaubacorp.com/company/DOHA-TECH-VENTURES-LIMITED/U72200KA2016PLC098765',
    confidence: 92,
  },
  {
    companyName: 'Manama Manufacturing Industries Ltd',
    cin: 'L28100TN2017PLC123789',
    eventType: 'director_change',
    details: {
      directors: [
        { name: 'Suresh Babu Narayanan', din: 'DIN00901234' },
        { name: 'Meera Krishnan', din: 'DIN01012345' },
      ],
      shareCapital: 450000000, // $45 Million
      filingDate: new Date('2025-12-08'),
    },
    source: 'Zauba Corp',
    sourceUrl: 'https://www.zaubacorp.com/company/MANAMA-MANUFACTURING-INDUSTRIES-LIMITED/U28100TN2017PLC123789',
    confidence: 94,
  },
];

// ==============================================
// MOCK DATA: IPO EVENTS (NSE/BSE)
// ==============================================

export const mockIPOEvents: IPOEvent[] = [
  {
    companyName: 'CloudTech Solutions Limited',
    exchange: 'NSE',
    eventType: 'drhp_filed',
    details: {
      ipoSize: 12000000000, // $1200 Million
      priceRange: { min: 450, max: 500 },
      filingDate: new Date('2025-12-16'),
      expectedListing: new Date('2026-02-15'),
    },
    source: 'NSE',
    sourceUrl: 'https://www.nseindia.com/companies-listing/corporate-filings-ipo',
    confidence: 99,
  },
  {
    companyName: 'Renewable Energy Corp Gulf Ltd',
    exchange: 'ADX',
    eventType: 'prospectus_filed',
    details: {
      ipoSize: 8500000000, // $850 Million
      priceRange: { min: 320, max: 360 },
      filingDate: new Date('2025-12-14'),
      expectedListing: new Date('2026-01-20'),
    },
    source: 'BSE',
    sourceUrl: 'https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx',
    confidence: 98,
  },
  {
    companyName: 'Fintech Payments Gateway Ltd',
    exchange: 'DFM',
    eventType: 'listing_approved',
    details: {
      ipoSize: 15000000000, // $1500 Million
      priceRange: { min: 580, max: 620 },
      filingDate: new Date('2025-12-12'),
      expectedListing: new Date('2026-01-05'),
    },
    source: 'DFM',
    sourceUrl: 'https://www.dfm.ae/companies-listing/corporate-filings-ipo',
    confidence: 99,
  },
  {
    companyName: 'Logistics & Supply Chain Gulf Ltd',
    exchange: 'ADX',
    eventType: 'drhp_filed',
    details: {
      ipoSize: 6000000000, // $600 Million
      priceRange: { min: 220, max: 250 },
      filingDate: new Date('2025-12-10'),
      expectedListing: new Date('2026-03-01'),
    },
    source: 'ADX',
    sourceUrl: 'https://www.adx.ae/markets/PublicIssues/IPOIssues_new.aspx',
    confidence: 97,
  },
];

// ==============================================
// MOCK DATA: NEWS EVENTS
// ==============================================

export const mockNewsEvents: NewsEvent[] = [
  {
    companyName: 'TechVenture Solutions',
    headline: 'TechVenture Solutions raises $250M in Series B funding led by Sequoia',
    summary: 'Dubai-based tech startup TechVenture Solutions announced today that it has raised $250 million in Series B funding, valuing the company at $1.2 billion. The round was led by Sequoia Capital with participation from existing investors.',
    source: 'Economic Times',
    publishedAt: new Date('2025-12-18T09:30:00Z'),
    url: 'https://economictimes.com/tech/funding/techventure-solutions-series-b',
    sentiment: 'positive',
    confidence: 75,
  },
  {
    companyName: 'GreenEnergy Innovations',
    headline: 'GreenEnergy Innovations secures $75M to expand solar operations',
    summary: 'Renewable energy startup GreenEnergy Innovations has secured $75 million in Series A funding from Matrix Partners and Lightspeed Venture to expand its solar panel manufacturing capacity.',
    source: 'Mint',
    publishedAt: new Date('2025-12-17T14:15:00Z'),
    url: 'https://livemint.com/companies/news/greenenergy-innovations-funding',
    sentiment: 'positive',
    confidence: 72,
  },
  {
    companyName: 'FinTech Pro Services',
    headline: 'FinTech Pro Services files for IPO, targets $500M raise',
    summary: 'Leading fintech company FinTech Pro Services has filed DRHP documents with SEBI for an IPO worth $4,000 Million. The company plans to list on NSE by Q1 2026.',
    source: 'Business Standard',
    publishedAt: new Date('2025-12-16T11:00:00Z'),
    url: 'https://business-standard.com/companies/news/fintech-pro-ipo-filing',
    sentiment: 'positive',
    confidence: 78,
  },
  {
    companyName: 'Dubai Infra Developers',
    headline: 'Dubai Infra Developers appoints new board members amid expansion',
    summary: 'Real estate developer Dubai Infra Developers Ltd has appointed three new directors to its board as part of its expansion strategy. The company recently secured $500 Million in funding.',
    source: 'Regional Business Line',
    publishedAt: new Date('2025-12-15T16:30:00Z'),
    url: 'https://regionalbusinessline.com/companies/dubai-infra-board-changes',
    sentiment: 'neutral',
    confidence: 68,
  },
  {
    companyName: 'HealthTech Diagnostics',
    headline: 'HealthTech Diagnostics raises $180M in Series C, eyes regional expansion',
    summary: 'Digital diagnostics platform HealthTech Diagnostics announced a $180 million Series C funding round led by Gulf Capital. The funds will be used to expand to 50 new locations across the Middle East.',
    source: 'YourStory',
    publishedAt: new Date('2025-12-14T10:45:00Z'),
    url: 'https://yourstory.com/2025/12/healthtech-diagnostics-series-c-funding',
    sentiment: 'positive',
    confidence: 74,
  },
  {
    companyName: 'CloudTech Solutions',
    headline: 'CloudTech Solutions files prospectus for $1,200 Million IPO on DFM',
    summary: 'Cloud infrastructure provider CloudTech Solutions has filed draft papers with DFSA for an initial public offering worth $1,200 Million. The IPO is expected to open in February 2026.',
    source: 'MoneyControl',
    publishedAt: new Date('2025-12-17T08:20:00Z'),
    url: 'https://moneycontrol.com/news/business/ipo/cloudtech-solutions-drhp-filing',
    sentiment: 'positive',
    confidence: 80,
  },
];

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Get data source by ID
 */
export function getDataSourceById(id: string): DataSource | undefined {
  return mockDataSources.find((source) => source.id === id);
}

/**
 * Get all online data sources
 */
export function getOnlineDataSources(): DataSource[] {
  return mockDataSources.filter((source) => source.status === 'online');
}

/**
 * Get pending conflicts
 */
export function getPendingConflicts(): DataConflict[] {
  return mockDataConflicts.filter((conflict) => conflict.status === 'pending');
}

/**
 * Get recent audit logs (last N entries)
 */
export function getRecentAuditLogs(limit: number = 10): AuditLog[] {
  return mockAuditLogs
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Get audit logs by source
 */
export function getAuditLogsBySource(sourceId: string): AuditLog[] {
  return mockAuditLogs.filter((log) => log.sourceId === sourceId);
}

/**
 * Get events by company name
 */
export function getEventsByCompany(companyName: string): {
  privateCircle: PrivateCircleEvent[];
  zauba: ZaubaEvent[];
  ipo: IPOEvent[];
  news: NewsEvent[];
} {
  return {
    privateCircle: mockPrivateCircleEvents.filter((e) =>
      e.companyName.toLowerCase().includes(companyName.toLowerCase())
    ),
    zauba: mockZaubaEvents.filter((e) =>
      e.companyName.toLowerCase().includes(companyName.toLowerCase())
    ),
    ipo: mockIPOEvents.filter((e) =>
      e.companyName.toLowerCase().includes(companyName.toLowerCase())
    ),
    news: mockNewsEvents.filter((e) =>
      e.companyName.toLowerCase().includes(companyName.toLowerCase())
    ),
  };
}

/**
 * Calculate overall system health score
 */
export function calculateSystemHealth(): number {
  const avgUptime = mockDataSources.reduce((sum, s) => sum + s.uptime, 0) / mockDataSources.length;
  const avgReliability = mockDataSources.reduce((sum, s) => sum + s.reliability, 0) / mockDataSources.length;
  const onlineCount = mockDataSources.filter((s) => s.status === 'online').length;
  const onlineRatio = onlineCount / mockDataSources.length;

  return Math.round((avgUptime * 0.4 + avgReliability * 0.4 + onlineRatio * 100 * 0.2));
}

/**
 * Get aggregated stats for dashboard
 */
export function getAggregatedStats() {
  return {
    totalSources: mockDataSources.length,
    onlineSources: mockDataSources.filter((s) => s.status === 'online').length,
    degradedSources: mockDataSources.filter((s) => s.status === 'degraded').length,
    offlineSources: mockDataSources.filter((s) => s.status === 'offline').length,
    pendingConflicts: getPendingConflicts().length,
    totalRecordsToday: mockIngestionMetrics.totalRecords,
    systemHealth: calculateSystemHealth(),
    avgDataQuality: Math.round(
      mockDataSources.reduce((sum, s) => sum + s.dataQuality, 0) / mockDataSources.length
    ),
  };
}
