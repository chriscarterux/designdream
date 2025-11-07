/**
 * useFileUpload Hook
 * Custom hook for handling file uploads with progress tracking
 */

import { useState, useCallback } from 'react';
import type {
  UploadFile,
  FileUploadConfig,
  AttachmentRecord,
  StorageBucket,
} from '@/types/upload.types';
import { validateFile } from '@/lib/storage/file-utils';

interface UseFileUploadOptions extends FileUploadConfig {
  requestId?: string;
  onUploadComplete?: (files: AttachmentRecord[]) => void;
  onUploadError?: (error: string) => void;
}

interface UseFileUploadReturn {
  files: UploadFile[];
  uploadFiles: (newFiles: File[]) => Promise<void>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  isUploading: boolean;
  error: string | null;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024, // 50MB
    accept,
    bucket = 'request-attachments',
    folder = 'uploads',
    requestId,
    onUploadComplete,
    onUploadError,
  } = options;

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const uploadFiles = useCallback(
    async (newFiles: File[]) => {
      setError(null);

      // Check max files limit
      if (files.length + newFiles.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} files allowed`;
        setError(errorMsg);
        onUploadError?.(errorMsg);
        return;
      }

      // Validate files
      const validatedFiles: UploadFile[] = [];
      const errors: string[] = [];

      for (const file of newFiles) {
        const validation = validateFile(file, { maxSize, accept });

        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
        } else {
          validatedFiles.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            progress: 0,
            status: 'pending',
          });
        }
      }

      if (errors.length > 0) {
        const errorMsg = errors.join('\n');
        setError(errorMsg);
        onUploadError?.(errorMsg);
        return;
      }

      // Add files to state
      setFiles(prev => [...prev, ...validatedFiles]);
      setIsUploading(true);

      try {
        // Upload files sequentially with progress tracking
        const uploadedAttachments: AttachmentRecord[] = [];

        for (const uploadFile of validatedFiles) {
          setFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
            )
          );

          try {
            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', uploadFile.file);
            formData.append('bucket', bucket);
            formData.append('folder', folder);
            if (requestId) {
              formData.append('requestId', requestId);
            }

            // Upload with progress tracking
            const response = await fetch('/api/uploads', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();
            uploadedAttachments.push(result.attachment);

            // Update file status to success
            setFiles(prev =>
              prev.map(f =>
                f.id === uploadFile.id
                  ? {
                      ...f,
                      status: 'success' as const,
                      progress: 100,
                      url: result.attachment.file_path,
                      storageKey: result.attachment.id,
                    }
                  : f
              )
            );
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Upload failed';

            // Update file status to error
            setFiles(prev =>
              prev.map(f =>
                f.id === uploadFile.id
                  ? { ...f, status: 'error' as const, error: errorMsg }
                  : f
              )
            );

            errors.push(`${uploadFile.file.name}: ${errorMsg}`);
          }
        }

        if (errors.length > 0) {
          const errorMsg = errors.join('\n');
          setError(errorMsg);
          onUploadError?.(errorMsg);
        }

        if (uploadedAttachments.length > 0) {
          onUploadComplete?.(uploadedAttachments);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMsg);
        onUploadError?.(errorMsg);
      } finally {
        setIsUploading(false);
      }
    },
    [files.length, maxFiles, maxSize, accept, bucket, folder, requestId, onUploadComplete, onUploadError]
  );

  return {
    files,
    uploadFiles,
    removeFile,
    clearFiles,
    isUploading,
    error,
  };
}
