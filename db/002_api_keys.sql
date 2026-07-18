-- ============================================================
-- NextGen Sync — API publique pour développeurs
-- Clés API (Bearer) + journal des appels
-- ============================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  prefix        TEXT NOT NULL,
  key_hash      TEXT NOT NULL UNIQUE,
  environment   TEXT NOT NULL DEFAULT 'sandbox'
                CHECK (environment IN ('production', 'sandbox')),
  scopes        TEXT[] NOT NULL DEFAULT '{meetings,recordings,webinars,analytics}',
  last_used_at  TIMESTAMPTZ,
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_owner ON api_keys(owner_id);

CREATE TABLE IF NOT EXISTS api_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id   UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  method       TEXT NOT NULL,
  endpoint     TEXT NOT NULL,
  status       INTEGER NOT NULL,
  duration_ms  INTEGER NOT NULL DEFAULT 0,
  ip           TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_logs_key ON api_logs(api_key_id, created_at DESC);
