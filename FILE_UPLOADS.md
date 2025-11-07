# File Upload System Documentation

This document provides comprehensive documentation for the file upload and attachment system built with Supabase Storage.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Storage Buckets](#storage-buckets)
8. [Security](#security)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

The file upload system provides a comprehensive solution for handling file uploads in the DesignDream application. It includes:

- **Drag-and-drop uploads** with visual feedback
- **Multiple file selection** and batch uploads
- **Real-time progress tracking** for each file
- **File validation** (type, size, magic bytes)
- **Image preview thumbnails** with automatic generation
- **Secure storage** using Supabase Storage buckets
- **Row-level security** for access control
- **Download and delete** functionality
- **Responsive UI** for mobile and desktop

### Supported File Types

| Category | MIME Types | Extensions | Max Size |
|----------|-----------|------------|----------|
| Images | `image/png`, `image/jpeg`, `image/gif`, `image/svg+xml`, `image/webp` | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp` | 50MB |
| Documents | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.pdf`, `.doc`, `.docx` | 50MB |
| Design Files | `application/octet-stream` | `.fig`, `.sketch`, `.xd` | 50MB |
| Archives | `application/zip`, `application/x-zip-compressed` | `.zip` | 50MB |
| Videos | `video/mp4`, `video/quicktime` | `.mp4`, `.mov` | 50MB |

## Architecture

### Directory Structure

```
src/
├── components/
│   └── uploads/
│       ├── FileUploader.tsx       # Main upload component
│       ├── FilePreview.tsx        # Preview thumbnail component
│       ├── FileList.tsx           # List of files component
│       ├── DropZone.tsx           # Drag-drop zone component
│       └── index.ts               # Exports
├── lib/
│   └── storage/
│       ├── supabase-storage.ts    # Storage client and operations
│       └── file-utils.ts          # File validation and utilities
├── hooks/
│   └── useFileUpload.ts           # Custom upload hook
├── app/
│   └── api/
│       └── uploads/
│           ├── route.ts           # Upload/list handler
│           ├── [fileId]/route.ts  # Get/delete specific file
│           └── presigned/route.ts # Presigned URLs
└── types/
    └── upload.types.ts            # TypeScript types
```

### Component Hierarchy

```
FileUploader (Main component)
├── DropZone (Drag-drop area)
├── FileList (Display files)
│   └── FilePreview (Individual file)
│       ├── Image preview
│       ├── Progress indicator
│       └── Action buttons
└── Error display
```

## Installation

### 1. Install Dependencies

The required dependencies are already included in the project:

```bash
npm install @supabase/supabase-js lucide-react
```

### 2. Environment Variables

Add the following to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Database Migrations

Execute the SQL migrations to create the database tables and storage buckets:

```bash
# Apply attachments table migration
supabase db push --file supabase/migrations/20251103000000_create_attachments_table.sql

# Apply storage buckets migration
supabase db push --file supabase/migrations/20251103000001_create_storage_buckets.sql
```

Or run all migrations:

```bash
npm run db:migrate
```

### 4. Verify Storage Buckets

Check that the storage buckets were created in your Supabase dashboard:

1. Go to Storage in Supabase dashboard
2. Verify these buckets exist:
   - `request-attachments` (private)
   - `profile-avatars` (public)
   - `shared-assets` (public)

## Usage

### Basic Usage

```tsx
import { FileUploader } from '@/components/uploads';

function MyComponent() {
  const handleUploadComplete = (files) => {
    console.log('Uploaded files:', files);
  };

  return (
    <FileUploader
      maxFiles={10}
      maxSize={50 * 1024 * 1024} // 50MB
      accept="image/*,.pdf"
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### With Request Association

```tsx
<FileUploader
  requestId="request-uuid-here"
  maxFiles={10}
  bucket="request-attachments"
  folder="request-files"
  onUploadComplete={(files) => {
    console.log('Files attached to request:', files);
  }}
/>
```

### Images Only

```tsx
<FileUploader
  maxFiles={5}
  accept="image/*"
  bucket="shared-assets"
  onUploadComplete={(files) => {
    console.log('Images uploaded:', files);
  }}
/>
```

### With Existing Files

```tsx
const [existingFiles, setExistingFiles] = useState<AttachmentRecord[]>([]);

// Fetch existing files
useEffect(() => {
  async function fetchFiles() {
    const response = await fetch(`/api/uploads?requestId=${requestId}`);
    const data = await response.json();
    setExistingFiles(data.attachments);
  }
  fetchFiles();
}, [requestId]);

return (
  <FileUploader
    requestId={requestId}
    existingFiles={existingFiles}
    onUploadComplete={(newFiles) => {
      setExistingFiles(prev => [...prev, ...newFiles]);
    }}
  />
);
```

### Using the Hook Directly

```tsx
import { useFileUpload } from '@/hooks/useFileUpload';

function CustomUploader() {
  const { files, uploadFiles, removeFile, isUploading, error } = useFileUpload({
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: 'image/*',
    onUploadComplete: (files) => console.log('Done:', files),
  });

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => uploadFiles(Array.from(e.target.files || []))}
      />
      {/* Display files, progress, etc. */}
    </div>
  );
}
```

## API Reference

### Components

#### `<FileUploader />`

Main file upload component with full functionality.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `maxSize` | `number` | `52428800` | Maximum file size in bytes (50MB) |
| `accept` | `string \| string[]` | - | Accepted file types (MIME or extensions) |
| `bucket` | `StorageBucket` | `'request-attachments'` | Storage bucket name |
| `folder` | `string` | `'uploads'` | Folder within bucket |
| `requestId` | `string` | - | Optional request ID to associate files |
| `existingFiles` | `AttachmentRecord[]` | `[]` | Previously uploaded files |
| `onUploadComplete` | `(files) => void` | - | Callback when upload completes |
| `onUploadError` | `(error) => void` | - | Callback when upload fails |

#### `<DropZone />`

Drag-and-drop area for file selection.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDrop` | `(files: File[]) => void` | - | Callback when files are dropped |
| `accept` | `string` | - | Accepted file types |
| `maxFiles` | `number` | `10` | Maximum files to accept |
| `disabled` | `boolean` | `false` | Disable the drop zone |
| `children` | `ReactNode` | - | Custom content |

#### `<FileList />`

Display list of files with previews.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `(UploadFile \| AttachmentRecord)[]` | - | Files to display |
| `onRemove` | `(file) => void` | - | Callback when file is removed |
| `showActions` | `boolean` | `true` | Show action buttons |
| `variant` | `'grid' \| 'list'` | `'grid'` | Display layout |
| `compact` | `boolean` | `false` | Use compact preview |

#### `<FilePreview />`

Preview thumbnail for a single file.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `UploadFile \| AttachmentRecord` | - | File to preview |
| `onRemove` | `() => void` | - | Callback when remove clicked |
| `onDownload` | `() => void` | - | Callback when download clicked |
| `showActions` | `boolean` | `true` | Show action buttons |
| `variant` | `'compact' \| 'full'` | `'full'` | Preview size |

### Hooks

#### `useFileUpload(options)`

Custom hook for handling file uploads.

**Options:**

```typescript
interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number;
  accept?: string | string[];
  bucket?: StorageBucket;
  folder?: string;
  requestId?: string;
  onUploadComplete?: (files: AttachmentRecord[]) => void;
  onUploadError?: (error: string) => void;
}
```

**Returns:**

```typescript
interface UseFileUploadReturn {
  files: UploadFile[];
  uploadFiles: (files: File[]) => Promise<void>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  isUploading: boolean;
  error: string | null;
}
```

### API Routes

#### `POST /api/uploads`

Upload a file to storage.

**Request:**

```typescript
// FormData
{
  file: File;
  bucket?: string;
  folder?: string;
  requestId?: string;
}
```

**Response:**

```typescript
{
  success: true;
  attachment: AttachmentRecord;
  url: string;
}
```

#### `GET /api/uploads?requestId=xxx`

Get attachments for a request.

**Response:**

```typescript
{
  success: true;
  attachments: AttachmentRecord[];
}
```

#### `GET /api/uploads/[fileId]`

Get a specific attachment with signed URL.

**Response:**

```typescript
{
  success: true;
  attachment: AttachmentRecord & { url: string };
}
```

#### `DELETE /api/uploads/[fileId]`

Delete an attachment.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```typescript
{
  success: true;
  message: string;
}
```

#### `POST /api/uploads/presigned`

Generate presigned URL for direct upload.

**Request:**

```typescript
{
  fileName: string;
  fileType: string;
  bucket?: string;
  folder?: string;
}
```

**Response:**

```typescript
{
  success: true;
  uploadUrl: string;
  filePath: string;
  token: string;
}
```

## Database Schema

### `attachments` Table

```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);
```

### Indexes

- `idx_attachments_request` on `request_id`
- `idx_attachments_uploaded_by` on `uploaded_by`
- `idx_attachments_uploaded_at` on `uploaded_at DESC`
- `idx_attachments_bucket` on `storage_bucket`
- `idx_attachments_mime_type` on `mime_type`
- `idx_attachments_metadata` on `metadata` (GIN)

### Functions

- `get_attachment_count(request_uuid)` - Count attachments for a request
- `get_user_storage_size(user_uuid)` - Total storage used by user

## Storage Buckets

### `request-attachments` (Private)

- **Purpose:** Files attached to design requests
- **Public:** No
- **Max Size:** 50MB per file
- **Access:** Users can access their own files, admins can access all

### `profile-avatars` (Public)

- **Purpose:** User profile pictures
- **Public:** Yes
- **Max Size:** 5MB per file
- **Access:** Users can manage their own, all can view

### `shared-assets` (Public)

- **Purpose:** Company logos, brand assets
- **Public:** Yes
- **Max Size:** 10MB per file
- **Access:** Admins can manage, all can view

## Security

### File Validation

1. **MIME Type Check:** Validates against allowed types
2. **Extension Check:** Verifies file extension matches content
3. **Size Limit:** Enforces maximum file size
4. **Magic Bytes:** Checks file signature for authenticity (recommended)

### Row-Level Security (RLS)

Policies enforce:

- Users can only upload to their own folders
- Users can view/delete their own files
- Admins have full access to all files
- Public buckets are readable by everyone

### Rate Limiting

Implement rate limiting at the API route level:

```typescript
// Example using middleware
const rateLimiter = createRateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
});
```

### Authentication

All upload operations require authentication:

```typescript
// Check JWT token
const authHeader = request.headers.get('authorization');
const token = authHeader?.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(token);
```

## Best Practices

### 1. File Size Optimization

```typescript
// Resize images before upload
import { resizeImage } from '@/lib/storage/file-utils';

const optimizedBlob = await resizeImage(file, 1920, 1080, 0.9);
```

### 2. Error Handling

```typescript
<FileUploader
  onUploadError={(error) => {
    // Log to error tracking service
    console.error('Upload failed:', error);
    // Show user-friendly message
    toast.error('Failed to upload file. Please try again.');
  }}
/>
```

### 3. Progress Feedback

```typescript
// The FileUploader component automatically shows progress
// For custom implementations:
const { files } = useFileUpload({...});

files.map(file => (
  <div>
    <ProgressBar value={file.progress} />
    <span>{file.status}</span>
  </div>
));
```

### 4. Cleanup

```typescript
// Delete unused files
useEffect(() => {
  return () => {
    // Clean up temporary files
    files.forEach(file => {
      if (file.status === 'pending') {
        removeFile(file.id);
      }
    });
  };
}, []);
```

### 5. Accessibility

The components include:
- Keyboard navigation
- ARIA labels
- Screen reader support
- Focus management

## Troubleshooting

### Upload Fails

**Problem:** Upload returns 401 Unauthorized

**Solution:** Check authentication token:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### File Not Found

**Problem:** Cannot access uploaded file

**Solution:** Verify RLS policies and bucket privacy settings

### Large Files Timeout

**Problem:** Large files fail to upload

**Solution:** Implement chunked uploads or increase timeout:
```typescript
fetch('/api/uploads', {
  method: 'POST',
  body: formData,
  signal: AbortSignal.timeout(5 * 60 * 1000), // 5 minutes
});
```

### CORS Issues

**Problem:** CORS errors when accessing files

**Solution:** Configure CORS in Supabase Storage settings

### Storage Quota

**Problem:** Storage quota exceeded

**Solution:** Implement storage limits per user:
```sql
SELECT get_user_storage_size('user-uuid');
```

## Examples

See the live example at: `/examples/file-upload`

Or run locally:
```bash
npm run dev
# Visit http://localhost:3000/examples/file-upload
```

## Support

For issues or questions:
1. Check this documentation
2. Review the example code
3. Check Supabase Storage documentation
4. Open an issue on GitHub

## License

MIT License - See LICENSE file for details
