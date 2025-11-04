-- Create Supabase Storage Buckets
-- This migration sets up the storage buckets for file uploads

-- Create request-attachments bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'request-attachments',
  'request-attachments',
  false,
  52428800, -- 50MB in bytes
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream', -- For .fig, .sketch, .xd files
    'application/zip',
    'application/x-zip-compressed',
    'video/mp4',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create profile-avatars bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-avatars',
  'profile-avatars',
  true,
  5242880, -- 5MB in bytes
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create shared-assets bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shared-assets',
  'shared-assets',
  true,
  10485760, -- 10MB in bytes
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for request-attachments bucket
-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload to own folder in request-attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'request-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read own files in request-attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'request-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files in request-attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'request-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admins can access all files in request-attachments
CREATE POLICY "Admins can access all files in request-attachments"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'request-attachments' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Storage policies for profile-avatars bucket
-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-avatars');

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for shared-assets bucket
-- Policy: Admins can upload shared assets
CREATE POLICY "Admins can upload shared assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shared-assets' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: Anyone can view shared assets (public bucket)
CREATE POLICY "Anyone can view shared assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'shared-assets');

-- Policy: Admins can update shared assets
CREATE POLICY "Admins can update shared assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'shared-assets' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: Admins can delete shared assets
CREATE POLICY "Admins can delete shared assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'shared-assets' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Add comments
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads';
