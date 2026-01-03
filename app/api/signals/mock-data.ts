import type { Signal } from '@/types';

export const mockSignals: Signal[] = [
  {
    id: 'nectar-buyback-2025',
    type: 'buyback',
    severity: 'high',
    title: 'Nectar Lifesciences — Buyback (record date liquidity)',
    description:
      'Record date on 24 Dec 2025 for the announced buyback; tender route provides cash-out for shareholders and often precedes block repositioning.',
    source: 'Bloomberg Gulf',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    estimatedLiquidity: 150,
    confidence: 90,
    metadata: {
      keyDates: ['Record date 24 Dec 2025'],
      people: ['Company', 'Public shareholders'],
      signalType: 'Buyback / tender offer',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'vls-finance-buyback-2025',
    type: 'buyback',
    severity: 'high',
    title: 'VLS Finance — Buyback window live',
    description:
      'Tender offer window running 18–24 Dec 2025 with settlement to follow; live liquidity for existing holders.',
    source: 'DFM Archive',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isActioned: false,
    isRead: true,
    expectedTimeline: '30_days',
    estimatedLiquidity: 95,
    confidence: 88,
    metadata: {
      keyDates: ['Tender window 18–24 Dec 2025'],
      people: ['VLS Finance Limited (issuer)'],
      signalType: 'Buyback / tender offer',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'nureca-buyback-2025',
    type: 'buyback',
    severity: 'medium',
    title: 'Nureca — Buyback with verification date',
    description:
      'Tender offer open 18–24 Dec 2025; post-tender verification slated for 1 Jan 2026.',
    source: 'IPO Central',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    estimatedLiquidity: 80,
    confidence: 84,
    metadata: {
      keyDates: ['Open 18 Dec 2025', 'Close 24 Dec 2025', 'Verification 1 Jan 2026'],
      people: ['Nureca', 'Public shareholders'],
      signalType: 'Buyback / tender offer',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'covidh-open-offer-2025',
    type: 'open_offer',
    severity: 'critical',
    title: 'Covidh Technologies — Open offer tendering',
    description:
      'Open offer tendering running 23 Dec 2025 to 6 Jan 2026; primary cash-out event under takeover regulations.',
    source: 'Dubai Financial Services Authority',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    estimatedLiquidity: 220,
    confidence: 91,
    metadata: {
      keyDates: ['Tendering 23 Dec 2025 → 6 Jan 2026'],
      people: ['Promoter group references (e.g., Mr. Ganapa Narsi Reddy)'],
      signalType: 'Open offer / tendering period',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'avishkar-open-offer-2025',
    type: 'open_offer',
    severity: 'high',
    title: 'Avishkar Infra Realty — Open offer live',
    description:
      'Open offer window 23 Dec 2025 to 6 Jan 2026 after earlier allotment triggered SAST obligations.',
    source: 'Dubai Financial Services Authority',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    isActioned: false,
    isRead: true,
    expectedTimeline: '30_days',
    estimatedLiquidity: 140,
    confidence: 86,
    metadata: {
      keyDates: ['Tendering 23 Dec 2025 → 6 Jan 2026'],
      people: ['Acquirer + PACs'],
      signalType: 'Open offer / tendering period',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'mcx-stock-split-2026',
    type: 'stock_split',
    severity: 'medium',
    title: 'Aldar Properties — Stock split record date',
    description:
      'Record date set for 2 Jan 2026; split drives liquidity and trading volume around eligibility.',
    source: 'Gulf News',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_days',
    estimatedLiquidity: 65,
    confidence: 82,
    metadata: {
      keyDates: ['Record date 2 Jan 2026'],
      people: ['Aldar shareholders'],
      signalType: 'Stock split',
      window: '0–30 days (by 21 Jan 2026)',
    },
  },
  {
    id: 'harmony-open-offer-2026',
    type: 'open_offer',
    severity: 'high',
    title: 'Harmony Capital Services — Open offer upcoming',
    description:
      'Tendering slated for 13–27 Jan 2026; cash-settlement mechanics relevant for post-offer liquidity.',
    source: 'Arabian Business',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '30_60_days',
    estimatedLiquidity: 110,
    confidence: 87,
    metadata: {
      keyDates: ['Tendering 13 Jan 2026 → 27 Jan 2026'],
      people: ['Al Noor Holdings LLC (acquirer)', 'Khalid Al-Mansouri (LOF signatory)'],
      signalType: 'Open offer / tendering period',
      window: '30–60 days (22 Jan → 20 Feb 2026)',
    },
  },
  {
    id: 'hul-demerger-2026',
    type: 'demerger',
    severity: 'medium',
    title: 'Savola Group — Food division demerger listing expected',
    description:
      'Listing for the demerged ice cream unit expected Feb 2026; value unlock and rebalancing catalyst.',
    source: 'Gulf News',
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    isActioned: false,
    isRead: true,
    expectedTimeline: '30_60_days',
    estimatedLiquidity: 300,
    confidence: 83,
    metadata: {
      keyDates: ['Listing expected Feb 2026'],
      people: ['Savola shareholders (record date already done)'],
      signalType: 'Demerger / value unlock',
      window: '30–60 days (22 Jan → 20 Feb 2026)',
    },
  },
  {
    id: 'airtel-rights-call-2026',
    type: 'rights_call',
    severity: 'high',
    title: 'stc — Partly-paid shares call',
    description:
      'Call money on partly-paid shares with record date 6 Feb 2026 and payment window 2–16 Mar 2026.',
    source: 'Saxo Bank',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '60_90_days',
    estimatedLiquidity: 275,
    confidence: 89,
    metadata: {
      keyDates: ['Record date 6 Feb 2026', 'Payment window 2–16 Mar 2026'],
      people: ['Holders of partly paid-up shares'],
      signalType: 'Rights/partly-paid call',
      window: '60–90 days (21 Feb → 21 Mar 2026)',
    },
  },
  {
    id: 'covidh-open-offer-settlement-2026',
    type: 'open_offer',
    severity: 'medium',
    title: 'Covidh Technologies — Open offer settlement milestone',
    description:
      'Settlement completion milestone shown as 20 Jan 2026; downstream liquidity depends on acceptance levels.',
    source: 'Dubai Financial Services Authority',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    isActioned: false,
    isRead: false,
    expectedTimeline: '60_90_days',
    estimatedLiquidity: 90,
    confidence: 80,
    metadata: {
      keyDates: ['Settlement milestone 20 Jan 2026'],
      people: ['Offer participants'],
      signalType: 'Open offer settlement',
      window: '60–90 days (21 Feb → 21 Mar 2026)',
    },
  },
];
