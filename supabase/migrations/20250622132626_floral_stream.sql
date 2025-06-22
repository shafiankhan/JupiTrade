/*
  # Fix comments RLS policies

  1. Security Updates
    - Update RLS policies for comments table to work with trader authentication
    - Allow authenticated users to insert comments when they have a corresponding trader profile
    - Allow users to update their own comments based on trader relationship

  2. Changes
    - Modified INSERT policy to check if user has trader profile
    - Updated UPDATE policy to use proper trader relationship
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;

-- Create new policies that work with the trader relationship
CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM traders 
      WHERE traders.id = commenter_id 
      AND traders.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own comments via trader profile"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM traders 
      WHERE traders.id = commenter_id 
      AND traders.id = auth.uid()
    )
  );

-- Also allow public users to insert comments if they have a trader profile
CREATE POLICY "Public users can insert comments with trader profile"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (
    commenter_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM traders WHERE traders.id = commenter_id)
  );