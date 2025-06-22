/*
  # Add INSERT policy for follows table

  1. Security
    - Add policy for authenticated users to insert follow relationships
    - Users can only create follows where they are the follower
    - Ensures users cannot create follows on behalf of other users

  2. Changes
    - Create INSERT policy "Users can follow others" on follows table
    - Policy allows authenticated users to insert rows where auth.uid() = follower_id
*/

-- Add INSERT policy for follows table
CREATE POLICY "Users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);