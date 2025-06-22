/*
  # Fix RLS policies for follows table

  1. Security Updates
    - Drop existing policies that may have incorrect uid() references
    - Create new policies with proper auth.uid() references
    - Ensure authenticated users can follow/unfollow others
    - Allow users to update their own follow settings (auto_copy)

  2. Policy Details
    - INSERT: Allow authenticated users to follow others (follower_id must match auth.uid())
    - UPDATE: Allow users to update their own follows (follower_id must match auth.uid())
    - DELETE: Allow users to unfollow others (follower_id must match auth.uid())
    - SELECT: Allow anyone to read follows (public access for displaying follower counts)
*/

-- Drop existing policies to recreate them with correct syntax
DROP POLICY IF EXISTS "Anyone can read follows" ON follows;
DROP POLICY IF EXISTS "Authenticated users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON follows;
DROP POLICY IF EXISTS "Users can update their own follows" ON follows;

-- Create new policies with correct auth.uid() syntax
CREATE POLICY "Anyone can read follows"
  ON follows
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

CREATE POLICY "Users can update their own follows"
  ON follows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);