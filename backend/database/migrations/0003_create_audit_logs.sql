-- Create ingestion audit logs table

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS intelligence_ingestion_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text NOT NULL,
  source varchar(32) NOT NULL,
  processed integer NOT NULL DEFAULT 0,
  conflicts integer NOT NULL DEFAULT 0,
  errors jsonb,
  inserted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (batch_id, source)
);
