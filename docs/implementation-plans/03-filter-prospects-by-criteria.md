# [03] Filter Prospects by Criteria - Implementation Planning

## Project Context
**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS, Radix UI
**Backend**: Supabase (PostgreSQL), Neo4j Aura (Graph DB)
**State Management**: Zustand + Server Components
**Infrastructure**: Vercel (Frontend), Supabase (Backend)

## User Story

As a Relationship Manager, I want to filter prospects by city, sector, network, and clusters, so that I can focus on clients within my area of responsibility or interest.

## Pre-conditions

- User is authenticated as a Relationship Manager
- Client/prospect data exists in Supabase database with associated metadata
- Lead scores are calculated and available (Story #2 dependency)
- Client data includes city, sector, network, and cluster information
- Filter UI is integrated with the main dashboard/clients view

## Business Requirements

- **Enable targeted prospecting**: RMs can narrow down prospects to relevant segments
- **Improve efficiency**: Reduce time to identify actionable prospects by 60%
- **Support territory management**: City filters help RMs manage geographical areas
- **Enable sector specialization**: RMs can focus on industries they understand best
- **Facilitate network-based selling**: Leverage existing connections for warm intros
- **Success Metric**: 85% of RMs use filters at least once per session
- **Success Metric**: Average filter application time < 5 seconds
- **Success Metric**: 70% reduction in irrelevant prospect views

## Technical Specifications

### Integration Points
- **Authentication**: Supabase Auth (JWT-based) for RM identity
- **Database**: Supabase PostgreSQL for client/prospect data
- **Graph Database**: Neo4j for network/cluster relationships
- **State Management**: Zustand for filter state persistence across sessions
- **URL State**: Next.js searchParams for shareable filter combinations

### Security Requirements
- Row-level security (RLS) in Supabase - RMs see only authorized clients
- Filter queries use parameterized statements (SQL injection prevention)
- API rate limiting on filter endpoints
- Audit logging for filter usage patterns
- No exposure of unauthorized client data through filter aggregations

### Data Schema

```typescript
// Supabase PostgreSQL Schema Extensions
interface Client {
  id: string;
  name: string;
  company: string;
  estimated_wealth: number;
  rm_id: string;
  
  // Filter Fields
  city: string; // Mumbai, Delhi, Bangalore, etc.
  sector: string; // Technology, Finance, Manufacturing, etc.
  network_id: string | null; // Reference to network/cluster
  cluster_tags: string[]; // Array of cluster identifiers
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

interface Network {
  id: string;
  name: string; // "IIT Alumni", "TiE Network", "YPO"
  description: string;
  member_count: number;
  created_at: Date;
}

interface Cluster {
  id: string;
  name: string; // "Fintech Founders", "Second-gen Industrialists"
  description: string;
  criteria: Record<string, any>; // Clustering logic
  member_count: number;
  created_at: Date;
}

interface FilterOptions {
  cities: string[];
  sectors: string[];
  networks: Network[];
  clusters: Cluster[];
}

interface AppliedFilters {
  cities: string[];
  sectors: string[];
  network_ids: string[];
  cluster_ids: string[];
}
```

## Design Specifications

### Visual Layout & Components

**Main Layout Structure**:
```
[Header - Fixed]
├── Logo + Navigation
└── RM Profile Menu

[Main Content Area]
├── [Filter Panel - Sticky Sidebar] (1/4 width)
│   ├── Filter Header
│   │   ├── "Filters" Title
│   │   └── "Clear All" Button
│   │
│   ├── City Filter
│   │   ├── Search Input
│   │   ├── City Checkboxes (Multi-select)
│   │   └── Selected Count Badge
│   │
│   ├── Sector Filter
│   │   ├── Search Input
│   │   ├── Sector Checkboxes (Multi-select)
│   │   └── Selected Count Badge
│   │
│   ├── Network Filter
│   │   ├── Search Input
│   │   ├── Network Checkboxes (Multi-select)
│   │   └── Selected Count Badge
│   │
│   ├── Cluster Filter
│   │   ├── Search Input
│   │   ├── Cluster Checkboxes (Multi-select)
│   │   └── Selected Count Badge
│   │
│   └── Apply Filters Button
│
└── [Prospects Grid] (3/4 width)
    ├── [Active Filters Bar]
    │   ├── Filter Pills (removable)
    │   ├── Results Count ("X prospects found")
    │   └── Sort Dropdown
    │
    └── [Client Cards Grid]
        └── (Filtered prospects displayed)

[Mobile Layout - Collapsed Filters]
├── [Filter Toggle Button - Floating]
│   └── Opens bottom sheet with filters
│
└── [Filter Bottom Sheet - Mobile]
    ├── All filters in accordion
    └── Apply & Close buttons
```

**Component Hierarchy**:
```tsx
<DashboardLayout>
  <Header />
  
  <MainContent className="flex">
    {/* Desktop: Sidebar, Mobile: Bottom Sheet */}
    <FilterPanel
      options={filterOptions}
      appliedFilters={filters}
      onFilterChange={handleFilterChange}
      onClearAll={clearAllFilters}
      resultCount={filteredCount}
    >
      <FilterHeader />
      
      <CityFilter
        cities={filterOptions.cities}
        selected={filters.cities}
        onChange={updateCityFilters}
      />
      
      <SectorFilter
        sectors={filterOptions.sectors}
        selected={filters.sectors}
        onChange={updateSectorFilters}
      />
      
      <NetworkFilter
        networks={filterOptions.networks}
        selected={filters.network_ids}
        onChange={updateNetworkFilters}
      />
      
      <ClusterFilter
        clusters={filterOptions.clusters}
        selected={filters.cluster_ids}
        onChange={updateClusterFilters}
      />
      
      <ApplyButton onClick={applyFilters} />
    </FilterPanel>
    
    <ProspectsContent>
      <ActiveFiltersBar
        filters={filters}
        onRemoveFilter={removeFilter}
        resultCount={filteredCount}
      >
        <FilterPill />
        <FilterPill />
      </ActiveFiltersBar>
      
      <ClientsGrid clients={filteredClients}>
        <ClientCard />
        <ClientCard />
      </ClientsGrid>
    </ProspectsContent>
  </MainContent>
</DashboardLayout>
```

### Design System Compliance

**Color Palette (Premium Wealth Management)**:
```css
/* Filter Panel Colors */
--filter-bg: #FFFFFF;
--filter-border: #E1E5EB;
--filter-hover: #F8F9FA;
--filter-selected: #EBF4FF; /* Light blue tint */

/* Filter Pill Colors */
--pill-bg: #EBF4FF;
--pill-text: #1E3A5F;
--pill-border: #C9D6E8;
--pill-close-hover: #DC3545;

/* Primary Wealth Colors */
--primary-deep-blue: #0A1628;
--primary-royal-blue: #1E3A5F;
--primary-accent: #C9A227;      /* Gold accent for premium feel */

/* Checkbox States */
--checkbox-default: #E1E5EB;
--checkbox-checked: #1E3A5F;
--checkbox-hover: #C9D6E8;

/* Search Input */
--search-bg: #F8F9FA;
--search-border: #E1E5EB;
--search-focus: #1E3A5F;
```

**Typography Scale**:
```css
/* Font Families */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', 'Helvetica Neue', sans-serif;

/* Filter Typography */
.filter-header {
  font-family: var(--font-heading);
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  color: var(--text-primary);
}

.filter-section-title {
  font-family: var(--font-body);
  font-size: 0.875rem;    /* 14px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.filter-option-label {
  font-family: var(--font-body);
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  color: var(--text-primary);
}

.filter-count-badge {
  font-family: var(--font-body);
  font-size: 0.75rem;     /* 12px */
  font-weight: 600;
  color: var(--primary-royal-blue);
}

.results-count {
  font-family: var(--font-body);
  font-size: 1rem;        /* 16px */
  font-weight: 500;
  color: var(--text-secondary);
}
```

### Responsive Behavior

**Breakpoints**:
```css
/* Mobile (< 768px) - Bottom Sheet */
.filter-panel-mobile {
  @apply fixed inset-x-0 bottom-0 z-50;
  @apply transform transition-transform;
  @apply translate-y-full; /* Hidden by default */
}

.filter-panel-mobile.open {
  @apply translate-y-0;
}

.filter-toggle-button {
  @apply fixed bottom-4 right-4 z-40;
  @apply bg-primary-royal-blue text-white;
  @apply rounded-full shadow-lg;
  @apply w-14 h-14 flex items-center justify-center;
}

/* Tablet (768px - 1023px) - Collapsible Sidebar */
.filter-panel-tablet {
  @apply w-64 border-r border-gray-200;
  @apply transition-transform;
}

/* Desktop (1024px+) - Fixed Sidebar */
.filter-panel-desktop {
  @apply w-80 border-r border-gray-200 sticky top-0;
  @apply h-screen overflow-y-auto;
}

/* Large Desktop (1440px+) - Wider Sidebar */
.filter-panel-xl {
  @apply w-96;
}
```

**Layout Adaptations**:
```typescript
interface ResponsiveFilterConfig {
  mobile: {
    filterPanel: 'bottom-sheet';
    columns: 1;
    stickyHeader: true;
    maxVisibleOptions: 5; // Show top 5, then "Show more"
  };
  tablet: {
    filterPanel: 'collapsible-sidebar';
    columns: 2;
    stickyHeader: true;
    maxVisibleOptions: 10;
  };
  desktop: {
    filterPanel: 'fixed-sidebar';
    columns: 3;
    stickyHeader: false;
    maxVisibleOptions: 15;
  };
  xl: {
    filterPanel: 'fixed-sidebar';
    columns: 4;
    stickyHeader: false;
    maxVisibleOptions: 20;
  };
}
```

### Interaction Patterns

**Filter States**:
```typescript
interface FilterStates {
  default: {
    background: 'bg-white';
    border: 'border-gray-200';
    text: 'text-gray-700';
  };
  hover: {
    background: 'bg-gray-50';
    border: 'border-gray-300';
    text: 'text-gray-900';
  };
  selected: {
    background: 'bg-blue-50';
    border: 'border-blue-300';
    text: 'text-blue-900';
    icon: 'text-blue-600';
  };
  disabled: {
    background: 'bg-gray-100';
    border: 'border-gray-200';
    text: 'text-gray-400';
    cursor: 'cursor-not-allowed';
  };
}
```

**Checkbox Animation**:
```css
.filter-checkbox {
  transition: all 0.2s ease;
  
  &:checked {
    background-color: var(--checkbox-checked);
    border-color: var(--checkbox-checked);
    transform: scale(1.05);
  }
  
  &:hover {
    border-color: var(--checkbox-hover);
    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
  }
}
```

**Filter Pill Animation**:
```css
.filter-pill {
  animation: slideIn 0.2s ease;
  transition: all 0.15s ease;
  
  &:hover {
    background-color: var(--pill-hover);
    transform: scale(1.02);
  }
  
  &:hover .close-button {
    color: var(--pill-close-hover);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**Search Input Behavior**:
```typescript
interface SearchBehavior {
  debounceTime: 300; // ms
  minCharacters: 2;
  caseSensitive: false;
  highlightMatches: true;
  showNoResults: true;
}
```

## Technical Architecture

### Component Structure
```
app/
├── (dashboard)/
│   ├── clients/
│   │   ├── page.tsx                    # Main clients page with filters
│   │   ├── layout.tsx                  # Layout wrapper
│   │   └── components/
│   │       ├── FilterPanel.tsx         # Main filter sidebar/sheet
│   │       ├── FilterHeader.tsx        # Filter panel header
│   │       ├── CityFilter.tsx          # City multi-select
│   │       ├── SectorFilter.tsx        # Sector multi-select
│   │       ├── NetworkFilter.tsx       # Network multi-select
│   │       ├── ClusterFilter.tsx       # Cluster multi-select
│   │       ├── FilterSearch.tsx        # Search input for filters
│   │       ├── FilterCheckbox.tsx      # Custom checkbox component
│   │       ├── ActiveFiltersBar.tsx    # Applied filters display
│   │       ├── FilterPill.tsx          # Individual filter pill
│   │       ├── FilterToggleButton.tsx  # Mobile toggle button
│   │       ├── FilterBottomSheet.tsx   # Mobile bottom sheet
│   │       └── hooks/
│   │           ├── useFilterOptions.ts # Fetch filter options
│   │           ├── useFilterState.ts   # Filter state management
│   │           ├── useFilteredClients.ts # Apply filters to clients
│   │           └── useFilterSearch.ts  # Search within filters
│   │
│   └── layout.tsx
│
├── api/
│   ├── filters/
│   │   ├── options/route.ts            # GET filter options
│   │   └── apply/route.ts              # POST apply filters
│   │
│   └── clients/
│       ├── route.ts                    # GET clients with filters
│       └── count/route.ts              # GET filtered count
│
├── components/
│   └── ui/
│       ├── Checkbox.tsx                # Base checkbox component
│       ├── SearchInput.tsx             # Base search input
│       ├── Badge.tsx                   # Badge component (exists)
│       ├── Sheet.tsx                   # Bottom sheet component
│       └── Accordion.tsx               # Accordion component
│
├── lib/
│   ├── filters/
│   │   ├── filter-utils.ts             # Filter utility functions
│   │   ├── filter-queries.ts           # Database query builders
│   │   ├── filter-cache.ts             # Filter options caching
│   │   └── filter-validation.ts        # Filter input validation
│   │
│   └── supabase/
│       ├── client.ts                   # Supabase client
│       └── queries.ts                  # Database queries
│
├── store/
│   └── filter-store.ts                 # Zustand filter state
│
└── types/
    └── filter.types.ts                 # Filter-related types
```

### State Management Architecture

**Global Filter Store (Zustand)**:
```typescript
interface FilterStore {
  // Filter State
  appliedFilters: AppliedFilters;
  filterOptions: FilterOptions | null;
  
  // UI State
  isFilterPanelOpen: boolean; // For mobile
  isLoadingFilters: boolean;
  isApplyingFilters: boolean;
  
  // Search State
  citySearch: string;
  sectorSearch: string;
  networkSearch: string;
  clusterSearch: string;
  
  // Results
  filteredCount: number;
  
  // Actions - Filter Management
  setFilter: (filterType: FilterType, values: string[]) => void;
  addFilterValue: (filterType: FilterType, value: string) => void;
  removeFilterValue: (filterType: FilterType, value: string) => void;
  clearFilter: (filterType: FilterType) => void;
  clearAllFilters: () => void;
  
  // Actions - UI
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (open: boolean) => void;
  
  // Actions - Search
  setSearchQuery: (filterType: FilterType, query: string) => void;
  
  // Actions - Data
  loadFilterOptions: () => Promise<void>;
  applyFilters: () => Promise<void>;
  
  // Actions - Persistence
  saveFiltersToUrl: () => void;
  loadFiltersFromUrl: () => void;
  saveFiltersToStorage: () => void;
  loadFiltersFromStorage: () => void;
}
```

**Local Component State**:
```typescript
// FilterPanel component state
interface FilterPanelState {
  expandedSections: Set<string>; // Which filter sections are open
  isSticky: boolean; // For scroll behavior
  hasChanges: boolean; // Unsaved filter changes
}

// Individual Filter component state
interface FilterComponentState {
  searchQuery: string;
  visibleOptions: string[]; // After search filtering
  selectedCount: number;
  isExpanded: boolean;
}
```

### API Integration Schema

**API Endpoints**:
```typescript
// GET /api/filters/options - Get all available filter options
interface GetFilterOptionsRequest {
  rm_id?: string; // Optional: get options for specific RM
}

interface GetFilterOptionsResponse {
  success: boolean;
  data: {
    cities: string[];
    sectors: string[];
    networks: Network[];
    clusters: Cluster[];
  };
}

// GET /api/clients?[filters] - Get filtered clients
interface GetFilteredClientsRequest {
  cities?: string[]; // ?cities=Mumbai&cities=Delhi
  sectors?: string[];
  network_ids?: string[];
  cluster_ids?: string[];
  limit?: number;
  offset?: number;
  sort_by?: 'score' | 'name' | 'wealth';
  sort_order?: 'asc' | 'desc';
}

interface GetFilteredClientsResponse {
  success: boolean;
  data: {
    clients: Client[];
    total: number;
    has_more: boolean;
  };
}

// GET /api/clients/count?[filters] - Get count without fetching all data
interface GetFilteredCountRequest {
  cities?: string[];
  sectors?: string[];
  network_ids?: string[];
  cluster_ids?: string[];
}

interface GetFilteredCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}
```

### Filter Query Builder

**Supabase Query Construction**:
```typescript
/**
 * Build filtered query for clients
 * Handles multiple filter types with AND logic
 */
async function buildFilteredQuery(filters: AppliedFilters) {
  let query = supabase
    .from('clients')
    .select('*, lead_scores(*)', { count: 'exact' });
  
  // Apply city filter
  if (filters.cities.length > 0) {
    query = query.in('city', filters.cities);
  }
  
  // Apply sector filter
  if (filters.sectors.length > 0) {
    query = query.in('sector', filters.sectors);
  }
  
  // Apply network filter
  if (filters.network_ids.length > 0) {
    query = query.in('network_id', filters.network_ids);
  }
  
  // Apply cluster filter (array overlap)
  if (filters.cluster_ids.length > 0) {
    query = query.overlaps('cluster_tags', filters.cluster_ids);
  }
  
  return query;
}

/**
 * Example generated SQL
 */
const exampleSQL = `
  SELECT clients.*, lead_scores.*
  FROM clients
  LEFT JOIN lead_scores ON clients.id = lead_scores.client_id
  WHERE 
    city = ANY($1) -- ['Mumbai', 'Delhi']
    AND sector = ANY($2) -- ['Technology', 'Finance']
    AND network_id = ANY($3) -- ['net_123', 'net_456']
    AND cluster_tags && $4 -- ['cluster_xyz']
  ORDER BY lead_scores.score DESC
  LIMIT 50 OFFSET 0;
`;
```

## Implementation Requirements

### Core Components

1. **FilterPanel.tsx** - Main filter container (sidebar/bottom sheet)
2. **FilterHeader.tsx** - Header with title and clear all button
3. **CityFilter.tsx** - City multi-select with search
4. **SectorFilter.tsx** - Sector multi-select with search
5. **NetworkFilter.tsx** - Network multi-select with search
6. **ClusterFilter.tsx** - Cluster multi-select with search
7. **FilterSearch.tsx** - Reusable search input component
8. **FilterCheckbox.tsx** - Custom styled checkbox
9. **ActiveFiltersBar.tsx** - Display applied filters as pills
10. **FilterPill.tsx** - Individual removable filter pill
11. **FilterToggleButton.tsx** - Floating button for mobile
12. **FilterBottomSheet.tsx** - Mobile bottom sheet overlay

### Custom Hooks

1. **useFilterOptions()** - Fetch and cache filter options
2. **useFilterState()** - Manage filter state with Zustand
3. **useFilteredClients()** - Apply filters and fetch clients
4. **useFilterSearch()** - Search within filter options
5. **useFilterUrl()** - Sync filters with URL params
6. **useFilterPersistence()** - Save/load filters from localStorage

### Utility Functions

1. **filter-utils.ts** - Filter manipulation and validation
2. **filter-queries.ts** - Query builder for filtered data
3. **filter-cache.ts** - Caching strategies for filter options
4. **filter-validation.ts** - Input validation and sanitization
5. **filter-serialization.ts** - Serialize/deserialize for URL/storage

### API Routes

1. **/api/filters/options/route.ts** - Get all filter options
2. **/api/clients/route.ts** - Get filtered clients (MODIFY)
3. **/api/clients/count/route.ts** - Get filtered count

## Acceptance Criteria

### Functional Requirements

#### 1. Filter Availability
- ✅ Filter panel is accessible from main dashboard/clients page
- ✅ Four filter types available: City, Sector, Network, Clusters
- ✅ Each filter displays all available options
- ✅ Filter options are loaded from database on mount

#### 2. Multi-Filter Application
- ✅ Multiple filters can be applied simultaneously (AND logic)
- ✅ Within each filter type, multiple values can be selected (OR logic)
- ✅ Example: (City = Mumbai OR Delhi) AND (Sector = Tech OR Finance)
- ✅ Filters persist across page navigation

#### 3. Real-time Updates
- ✅ Prospect list updates immediately when filters are applied
- ✅ Results count updates in real-time as filters change
- ✅ No page reload required for filter changes
- ✅ Loading states shown during filter application

#### 4. Filter Visibility
- ✅ Active filters clearly indicated with pills/badges
- ✅ Each filter section shows selected count
- ✅ Applied filters displayed in prominent bar above results
- ✅ Filter pills are removable individually

#### 5. Filter Management
- ✅ "Clear All" button removes all filters at once
- ✅ Individual filter pills have close (X) button
- ✅ Filters can be reset to default state
- ✅ Filter state persists in URL (shareable links)
- ✅ Filter state persists in localStorage (session continuity)

#### 6. Search Within Filters
- ✅ Each filter has a search input
- ✅ Search filters available options in real-time
- ✅ Case-insensitive search
- ✅ Debounced search (300ms delay)

#### 7. Responsive Behavior
- ✅ Desktop: Fixed sidebar on left
- ✅ Tablet: Collapsible sidebar
- ✅ Mobile: Bottom sheet with toggle button
- ✅ All interactions work on touch devices

### Non-Functional Requirements

#### Performance
- Initial filter options load < 500ms
- Filter application response < 300ms
- Search within filter < 100ms (debounced)
- Support for 500+ clients without performance degradation
- Smooth animations at 60fps

#### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all filter interactions
- Screen reader announcements for filter changes
- Focus management in bottom sheet
- Proper ARIA labels and roles

#### Security
- Parameterized queries (SQL injection prevention)
- Row-level security enforced
- API rate limiting
- Input sanitization for all user inputs
- No exposure of unauthorized data

#### Usability
- Intuitive filter UI following Kairos Capital branding
- Clear visual feedback for all interactions
- Undo capability (clear individual filter)
- Filter state persists across sessions
- Shareable filter combinations via URL

## Modified Files

```
app/
├── (dashboard)/
│   ├── clients/
│   │   ├── page.tsx ⬜ MODIFIED (integrate filters)
│   │   └── components/
│   │       ├── FilterPanel.tsx ⬜ NEW
│   │       ├── FilterHeader.tsx ⬜ NEW
│   │       ├── CityFilter.tsx ⬜ NEW
│   │       ├── SectorFilter.tsx ⬜ NEW
│   │       ├── NetworkFilter.tsx ⬜ NEW
│   │       ├── ClusterFilter.tsx ⬜ NEW
│   │       ├── FilterSearch.tsx ⬜ NEW
│   │       ├── FilterCheckbox.tsx ⬜ NEW
│   │       ├── ActiveFiltersBar.tsx ⬜ NEW
│   │       ├── FilterPill.tsx ⬜ NEW
│   │       ├── FilterToggleButton.tsx ⬜ NEW
│   │       ├── FilterBottomSheet.tsx ⬜ NEW
│   │       └── hooks/
│   │           ├── useFilterOptions.ts ⬜ NEW
│   │           ├── useFilterState.ts ⬜ NEW
│   │           ├── useFilteredClients.ts ⬜ NEW
│   │           ├── useFilterSearch.ts ⬜ NEW
│   │           ├── useFilterUrl.ts ⬜ NEW
│   │           └── useFilterPersistence.ts ⬜ NEW
│   │
│   └── api/
│       ├── filters/
│       │   └── options/route.ts ⬜ NEW
│       │
│       └── clients/
│           ├── route.ts ⬜ MODIFIED (add filter params)
│           └── count/route.ts ⬜ NEW
│
├── components/
│   └── ui/
│       ├── Checkbox.tsx ⬜ NEW
│       ├── SearchInput.tsx ⬜ NEW
│       ├── Sheet.tsx ⬜ NEW
│       └── Accordion.tsx ⬜ NEW
│
├── lib/
│   ├── filters/
│   │   ├── filter-utils.ts ⬜ NEW
│   │   ├── filter-queries.ts ⬜ NEW
│   │   ├── filter-cache.ts ⬜ NEW
│   │   ├── filter-validation.ts ⬜ NEW
│   │   └── filter-serialization.ts ⬜ NEW
│   │
│   └── supabase/
│       └── queries.ts ⬜ MODIFIED
│
├── store/
│   └── filter-store.ts ⬜ NEW
│
└── types/
    └── filter.types.ts ⬜ NEW

Database Migrations:
├── supabase/
│   └── migrations/
│       ├── 005_add_filter_fields_to_clients.sql ⬜ NEW
│       ├── 006_create_networks_table.sql ⬜ NEW
│       ├── 007_create_clusters_table.sql ⬜ NEW
│       └── 008_create_filter_indexes.sql ⬜ NEW
```

## Implementation Status

**OVERALL STATUS: ⬜ NOT STARTED**

### Phase 1: Foundation & Setup ⬜ NOT STARTED
- [ ] Database schema updates (networks, clusters)
- [ ] TypeScript types and interfaces
- [ ] Base UI components (Checkbox, SearchInput, Sheet)
- [ ] Filter store with Zustand
- [ ] API route structure

**Estimated Time: 2 days**

### Phase 2: Filter Logic & API ⬜ NOT STARTED
- [ ] Filter query builder utilities
- [ ] API endpoint for filter options
- [ ] API endpoint modifications for filtered clients
- [ ] Filter validation and sanitization
- [ ] Caching strategy for filter options

**Estimated Time: 2 days**

### Phase 3: UI Components ⬜ NOT STARTED
- [ ] FilterPanel container (desktop sidebar)
- [ ] Individual filter components (City, Sector, Network, Cluster)
- [ ] FilterCheckbox with custom styling
- [ ] FilterSearch component
- [ ] FilterHeader with clear all
- [ ] ActiveFiltersBar with pills

**Estimated Time: 3 days**

### Phase 4: Mobile Experience ⬜ NOT STARTED
- [ ] FilterBottomSheet component
- [ ] FilterToggleButton (floating action button)
- [ ] Mobile-optimized filter layout
- [ ] Touch gesture support
- [ ] Responsive breakpoints

**Estimated Time: 2 days**

### Phase 5: State Management & Persistence ⬜ NOT STARTED
- [ ] useFilterState hook with Zustand
- [ ] useFilteredClients hook
- [ ] URL synchronization (useFilterUrl)
- [ ] localStorage persistence
- [ ] Filter state restoration on mount

**Estimated Time: 2 days**

### Phase 6: Search & Interactions ⬜ NOT STARTED
- [ ] useFilterSearch hook
- [ ] Debounced search implementation
- [ ] Filter pill interactions (remove)
- [ ] Clear all functionality
- [ ] Keyboard navigation
- [ ] Focus management

**Estimated Time: 2 days**

### Phase 7: Polish & Testing ⬜ NOT STARTED
- [ ] Animations and transitions
- [ ] Loading and error states
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Responsive design refinements
- [ ] Unit tests for filter logic
- [ ] Integration tests for API
- [ ] E2E tests for filter workflows

**Estimated Time: 2 days**

**Total Estimated Time: 15 days (3 weeks)**

## Dependencies

### Internal Dependencies
- ✅ Authentication system (Supabase Auth)
- ⚠️ **Story #2**: Lead scores (for sorting filtered results)
- ✅ Client data structure
- ✅ Design system components (Button, Card, Badge)
- ✅ Next.js App Router

### External Dependencies
- Supabase PostgreSQL database
- Neo4j Aura (for network/cluster data - optional)
- Zustand for state management
- React Hook Form (if using form wrapper)

## Risk Assessment

### Technical Risks

#### 1. Query Performance with Multiple Filters
- **Impact**: High
- **Probability**: Medium
- **Mitigation**:
  - Database indexes on filter columns
  - Query optimization with EXPLAIN ANALYZE
  - Pagination to limit result set
  - Client-side caching of filter options
- **Contingency**: Implement filter result caching, reduce filter granularity

#### 2. Complex State Management
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**:
  - Use Zustand for clear, predictable state
  - URL state as single source of truth
  - Comprehensive state tests
- **Contingency**: Simplify filter logic, reduce state complexity

#### 3. Mobile UX Complexity
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**:
  - Bottom sheet pattern (familiar UX)
  - Touch-optimized checkboxes
  - User testing on mobile devices
- **Contingency**: Simplified mobile filter UI, reduce available filters on mobile

#### 4. Filter Option Staleness
- **Impact**: Low
- **Probability**: Medium
- **Mitigation**:
  - Cache invalidation strategy
  - Periodic background refresh
  - Manual refresh button
- **Contingency**: Accept some staleness, focus on critical filters

### Business Risks

#### 1. RM Filter Adoption
- **Impact**: High
- **Probability**: Low
- **Mitigation**:
  - Intuitive UI design
  - Training and documentation
  - Default to no filters (show all)
- **Contingency**: Simplify filters, provide presets

#### 2. Over-Filtering (Too Many Options)
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**:
  - Search within filters
  - Most-used filters prioritized
  - Collapsible sections
- **Contingency**: Reduce available options, add "Popular" section

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('Filter Query Builder', () => {
  it('should build query with single city filter', () => {
    const filters = { cities: ['Mumbai'], sectors: [], network_ids: [], cluster_ids: [] };
    const query = buildFilteredQuery(filters);
    
    expect(query.toString()).toContain('city = ANY');
  });
  
  it('should build query with multiple filter types', () => {
    const filters = {
      cities: ['Mumbai', 'Delhi'],
      sectors: ['Technology'],
      network_ids: ['net_123'],
      cluster_ids: []
    };
    const query = buildFilteredQuery(filters);
    
    expect(query.toString()).toContain('city = ANY');
    expect(query.toString()).toContain('sector = ANY');
    expect(query.toString()).toContain('network_id = ANY');
  });
  
  it('should handle empty filters', () => {
    const filters = { cities: [], sectors: [], network_ids: [], cluster_ids: [] };
    const query = buildFilteredQuery(filters);
    
    // Should return all clients (no WHERE clauses)
    expect(query.toString()).not.toContain('WHERE');
  });
});

describe('Filter State Management', () => {
  it('should add filter value', () => {
    const store = useFilterStore.getState();
    store.addFilterValue('cities', 'Mumbai');
    
    expect(store.appliedFilters.cities).toContain('Mumbai');
  });
  
  it('should remove filter value', () => {
    const store = useFilterStore.getState();
    store.setFilter('cities', ['Mumbai', 'Delhi']);
    store.removeFilterValue('cities', 'Mumbai');
    
    expect(store.appliedFilters.cities).toEqual(['Delhi']);
  });
  
  it('should clear all filters', () => {
    const store = useFilterStore.getState();
    store.setFilter('cities', ['Mumbai']);
    store.setFilter('sectors', ['Technology']);
    store.clearAllFilters();
    
    expect(store.appliedFilters.cities).toEqual([]);
    expect(store.appliedFilters.sectors).toEqual([]);
  });
});

describe('Filter Search', () => {
  it('should filter options by search query', () => {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
    const result = filterOptionsBySearch(cities, 'mum');
    
    expect(result).toEqual(['Mumbai']);
  });
  
  it('should be case-insensitive', () => {
    const cities = ['Mumbai', 'Delhi'];
    const result = filterOptionsBySearch(cities, 'MUMBA');
    
    expect(result).toEqual(['Mumbai']);
  });
});
```

### Integration Tests (React Testing Library)

```typescript
describe('Filter Panel Integration', () => {
  it('should load filter options on mount', async () => {
    const mockOptions = {
      cities: ['Mumbai', 'Delhi'],
      sectors: ['Technology', 'Finance'],
      networks: [],
      clusters: []
    };
    
    mockAPI('/api/filters/options', { data: mockOptions });
    
    const { findByText } = render(<FilterPanel />);
    
    expect(await findByText('Mumbai')).toBeInTheDocument();
    expect(await findByText('Delhi')).toBeInTheDocument();
  });
  
  it('should apply filters and update client list', async () => {
    const { getByLabelText, findByText } = render(<ClientsPage />);
    
    // Select Mumbai filter
    const mumbaiCheckbox = getByLabelText('Mumbai');
    fireEvent.click(mumbaiCheckbox);
    
    // Wait for filtered results
    await waitFor(() => {
      expect(mockAPI).toHaveBeenCalledWith(
        expect.stringContaining('cities=Mumbai')
      );
    });
    
    expect(await findByText('5 prospects found')).toBeInTheDocument();
  });
  
  it('should display active filter pills', async () => {
    const { getByLabelText, findByText } = render(<ClientsPage />);
    
    fireEvent.click(getByLabelText('Mumbai'));
    fireEvent.click(getByLabelText('Technology'));
    
    expect(await findByText('Mumbai')).toBeInTheDocument();
    expect(await findByText('Technology')).toBeInTheDocument();
  });
  
  it('should remove filter via pill close button', async () => {
    const { getByLabelText, findByText, queryByText } = render(<ClientsPage />);
    
    fireEvent.click(getByLabelText('Mumbai'));
    
    const pill = await findByText('Mumbai');
    const closeButton = pill.nextSibling; // X button
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(queryByText('Mumbai')).not.toBeInTheDocument();
    });
  });
  
  it('should clear all filters', async () => {
    const { getByLabelText, getByText, queryByText } = render(<ClientsPage />);
    
    fireEvent.click(getByLabelText('Mumbai'));
    fireEvent.click(getByLabelText('Technology'));
    
    fireEvent.click(getByText('Clear All'));
    
    await waitFor(() => {
      expect(queryByText(/Mumbai|Technology/)).not.toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Filter Prospects E2E', () => {
  test('should apply single filter', async ({ page }) => {
    await page.goto('/clients');
    
    // Wait for filter panel to load
    await page.waitForSelector('[data-testid="filter-panel"]');
    
    // Click Mumbai checkbox
    await page.click('label:has-text("Mumbai")');
    
    // Verify filter pill appears
    await expect(page.locator('.filter-pill:has-text("Mumbai")')).toBeVisible();
    
    // Verify results update
    await expect(page.locator('.results-count')).toContainText('prospects found');
  });
  
  test('should apply multiple filters', async ({ page }) => {
    await page.goto('/clients');
    
    // Apply city filter
    await page.click('label:has-text("Mumbai")');
    
    // Apply sector filter
    await page.click('label:has-text("Technology")');
    
    // Verify both pills appear
    await expect(page.locator('.filter-pill')).toHaveCount(2);
    
    // Verify refined results
    const resultsText = await page.locator('.results-count').textContent();
    expect(resultsText).toMatch(/\d+ prospects found/);
  });
  
  test('should search within filter options', async ({ page }) => {
    await page.goto('/clients');
    
    // Type in city search
    await page.fill('[data-testid="city-search"]', 'Mum');
    
    // Verify only Mumbai is visible
    await expect(page.locator('label:has-text("Mumbai")')).toBeVisible();
    await expect(page.locator('label:has-text("Delhi")')).not.toBeVisible();
  });
  
  test('should persist filters in URL', async ({ page }) => {
    await page.goto('/clients');
    
    // Apply filters
    await page.click('label:has-text("Mumbai")');
    await page.click('label:has-text("Technology")');
    
    // Check URL
    const url = page.url();
    expect(url).toContain('cities=Mumbai');
    expect(url).toContain('sectors=Technology');
    
    // Reload page
    await page.reload();
    
    // Verify filters still applied
    await expect(page.locator('.filter-pill')).toHaveCount(2);
  });
  
  test('should work on mobile with bottom sheet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/clients');
    
    // Click filter toggle button
    await page.click('[data-testid="filter-toggle"]');
    
    // Verify bottom sheet opens
    await expect(page.locator('[data-testid="filter-bottom-sheet"]')).toBeVisible();
    
    // Apply filter
    await page.click('label:has-text("Mumbai")');
    
    // Close bottom sheet
    await page.click('button:has-text("Apply")');
    
    // Verify filter applied
    await expect(page.locator('.filter-pill:has-text("Mumbai")')).toBeVisible();
  });
  
  test('should clear all filters', async ({ page }) => {
    await page.goto('/clients');
    
    // Apply multiple filters
    await page.click('label:has-text("Mumbai")');
    await page.click('label:has-text("Technology")');
    
    // Click clear all
    await page.click('button:has-text("Clear All")');
    
    // Verify no pills remain
    await expect(page.locator('.filter-pill')).toHaveCount(0);
  });
});
```

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Lazy load filter bottom sheet (mobile only)
- **Tree Shaking**: Import only used UI components
- **Dynamic Imports**: Load filter components on demand

```typescript
// Lazy load mobile components
const FilterBottomSheet = dynamic(
  () => import('./components/FilterBottomSheet'),
  { ssr: false }
);

const FilterToggleButton = dynamic(
  () => import('./components/FilterToggleButton'),
  { ssr: false }
);
```

### Runtime Performance

**Memoization**:
```typescript
// Memoize filtered options
const filteredCities = useMemo(() => {
  return filterOptionsBySearch(filterOptions.cities, citySearch);
}, [filterOptions.cities, citySearch]);

// Memoize filter application
const filteredClients = useMemo(() => {
  return applyFiltersToClients(allClients, appliedFilters);
}, [allClients, appliedFilters]);
```

**Debouncing**:
```typescript
// Debounce search input
const debouncedCitySearch = useDebounce(citySearch, 300);

useEffect(() => {
  // Search only after 300ms of no typing
  performSearch(debouncedCitySearch);
}, [debouncedCitySearch]);
```

**Virtualization** (if many filter options):
```typescript
// Use react-window for long lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={filterOptions.cities.length}
  itemSize={40}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <FilterCheckbox
        label={filterOptions.cities[index]}
        checked={appliedFilters.cities.includes(filterOptions.cities[index])}
      />
    </div>
  )}
</FixedSizeList>
```

### Caching Strategy

**Filter Options Cache**:
```typescript
// Cache filter options for 1 hour
const { data: filterOptions } = useQuery({
  queryKey: ['filter-options'],
  queryFn: fetchFilterOptions,
  staleTime: 60 * 60 * 1000, // 1 hour
  cacheTime: 24 * 60 * 60 * 1000, // 24 hours
});
```

**Filtered Results Cache**:
```typescript
// Cache filtered results based on filter combination
const { data: filteredClients } = useQuery({
  queryKey: ['clients', appliedFilters],
  queryFn: () => fetchFilteredClients(appliedFilters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: hasActiveFilters, // Only fetch if filters applied
});
```

**Database Indexes**:
```sql
-- Create indexes for filter columns
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_sector ON clients(sector);
CREATE INDEX idx_clients_network_id ON clients(network_id);
CREATE INDEX idx_clients_cluster_tags ON clients USING GIN(cluster_tags);

-- Composite index for common filter combinations
CREATE INDEX idx_clients_city_sector ON clients(city, sector);
```

## Deployment Plan

### Development Phase
- Feature branch: `feature/03-filter-prospects`
- Feature flag: `ENABLE_FILTERS` (default: true in dev)
- Database migrations: Run on dev environment first
- Seed data: Populate networks and clusters tables

**Checklist**:
- [ ] Create feature branch
- [ ] Run database migrations on dev
- [ ] Implement filter logic and APIs
- [ ] Build UI components
- [ ] Write unit and integration tests
- [ ] Manual testing across devices

### Staging Phase
- Deploy to staging environment
- Populate with production-like data
- Conduct UAT with 3-5 RMs
- Performance testing with large datasets

**Checklist**:
- [ ] Deploy to staging
- [ ] Run database migrations on staging
- [ ] Import production-like filter data
- [ ] UAT with RMs
- [ ] Load testing (1000+ clients)
- [ ] Mobile device testing
- [ ] Accessibility audit

### Production Phase
- Gradual rollout with feature flag
- Monitor query performance
- Track filter usage analytics

**Rollout Strategy**:
1. **Pilot (Week 1)**: Enable for 5 RMs (15% of users)
2. **Expanded (Week 2)**: Enable for 15 RMs (50% of users)
3. **Full Launch (Week 3)**: Enable for all RMs (100%)

**Checklist**:
- [ ] Deploy to production
- [ ] Run database migrations on production
- [ ] Enable feature flag for pilot group
- [ ] Monitor query performance and error rates
- [ ] Collect pilot user feedback
- [ ] Expand to 50% of users
- [ ] Monitor for 48 hours
- [ ] Full rollout to 100%

### Rollback Plan
- Feature flag can disable filters instantly
- Database migrations are reversible
- Clients page defaults to unfiltered view
- No data loss if filters are disabled

```typescript
// Feature flag check
if (!featureFlags.ENABLE_FILTERS) {
  return <ClientListWithoutFilters />;
}

return <ClientListWithFilters />;
```

## Monitoring & Analytics

### Performance Metrics
```typescript
interface PerformanceMetrics {
  // Query Performance
  avgFilterQueryTime: number; // Target: < 300ms
  slowFilterQueries: number; // Queries > 1s
  cacheHitRate: number; // Target: > 60%
  
  // UI Performance
  filterPanelRenderTime: number; // Target: < 200ms
  searchDebounceEffectiveness: number;
  filterApplicationTime: number; // Target: < 300ms
}
```

### Business Metrics
```typescript
interface BusinessMetrics {
  // Adoption Metrics
  activeFilterUsers: number; // RMs using filters
  avgFiltersPerSession: number;
  mostUsedFilters: Record<FilterType, number>;
  
  // Effectiveness Metrics
  filterToEngagementRate: number; // Filtered → contacted
  timeToFindProspect: number; // With vs without filters
  
  // Filter Combinations
  popularFilterCombinations: FilterCombination[];
  unusedFilters: string[];
}
```

### Technical Metrics
```typescript
interface TechnicalMetrics {
  // API Performance
  filterOptionsLoadTime: number;
  filteredClientsLoadTime: number;
  apiErrorRate: number;
  
  // Database Performance
  avgQueryExecutionTime: Record<string, number>;
  indexUtilization: number;
  fullTableScans: number; // Should be 0
  
  // Client-Side Performance
  stateUpdateFrequency: number;
  renderCount: number; // Detect unnecessary re-renders
}
```

### Alerting Rules
```yaml
alerts:
  # Critical Alerts
  - name: SlowFilterQueries
    condition: avgFilterQueryTime > 1s
    severity: critical
    notify: oncall-engineer
  
  - name: FilterApiDown
    condition: errorRate > 10%
    severity: critical
    notify: oncall-engineer
  
  # Warning Alerts
  - name: LowCacheHitRate
    condition: cacheHitRate < 40%
    severity: warning
    notify: dev-channel
  
  - name: HighDatabaseLoad
    condition: avgQueryExecutionTime > 500ms
    severity: warning
    notify: dev-channel
```

## Documentation Requirements

### Technical Documentation

**1. Filter Query Optimization Guide**:
```markdown
# Filter Query Optimization

## Database Indexes
All filter columns have indexes for optimal performance:
- `idx_clients_city` - City filter
- `idx_clients_sector` - Sector filter
- `idx_clients_network_id` - Network filter
- `idx_clients_cluster_tags` (GIN) - Cluster filter (array)

## Query Patterns
Filters use AND logic between types, OR within types:
```sql
WHERE 
  city IN ('Mumbai', 'Delhi') -- OR within cities
  AND sector IN ('Tech', 'Finance') -- OR within sectors
```

## Performance Tips
- Use composite indexes for common filter combinations
- Limit result sets with pagination
- Cache filter options aggressively (1 hour TTL)
```

**2. API Documentation**:
```yaml
# GET /api/clients
summary: Get filtered clients
parameters:
  - name: cities
    in: query
    schema:
      type: array
      items:
        type: string
    example: ["Mumbai", "Delhi"]
  - name: sectors
    in: query
    schema:
      type: array
      items:
        type: string
  - name: network_ids
    in: query
    schema:
      type: array
      items:
        type: string
  - name: cluster_ids
    in: query
    schema:
      type: array
      items:
        type: string
responses:
  200:
    description: Filtered clients
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
              properties:
                clients:
                  type: array
                  items:
                    $ref: '#/components/schemas/Client'
                total:
                  type: integer
```

### User Documentation

**1. Filter Guide for RMs**:
```markdown
# Using Filters to Find Prospects

## Available Filters

### 🏙️ City Filter
Filter prospects by their location. Useful for:
- Territory management
- Local market focus
- Regional campaigns

**Tip**: Select multiple cities to broaden your search.

### 🏢 Sector Filter
Filter by industry/business sector. Useful for:
- Sector expertise leverage
- Industry-specific campaigns
- Cross-sell within sectors

**Examples**: Technology, Finance, Manufacturing, Real Estate

### 🤝 Network Filter
Filter by professional networks. Useful for:
- Leveraging connections
- Finding warm intro paths
- Community-based selling

**Examples**: IIT Alumni, TiE Network, YPO

### 📊 Cluster Filter
Filter by wealth/behavior clusters. Useful for:
- Targeting similar profiles
- Persona-based selling
- Strategic segmentation

**Examples**: Fintech Founders, Second-gen Industrialists

## How to Use Filters

1. **Open the filter panel** (left sidebar on desktop, bottom sheet on mobile)
2. **Select filters** by checking the boxes
3. **Combine multiple filters** to narrow down prospects
4. **View results** in real-time as you apply filters
5. **Remove filters** by clicking the X on filter pills or "Clear All"

## Filter Best Practices

✅ Start broad, then narrow down
✅ Use sector + city for targeted campaigns
✅ Leverage networks for warm introductions
✅ Save filter combinations in browser bookmarks (URL-based)

❌ Don't over-filter (you might miss opportunities)
❌ Don't ignore prospects outside your filters
```

**2. FAQ Document**:
```markdown
# Filters FAQ

## General Questions

**Q: How many filters can I apply at once?**
A: You can apply as many filters as you want. Filters combine with AND logic (e.g., Mumbai AND Technology).

**Q: Do filters persist when I log out?**
A: Yes, filters are saved in your browser and restored when you return.

**Q: Can I share filter combinations with colleagues?**
A: Yes, copy the URL and share it. The filters are encoded in the URL.

## Troubleshooting

**Q: No results after applying filters**
A: Try removing some filters to broaden your search. Not all filter combinations will have matching prospects.

**Q: Filters loading slowly**
A: This may indicate a slow internet connection. Filters are cached after the first load.

**Q: Filter options seem outdated**
A: Refresh the page to reload filter options. Options are cached for 1 hour.
```

### Code Documentation

```typescript
/**
 * FilterPanel Component
 * 
 * Main filter container that displays all available filter types.
 * Adapts to screen size (sidebar on desktop, bottom sheet on mobile).
 * 
 * @component
 * @category Dashboard/Clients
 * 
 * @example
 * <FilterPanel
 *   options={filterOptions}
 *   appliedFilters={filters}
 *   onFilterChange={(type, values) => setFilters(type, values)}
 *   onClearAll={() => clearAllFilters()}
 * />
 * 
 * @param {FilterPanelProps} props - Component props
 * @param {FilterOptions} props.options - Available filter options
 * @param {AppliedFilters} props.appliedFilters - Currently applied filters
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onClearAll - Callback to clear all filters
 * 
 * @returns {JSX.Element} Rendered filter panel
 */
```

## Post-Launch Review

### Success Criteria

**Week 1 (Pilot Phase)**:
- [ ] Zero critical bugs reported
- [ ] < 300ms average filter application time
- [ ] 80% of pilot RMs use filters at least once
- [ ] 4+ star average satisfaction rating

**Week 4 (Full Launch)**:
- [ ] 85% of RMs use filters at least once per session
- [ ] 60% reduction in time to find relevant prospects
- [ ] 70% increase in filtered prospect engagement
- [ ] 4.5+ star average satisfaction rating

**Month 3 (Maturity)**:
- [ ] Consistent daily usage by 80%+ of RMs
- [ ] Popular filter combinations identified and analyzed
- [ ] 50% of prospect engagements start with filters
- [ ] < 5% filter-related support tickets

### Key Metrics to Track

**Adoption Metrics**:
- Daily/Weekly active filter users
- Average filters applied per session
- Most popular filter types
- Filter combination patterns

**Effectiveness Metrics**:
- Time to find prospect (with vs without filters)
- Filter-to-engagement conversion rate
- Filtered prospect AUM vs unfiltered
- Filter refinement iterations per search

**Quality Metrics**:
- RM satisfaction score (1-5)
- Filter accuracy/relevance ratings
- Support tickets related to filters
- Feature requests for new filters

### Retrospective Items

**What Went Well**:
- [ ] Document successful patterns
- [ ] Identify most-used filter combinations
- [ ] Note effective collaboration approaches

**What Could Be Improved**:
- [ ] Technical challenges encountered
- [ ] UX friction points identified
- [ ] Performance bottlenecks

**Action Items**:
- [ ] Technical debt to address
- [ ] Future filter enhancements
- [ ] Process improvements for next story

### Future Enhancements

**Short-term (1-3 months)**:
- [ ] Saved filter presets (custom views)
- [ ] Filter templates (e.g., "High Net Worth Tech Founders")
- [ ] Filter history (recently used filters)
- [ ] Quick filter toggles (favorites)

**Medium-term (3-6 months)**:
- [ ] Smart filters (AI-suggested based on behavior)
- [ ] Bulk actions on filtered results
- [ ] Export filtered list to CSV/PDF
- [ ] Advanced filter operators (NOT, complex logic)

**Long-term (6-12 months)**:
- [ ] Predictive filters (ML-based suggestions)
- [ ] Dynamic filter creation (custom criteria)
- [ ] Cross-RM filter analytics (benchmarking)
- [ ] Filter-based automated workflows

---

## Appendix

### Glossary

- **Filter Type**: Category of filter (City, Sector, Network, Cluster)
- **Applied Filters**: Currently active filter selections
- **Filter Options**: Available values for each filter type
- **Filter Pill**: UI element representing an active filter
- **Filter Combination**: Multiple filters applied together
- **AND Logic**: Filters across types combine with AND
- **OR Logic**: Values within a filter type combine with OR

### References

- [Kairos Capital Design System](https://www.nuvamawealth.com/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase PostgreSQL](https://supabase.com/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Radix UI Primitives](https://www.radix-ui.com/)

### Database Schema Reference

```sql
-- Clients table with filter fields
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  estimated_wealth BIGINT,
  rm_id UUID NOT NULL REFERENCES users(id),
  
  -- Filter fields
  city VARCHAR(100),
  sector VARCHAR(100),
  network_id UUID REFERENCES networks(id),
  cluster_tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Networks table
CREATE TABLE networks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clusters table
CREATE TABLE clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal filter performance
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_sector ON clients(sector);
CREATE INDEX idx_clients_network_id ON clients(network_id);
CREATE INDEX idx_clients_cluster_tags ON clients USING GIN(cluster_tags);
CREATE INDEX idx_clients_city_sector ON clients(city, sector);
```

### Contact

- **Product Owner**: [Name]
- **Tech Lead**: [Name]
- **Design Lead**: [Name]
- **QA Lead**: [Name]

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-19  
**Next Review**: 2025-01-05
