-- Create intelligence signals table
-- Assumes prospects table exists with a primary key `id` and rm_id column.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS intelligence_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  description text,
  relevance_score numeric(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  detected_at timestamptz NOT NULL DEFAULT now(),
  source_trace jsonb NOT NULL DEFAULT '[]'::jsonb,
  prospect_id uuid REFERENCES prospects(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED
);

ALTER TABLE intelligence_signals ENABLE ROW LEVEL SECURITY;

-- RM access policy
CREATE POLICY "RM can read assigned intelligence signals" ON intelligence_signals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM prospects p
      WHERE p.id = intelligence_signals.prospect_id
        AND p.rm_id = auth.uid()
    )
  );
