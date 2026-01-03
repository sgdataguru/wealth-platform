# Prospects View Update - Middle East Segmentation & Wallet Share

## Summary of Changes

This update enhances the Prospects view with realistic Middle East market segmentation, client tier classifications, and wallet share estimates to help RMs prioritize and manage prospects more effectively.

## Key Features Added

### 1. Client Tier Classification
Prospects are now categorized into three tiers based on Middle East wealth benchmarks:

- **UHNW (Ultra-High-Net-Worth)**: $85M - $320M total wealth
  - 5 prospects in this tier
  - Wallet share: 18-35%
  - Visual: Gold badge (`#C9A84A`)
  
- **HNW (High-Net-Worth)**: $35M - $55M total wealth
  - 6 prospects in this tier
  - Wallet share: 12-22%
  - Visual: Teal badge (`#007B7A`)
  
- **Emerging**: $8M - $12M total wealth
  - 3 prospects in this tier
  - Wallet share: 8-10%
  - Visual: Silver badge (`#BFC9CC`)

### 2. Regional Segments
Three Middle East-specific segments aligned with local market structure:

- **Family Office**: Multi-generational wealth management (5 prospects)
- **PE-backed**: Private equity-supported businesses (5 prospects)
- **Founder-led**: Entrepreneur-driven companies (4 prospects)

### 3. Wallet Share Intelligence
Each prospect now displays:
- **Wallet Share %**: Percentage of total wealth managed by the platform
- **Estimated Total Wealth**: Total wealth in USD millions
- Enables quick ROI assessment and prioritization

## UI Components Updated

### EnhancedProspectCard
- Added tier badge next to prospect name (color-coded by tier)
- Added segment badge below company name
- New wallet share section with:
  - Large, prominent wallet share percentage
  - Total wealth display
  - Professional layout with background and border

### FilterPanel
- Added "Segment" filter section
  - Options: Family Office, PE-backed, Founder-led
- Added "Client Tier" filter section
  - Options: UHNW, HNW, Emerging
- Both integrate seamlessly with existing filter system

## Data Distribution

### By Tier:
- UHNW: 5 prospects (36%)
- HNW: 6 prospects (43%)
- Emerging: 3 prospects (21%)

### By Segment:
- Family Office: 5 prospects (36%)
- PE-backed: 5 prospects (36%)
- Founder-led: 4 prospects (29%)

### By Location:
- Dubai: 7 prospects
- Abu Dhabi: 5 prospects
- Riyadh: 2 prospects
- Doha: 2 prospects

## Sample Prospect Data

### Example 1: Abdullah Al Suwaidi (UHNW, Family Office)
- **Location**: Doha
- **Sector**: Finance
- **Total Wealth**: $320M
- **Wallet Share**: 35%
- **Lead Score**: 93 (Excellent)
- **Segment**: Family Office
- **Tier**: UHNW

### Example 2: Ali Al Saud (HNW, Founder-led)
- **Location**: Riyadh
- **Sector**: Clean Energy
- **Total Wealth**: $42M
- **Wallet Share**: 12%
- **Lead Score**: 72 (Good)
- **Segment**: Founder-led
- **Tier**: HNW

### Example 3: Latifa Al Qasimi (Emerging, Founder-led)
- **Location**: Dubai
- **Sector**: Retail
- **Total Wealth**: $8.5M
- **Wallet Share**: 8%
- **Lead Score**: 45 (Fair)
- **Segment**: Founder-led
- **Tier**: Emerging

## Technical Changes

### Type System Updates
```typescript
// New client tier type
export type ClientTier = 'UHNW' | 'HNW' | 'Emerging';

// Updated Prospect interface
export interface Prospect {
  // ... existing fields
  clientTier?: ClientTier;
  segment?: string;
  totalWealth?: number;
  walletShare?: number;
}

// Updated filter types
export type FilterType = 
  | 'cities' 
  | 'sectors' 
  | 'network_ids' 
  | 'cluster_ids' 
  | 'prospect_types' 
  | 'segments'  // NEW
  | 'tiers';    // NEW
```

### Filter Store Updates
- Added `segments` and `tiers` to `AppliedFilters` interface
- Added search queries for new filter types
- Updated persistence logic to include new filters

### API Updates
- `/api/filters/options` now returns:
  - `segments`: ['Family Office', 'PE-backed', 'Founder-led']
  - `tiers`: ['UHNW', 'HNW', 'Emerging']

## Files Modified

1. **types/index.ts**
   - Added `ClientTier` type
   - Updated `Prospect` interface

2. **types/filter.types.ts**
   - Updated `FilterType`
   - Updated `FilterOptions`
   - Updated `AppliedFilters`
   - Updated search queries

3. **store/filter-store.ts**
   - Added new filter fields to initial state
   - Updated all persistence methods

4. **app/api/filters/options/route.ts**
   - Added segments and tiers to filter options

5. **app/prospects/page.tsx**
   - Updated all 14 mock prospects with new fields
   - Added filter logic for segments and tiers

6. **app/prospects/components/FilterPanel.tsx**
   - Added Segment filter section
   - Added Client Tier filter section

7. **app/components/features/EnhancedProspectCard.tsx**
   - Added tier badge rendering
   - Added segment badge rendering
   - Added wallet share display section

## Color Scheme (Kairos Capital Branding)

### Tier Badges:
- **UHNW**: Gold (`#C9A84A`) - Premium/prestige
- **HNW**: Teal (`#007B7A`) - Trust/confidence
- **Emerging**: Silver (`#BFC9CC`) - Professional/refined

### Wallet Share Section:
- Background: Off-white (`#F6F8F8`)
- Border: Platinum (`#E9ECEC`)
- Wallet Share Text: Teal (`#007B7A`)
- Total Wealth Text: Ink (`#1A1A2E`)

## Business Impact

### For Relationship Managers:
1. **Faster Prioritization**: Wallet share % allows quick identification of high-value opportunities
2. **Better Targeting**: Tier and segment filters enable focused prospecting
3. **Commercial Clarity**: Total wealth + wallet share = clear ROI picture

### For Sales Strategy:
1. **Segment-specific Approaches**: Tailor strategies for Family Office vs PE-backed vs Founder-led
2. **Tier-based Resource Allocation**: Focus high-touch service on UHNW tier
3. **Growth Opportunities**: Low wallet share + high total wealth = expansion potential

## Next Steps

Future enhancements could include:
1. Wallet share trend analysis (increasing/decreasing)
2. Segment-specific KPIs and benchmarks
3. Tier transition tracking (Emerging → HNW → UHNW)
4. Competitive wallet share intelligence
5. Automated tier reassessment based on wealth updates

## Testing Notes

- All TypeScript compilation passes
- Filter logic tested for segments and tiers
- Mock data reflects realistic ME market conditions
- UI components render tier badges and wallet share correctly
- No calculation engine changes (as requested)
