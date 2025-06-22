/*
  # Fix Comments Foreign Key Relationship

  1. Changes
    - Ensure proper foreign key constraint exists between comments.commenter_id and traders.id
    - This enables Supabase to correctly resolve the relationship for REST API joins

  2. Security
    - No changes to existing RLS policies
    - Maintains existing security model
*/

-- Ensure the foreign key constraint exists (it should already exist based on schema)
-- This is a safety check to make sure the relationship is properly defined
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'comments_commenter_id_fkey' 
    AND table_name = 'comments'
  ) THEN
    -- Add the foreign key constraint if it doesn't exist
    ALTER TABLE comments 
    ADD CONSTRAINT comments_commenter_id_fkey 
    FOREIGN KEY (commenter_id) REFERENCES traders(id) ON DELETE CASCADE;
  END IF;
END $$;