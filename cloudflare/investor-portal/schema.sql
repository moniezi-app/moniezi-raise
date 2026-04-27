CREATE TABLE IF NOT EXISTS packages (
  token TEXT PRIMARY KEY,
  company_json TEXT NOT NULL,
  package_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready_to_send',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  sent_at TEXT,
  opened_at TEXT,
  signed_at TEXT,
  expires_on TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  package_id TEXT,
  investor_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  entity_name TEXT,
  desired_amount REAL NOT NULL DEFAULT 0,
  instrument_type TEXT NOT NULL DEFAULT 'undecided',
  signature_name TEXT,
  consent_electronic_records INTEGER NOT NULL DEFAULT 0,
  acknowledgment_indication_only INTEGER NOT NULL DEFAULT 0,
  acknowledgment_risk INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT,
  user_agent TEXT,
  notes TEXT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(token) REFERENCES packages(token)
);

CREATE INDEX IF NOT EXISTS idx_submissions_token ON submissions(token);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
