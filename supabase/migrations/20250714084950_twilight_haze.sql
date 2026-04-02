/*
  # Create export data tables

  1. New Tables
    - `export_data`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `data` (jsonb)
      - `created_at` (timestamp)
    - `export_downloads`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `tool_id` (text)
      - `format` (text)
      - `filename` (text)
      - `customer_email` (text)
      - `amount` (integer)
      - `downloaded_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for service role access
*/

-- Create export_data table to store export data temporarily
CREATE TABLE IF NOT EXISTS export_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create export_downloads table to track successful downloads
CREATE TABLE IF NOT EXISTS export_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  tool_id text,
  format text NOT NULL,
  filename text NOT NULL,
  customer_email text,
  amount integer,
  downloaded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE export_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage export_data"
  ON export_data
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage export_downloads"
  ON export_downloads
  USING (true)
  WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS export_data_session_id_idx ON export_data (session_id);
CREATE INDEX IF NOT EXISTS export_downloads_session_id_idx ON export_downloads (session_id);