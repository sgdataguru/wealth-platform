# 9-Week MVP Execution Strategy: UHNW Wealth Intelligence Platform

**Role:** Senior Technical Program Manager (TPM) & Lead Systems Architect  
**Objective:** Deliver high-performance Web App MVP (Liquidity Triggers, Action Center, AI Insights, Network Visualization, Analytics)  
**Timeline:** 9 Weeks  
**Team:** 1 FE, 1 BE, 1 DE, 1 DevOps, 1 PM

---

## 1. MVP Success Metrics & Exit Criteria (Non-Negotiable)

The MVP will be considered successful only if the following measurable criteria are met:

### Business KPIs

* **≥ 10 actionable Liquidity Triggers/week** with confidence ≥ 80%.
* **RM action rate ≥ 60%** within 48 hours of trigger firing.
* **False-positive rate ≤ 15%** (Trigger validity verified by RMs).
* **AI Insight usefulness rating ≥ 4/5** (collected via RM feedback widget).

### Technical KPIs

* **End-to-end signal latency ≤ 5 minutes (P95)** (Ingestion -> Dashboard).
* **Dashboard load time ≤ 2 seconds (P95)**.
* **API error rate < 0.5%**.
* **Zero PII/MNPI leaks in logs** (validated by automated audit scan).

### Exit Criteria (Week 9)

* All **RED-category signals** fire correctly for 7 consecutive days.
* UAT signed off by **≥ 2 senior RMs**.
* **Production rollback** tested successfully.

---

## 2. Pre-Kickoff Readiness (Phase 0)

Before Day 1, we must eliminate ambiguity to ensure the team hits the ground running.

### Product Readiness

* **Finalize PRD & Scope:** Lock scope for the 5 Core Features.
  * **Liquidity Triggers:** Define specific event types and data sources.
  * **Action Center & Fallback Logic UI:** Finalize layout (Story 00) and define UI graceful degradation (e.g., if Graph DB fails, fallback to List View).
  * **AI Insights:** Define input prompts, JSON schema, and context limits.
* **Definition of Done (DoD) - Global:**
  * Code reviewed & merged to `dev`.
  * Unit tests passing (>80% coverage).
  * **Security verified:** No critical vulnerabilities (SAST) and zero unmasked PII in non-prod logs.
  * Feature verified in Staging environment.
  * UI meets responsiveness criteria (Desktop/Tablet).
  * API Latency < 200ms (P95).
* **Design Sign-off:** High-fidelity Figma mocks with component states.

### Technical Readiness

* **Architecture Review:** Verify `infra/` Terraform scripts. Ensure AWS MSK (Kafka) and Spark cluster sizing matches expected throughput (est. 10k events/sec).
* **Compliance & Data Sovereignty:** Verify AWS Region selection complies with local data protection and sovereignty requirements for the target deployment jurisdiction.

* **GCC / Multi-Jurisdiction Considerations:**

  * **Multi-jurisdiction infra:** Identify target jurisdictions (e.g., Saudi Arabia - SAMA, UAE - ADGM/DIFC, Bahrain - CBB, Kuwait - CMA) and map required region, residency and isolation requirements (data-at-rest region, backup location, cross-border backup rules).
  * **Jurisdictional Policy Engine:** Define a lightweight policy engine (server-side) to evaluate cross-border operations (marketing, document sharing, product offers) at the point of action and return allow/deny with rationale.
  * **Shariah Compliance & Fields:** Add explicit `shariahStatus` and `complianceTags` to the canonical Client/Prospect model and plan UI affordances for Shariah-only views/filters and AI prompt constraints.
  * **Wallet Share Intelligence:** Define ingestion points for custodian/held-away assets and a nightly aggregation job to compute `totalWealth` and `walletShare` metrics for wallet-share triggers and UI cards.
  * **Cross-border Marketing Rules:** Capture consent, permitted channels per jurisdiction, and operational rules to prevent outbound messages that violate local marketing or privacy laws.
  * **Regulatory Fragmentation Risk:** Add this as a first-class risk to be evaluated during Architecture Review and prioritized in the cut-lines and runbooks.
* **Schema Finalization:** Define the Canonical Data Model for "Client", "Asset", and "Signal".
  * **Deliverable:** OpenAPI 3.0 spec for BE-FE contract and Avro schemas (`.avsc`) for Kafka topics.
* **Environment & Data Isolation Strategy (Hard Separation):**
  * **Environment Strategy:**
    * **Dev:** Logic dev | ID-masked synthetic data.
    * **Staging:** UAT/Perf | Production-like volume, masked PII.
    * **Prod:** Live | Real Client PII (Restricted access).
  * **Rules:**
    * No prod credentials in dev/staging.
    * No cross-env Kafka topic reuse.
    * Separate IAM roles per environment.
    * Feature Store is read-only in prod UI layer.
* **API Contract Governance:**
  * **OpenAPI 3.0 is source of truth:** FE–BE integration allowed only via versioned contracts.
  * **Breaking changes:** Require version bump (/v2) and backward compatibility window ≥ 2 weeks.
  * **Kafka schemas:** Backward-compatible Avro only. Schema Registry enforced (no “latest”).
  * **Owner:** Backend Lead. **Gate:** Weekly Architecture Review.

### Alignment & Cadence

* **Ceremonies:**
  * **Daily Standup:** 09:45 AM (15 min) - Blocker focused.
  * **Weekly Sprint Planning:** Monday 10:00 AM.
  * **Weekly Demo:** Friday 04:00 PM (Show progress, no slides).
* **Communication:**
  * **Slack channels:** `#dev-core`, `#alerts-critical`, `#product-updates`.
  * **Jira/Linear board:** Setup with **"Epics"** mapping to the 5 Core Features.
  * **GitHub:** Draft repo created with respective branches (`dev`, `staging`).

---

## 3. Third-Party Software Bill of Materials (BOM)

Detailed software inventory required for project execution, ensuring full FinTech compliance and functional readiness.

| Category | Component | Product/Vendor | Purpose | Compliance/Ops Note |
| :--- | :--- | :--- | :--- | :--- |
| **Core Infra** | Cloud Provider | **AWS** | Compute (EKS), Networking (VPC), Security | Selected compliant region based on deployment jurisdiction (e.g., `me-south-1` for Middle East). |
| **Data Stream** | Event Bus | **AWS MSK** (Apache Kafka) | Real-time events, Decoupling services | Schema Registry mandatory. Encrypted at rest. |
| **Data Proc** | Analytics Eng | **AWS EMR / Databricks** (Spark) | Signal aggregation, Privacy Filters | Cluster auto-termination required (FinOps). |
| **Database** | Relational | **AWS RDS** (PostgreSQL) | User data, WORM Audit Logs | Multi-AZ enabled for Prod. |
| **Database** | Graph | **Neo4j Aura** (Managed) | Network visualization, Pathfinding | dedicated instance preferred for data isolation. |
| **Database** | Cache/Store | **AWS ElastiCache** (Redis) | Feature Store, UI Caching | Non-persistent count (cache-only). |
| **AI / ML** | LLM Provider | **Azure OpenAI** / **AWS Bedrock** | Generative Insights | **Private Endpoint** mandatory. No data training on inputs. |
| **Auth / IAM** | Identity | **Auth0** / **AWS Cognito** | Client Auth, MFA Management | OIDC compliant. MFA enforced for Admin roles. |
| **DevOps** | CI/CD | **GitHub Actions** | Build/Test/Deploy pipelines | Self-hosted runners if source code restricted. |
| **DevOps** | Security | **Snyk** / **SonarQube** | SAST, SCA, Code Quality | Gate blocker in pipeline. |
| **Ops** | Observability | **Datadog** / **Prometheus** | APM, Logging, Metrics | Logs must be PII-scrubbed before ingest. |
| **Frontend** | UI Framework | **Next.js** | Web App Framework | SSR enabled. |
| **Frontend** | Components | **Tailwind CSS** + **Shadcn/ui** | Styling, Rapid UI dev | Consistent Design System. |

---

## 4. Decision Ownership & Escalation Model

| Area | Owner | Escalation Path |
| :--- | :--- | :--- |
| **Product Scope** | PM | Steering Committee |
| **Architecture** | Lead Architect | CTO |
| **Data Compliance** | Data Engineer | Legal / DPO |
| **Go/No-Go** | TPM | Sponsor |

**Escalation SLA:**

* Blocker unresolved > 24 hrs → TPM.
* Critical risk → Same-day escalation.

---

## 5. High-Velocity 9-Week Roadmap

### Phase 1: Foundation (Weeks 1-3)

*Focus: Piping, Infrastructure, and Core Data Models.*

* **Goal:** Secure, compliant end-to-end "Hello World" flow.
* **Key Deliverables:**
  * Dev & Staging Envs provisioned in compliant AWS region.
  * PII Masking & Privacy filters active in ingestion pipeline.
  * Base UI Shell with graceful error handling.
  * Kafka Topics created & Schema Registry configured.
* **Critical Path:** Infrastructure Provisioning -> PII Filter Implementation -> API Gateway Definition -> Database Schema Deployment.

### Phase 2: Integration (Weeks 4-6)

*Focus: Feature Implementation and Connecting Dots.*

* **Goal:** Functional MVP features with data integrity.
* **Key Deliverables:**
  * **Liquidity Triggers:** Real-time alerts with Audit Logging flowing via WebSockets.
  * **Action Center:** Live Dashboard.
  * **Network Visualization:** Graph database (Neo4j) integrated with Entity Resolution (deduplication).
  * **AI Insights:** LLM integration generating context-aware summaries.
  * **Jurisdictional Policy Engine (GCC):** Prototype server-side policy checks for cross-border actions and marketing rules; integrate as a pre-flight check in Action Center workflows.
  * **Shariah Compliance (GCC):** Add Shariah-aware filters and UI toggles (Shariah-only) for AI suggestions and product recommendations.
  * **Wallet Share Intelligence:** Implement nightly aggregation pipelines and surface wallet-share cards and triggers in the Action Center.
* **Feature Flag Strategy:**
  * All high-risk features (AI Insights, Network Graph, Fast-path Alerts) must be wrapped with config-based flags (LaunchDarkly/Internal).
  * **Benefit:** Enables partial rollouts and zero-downtime deactivation (Kill-switch).
* **Critical Path:** Data Pipeline Stability -> Entity Resolution -> Trigger Logic -> Audit Service -> Dashboard Update.

### Phase 3: Optimization & Launch (Weeks 7-9)

*Focus: Performance, Polish, and Reliability.*

* **Goal:** Production-ready stability and operational readiness.
* **Key Deliverables:**
  * Sub-second dashboard load times (Redis caching).
  * Business Activity Monitoring (BAM) dashboards.
  * L1 Support Runbooks.
  * User Acceptance Testing (UAT) sign-off.
  * Production deployment (Blue/Green).
* **FinOps Guardrails (POC-Safe):**
  * **AI Token spend cap:** Hard limit configured.
  * **Kafka retention:** ≤ 7 days for MVP.
  * **Spark auto-termination:** Enabled after idle.
  * **Weekly Cost Review:** TPM + DevOps review Token, MSK, Egress costs.
* **Critical Path:** Security Audit -> Load Testing -> Production Data Migration -> DNS Switch.

---

## 6. Role-Specific Task Matrix

| Week | Phase | Frontend (FE) | Backend (BE) | Data Engineer (DE) | DevOps | PM / TPM | Definition of Done (DoD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Foundation** | **Initialize** Next.js repo, implement UI Component Lib (Tailwind/Shadcn), & builds Auth screens. **Implement** "List View" fallback component for Network Graph. | **Initialize** NestJS/Python API, **Provision** DB Schemas (Postgres + Neo4j) via migration scripts. | **Provision** AWS MSK (Kafka) & Spark Infrastructure. **Define** & **Register** Avro schemas. **Implement** "Privacy Filter" (Spark UDF) for PII masking (**CRITICAL PATH**). | **Provision** VPCs/Roles in India AWS Region (`ap-south-1`). **Configure** CI/CD pipelines. | **Refine** "Liquidity Triggers" criteria. **Verify** DPDP/RBI data residency compliance. | Envs compliant. PII masked. Git repos initialized. |
| **2** | **Foundation** | **Implement** "Action Center" Shell (Story 00) & Grid Layout. **Integrate** Mock APIs. | **Develop** User Service & Asset Service endpoints. **Deploy** Swagger docs. | **Develop** Ingestion Pipelines (Market Data -> Kafka). **Ingest** CRM Data (Salesforce/Dynamics) & normalize relationships. **Implement** Bronze/Silver Delta tables. | **Configure** Docker container registry (ECR) & EKS/ECS clusters. **Setup** Secrets Manager. | **Finalize** "Network Visualization" logic. **Define** "Fall-back" UI behavior specifications. | API responds 200 OK. JSON logs free of MNPI. |
| **3** | **Foundation** | **Integrate** "Action Center" API (Agendas, Alerts). **Implement** global state stores (Zustand/Redux). | **Implement** `AuditService` to log all user actions to immutable store (WORM). **Implement** "Liquidity Triggers" Rule Engine. **Develop** Websocket Gateway. | **Develop** Spark Streaming jobs for signal detection (**CRITICAL PATH**). | **Configure** Monitoring (Prometheus/Grafana) & Log Aggregation (ELK/CloudWatch). | **Review** Alpha build (Foundation). **Draft** UAT Test Plan. | Real-time signals visible. Immutable Audit logs active. |
| **4** | **Integration** | **Develop** "Network Visualization" component using D3.js/React-Flow. **Implement** Error Boundaries for Component failure. | **Integrate** Neo4j driver. **Connect** `AuditService` hooks to all read/write Ops. **Develop** Graph API (Shortest Path). | **Implement** "Entity Resolution" pipeline (deduplication/linking) (**CRITICAL PATH**). **Populate** Neo4j (Graph DB). | **Implement** Caching Infrastructure (Redis/Memcached) for hot data. | **Conduct** Usability Testing on "Action Center". | Nodes deduplicated. Graph renders < 2s. |
| **5** | **Integration** | **Implement** "AI Insights" cards. **Develop** Markdown rendering for AI text. **Integrate** Feature Flags logic. | **Integrate** LLM Provider (OpenAI/Azure). **Implement** Prompt Engineering using PII-masked context. **Wrap** AI & Graph features in Feature Flags. | **Build** Feature Store (Redis) for real-time AI context (**CRITICAL PATH**). | **Implement** Security Scanning (SAST/DAST) in CI pipelines. | **Verify** "Liquidity Triggers" accuracy against market data. | AI Input free of PII. Feature store latency < 10ms. |
| **6** | **Integration** | **Implement** Real-time Websocket listeners for Notifications/Alerts. | **Optimize** Query Performance (Indexing, Query Plans). **Implement** Cache-Aside pattern. | **Implement** Data Quality Tests (Great Expectations). **Backfill** Historical Data. | **Provisio**n Load Testing environment (k6/JMeter). | **Sign-off** Beta Release. Go/No-Go for UAT. | Websockets push < 1s delay. Data Quality > 99%. |
| **7** | **Optimization** | **Optimize** Bundle Size (Code Splitting). **Refine** UX Micro-interactions. | **Implement** "Business Monitoring" (BAM) endpoints (Trigger Volume, AI Token Usage). **Harden** Security (Rate Limiting). | **Optimize** Spark Jobs (Partitioning, memory tuning). | **Execute** Disaster Recovery Drill. **Configure** Auto-scaling policies. | **Coordinate** UAT with RMs. **Triage** Bugs. **Monitor** FinOps dashboards. | BAM Dashboards live. P95 Latency goals met. DR RTO < 4h verified. |
| **8** | **Optimization** | **Fix** Bugs. **Finalize** Dark Mode theme. **Polish** Visual States. | **Fix** Bugs. **Implement** Circuit Breakers for 3rd party APIs. | **Finalize** Analytics Aggregations (Gold Layer). | **Provision** Production Environment. **Write** L1 Support Runbooks for Triage. | **Conduct** "Go/No-Go" Meeting. **Finalize** User Manuals. | L1 Runbooks published. Prod Env ready. |
| **9** | **Launch** | **Support** Production Deploy. **Integrate** Analytics SDK (GA/Mixpanel). | **Support** Production Deploy. **Monitor** API Health metrics. | **Monitor** Data Pipeline Lag & Data Freshness. | **Execute** Cutover to Prod. **Monitor** Error Rates. | **Execute** Launch Comms. **Plan** V2 Roadmap. | **LIVE IN PRODUCTION.** |

---

## 7. Technical Depth & Risk Management

### Security Threat Model (STRIDE-lite)

**Security Gate:** No prod deploy without STRIDE checklist sign-off.

| Threat | Area | Mitigation Strategy |
| :--- | :--- | :--- |
| **Spoofing** | Auth | OIDC + short-lived tokens |
| **Tampering** | Kafka | Signed messages + schema validation |
| **Repudiation** | Actions | Immutable `AuditService` (WORM) |
| **Info Disclosure** | Logs | PII masking + denylist (Privacy Filter) |
| **DoS** | APIs | Rate limiting + WAF |
| **Privilege Escalation** | RBAC | Fine-grained IAM + policy tests |

### Data/AI Integration Strategy: Real-Time, Accurate, & Compliant

To ensure **AI Insights** (Feature 09) are generated in real-time with high accuracy and strict compliance:

1. **Strict PII Masking (Privacy First):**
    * **Action:** All raw data (CRM, Market) passes through a **Spark Privacy Filter UDF** immediately upon ingestion. Names/IDs are hashed/tokenized before writing to ANY non-prod logs.
2. **Entity Resolution (Truth Architecture):**
    * **Action:** DE builds a "Linkage Service" in Week 4 to merge duplicate records (e.g., "J. Smith" vs "John Smith") before graph population.
3. **Feature Store & Inference:**
    * BE fetches tokenized context from Feature Store -> Sends to LLM -> Re-hydrates PII only at the "Glass Level" (UI) for authorized users. feature flags enable "Kill Switch" for unsafe output.

### Descoping Strategy & Cut-Lines ("The Ejection Seat")

To guarantee Week 9 launch, the following cut-lines apply if **Critical Path** tasks are delayed > 3 days by Week 4:

1. **AI Insights (Risk: High Complexity):**
    * *Fallback:* Revert to **Rule-Based Heuristics** (hardcoded templates) instead of Generative LLM summaries if LLM hallucinations > 10% or Latency > 3s by Week 5.
2. **Network Visualization (Risk: Rendering Perf):**
    * *Fallback:* Revert to **Paginated List View** of connections sorted by relationship strength if Entity Resolution fails to deduplicate > 80% of nodes by Week 5.

### Post-MVP Hardening Roadmap (Weeks 10–16)

This reassures stakeholders the MVP is not a dead-end prototype.

* **MAS / SEBI compliance mapping.**
* **Full RBAC:** Multi-tenant support (RM / Regional Head / Admin).
* **Advanced explainability** for AI scores.
* **DR automation:** Target RTO < 1 hr.
* **SOC2 / ISO prep artifacts.**

### Regulatory Fragmentation & Compliance Strategy

Regulatory fragmentation across jurisdictions (especially GCC nations) increases operational risk. Recommended mitigations and design rules for the MVP and immediate post-MVP period:

- **Policy-as-Config:** Keep jurisdiction rules in a versioned config (policy engine) so legal teams can update rules without code deploys.
- **Pre-flight Enforcement:** All cross-border or marketing actions must call the policy engine and block/soft-block actions when non-compliant; record decisions in the immutable `AuditService`.
- **Shariah-aware AI Pipeline:** Add a Shariah filtering step to the AI inference pipeline that filters or re-ranks suggestions for clients marked `shariahStatus` = 'halal' / 'restricted'.
- **Data Residency Controls:** Use environment isolation and dedicated storage endpoints per jurisdiction where required; employ encrypted replication with approval gating.
- **Regulatory Fragmentation Risk Scoring:** Maintain a per-client/regional risk score (low/medium/high) surfaced in RM UIs so operations can make informed choices (e.g., block cross-border outreach for `high` risk clients).
- **Legal Review Runbooks:** Create legal/ops runbooks for handling denied actions, cross-jurisdiction consent errors, and cross-border incident disclosure.
