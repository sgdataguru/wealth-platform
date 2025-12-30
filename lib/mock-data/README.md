# Mock Data for Data Sources Demo

This directory contains mock data for demonstrating the multi-source data aggregation feature (Story #10).

## Overview

The mock data simulates responses from 6 different data sources:
1. **PrivateCircle** - VC/PE funding data
2. **Zauba Corp** - MCA filings and company data
3. **NSE India** - IPO filings from National Stock Exchange
4. **BSE India** - IPO filings from Bombay Stock Exchange
5. **NewsAPI** - Business news and announcements
6. **Public Domain** - General public information

## Files

### `data-sources-mock.ts`

Main mock data file containing:
- Data source statuses
- Ingestion metrics
- Data conflicts
- Audit logs
- Sample events from each source

## API Endpoints

All endpoints are located in `/app/api/data-sources/`:

### 1. Get Data Source Statuses

```typescript
GET /api/data-sources/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": "privatecircle",
        "name": "PrivateCircle",
        "type": "api",
        "status": "online",
        "lastSync": "2025-12-19T10:30:00Z",
        "nextSync": "2025-12-19T10:45:00Z",
        "reliability": 92,
        "uptime": 98.5,
        "errorRate": 1.2,
        "averageLatency": 320,
        "dataQuality": 88
      }
      // ... more sources
    ],
    "stats": {
      "totalSources": 6,
      "onlineSources": 5,
      "degradedSources": 1,
      "offlineSources": 0,
      "pendingConflicts": 2,
      "totalRecordsToday": 15847,
      "systemHealth": 95,
      "avgDataQuality": 87
    }
  }
}
```

### 2. Get Ingestion Metrics

```typescript
GET /api/data-sources/metrics
GET /api/data-sources/metrics?sourceId=privatecircle
```

**Response (All Sources):**
```json
{
  "success": true,
  "data": {
    "aggregated": {
      "totalRecords": 15847,
      "newRecords": 234,
      "updatedRecords": 89,
      "duplicates": 45,
      "errors": 7,
      "processingTime": 4235,
      "dataFreshness": 5
    },
    "bySource": {
      "privatecircle": { /* source metrics */ },
      "zauba": { /* source metrics */ }
      // ... other sources
    }
  }
}
```

**Response (Single Source):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 3245,
    "newRecords": 67,
    "updatedRecords": 23,
    "duplicates": 12,
    "errors": 2,
    "processingTime": 890,
    "dataFreshness": 5
  }
}
```

### 3. Get Data Conflicts

```typescript
GET /api/data-sources/conflicts
GET /api/data-sources/conflicts?status=pending
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conflicts": [
      {
        "id": "conflict-001",
        "entityType": "company",
        "entityId": "comp-zomato",
        "field": "funding_amount",
        "conflictingValues": [
          {
            "source": "PrivateCircle",
            "value": 250000000,
            "confidence": 85,
            "timestamp": "2025-12-18T10:30:00Z"
          },
          {
            "source": "NewsAPI",
            "value": 275000000,
            "confidence": 65,
            "timestamp": "2025-12-18T11:15:00Z"
          }
        ],
        "suggestedResolution": {
          "value": 250000000,
          "reasoning": "PrivateCircle has higher reliability and confidence"
        },
        "status": "pending",
        "createdAt": "2025-12-18T11:20:00Z"
      }
      // ... more conflicts
    ],
    "summary": {
      "total": 3,
      "pending": 2,
      "resolved": 1,
      "escalated": 0
    }
  }
}
```

### 4. Resolve Conflict

```typescript
POST /api/data-sources/conflicts
```

**Request Body:**
```json
{
  "conflictId": "conflict-001",
  "selectedValue": 250000000,
  "reasoning": "PrivateCircle data verified with company",
  "overrideSources": ["NewsAPI"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conflictId": "conflict-001",
    "status": "resolved",
    "resolution": {
      "selectedValue": 250000000,
      "reasoning": "PrivateCircle data verified with company",
      "overrideSources": ["NewsAPI"],
      "resolvedAt": "2025-12-19T10:35:00Z"
    }
  }
}
```

### 5. Get Audit Logs

```typescript
GET /api/data-sources/audit-logs
GET /api/data-sources/audit-logs?sourceId=privatecircle&limit=10
GET /api/data-sources/audit-logs?action=sync&status=success
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-001",
        "sourceId": "privatecircle",
        "sourceName": "PrivateCircle",
        "action": "sync",
        "status": "success",
        "recordsProcessed": 67,
        "errors": [],
        "timestamp": "2025-12-19T10:30:00Z",
        "duration": 890
      }
      // ... more logs
    ],
    "summary": {
      "total": 8,
      "success": 6,
      "failure": 1,
      "partial": 1
    }
  }
}
```

## Mock Data Details

### Data Sources (6 sources)

| Source | Type | Status | Reliability | Uptime | Data Quality |
|--------|------|--------|-------------|--------|--------------|
| PrivateCircle | API | Online | 92% | 98.5% | 88% |
| Zauba Corp | Scraper | Online | 95% | 99.2% | 95% |
| NSE India | API | Online | 98% | 99.8% | 99% |
| BSE India | API | Degraded | 96% | 97.5% | 97% |
| NewsAPI | API | Online | 85% | 96.0% | 75% |
| Public Domain | Scraper | Online | 78% | 94.0% | 70% |

### Sample Events

**PrivateCircle Events (5 funding rounds):**
- TechVenture Solutions: $250M Series B
- GreenEnergy Innovations: $75M Series A
- FinTech Pro Services: $500M Pre-IPO
- HealthTech Diagnostics: $180M Series C
- EdTech Learning Platform: $15M Seed

**Zauba Corp Events (4 MCA filings):**
 - Dubai Infra Developers: Director change
 - Riyadh Real Estate Holdings: Share transfer
 - Doha Tech Ventures: Filing update
 - Manama Manufacturing: Director change

**IPO Events (4 filings):**
- CloudTech Solutions: $1,200 Million DRHP filed (NSE)
- Renewable Energy Corp: $850 Million prospectus (BSE)
- Fintech Payments Gateway: $1,500 Million approved (NSE)
- Logistics & Supply Chain: $600 Million DRHP filed (BSE)

**News Events (6 articles):**
- Various company funding announcements
- IPO filing news
- Board changes and expansions

### Data Conflicts (3 conflicts)

1. **Zomato Funding Amount**
   - PrivateCircle: $250M (confidence: 85%)
   - NewsAPI: $275M (confidence: 65%)
   - Status: Pending

2. **Rajesh Kumar Role**
   - Zauba Corp: Managing Director (confidence: 95%)
   - Public Domain: Director (confidence: 70%)
   - Status: Pending

3. **Tech Co IPO Size**
  - NSE: $5,000 Million (confidence: 99%)
  - NewsAPI: $4,800 Million (confidence: 60%)
   - Status: Resolved

### Audit Logs (8 entries)

Recent sync operations from all sources, including:
- Successful syncs (6)
- Partial success with errors (1)
- Failed sync with timeout (1)

## Helper Functions

The mock data file includes several helper functions:

```typescript
// Get data source by ID
getDataSourceById(id: string): DataSource | undefined

// Get all online sources
getOnlineDataSources(): DataSource[]

// Get pending conflicts only
getPendingConflicts(): DataConflict[]

// Get recent audit logs (last N)
getRecentAuditLogs(limit: number): AuditLog[]

// Get logs by source
getAuditLogsBySource(sourceId: string): AuditLog[]

// Get all events for a company
getEventsByCompany(companyName: string): {
  privateCircle: PrivateCircleEvent[];
  zauba: ZaubaEvent[];
  ipo: IPOEvent[];
  news: NewsEvent[];
}

// Calculate system health score
calculateSystemHealth(): number

// Get aggregated stats
getAggregatedStats(): {
  totalSources: number;
  onlineSources: number;
  degradedSources: number;
  offlineSources: number;
  pendingConflicts: number;
  totalRecordsToday: number;
  systemHealth: number;
  avgDataQuality: number;
}
```

## Usage in Components

### Example: Fetching Data Sources

```typescript
'use client';

import { useEffect, useState } from 'react';

export function DataSourceMonitoring() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      const response = await fetch('/api/data-sources/status');
      const { data } = await response.json();
      setSources(data.sources);
      setLoading(false);
    }

    fetchSources();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSources, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </div>
  );
}
```

### Example: Resolving Conflicts

```typescript
async function resolveConflict(conflictId: string, selectedValue: any) {
  const response = await fetch('/api/data-sources/conflicts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conflictId,
      selectedValue,
      reasoning: 'Verified with primary source',
      overrideSources: ['NewsAPI'],
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Conflict resolved:', result.data);
  }
}
```

## Demo Mode

To enable demo mode in your application:

1. Set environment variable: `NEXT_PUBLIC_DEMO_MODE=true`
2. All API calls will use mock data
3. No external API keys required
4. Perfect for presentations and testing

## Future Enhancements

- [ ] Add WebSocket support for real-time updates
- [ ] Implement caching layer with Redis
- [ ] Add more diverse conflict scenarios
- [ ] Include historical data trends
- [ ] Add data quality scoring algorithms
- [ ] Implement ML-based conflict resolution suggestions

---

**Created**: 2025-12-19  
**Last Updated**: 2025-12-19  
**Version**: 1.0.0
