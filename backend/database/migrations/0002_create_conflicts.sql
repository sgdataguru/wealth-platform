-- 0002_create_conflicts.sql
-- Stores detected conflicts between sources for manual review and audit
CREATE TABLE IF NOT EXISTS intelligence_conflicts (
  id SERIAL PRIMARY KEY,
  signal_id TEXT NOT NULL,
  field TEXT NOT NULL,
  conflicting_values JSONB NOT NULL, -- [{value, source, confidence}]
  resolution JSONB, -- {resolvedValue, strategy, resolvedBy, resolvedAt}
  has_auto_resolution BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conflicts_signal_id ON intelligence_conflicts(signal_id);
