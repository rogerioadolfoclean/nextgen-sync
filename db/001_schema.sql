-- ============================================================
-- NextGen Sync — schema initial
-- Plateforme de visioconference et collaboration unifiee
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- Utilisateurs ----------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'host', 'admin')),
  avatar_url    TEXT,
  plan          TEXT NOT NULL DEFAULT 'freemium'
                CHECK (plan IN ('freemium', 'pro', 'enterprise')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Reunions ----------
CREATE TABLE IF NOT EXISTS meetings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  host_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  kind          TEXT NOT NULL DEFAULT 'meeting'
                CHECK (kind IN ('meeting', 'webinar')),
  status        TEXT NOT NULL DEFAULT 'scheduled'
                CHECK (status IN ('scheduled', 'live', 'ended')),
  scheduled_at  TIMESTAMPTZ,
  started_at    TIMESTAMPTZ,
  ended_at      TIMESTAMPTZ,
  waiting_room  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meetings_host ON meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- ---------- Participants d'une reunion ----------
CREATE TABLE IF NOT EXISTS participants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'attendee'
              CHECK (role IN ('host', 'moderator', 'speaker', 'attendee')),
  muted       BOOLEAN NOT NULL DEFAULT false,
  admitted    BOOLEAN NOT NULL DEFAULT true,
  joined_at   TIMESTAMPTZ,
  left_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_participants_meeting ON participants(meeting_id);

-- ---------- Messages de chat ----------
CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  body        TEXT NOT NULL,
  private_to  UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_meeting ON messages(meeting_id, created_at);

-- ---------- Enregistrements ----------
CREATE TABLE IF NOT EXISTS recordings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id   UUID REFERENCES meetings(id) ON DELETE SET NULL,
  owner_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  url          TEXT,
  duration_s   INTEGER NOT NULL DEFAULT 0,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Sortie IA (compte rendu, decisions, taches, transcription)
  summary      TEXT,
  decisions    JSONB,
  action_items JSONB,
  transcript   TEXT
);

CREATE INDEX IF NOT EXISTS idx_recordings_owner ON recordings(owner_id, recorded_at DESC);

-- ---------- Tableaux blancs ----------
CREATE TABLE IF NOT EXISTS whiteboards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID REFERENCES meetings(id) ON DELETE CASCADE,
  state       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whiteboards_meeting ON whiteboards(meeting_id);

-- ---------- Sondages ----------
CREATE TABLE IF NOT EXISTS polls (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open'
              CHECK (status IN ('open', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  votes       INTEGER NOT NULL DEFAULT 0,
  position    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options(poll_id, position);

-- ---------- Messages video ----------
CREATE TABLE IF NOT EXISTS video_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  url         TEXT,
  duration_s  INTEGER NOT NULL DEFAULT 0,
  seen        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_messages_recipient
  ON video_messages(recipient_id, created_at DESC);

-- ---------- Abonnements (Stripe) ----------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL DEFAULT 'freemium'
                         CHECK (plan IN ('freemium', 'pro', 'enterprise')),
  status                 TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  current_period_end     TIMESTAMPTZ,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- ---------- Sessions (cookies signes) ----------
CREATE TABLE IF NOT EXISTS sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
