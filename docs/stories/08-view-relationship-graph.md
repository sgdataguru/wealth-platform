# User Story: 8 - View Relationship Graph Between Entities

**As a** Relationship Manager,
**I want** to visualize the relationships between individuals, companies, sectors, and liquidity events,
**so that** I can understand how changes in one entity may impact others in my client network.

## Acceptance Criteria

* Graph visualization shows connections between entities (people, companies, sectors)
* Liquidity events are mapped to affected entities
* User can trace how a trigger or data change impacts across companies and individuals
* Graph is interactive (zoom, pan, click to explore)
* Relationships are clearly labeled (e.g., "promoter of", "investor in")

## Notes

* System uses a graph database to map relationships
* Every trigger or data change should be traceable to understand its impact
* This provides the underlying intelligence for lead scoring and recommendations
