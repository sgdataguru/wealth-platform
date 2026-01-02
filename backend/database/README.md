# Intelligence DB Migrations (Demo)

This folder contains SQL migrations and demo seeds for the intelligence prototype.

Files:
- `migrations/0001_create_intelligence_signals.sql`
- `migrations/0002_create_conflicts.sql`
- `migrations/0003_create_audit_logs.sql`
- `migrations/0004_add_fulltext_indexes.sql` ← **NEW: Full-text search support**
- `seeds/seed_intelligence_demo.sql`

Usage (local Postgres):

1. Apply migrations in order:

```bash
psql $DATABASE_URL -f backend/database/migrations/0001_create_intelligence_signals.sql
psql $DATABASE_URL -f backend/database/migrations/0002_create_conflicts.sql
psql $DATABASE_URL -f backend/database/migrations/0003_create_audit_logs.sql
psql $DATABASE_URL -f backend/database/migrations/0004_add_fulltext_indexes.sql
```

2. Load demo seeds:

```bash
psql $DATABASE_URL -f backend/database/seeds/seed_intelligence_demo.sql
```

Usage (Supabase SQL editor):

- Paste each migration into the Supabase SQL editor and run sequentially. Then paste the seed SQL.

Notes:
- Migration 0004 adds GIN indexes for fast full-text search (supports `textSearch` API in Supabase client)
- Search operates on both `title` and `description` columns
- These are demo schemas intended for prototype and validation. Adjust column types and add constraints as needed for production.
- For production, consider using Supabase migration CLI: `supabase migration new <name>`

## Testing Full-Text Search

After applying migrations, test search functionality:

```sql
-- Test full-text search
SELECT * FROM intelligence_signals 
WHERE fts @@ websearch_to_tsquery('english', 'transfer');

-- Test with ranking
SELECT id, title, ts_rank(fts, websearch_to_tsquery('english', 'IPO')) as rank
FROM intelligence_signals
WHERE fts @@ websearch_to_tsquery('english', 'IPO')
ORDER BY rank DESC;
```

