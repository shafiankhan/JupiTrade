/*
  # Fix follows table RLS policy and add profile editing features

  1. Security Updates
    - Fix the follows table RLS policy to properly allow authenticated users to follow others
    - Ensure the policy uses auth.uid() correctly for authentication
    - Add proper policies for all CRUD operations on follows table

  2. Profile Editing
    - Allow users to update their own trader profiles
    - Ensure proper RLS policies for profile updates
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can manage their own follows" ON follows;
DROP POLICY IF EXISTS "Anyone can read follows" ON follows;

-- Create proper RLS policies for follows table
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

-- Update traders table policies to allow profile editing
DROP POLICY IF EXISTS "Users can update their own trader profile" ON traders;

CREATE POLICY "Users can update their own trader profile"
  ON traders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create functions to handle follower count updates
CREATE OR REPLACE FUNCTION increment_followers_count(trader_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE traders 
  SET followers_count = followers_count + 1 
  WHERE id = trader_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_followers_count(trader_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE traders 
  SET followers_count = GREATEST(followers_count - 1, 0) 
  WHERE id = trader_id;
END;
$$;