CREATE TABLE IF NOT EXISTS start_state_submissions (
  id UUID PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  permission_to_showcase BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  pattern_name TEXT NOT NULL,
  pattern_category TEXT,
  pattern_matrix JSONB NOT NULL,
  interesting_behavior TEXT,
  project_url TEXT,
  project_description TEXT,
  rule_modifications TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  permission_to_showcase BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  project_url TEXT NOT NULL,
  project_description TEXT,
  rule_modifications TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE start_state_submissions
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE project_submissions
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_start_state_submissions_submitted_at
  ON start_state_submissions (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_start_state_submissions_permission
  ON start_state_submissions (permission_to_showcase);

CREATE INDEX IF NOT EXISTS idx_start_state_submissions_hidden
  ON start_state_submissions (is_hidden);

CREATE INDEX IF NOT EXISTS idx_project_submissions_submitted_at
  ON project_submissions (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_submissions_permission
  ON project_submissions (permission_to_showcase);

CREATE INDEX IF NOT EXISTS idx_project_submissions_hidden
  ON project_submissions (is_hidden);
