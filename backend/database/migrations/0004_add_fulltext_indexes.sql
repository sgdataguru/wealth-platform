-- Add indexes for intelligence signals

CREATE INDEX IF NOT EXISTS idx_signals_search_vector
  ON intelligence_signals USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_signals_detected
  ON intelligence_signals (detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_signals_relevance
  ON intelligence_signals (relevance_score DESC);

CREATE INDEX IF NOT EXISTS idx_signals_detected_relevance
  ON intelligence_signals (detected_at DESC, relevance_score DESC);
