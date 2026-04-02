/*
  # Create export sessions table for payment workflow

  1. New Tables
    - `export_sessions`
      - `session_id` (text, primary key) - Stripe session ID
      - `export_key` (text) - Export data key/identifier
      - `tool_id` (text) - Tool that generated the export
      - `filename` (text) - Export filename
      - `format` (text) - Export format (pdf, csv, etc.)
      - `status` (text) - pending, paid, downloaded
      - `created_at` (timestamp)
      - `paid_at` (timestamp, nullable)
      - `downloaded_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `export_sessions` table
    - Add policy for service role to manage sessions
    - Add cleanup policy for old sessions
*/

CREATE TABLE IF NOT EXISTS export_sessions (
  session_id text PRIMARY KEY,
  export_key text NOT NULL,
  tool_id text,
  filename text NOT NULL,
  format text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  downloaded_at timestamptz
);

ALTER TABLE export_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage export sessions"
  ON export_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS export_sessions_session_id_idx ON export_sessions (session_id);
CREATE INDEX IF NOT EXISTS export_sessions_status_idx ON export_sessions (status);
CREATE INDEX IF NOT EXISTS export_sessions_created_at_idx ON export_sessions (created_at);

-- Auto-cleanup function for old sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_export_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM export_sessions 
  WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;