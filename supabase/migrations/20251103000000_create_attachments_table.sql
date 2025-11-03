-- Create attachments table for file uploads
-- This table stores metadata about files uploaded to Supabase Storage

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL CHECK (storage_bucket IN ('request-attachments', 'profile-avatars', 'shared-assets')),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_file_name CHECK (char_length(file_name) > 0),
  CONSTRAINT valid_file_path CHECK (char_length(file_path) > 0),
  CONSTRAINT valid_mime_type CHECK (char_length(mime_type) > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_attachments_request ON attachments(request_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);
CREATE INDEX idx_attachments_uploaded_at ON attachments(uploaded_at DESC);
CREATE INDEX idx_attachments_bucket ON attachments(storage_bucket);
CREATE INDEX idx_attachments_mime_type ON attachments(mime_type);

-- Create index on metadata JSONB field for common queries
CREATE INDEX idx_attachments_metadata ON attachments USING GIN (metadata);

-- Add comment to table
COMMENT ON TABLE attachments IS 'Stores metadata for files uploaded to Supabase Storage buckets';

-- Add comments to columns
COMMENT ON COLUMN attachments.id IS 'Unique identifier for the attachment';
COMMENT ON COLUMN attachments.request_id IS 'Foreign key to requests table (nullable for non-request attachments)';
COMMENT ON COLUMN attachments.file_name IS 'Original file name';
COMMENT ON COLUMN attachments.file_path IS 'Path to file in storage bucket';
COMMENT ON COLUMN attachments.file_size IS 'File size in bytes';
COMMENT ON COLUMN attachments.mime_type IS 'MIME type of the file';
COMMENT ON COLUMN attachments.storage_bucket IS 'Name of the Supabase Storage bucket';
COMMENT ON COLUMN attachments.uploaded_by IS 'User who uploaded the file';
COMMENT ON COLUMN attachments.uploaded_at IS 'Timestamp when file was uploaded';
COMMENT ON COLUMN attachments.metadata IS 'Additional metadata (dimensions, duration, etc.)';

-- Create Row Level Security (RLS) policies
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view attachments they uploaded
CREATE POLICY "Users can view their own attachments"
  ON attachments
  FOR SELECT
  USING (auth.uid() = uploaded_by);

-- Policy: Users can view attachments on requests they have access to
CREATE POLICY "Users can view attachments on accessible requests"
  ON attachments
  FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Policy: Admins can view all attachments
CREATE POLICY "Admins can view all attachments"
  ON attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Users can insert attachments
CREATE POLICY "Users can upload attachments"
  ON attachments
  FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy: Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
  ON attachments
  FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Policy: Admins can delete any attachment
CREATE POLICY "Admins can delete any attachment"
  ON attachments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create function to automatically delete storage file when attachment record is deleted
CREATE OR REPLACE FUNCTION delete_storage_file()
RETURNS TRIGGER AS $$
BEGIN
  -- Note: This is a placeholder. Actual deletion should be handled by application code
  -- because Supabase Storage deletion requires service role key
  -- You can implement this using Supabase Edge Functions or similar
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to clean up storage on attachment deletion
CREATE TRIGGER on_attachment_delete
  AFTER DELETE ON attachments
  FOR EACH ROW
  EXECUTE FUNCTION delete_storage_file();

-- Create function to get attachment count by request
CREATE OR REPLACE FUNCTION get_attachment_count(request_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM attachments
    WHERE request_id = request_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get total storage used by user
CREATE OR REPLACE FUNCTION get_user_storage_size(user_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(file_size), 0)::BIGINT
    FROM attachments
    WHERE uploaded_by = user_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON attachments TO authenticated;
GRANT EXECUTE ON FUNCTION get_attachment_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_storage_size(UUID) TO authenticated;

-- Create view for attachment statistics
CREATE OR REPLACE VIEW attachment_stats AS
SELECT
  storage_bucket,
  COUNT(*) as total_files,
  SUM(file_size) as total_size,
  AVG(file_size) as avg_file_size,
  MIN(uploaded_at) as first_upload,
  MAX(uploaded_at) as last_upload
FROM attachments
GROUP BY storage_bucket;

-- Grant access to stats view
GRANT SELECT ON attachment_stats TO authenticated;
