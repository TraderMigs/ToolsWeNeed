/*
  # Create tool requests table

  1. New Tables
    - `tool_requests`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `reason` (text)
      - `expensive_link` (text)
      - `email` (text)
      - `created_at` (timestamp with time zone, default now())
      - `upvotes` (integer, default 0)
  2. Security
    - Enable RLS on `tool_requests` table
    - Add policy for public to insert tool requests
    - Add policy for authenticated users to read tool requests
*/

CREATE TABLE IF NOT EXISTS tool_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  reason text,
  expensive_link text,
  email text,
  created_at timestamptz DEFAULT now(),
  upvotes integer DEFAULT 0
);

ALTER TABLE tool_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert tool requests"
  ON tool_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read tool requests"
  ON tool_requests
  FOR SELECT
  TO authenticated
  USING (true);