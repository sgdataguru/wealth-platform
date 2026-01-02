-- seed_intelligence_demo.sql
-- Insert demo signals into intelligence_signals and sample conflict + audit log

INSERT INTO intelligence_signals (id, title, description, relevance_score, detected_at, source_trace, raw_payload)
VALUES
('demo-signal-1', 'Company X large transfer', 'Observed large transfer from client account to external beneficiary', 0.92, now() - interval '1 hour',
  '[{"source":"FINOVA","receivedAt":"2025-12-31T10:00:00Z","rawId":"finova-123"}]'::jsonb,
  '{"raw":"demo"}'::jsonb
),
('demo-signal-2', 'Company X IPO filing rumor', 'Unconfirmed IPO filing rumor observed in media', 0.6, now() - interval '2 hour',
  '[{"source":"MARKET","receivedAt":"2025-12-31T09:00:00Z","rawId":"feed-789"}]'::jsonb,
  '{"raw":"demo2"}'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO intelligence_conflicts (signal_id, field, conflicting_values, resolution, has_auto_resolution)
VALUES
('demo-signal-1', 'beneficiary_name', '[{"value":"Rajesh Kumar","source":"zauba","confidence":60},{"value":"R. Kumar","source":"mca","confidence":80}]'::jsonb, null, false)
ON CONFLICT DO NOTHING;

INSERT INTO intelligence_audit_logs (event_type, source, details, severity)
VALUES
('INGEST_DEMO', 'demo', '{"message":"Demo seed ingestion"}'::jsonb, 'INFO')
ON CONFLICT DO NOTHING;
