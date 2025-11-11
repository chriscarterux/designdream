-- Add comment_id support to attachments table
-- This allows attachments to be linked to either requests OR comments

ALTER TABLE attachments
ADD COLUMN comment_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Add check constraint to ensure attachment is linked to either request OR comment, but not both
ALTER TABLE attachments
ADD CONSTRAINT attachments_link_check CHECK (
  (request_id IS NOT NULL AND comment_id IS NULL) OR
  (request_id IS NULL AND comment_id IS NOT NULL)
);

-- Create index for comment attachments
CREATE INDEX idx_attachments_comment ON attachments(comment_id);

-- Update RLS policy to allow viewing attachments on comments
CREATE POLICY "Users can view attachments on accessible comments"
  ON attachments
  FOR SELECT
  USING (
    comment_id IN (
      SELECT c.id FROM comments c
      INNER JOIN requests r ON c.request_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

-- Update comment to reflect support for both requests and comments
COMMENT ON COLUMN attachments.request_id IS 'Foreign key to requests table (mutually exclusive with comment_id)';
COMMENT ON COLUMN attachments.comment_id IS 'Foreign key to comments table (mutually exclusive with request_id)';
