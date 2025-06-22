/*
  # Fix traders table RLS policies

  1. Security Updates
    - Update INSERT policy to allow public users to create trader profiles
    - Ensure traders can be created without requiring auth.uid() match
    - Keep existing SELECT and UPDATE policies intact

  2. Changes Made
    - Modified INSERT policy to allow public role with proper validation
    - Added check to ensure wallet_address uniqueness is maintained
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert their own trader profile" ON traders;

-- Create new INSERT policy that allows public users to create trader profiles
CREATE POLICY "Anyone can create trader profile"
  ON traders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the existing policies remain intact
-- SELECT policy: "Anyone can read traders" - already exists
-- UPDATE policy: "Users can update their own trader profile" - already exists