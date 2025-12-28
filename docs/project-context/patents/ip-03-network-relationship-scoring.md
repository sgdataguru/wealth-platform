# IP Candidate 3: Network-Based Relationship Scoring System

**Patent Priority: Phase 2 (File after IP-01 and IP-02)**

---

## 1. Title of the Invention

**System and Method for Calculating Engagement Probability Using Graph-Based Relationship Strength Analysis in Wealth Management**

Alternative titles:

- Computer-Implemented Network Analysis System for UHNW Client Warm Introduction Scoring
- Graph Database Method for Predicting Relationship Manager Success Probability

---

## 2. Field of the Invention

This invention relates to the field of **social network analysis and relationship management**, specifically to computer-implemented systems and methods for calculating the probability of successful client engagement based on professional, social, and institutional network connections.

More particularly, the invention pertains to:

- Graph database systems for relationship mapping
- Influence path discovery algorithms
- Connection strength scoring for wealth management
- Warm introduction recommendation engines

**Technical domains**: Graph analytics, network science, social network analysis, relationship management systems, machine learning.

---

## 3. Background / Problem Statement

### Current State of UHNW Relationship Management

Relationship Managers (RMs) in wealth management face a critical challenge: **cold outreach to UHNW prospects has extremely low success rates** (<5%), while **warm introductions have 10-20x higher conversion**.

However, RMs lack systematic methods to:

#### 1. **Identify Hidden Connection Paths**

**Problem**: An RM may not realize they have a connection to a prospect through:

- Shared board memberships
- Common investors or advisors
- Alumni networks (same university, company, club)
- Family connections (spouse, siblings, business partners)
- Institutional relationships (same bank, law firm, auditor)

**Current State**: RMs manually search LinkedIn, ask colleagues, or rely on memory. This is:

- Time-consuming (2-3 hours per prospect)
- Incomplete (misses non-obvious paths)
- Not scalable (can't analyze 1000+ prospects)

---

#### 2. **Quantify Relationship Strength**

**Problem**: Not all connections are equal. A connection through:

- A close friend (strong) vs. a distant acquaintance (weak)
- A current colleague (strong) vs. a former colleague from 10 years ago (weak)
- A direct connection (1-hop) vs. a friend-of-a-friend (2-hop)

**Current State**: RMs use subjective judgment ("I think X knows Y well"). No quantitative scoring exists.

---

#### 3. **Prioritize Introduction Requests**

**Problem**: An RM might have 50 potential introduction paths to a prospect. Which one to pursue?

**Factors to consider**:

- Strength of each connection in the path
- Willingness of intermediaries to make introductions
- Context relevance (e.g., business vs. social connection)
- Recency of interaction

**Current State**: RMs guess or pick the most obvious path (often not the best).

---

#### 4. **Leverage Institutional Relationships**

**Problem**: UHNW individuals are connected through institutions:

- Same private equity fund (co-investors)
- Same country club or golf club
- Same charitable foundation board
- Same family office or wealth advisor

**Current State**: These institutional connections are not systematically tracked or leveraged.

---

### Technical Gaps in Prior Art

No existing system provides:

- **Graph-based relationship mapping** specific to UHNW ecosystems
- **Multi-dimensional connection strength scoring** (professional, social, institutional)
- **Influence path discovery** with weighted edge traversal
- **Context-aware introduction recommendations** (when to ask whom)
- **Real-time updates** as new connections are formed

---

## 4. Summary of the Invention

### What is Novel

The invention provides a **graph-based relationship scoring system** that:

1. **Models** UHNW ecosystems as a multi-layer graph with:
   - Nodes: Individuals, companies, institutions
   - Edges: Relationships (employment, investment, board membership, social, family)
   - Attributes: Connection strength, recency, context

2. **Discovers** influence paths between RMs and prospects using:
   - Multi-hop graph traversal (up to 3 degrees of separation)
   - Weighted edge scoring (strong vs. weak connections)
   - Context filtering (professional vs. social)

3. **Scores** each path using a proprietary algorithm that combines:
   - Connection type weights (family > business partner > colleague)
   - Path length penalty (1-hop > 2-hop > 3-hop)
   - Recency decay (recent interactions > old connections)
   - Intermediary willingness (some people are better connectors)

4. **Recommends** optimal introduction strategies:
   - Which path to pursue
   - What context to use (e.g., "You both invested in XYZ fund")
   - When to ask (timing based on recent interactions)

### Core Innovation

Unlike generic social network analysis (LinkedIn, Facebook):

- **UHNW-specific**: Includes institutional relationships (PE funds, family offices, boards)
- **Multi-dimensional**: Combines professional, social, and financial connections
- **Actionable**: Provides specific introduction recommendations, not just "people you may know"
- **Privacy-aware**: Does not expose sensitive financial relationships publicly

### Technical Advancement

- **Graph database architecture** (Neo4j) optimized for relationship queries
- **Multi-layer network model** (professional, social, institutional layers)
- **Weighted path discovery algorithm** with context-aware scoring
- **Real-time updates** as new connections are detected (e.g., from LinkedIn, news)

---

## 5. Detailed System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Data Ingestion Layer                       │
├─────────────────────────────────────────────────────────────┤
│  • LinkedIn API (Professional connections)                  │
│  • CRM Data (Client relationships)                          │
│  • Corporate Filings (Board memberships, shareholdings)     │
│  • News/Events (Co-attendees at conferences, galas)         │
│  • Internal Data (RM interactions, referrals)               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Entity Resolution & Normalization              │
├─────────────────────────────────────────────────────────────┤
│  • Person deduplication (same person, multiple sources)     │
│  • Company/Institution matching                             │
│  • Relationship type classification                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Graph Database (Neo4j) - CORE                  │
├─────────────────────────────────────────────────────────────┤
│  Nodes:                                                     │
│   • PERSON (name, title, company, location)                 │
│   • COMPANY (name, industry, size)                          │
│   • INSTITUTION (type: fund, club, foundation, school)      │
│                                                             │
│  Edges (Relationships):                                     │
│   • EMPLOYED_BY (person → company)                          │
│   • INVESTED_IN (person → company/fund)                     │
│   • BOARD_MEMBER_OF (person → company/institution)          │
│   • ALUMNI_OF (person → institution)                        │
│   • MEMBER_OF (person → club/association)                   │
│   • FAMILY_RELATION (person ↔ person)                       │
│   • BUSINESS_PARTNER (person ↔ person)                      │
│   • ADVISOR_TO (person → person/company)                    │
│   • KNOWS (person ↔ person, generic)                        │
│                                                             │
│  Edge Attributes:                                           │
│   • strength: 0.0-1.0 (weak to strong)                      │
│   • context: professional, social, family, institutional    │
│   • since: start date of relationship                       │
│   • last_interaction: most recent contact                   │
│   • source: where relationship was detected                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│          Relationship Strength Calculation Module           │
├─────────────────────────────────────────────────────────────┤
│  • Connection Type Weighting                                │
│  • Recency Decay Function                                   │
│  • Interaction Frequency Boost                              │
│  • Mutual Connection Amplification                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│            Influence Path Discovery Engine                  │
├─────────────────────────────────────────────────────────────┤
│  • Multi-hop Graph Traversal (Dijkstra's algorithm)         │
│  • Path Scoring (weighted edge product)                     │
│  • Context Filtering (e.g., only professional paths)        │
│  • Top-K Path Selection (best 5 paths)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│          Introduction Recommendation Engine                 │
├─────────────────────────────────────────────────────────────┤
│  • Path Ranking (by engagement probability)                 │
│  • Context Generation (talking points)                      │
│  • Timing Optimization (when to ask)                        │
│  • Intermediary Willingness Scoring                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   RM Dashboard / API                        │
├─────────────────────────────────────────────────────────────┤
│  • Relationship Map Visualization                           │
│  • Path Recommendations (ranked list)                       │
│  • Introduction Request Templates                           │
│  • Success Tracking (conversion rates by path type)         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Details

#### A. Graph Database Schema (Neo4j)

**Example Graph**:

```
(RM:PERSON {name:"Priya Sharma"})
  -[:EMPLOYED_BY {since:2020}]-> (WealthBank:COMPANY)
  -[:ALUMNI_OF]-> (IIM_A:INSTITUTION {type:"business_school"})

(Prospect:PERSON {name:"Amit Verma"})
  -[:FOUNDER_OF]-> (CloudTech:COMPANY)
  -[:ALUMNI_OF]-> (IIM_A:INSTITUTION)
  -[:INVESTED_IN]-> (TechFund:INSTITUTION {type:"pe_fund"})

(Connector:PERSON {name:"Rajesh Kumar"})
  -[:ALUMNI_OF]-> (IIM_A:INSTITUTION)
  -[:INVESTED_IN]-> (TechFund:INSTITUTION)
  -[:KNOWS {strength:0.8, last_interaction:"2025-12-01"}]-> (Prospect)
```

**Cypher Query** (find paths from RM to Prospect):

```cypher
MATCH path = (rm:PERSON {name:"Priya Sharma"})-[*1..3]-(prospect:PERSON {name:"Amit Verma"})
WHERE ALL(r IN relationships(path) WHERE r.strength > 0.3)
RETURN path
ORDER BY reduce(score = 1.0, r IN relationships(path) | score * r.strength) DESC
LIMIT 5
```

---

#### B. Relationship Strength Calculation

**Purpose**: Assign a strength score (0-1) to each edge

**Factors**:

1. **Connection Type** (base weight):
   - Family: 1.0
   - Business Partner: 0.95
   - Close Friend: 0.90
   - Board Co-Member: 0.75
   - Colleague (current): 0.70
   - Colleague (former): 0.50
   - Alumni (same year): 0.60
   - Alumni (different year): 0.40
   - Investor (same fund): 0.55
   - Generic "Knows": 0.30

2. **Recency Decay**:

   ```
   RecencyFactor = e^(-λ × years_since_last_interaction)
   ```

   Where λ = 0.2 (half-life ~3.5 years)

3. **Interaction Frequency Boost**:

   ```
   FrequencyBoost = min(0.3, log₁₀(interactions_per_year) × 0.1)
   ```

4. **Mutual Connections Amplification**:

   ```
   MutualBoost = min(0.2, mutual_connections / 20)
   ```

**Final Strength**:

```
Strength = BaseWeight × RecencyFactor + FrequencyBoost + MutualBoost
```

Capped at 1.0.

---

#### C. Influence Path Discovery Algorithm

**Goal**: Find top-K paths from RM to Prospect

**Algorithm**: Modified Dijkstra's shortest path (maximize strength product)

**Pseudocode**:

```python
def find_influence_paths(rm_id, prospect_id, max_hops=3, top_k=5):
    # Initialize
    paths = []
    visited = set()
    
    # BFS with priority queue (max-heap by path strength)
    queue = PriorityQueue()
    queue.put((1.0, [rm_id], []))  # (strength, node_path, edge_path)
    
    while not queue.empty() and len(paths) < top_k:
        strength, node_path, edge_path = queue.get()
        current = node_path[-1]
        
        if current == prospect_id:
            paths.append({
                'nodes': node_path,
                'edges': edge_path,
                'strength': strength
            })
            continue
        
        if len(node_path) > max_hops or current in visited:
            continue
        
        visited.add(current)
        
        # Explore neighbors
        for neighbor, edge in get_neighbors(current):
            if neighbor not in node_path:  # Avoid cycles
                new_strength = strength * edge.strength
                new_node_path = node_path + [neighbor]
                new_edge_path = edge_path + [edge]
                queue.put((new_strength, new_node_path, new_edge_path))
    
    return paths
```

**Optimization**: Bidirectional search (from RM and Prospect simultaneously) for faster convergence.

---

## 6. Core Algorithms / Formulae

### 6.1 Relationship Strength Score

```
S(e) = W(type) × R(t) + F(n) + M(k)
```

Where:

- **S(e)** = Strength of edge e (0-1)
- **W(type)** = Base weight for connection type
- **R(t)** = Recency factor = e^(-0.2 × years_since_last_interaction)
- **F(n)** = Frequency boost = min(0.3, log₁₀(interactions_per_year) × 0.1)
- **M(k)** = Mutual connections boost = min(0.2, k / 20)

**Example**:

- Connection: Former colleagues (base weight 0.50)
- Last interaction: 2 years ago → R = e^(-0.2×2) = 0.67
- Interactions: 4/year → F = log₁₀(4) × 0.1 = 0.06
- Mutual connections: 8 → M = 8/20 = 0.08

```
S = 0.50 × 0.67 + 0.06 + 0.08 = 0.34 + 0.14 = 0.48
```

---

### 6.2 Path Strength Score

```
PathStrength(P) = ∏ S(eᵢ) × D(L)
                  i=1 to L
```

Where:

- **P** = Path from RM to Prospect
- **L** = Path length (number of hops)
- **S(eᵢ)** = Strength of edge i in path
- **D(L)** = Distance penalty = 1.0 / L^0.5

**Rationale**: Product of edge strengths (weak link degrades path). Distance penalty favors shorter paths.

**Example**:

Path: RM → Connector1 → Connector2 → Prospect (3 hops)

- Edge strengths: 0.8, 0.6, 0.7
- Product: 0.8 × 0.6 × 0.7 = 0.336
- Distance penalty: 1.0 / √3 = 0.577
- **Final Path Strength**: 0.336 × 0.577 = 0.194

---

### 6.3 Engagement Probability

```
P(engagement | path) = α × PathStrength + β × ContextRelevance + γ × TimingScore
```

Where:

- **α, β, γ** = Weights (α=0.5, β=0.3, γ=0.2)
- **PathStrength** = From formula 6.2
- **ContextRelevance** = Similarity of connection context to engagement goal (0-1)
- **TimingScore** = Recency of intermediary interactions (0-1)

**Context Relevance**:

- Goal: Wealth management engagement
- Path context: Business (0.9), Social (0.6), Family (0.7), Institutional (0.8)

**Timing Score**:

```
TimingScore = 1 - (days_since_intermediary_interaction / 365)
```

Capped at 0-1.

---

### 6.4 Intermediary Willingness Score

```
Willingness(person) = BaseWillingness × IntroductionHistory × Reciprocity
```

Where:

- **BaseWillingness** = Personality factor (0-1, from ML model or manual input)
- **IntroductionHistory** = Past introduction success rate
- **Reciprocity** = Has this person asked for introductions from RM? (1.2 if yes, 1.0 if no)

**Example**:

- Connector has made 10 introductions, 7 successful → History = 0.70
- Connector previously asked RM for 2 introductions → Reciprocity = 1.2
- Base willingness: 0.80 (estimated)

```
Willingness = 0.80 × 0.70 × 1.2 = 0.67
```

---

## 7. Example Use Case (UHNW RM Scenario)

### Scenario: Finding a Warm Introduction Path

**RM**: Priya Sharma, WealthBank  
**Prospect**: Amit Verma, Founder of CloudTech (₹500 Cr net worth)  
**Goal**: Get an introduction to discuss wealth management services

---

### Step 1: Graph Query

Priya searches for paths to Amit in the system.

**System executes**:

```cypher
MATCH path = (priya:PERSON {name:"Priya Sharma"})-[*1..3]-(amit:PERSON {name:"Amit Verma"})
RETURN path
```

**Result**: 12 paths found (1-hop: 0, 2-hop: 3, 3-hop: 9)

---

### Step 2: Path Scoring

**Path 1** (2-hop via Rajesh Kumar):

- Priya → Rajesh: Alumni (IIM-A, same batch), strength 0.75
- Rajesh → Amit: Co-investor (TechFund), strength 0.65
- Path strength: 0.75 × 0.65 × (1/√2) = 0.345

**Path 2** (2-hop via Neha Gupta):

- Priya → Neha: Former colleague, strength 0.50
- Neha → Amit: Board co-member (CloudTech), strength 0.80
- Path strength: 0.50 × 0.80 × (1/√2) = 0.283

**Path 3** (3-hop via Vikram Shah → Sanjay Mehta):

- Priya → Vikram: Client relationship, strength 0.85
- Vikram → Sanjay: Business partner, strength 0.95
- Sanjay → Amit: Close friend, strength 0.90
- Path strength: 0.85 × 0.95 × 0.90 × (1/√3) = 0.421

**Ranking**: Path 3 > Path 1 > Path 2

---

### Step 3: Context & Timing Analysis

**Path 3 details**:

- Vikram (intermediary 1): Last interaction with Priya = 10 days ago (recent!)
- Sanjay (intermediary 2): Last interaction with Amit = 5 days ago (very recent!)
- Context: Business relationship (high relevance for wealth management)
- Vikram's willingness score: 0.85 (has made successful introductions before)

**Engagement Probability**:

```
P = 0.5×0.421 + 0.3×0.9 + 0.2×0.95 = 0.211 + 0.27 + 0.19 = 0.671 (67%)
```

---

### Step 4: Recommendation Delivered

**RM Dashboard**:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Introduction Path to Amit Verma                          │
├─────────────────────────────────────────────────────────────┤
│ Recommended Path (67% success probability):                 │
│                                                             │
│  You → Vikram Shah → Sanjay Mehta → Amit Verma              │
│                                                             │
│ Why this path works:                                        │
│  ✓ Vikram is a trusted client (last contact: 10 days ago)  │
│  ✓ Sanjay is Amit's close friend (recent interaction)      │
│  ✓ Business context aligns with wealth management goal     │
│                                                             │
│ Suggested Approach:                                         │
│  1. Call Vikram this week (he's responsive)                 │
│  2. Mention: "I help entrepreneurs like Amit with post-exit │
│     wealth planning. Would you be comfortable introducing   │
│     me to Sanjay, who could connect me to Amit?"            │
│  3. Offer value: "Happy to provide Vikram a complimentary   │
│     portfolio review as a thank you."                       │
│                                                             │
│ Alternative Paths:                                          │
│  • Path 2 (via Rajesh Kumar) - 35% probability              │
│  • Path 3 (via Neha Gupta) - 28% probability                │
│                                                             │
│ [Request Introduction] [View Full Network] [Dismiss]        │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 5: Outcome

**Week 1**: Priya calls Vikram, who agrees to introduce her to Sanjay.

**Week 2**: Sanjay (who trusts Vikram) agrees to introduce Priya to Amit.

**Week 3**: Priya meets Amit. Amit is receptive because:

- Warm introduction (not cold outreach)
- Trusted referral chain (Vikram → Sanjay → Amit)
- Timely (Amit just sold CloudTech, needs wealth planning)

**Result**: Amit becomes a client (₹200 Cr AUM).

**Without the system**: Priya might have:

- Never discovered the Vikram → Sanjay → Amit path
- Tried a weaker path (e.g., via Neha) with lower success
- Wasted time on cold outreach (likely rejected)

---

## 8. Key Novelty Points

### What Differentiates This Invention from Prior Art

1. **Multi-Layer Network Model**
   - Combines professional, social, family, and institutional relationships
   - Prior art (LinkedIn): Only professional connections

2. **UHNW-Specific Relationship Types**
   - Includes: PE fund co-investors, family office relationships, board memberships
   - Prior art: Generic "friend" or "colleague" labels

3. **Weighted Path Discovery**
   - Uses connection strength × recency × context
   - Prior art: Unweighted paths ("2 degrees away")

4. **Engagement Probability Scoring**
   - Predicts success likelihood, not just connection existence
   - Prior art: "People you may know" (no probability)

5. **Intermediary Willingness Modeling**
   - Accounts for connector personality and reciprocity
   - Prior art: Assumes all intermediaries equally willing

6. **Context-Aware Recommendations**
   - Suggests *how* to approach (talking points, timing)
   - Prior art: Only shows connection paths

7. **Real-Time Graph Updates**
   - Automatically ingests new connections from LinkedIn, news, CRM
   - Prior art: Static snapshots

8. **Privacy-Preserving**
   - Does not expose sensitive financial relationships publicly
   - Prior art (LinkedIn): All connections visible

---

## 9. Draft Independent Patent Claim (Indian Format)

### Claim 1 (Independent - Method)

A computer-implemented method for calculating engagement probability between a relationship manager and a prospect individual using graph-based relationship analysis, the method comprising:

(a) constructing, by a graph database module, a multi-layer relationship graph comprising:

- a plurality of person nodes, each representing an individual;
- a plurality of entity nodes, each representing a company or institution;
- a plurality of directed or undirected edges connecting nodes, wherein each edge represents a relationship and is associated with:
  - a relationship type selected from a predefined taxonomy including employment, investment, board membership, alumni affiliation, family relation, and social connection;
  - a strength score indicating relationship intensity;
  - a timestamp indicating relationship start date and last interaction date;
  - a context attribute indicating whether the relationship is professional, social, family, or institutional;

(b) calculating, by a relationship strength module, the strength score for each edge using a formula that combines:

- a base weight assigned to the relationship type;
- a recency factor computed as an exponential decay function of time elapsed since last interaction;
- a frequency boost derived from interaction frequency; and
- a mutual connections boost derived from number of shared connections between the two nodes;

(c) discovering, by a path discovery module, a plurality of influence paths from a relationship manager node to a prospect node by:

- performing a graph traversal algorithm with a maximum path length constraint;
- identifying all paths connecting the relationship manager node to the prospect node;
- filtering paths to exclude those containing edges with strength scores below a predefined threshold;

(d) scoring, by a path scoring module, each discovered path by:

- computing a product of strength scores of all edges in the path;
- applying a distance penalty factor inversely proportional to path length;
- generating a path strength score based on the product and distance penalty;

(e) calculating, by an engagement probability module, an engagement probability for each path using a weighted combination of:

- the path strength score;
- a context relevance score indicating alignment between relationship context and engagement goal;
- a timing score derived from recency of interactions with intermediary nodes in the path;

(f) ranking, by a ranking module, the plurality of paths by engagement probability in descending order;

(g) generating, by a recommendation module, an introduction recommendation comprising:

- identification of a highest-ranked path;
- identification of intermediary nodes in the path;
- suggested approach text describing how to request introductions from intermediaries;
- timing recommendation indicating when to initiate contact; and

(h) outputting, by a user interface module, the introduction recommendation to a display device associated with the relationship manager.

---

## 10. Draft Dependent Claims (3-5)

### Claim 2 (Dependent on Claim 1)

The method of claim 1, wherein the strength score in step (b) is calculated according to the formula:

```
S(e) = W(type) × e^(-λ × t) + min(0.3, log₁₀(f) × 0.1) + min(0.2, k / 20)
```

where W(type) is the base weight, λ is a decay constant, t is years since last interaction, f is interactions per year, and k is number of mutual connections.

---

### Claim 3 (Dependent on Claim 1)

The method of claim 1, wherein the path strength score in step (d) is calculated according to the formula:

```
PathStrength = [∏ S(eᵢ)] × (1 / L^0.5)
               i=1 to L
```

where S(eᵢ) is the strength of edge i, L is the path length, and the product is taken over all edges in the path.

---

### Claim 4 (Dependent on Claim 1)

The method of claim 1, wherein the engagement probability in step (e) is calculated according to the formula:

```
P = α × PathStrength + β × ContextRelevance + γ × TimingScore
```

where α, β, γ are predefined weights summing to 1.0, PathStrength is from step (d), ContextRelevance is a similarity score between relationship context and engagement goal, and TimingScore is inversely proportional to days since last interaction with intermediaries.

---

### Claim 5 (Dependent on Claim 1)

The method of claim 1, further comprising:

(i) calculating, by an intermediary willingness module, a willingness score for each intermediary node in the highest-ranked path, wherein the willingness score is based on:

- historical introduction success rate of the intermediary;
- reciprocity factor indicating whether the intermediary has previously requested introductions from the relationship manager; and
- a base willingness parameter; and

(j) adjusting the engagement probability based on the willingness scores of intermediaries in the path.

---

### Claim 6 (Independent - System)

A system for calculating engagement probability using graph-based relationship analysis, the system comprising:

(a) a graph database module configured to store a multi-layer relationship graph with person nodes, entity nodes, and relationship edges;

(b) a relationship strength module configured to calculate strength scores for edges using base weights, recency factors, frequency boosts, and mutual connection boosts;

(c) a path discovery module configured to identify influence paths between relationship manager and prospect nodes using graph traversal;

(d) a path scoring module configured to score paths using edge strength products and distance penalties;

(e) an engagement probability module configured to calculate engagement probabilities using path strength, context relevance, and timing scores;

(f) a ranking module configured to rank paths by engagement probability;

(g) a recommendation module configured to generate introduction recommendations with suggested approaches and timing; and

(h) a user interface module configured to display recommendations to relationship managers.

---

## 11. Prior Art Risk Assessment (India + Global)

### 11.1 Identified Prior Art

#### A. Social Network Analysis Platforms

**Examples**:

- LinkedIn "People You May Know"
- Facebook "Mutual Friends"
- Academic social network analysis tools

**Differentiation**:

- These systems show connections but do not:
  - Calculate engagement probability
  - Provide introduction strategies
  - Include UHNW-specific relationship types (PE funds, family offices)
- **Our invention**: Actionable recommendations with probability scoring

**Risk Level**: **MEDIUM** - Social network analysis is prior art, but wealth management application is novel

---

#### B. CRM Relationship Mapping

**Examples**:

- Salesforce Relationship Insights
- Microsoft Dynamics Relationship Assistant

**Differentiation**:

- Generic B2B relationship tracking
- **Our invention**: UHNW-specific, multi-layer graph with institutional relationships

**Risk Level**: **LOW-MEDIUM** - CRM relationship features exist, but not with our depth

---

#### C. Graph Database Applications

**Examples**:

- Neo4j (infrastructure)
- Academic papers on social network analysis

**Differentiation**:

- Infrastructure is not patentable
- **Our invention**: Domain-specific application with novel algorithms

**Risk Level**: **LOW** - Infrastructure is not claimed

---

#### D. Influence Path Discovery

**Examples**:

- Academic research on "shortest path" algorithms
- Dijkstra's algorithm (public domain)

**Differentiation**:

- Generic algorithms are prior art
- **Our invention**: Weighted path discovery with UHNW-specific scoring

**Risk Level**: **MEDIUM** - Algorithm is novel application, not generic shortest path

---

### 11.2 Overall Prior Art Risk

| Aspect | Risk Level | Mitigation |
|--------|------------|------------|
| Graph Database | LOW | Infrastructure not claimed |
| Social Network Analysis | MEDIUM | Focus on wealth management application |
| Path Discovery | MEDIUM | Emphasize weighted scoring, not generic shortest path |
| Engagement Probability | LOW | Novel calculation method |
| UHNW Relationships | LOW | Domain-specific relationship types |

**Overall Assessment**: **MEDIUM RISK** - Moderate patentability due to domain-specific application and novel scoring methods.

---

## 12. Patentability Assessment under Indian Law

### 12.1 Section 3(k) Analysis (Business Methods)

**Key Question**: Is this a "business method per se"?

⚠️ **BORDERLINE** - Requires careful claim drafting:

**Arguments FOR patentability**:

1. **Technical Effect**:
   - Graph database architecture (technical system)
   - Graph traversal algorithms (technical processing)
   - Real-time data ingestion and updates

2. **Computer Implementation**:
   - Requires graph database (Neo4j)
   - Cannot be performed manually (thousands of nodes/edges)
   - Involves complex algorithms (path discovery, scoring)

3. **Technical Problem Solved**:
   - Multi-source data integration
   - Scalable graph queries (sub-second response)
   - Real-time graph updates

**Arguments AGAINST patentability**:

1. **Business Method Risk**:
   - Core value is "finding introductions" (business activity)
   - Scoring is based on business relationships, not technical data

**Mitigation**:

- Emphasize graph database architecture and algorithms
- Frame as "data processing system" not "introduction finder"
- Include technical components (database, APIs, real-time updates)

---

### 12.2 Precedent Analysis (Indian Case Law)

**Ferid Allani v. Union of India (2019)**:

- Our invention has "technical contribution" via graph database and algorithms
- **Risk**: Contribution may be seen as primarily business-focused

**Recommendation**: Strengthen technical aspects in claims and specification.

---

### 12.3 Technical Effect Demonstration

**Technical Effects**:

1. **Graph Database Performance**:
   - Sub-second path discovery queries (vs. hours manually)
   - Handles 100,000+ nodes and 1M+ edges

2. **Algorithm Innovation**:
   - Weighted path discovery (not generic shortest path)
   - Multi-dimensional scoring (strength × context × timing)

3. **Real-Time Updates**:
   - Automatic graph updates as new connections detected
   - Event-driven architecture

4. **Scalability**:
   - Distributed graph database
   - Optimized for relationship queries

---

### 12.4 Patentability Conclusion

| Criterion | Assessment | Justification |
|-----------|------------|---------------|
| **Novelty** | ✅ PASS | No prior art combines all elements |
| **Inventive Step** | ⚠️ BORDERLINE | Graph analysis is known, but application is novel |
| **Industrial Applicability** | ✅ PASS | Directly applicable to wealth management |
| **Not Excluded (3(k))** | ⚠️ BORDERLINE | Risk of "business method" rejection |
| **Technical Advancement** | ⚠️ MODERATE | Advances graph analysis, but primarily business value |

---

### 12.5 Recommended Claim Strategy

**To maximize patentability**:

1. **Emphasize Graph Database Architecture**:
   - Claim specific node/edge schema
   - Highlight multi-layer graph structure

2. **Focus on Algorithms**:
   - Weighted path discovery (not generic shortest path)
   - Multi-dimensional scoring formulas

3. **Include Technical Components**:
   - Graph database (Neo4j)
   - Real-time data ingestion pipelines
   - API integrations

4. **Avoid Pure Business Language**:
   - Frame as "engagement probability calculation" not "introduction finder"
   - Emphasize data processing, not business outcomes

5. **Consider Trade Secret Alternative**:
   - Patent the methodology, keep specific weights as trade secrets
   - Or file as Phase 2 (after IP-01 and IP-02 are granted)

---

### 12.6 Filing Recommendations

**India Filing**: ⚠️ **MODERATE RISK** - Recommend filing after IP-01 and IP-02

**Alternative Strategies**:

1. **File in US first** (stronger patentability for software), then PCT to India
2. **Keep as trade secret** (if India filing is rejected)
3. **Bundle with IP-01** (as a dependent feature, not standalone)

**PCT Expansion**: US, EU (if India filing succeeds)

---

## Summary

**IP Candidate 3 (Network Relationship Scoring)** is a **moderate patent candidate** with:

- ⚠️ Moderate prior art risk (social network analysis exists)
- ⚠️ Borderline patentability under Indian law (business method risk)
- ✅ High commercial value (enables warm introductions)
- ⚠️ Recommend Phase 2 filing or trade secret protection

**Recommended Action**: **File after IP-01 and IP-02**, or consider **trade secret** protection for specific algorithms.

---

*Document prepared for patent counsel review. All technical details subject to verification and refinement during prosecution.*
