/*
  # Tool Analytics Table

  1. New Tables
    - `tool_analytics`
      - `id` (uuid, primary key)
      - `tool_id` (text, not null)
      - `event_type` (text, not null)
      - `timestamp` (timestamptz, default now())
      - `session_id` (text, not null)
      - `user_id` (text, nullable)
      - `referrer` (text, nullable)
  
  2. Security
    - Enable RLS on `tool_analytics` table
    - Add policy for anonymous users to insert analytics data
    - Add policy for authenticated users to read analytics data
*/

-- Create tool_analytics table
CREATE TABLE IF NOT EXISTS tool_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL,
  event_type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  session_id text NOT NULL,
  user_id text,
  referrer text
);

-- Enable Row Level Security
ALTER TABLE tool_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Anyone can insert analytics data"
  ON tool_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to read analytics data
CREATE POLICY "Authenticated users can read analytics data"
  ON tool_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS tool_analytics_tool_id_idx ON tool_analytics(tool_id);
CREATE INDEX IF NOT EXISTS tool_analytics_event_type_idx ON tool_analytics(event_type);
CREATE INDEX IF NOT EXISTS tool_analytics_timestamp_idx ON tool_analytics(timestamp);
CREATE INDEX IF NOT EXISTS tool_analytics_session_id_idx ON tool_analytics(session_id);