CREATE TABLE IF NOT EXISTS cms_properties (
  slug TEXT PRIMARY KEY,
  section TEXT NOT NULL CHECK (section IN ('sale', 'rent')),
  kind TEXT NOT NULL CHECK (kind IN ('sale', 'residential', 'commercial', 'parking')),
  content TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS cms_properties_section_status
  ON cms_properties (section, published, updated_at DESC);
