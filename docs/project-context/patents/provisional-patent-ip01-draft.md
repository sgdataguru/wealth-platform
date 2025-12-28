# Provisional Patent Application Draft: IP-01

## AI-Powered Lead Scoring Algorithm for UHNW Liquidity Events

**Applicant**: [Company Name]  
**Inventors**: [Inventor Names]  
**Filing Date**: [To be determined]  
**Application Type**: Provisional Patent Application (India)

---

## TITLE OF THE INVENTION

**System and Method for Predicting Wealth Management Transaction Propensity Using Multi-Signal Fusion and Dynamic Time-Decay Scoring**

---

## FIELD OF THE INVENTION

This invention relates to computer-implemented systems and methods for predicting transaction propensity of Ultra-High-Net-Worth (UHNW) individuals based on corporate liquidity events, specifically to automated lead scoring systems for wealth management relationship managers using multi-source data fusion, time-sensitive analytics, and source confidence weighting.

---

## BACKGROUND OF THE INVENTION

### Technical Problem

Wealth management firms managing portfolios for Ultra-High-Net-Worth (UHNW) individuals face significant technical challenges in identifying and prioritizing client engagement opportunities arising from corporate liquidity events. Relationship Managers (RMs) must process information from multiple heterogeneous data sources including stock exchanges (NSE, BSE), regulatory filings (SEBI), news media, and corporate disclosures to identify events such as Initial Public Offerings (IPOs), Mergers & Acquisitions (M&A), Employee Stock Option Plan (ESOP) exercises, buybacks, and dividend distributions.

### Limitations of Prior Art

Existing customer relationship management (CRM) systems employ generic lead scoring mechanisms designed for business-to-business (B2B) sales or retail banking, which suffer from the following technical deficiencies:

1. **Lack of Event-Type Differentiation**: Prior art systems do not account for the differential impact of various corporate liquidity event types on wealth management transaction propensity. An IPO generating ₹500 Crores in liquidity has fundamentally different characteristics than a ₹50 Crore dividend payment, yet existing systems treat them equivalently.

2. **Absence of Temporal Decay Functions**: Existing systems do not implement time-decay mechanisms to reduce the relevance of stale events. A 6-month-old IPO announcement has significantly lower predictive value than a recent announcement, but prior art systems lack event-type-specific decay rate constants.

3. **No Source Reliability Weighting**: Prior art systems do not differentiate data source reliability. Information from official stock exchange disclosures (99%+ accuracy) is treated identically to speculative news articles (70% accuracy), leading to false positives and wasted RM effort.

4. **Static Scoring Models**: Existing systems use batch processing with daily or weekly updates, failing to provide real-time recalculation as new events are detected.

5. **Generic Calibration**: Prior art lead scoring is calibrated for mass-market transactions (₹1-10 Lakhs), not UHNW wealth management transactions (₹10 Crores+), resulting in inappropriate prioritization.

### Technical Need

There exists a technical need for a computer-implemented system that:

- Aggregates multiple corporate liquidity event signals from heterogeneous data sources
- Applies event-type-specific weighting based on liquidity generation potential
- Implements exponential time-decay functions with event-specific decay rate constants
- Weights events by data source confidence scores
- Provides real-time score recalculation as new events are detected
- Is calibrated specifically for UHNW wealth management transaction propensity

---

## SUMMARY OF THE INVENTION

The present invention addresses the aforementioned technical problems by providing a computer-implemented system and method for calculating a dynamic lead score that predicts the probability of a UHNW individual engaging in a wealth management transaction.

### Core Technical Innovation

The invention employs a multi-signal fusion algorithm that aggregates corporate liquidity event signals using a proprietary scoring function:

```
LeadScore(P, t) = Σ [S_i × W_i × R(t_i, t) × C_i]
                  i=1 to N
```

Where:

- **P** = Person/Entity being scored
- **t** = Current timestamp
- **N** = Number of active events associated with P
- **S_i** = Severity score of event i (logarithmic transformation of financial magnitude)
- **W_i** = Weight of event type i (importance factor based on liquidity generation)
- **R(t_i, t)** = Recency factor (exponential decay function with event-type-specific decay rate)
- **C_i** = Confidence score of data source i (reliability weighting)

### Technical Advantages

1. **Logarithmic Severity Scaling**: Prevents mega-events from dominating scores while rewarding larger amounts
2. **Event-Type-Specific Weighting**: Differential treatment based on liquidity generation potential (IPO=1.0, M&A=0.95, Dividend=0.30)
3. **Exponential Time Decay**: Event-type-specific decay rate constants (λ_i) reflecting real-world urgency windows
4. **Source Confidence Integration**: Embedded reliability weighting (NSE=0.99, News=0.70) in scoring algorithm
5. **Real-Time Recalculation**: Event-driven architecture enabling sub-minute score updates

---

## DETAILED DESCRIPTION OF THE INVENTION

### System Architecture

The invention comprises the following technical modules:

#### 1. Data Ingestion Layer

**Function**: Collect raw data from multiple heterogeneous sources

**Data Sources**:

- Stock Exchange APIs (NSE, BSE) - Real-time WebSocket connections
- Regulatory Filing Systems (SEBI) - RSS feed polling
- News Aggregators - Streaming APIs
- Corporate Disclosure Websites - Web scraping
- Internal CRM Data - Database queries

**Output**: Normalized event objects with metadata (event type, amount, date, source)

---

#### 2. Event Detection & Normalization Module

**Function**: Classify raw data into structured event objects

**Processing Steps**:

- Event type classification (14 categories: IPO, M&A, ESOP, Buyback, Dividend, etc.)
- Entity resolution (linking events to specific individuals via company ownership)
- Deduplication (cross-source reconciliation)
- Metadata extraction (financial amount, date, source identifier)

**Technical Implementation**:

- Natural Language Processing (NLP) for event classification
- Named Entity Recognition (NER) for person/company extraction
- Fuzzy matching for deduplication (Levenshtein distance)

---

#### 3. Lead Scoring Engine (Core Invention)

**Function**: Calculate dynamic lead score using multi-signal fusion algorithm

**Sub-Modules**:

##### 3.1 Severity Calculation Module

**Input**: Financial amount (Amount_i) in ₹ Crores  
**Algorithm**:

```
S_i = log₁₀(Amount_i / BaseAmount) × 10
```

Where BaseAmount = ₹10 Cr (significance threshold)

**Example**:

- ₹500 Cr IPO: S = log₁₀(500/10) × 10 = 16.99
- ₹50 Cr dividend: S = log₁₀(50/10) × 10 = 6.99

**Technical Rationale**: Logarithmic scaling prevents outlier dominance while maintaining sensitivity to magnitude differences.

---

##### 3.2 Weight Assignment Module

**Input**: Event type (categorical variable)  
**Algorithm**: Lookup table mapping event types to weights

**Weight Table**:

| Event Type | Weight (W_i) | Liquidity Generation Potential |
|------------|--------------|-------------------------------|
| IPO | 1.0 | Highest (immediate large-scale liquidity) |
| M&A (Acquisition) | 0.95 | Very high (one-time payout) |
| ESOP Exercise | 0.85 | High (significant personal liquidity) |
| Secondary Sale | 0.80 | High (direct cash realization) |
| Buyback | 0.70 | Moderate-high (partial liquidity) |
| Dividend (Special) | 0.50 | Moderate (one-time distribution) |
| Dividend (Regular) | 0.30 | Low-moderate (recurring, predictable) |
| Bonus Issue | 0.20 | Low (no immediate liquidity) |
| Stock Split | 0.10 | Very low (cosmetic, no cash) |
| Rights Issue | 0.40 | Low-moderate (optional participation) |
| Demerger | 0.60 | Moderate (asset reallocation) |
| Promoter Pledge | 0.25 | Low (potential distress signal) |
| Board Appointment | 0.15 | Very low (influence indicator) |
| Regulatory Filing | 0.35 | Low-moderate (compliance-driven) |

**Calibration Methodology**: Weights derived from statistical analysis of 1,000+ historical RM engagement transactions, correlating event types with successful wealth management conversions.

---

##### 3.3 Time-Decay Computation Module

**Input**: Event timestamp (t_i), current timestamp (t)  
**Algorithm**: Exponential decay function

```
R(t_i, t) = e^(-λ_i × Δt)
```

Where:

- Δt = (t - t_i) in days
- λ_i = Event-type-specific decay rate constant

**Decay Rate Constants**:

| Event Type | λ_i | Half-Life (days) | Rationale |
|------------|-----|------------------|-----------|
| IPO | 0.015 | 46 | Lock-up period typically 6-12 months |
| M&A | 0.012 | 58 | Regulatory approval + closing: 3-6 months |
| ESOP Exercise | 0.020 | 35 | Exercise window typically 1-3 months |
| Dividend | 0.030 | 23 | Record date to payout: 15-30 days |
| News Mention | 0.050 | 14 | Media attention decays rapidly |

**Example Calculation**:

- IPO announced 30 days ago: R = e^(-0.015 × 30) = 0.638 (64% of original value)
- IPO announced 90 days ago: R = e^(-0.015 × 90) = 0.261 (26% of original value)

**Technical Rationale**: Exponential decay reflects empirical observation that engagement success probability decreases non-linearly with time. Half-life values calibrated from historical RM engagement data.

---

##### 3.4 Source Confidence Module

**Input**: Source identifier (categorical variable)  
**Algorithm**: Lookup table mapping sources to confidence scores

**Confidence Score Table**:

| Data Source | Confidence (C_i) | Justification |
|-------------|------------------|---------------|
| NSE/BSE Official Disclosures | 0.99 | Regulatory authority, legal requirement |
| SEBI Filings | 0.98 | Government regulatory body |
| Company Investor Relations Website | 0.95 | Official corporate disclosure |
| Bloomberg/Reuters Terminal | 0.90 | Verified financial data providers |
| Business News (Tier 1: ET, Mint, BS) | 0.75 | Editorial standards, fact-checking |
| Business News (Tier 2) | 0.60 | Less rigorous verification |
| Social Media (LinkedIn, Twitter) | 0.40 | Unverified, user-generated content |
| Rumor/Speculation | 0.20 | High noise, low signal |

**Application**: When same event reported by multiple sources, highest-confidence source is used.

---

##### 3.5 Multi-Signal Aggregation Module

**Input**: Array of events [E_1, E_2, ..., E_N] associated with person P  
**Algorithm**: Weighted sum

```
RawScore = Σ [S_i × W_i × R(t_i, t) × C_i]
           i=1 to N
```

**Example Calculation**:

Person: Rajesh Kumar  
Events:

1. IPO Filing (5 days ago, ₹300 Cr, SEBI source)
   - S_1 = log₁₀(300/10) × 10 = 14.77
   - W_1 = 1.0 (IPO)
   - R_1 = e^(-0.015 × 5) = 0.928
   - C_1 = 0.98 (SEBI)
   - Contribution: 14.77 × 1.0 × 0.928 × 0.98 = 13.42

2. ESOP Exercise (26 days ago, ₹45 Cr, Company IR)
   - S_2 = log₁₀(45/10) × 10 = 6.53
   - W_2 = 0.85 (ESOP)
   - R_2 = e^(-0.020 × 26) = 0.595
   - C_2 = 0.95 (Company IR)
   - Contribution: 6.53 × 0.85 × 0.595 × 0.95 = 3.14

RawScore = 13.42 + 3.14 = 16.56

---

##### 3.6 Score Normalization Module

**Input**: RawScore  
**Algorithm**:

```
FinalScore = min(100, RawScore × NormalizationFactor)
```

Where NormalizationFactor is calibrated to map typical high-value leads to 80-95 range.

**Example**: RawScore 16.56 × 5 = 82.8 ≈ 83

**Threshold-Based Categorization**:

- 90-100: Immediate engagement (Hot)
- 70-89: High priority (Warm)
- 50-69: Medium priority (Monitor)
- 0-49: Low priority (Cold)

---

#### 4. Prioritization & Ranking Layer

**Function**: Filter and rank leads for RM portfolio

**Processing Steps**:

- Portfolio filtering (only show leads in RM's client list)
- Threshold-based alerts (Score > 75 triggers immediate notification)
- Daily priority queue generation (sorted by FinalScore descending)

---

#### 5. RM Dashboard / API

**Function**: Deliver prioritized lead list to relationship managers

**User Interface Components**:

- Lead list (sorted by score)
- Score breakdown (explainability: which events contributed)
- Action recommendations (suggested next steps)
- Historical tracking (score evolution over time)

---

### Technical Implementation Details

#### Real-Time Recalculation Architecture

**Event-Driven Processing**:

1. New event detected → Trigger score recalculation for affected persons
2. Time-based recalculation → Nightly batch update of all recency factors
3. On-demand calculation → RM requests updated score for specific client

**Performance Optimization**:

- Incremental updates (only recalculate affected scores)
- Caching (store intermediate results)
- Parallel processing (multi-threaded score calculation)

**Scalability**:

- Handles 100,000+ persons in database
- Processes 10,000+ new events per day
- Sub-second response time for score queries

---

### Algorithmic Novelty

The invention's technical novelty lies in the **combination** of:

1. **Multi-dimensional scoring**: Severity × Weight × Recency × Confidence (4 factors)
2. **Event-type-specific calibration**: Different weights and decay rates per event type
3. **Logarithmic severity transformation**: Prevents outlier dominance
4. **Exponential time decay**: Non-linear temporal degradation
5. **Source confidence integration**: Embedded in scoring (not separate validation)
6. **Real-time recalculation**: Event-driven architecture
7. **UHNW-specific calibration**: Weights tuned for ₹10 Cr+ transactions

No prior art system combines all these elements in a single integrated scoring algorithm.

---

## CLAIMS

### Claim 1 (Independent - Method)

A computer-implemented method for predicting wealth management transaction propensity of an individual, the method comprising:

(a) receiving, by a data ingestion module executing on at least one processor, a plurality of corporate liquidity event signals from a plurality of data sources, each event signal associated with at least one individual and comprising:

- an event type selected from a predefined taxonomy of at least ten event categories including initial public offerings, mergers and acquisitions, employee stock option exercises, and dividend distributions;
- a financial magnitude value representing a monetary amount associated with the event;
- a timestamp indicating when the event occurred or was detected;
- a source identifier indicating the data source from which the event signal originated;

(b) calculating, by a severity computation module executing on the at least one processor, a severity score for each event signal using a logarithmic transformation of the financial magnitude value relative to a predefined base amount according to the formula:

   ```
   S_i = log₁₀(Amount_i / BaseAmount) × ScalingFactor
   ```

   where S_i is the severity score, Amount_i is the financial magnitude value, BaseAmount is a predefined threshold value, and ScalingFactor is a constant multiplier;

(c) assigning, by a weight assignment module executing on the at least one processor, an event type weight to each event signal based on the event type, wherein different event types are assigned different weights according to a predefined weighting scheme calibrated for ultra-high-net-worth wealth management transactions, wherein:

- initial public offering events are assigned a weight of 1.0;
- merger and acquisition events are assigned a weight of 0.95;
- employee stock option exercise events are assigned a weight of 0.85;
- buyback events are assigned a weight of 0.70; and
- regular dividend distribution events are assigned a weight of 0.30;

(d) computing, by a time-decay module executing on the at least one processor, a recency factor for each event signal using an exponential decay function applied to a time difference between the timestamp of the event signal and a current timestamp according to the formula:

   ```
   R(t_i, t) = e^(-λ_i × Δt)
   ```

   where R is the recency factor, t_i is the timestamp of the event signal, t is the current timestamp, Δt is the time difference in days, and λ_i is an event-type-specific decay rate constant;

(e) assigning, by a source confidence module executing on the at least one processor, a confidence score to each event signal based on the source identifier, wherein different data sources are assigned different confidence scores according to a predefined reliability hierarchy, wherein:

- stock exchange official disclosures and regulatory filings are assigned a confidence score of at least 0.95;
- verified financial news services are assigned a confidence score between 0.70 and 0.90; and
- unverified media and social media are assigned a confidence score below 0.70;

(f) aggregating, by a multi-signal fusion module executing on the at least one processor, the plurality of event signals for the individual by computing a weighted sum, wherein each event signal contributes to the sum based on a product of:

- the severity score calculated in step (b);
- the event type weight assigned in step (c);
- the recency factor computed in step (d); and
- the confidence score assigned in step (e);

(g) generating, by a score normalization module executing on the at least one processor, a final lead score for the individual by normalizing the weighted sum to a predefined numerical range of 0 to 100; and

(h) outputting, by a prioritization module executing on the at least one processor, the final lead score to a user interface for display to a relationship manager, wherein the final lead score indicates a predicted probability of the individual engaging in a wealth management transaction within a predefined time window.

---

### Claim 2 (Dependent on Claim 1)

The method of claim 1, wherein the event-type-specific decay rate constant λ_i in step (d) is selected from:

- 0.015 for initial public offering events;
- 0.012 for merger and acquisition events;
- 0.020 for employee stock option exercise events; and
- 0.030 for dividend distribution events.

---

### Claim 3 (Dependent on Claim 1)

The method of claim 1, wherein the predefined base amount in step (b) is ₹10 Crores and the scaling factor is 10.

---

### Claim 4 (Dependent on Claim 1)

The method of claim 1, further comprising:
(i) detecting, by the data ingestion module, a new corporate liquidity event signal;
(j) automatically recalculating, by the multi-signal fusion module, the final lead score for affected individuals in real-time; and
(k) updating, by the prioritization module, the user interface to reflect the recalculated final lead score.

---

### Claim 5 (Dependent on Claim 1)

The method of claim 1, wherein the predefined weighting scheme in step (c) is calibrated based on statistical analysis of historical wealth management transaction data comprising at least 1,000 transactions with transaction values exceeding ₹10 Crores.

---

### Claim 6 (Independent - System)

A system for predicting wealth management transaction propensity of an individual, the system comprising:

(a) at least one processor;

(b) at least one non-transitory computer-readable storage medium storing instructions that, when executed by the at least one processor, cause the system to:

   (i) receive a plurality of corporate liquidity event signals from a plurality of data sources, each event signal comprising an event type, a financial magnitude value, a timestamp, and a source identifier;

   (ii) calculate a severity score for each event signal using a logarithmic transformation of the financial magnitude value;

   (iii) assign an event type weight to each event signal based on the event type according to a predefined weighting scheme;

   (iv) compute a recency factor for each event signal using an exponential decay function with an event-type-specific decay rate constant;

   (v) assign a confidence score to each event signal based on the source identifier according to a predefined reliability hierarchy;

   (vi) aggregate the plurality of event signals by computing a weighted sum based on the severity score, event type weight, recency factor, and confidence score;

   (vii) generate a final lead score by normalizing the weighted sum to a range of 0 to 100; and

   (viii) output the final lead score to a user interface for display to a relationship manager.

---

### Claim 7 (Dependent on Claim 6)

The system of claim 6, wherein the instructions further cause the system to:
(ix) filter the plurality of event signals to identify events associated with individuals in a predefined client list associated with the relationship manager; and
(x) generate a prioritized list of individuals ordered by final lead score in descending order.

---

## ABSTRACT

A computer-implemented system and method for predicting wealth management transaction propensity using multi-signal fusion. The system aggregates corporate liquidity event signals (IPOs, M&As, ESOPs, dividends) from multiple data sources, calculating a dynamic lead score using: (1) logarithmic severity scaling of financial magnitude, (2) event-type-specific weighting based on liquidity generation potential, (3) exponential time-decay functions with event-specific decay rates, and (4) source confidence scoring based on data reliability. The system provides real-time score recalculation as new events are detected, enabling relationship managers to prioritize UHNW client engagement opportunities. The invention addresses technical limitations of prior art CRM systems by providing event-type-specific calibration, temporal awareness, and source reliability weighting in an integrated scoring algorithm.

---

## DRAWINGS (To be prepared)

**Figure 1**: System architecture diagram showing data flow from ingestion to RM dashboard  
**Figure 2**: Flowchart of lead scoring algorithm  
**Figure 3**: Graph showing exponential time-decay curves for different event types  
**Figure 4**: Example RM dashboard user interface  
**Figure 5**: Comparison of prior art vs. invention scoring methodology  

---

## INVENTOR DECLARATION

The undersigned inventor(s) declare that:

- They are the original and first inventor(s) of the subject matter claimed
- The invention has not been publicly disclosed prior to this application
- All information provided is true and accurate to the best of their knowledge

**Inventor Signature(s)**: ___________________________  
**Date**: ___________________________

---

*End of Provisional Patent Application Draft*

**Note to Patent Counsel**: This draft is prepared for provisional filing in India. Please review and refine claims, add drawings, and ensure compliance with Indian Patent Office requirements before filing.
