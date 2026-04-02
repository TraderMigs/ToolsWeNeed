/*
  # Create tool feedback table

  1. New Tables
    - `tool_feedback`
      - `id` (uuid, primary key)
      - `tool_id` (text, not null)
      - `emoji_rating` (text, not null)
      - `comment_text` (text)
      - `flagged` (boolean, default false)
      - `timestamp` (timestamptz, default now())
      - `user_ip` (text)
      - `user_email` (text)
  2. Security
    - Enable RLS on `tool_feedback` table
    - Add policy for public to insert feedback
    - Add policy for authenticated users to read feedback
*/

CREATE TABLE IF NOT EXISTS tool_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text NOT NULL,
  emoji_rating text NOT NULL,
  comment_text text,
  flagged boolean DEFAULT false,
  timestamp timestamptz DEFAULT now(),
  user_ip text,
  user_email text
);

-- Create index on tool_id for faster queries
CREATE INDEX IF NOT EXISTS tool_feedback_tool_id_idx ON tool_feedback(tool_id);

-- Create index on timestamp for sorting by most recent
CREATE INDEX IF NOT EXISTS tool_feedback_timestamp_idx ON tool_feedback(timestamp);

-- Create index on flagged for filtering flagged feedback
CREATE INDEX IF NOT EXISTS tool_feedback_flagged_idx ON tool_feedback(flagged);

-- Enable Row Level Security
ALTER TABLE tool_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Anyone can insert feedback"
  ON tool_feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can read feedback
CREATE POLICY "Authenticated users can read feedback"
  ON tool_feedback
  FOR SELECT
  TO authenticated
  USING (true);