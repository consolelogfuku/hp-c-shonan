CREATE TABLE IF NOT EXISTS cms_meta (
  key TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS cms_news (
  slug TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  source_url TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cms_sessions (
  token_hash TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  expires INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_login_limit (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  attempts INTEGER NOT NULL,
  resets INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS cms_news_published_date
  ON cms_news (published, updated_at DESC);

CREATE INDEX IF NOT EXISTS cms_sessions_expires
  ON cms_sessions (expires);
