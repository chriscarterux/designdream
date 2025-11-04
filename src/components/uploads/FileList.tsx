'use client';

/**
 * FileList Component
 * Display list of uploaded files
 */

import type { UploadFile, AttachmentRecord } from '@/types/upload.types';
import { FilePreview } from './FilePreview';
import { downloadFile, deleteAttachment } from '@/lib/storage/supabase-storage';
import { useState } from 'react';

interface FileListProps {
  files: (UploadFile | AttachmentRecord)[];
  onRemove?: (file: UploadFile | AttachmentRecord) => void;
  showActions?: boolean;
  variant?: 'grid' | 'list';
  compact?: boolean;
}

function isUploadFile(file: UploadFile | AttachmentRecord): file is UploadFile {
  return 'file' in file;
}

export function FileList({
  files,
  onRemove,
  showActions = true,
  variant = 'grid',
  compact = false,
}: FileListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDownload = async (file: UploadFile | AttachmentRecord) => {
    if (isUploadFile(file)) {
      // For uploading files, create download link from File object
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For uploaded files, download from storage
      try {
        const blob = await downloadFile(
          file.storage_bucket as any,
          file.file_path
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download file:', error);
        alert('Failed to download file');
      }
    }
  };

  const handleRemove = async (file: UploadFile | AttachmentRecord) => {
    const fileId = isUploadFile(file) ? file.id : file.id;

    if (!isUploadFile(file)) {
      // Show confirmation for uploaded files
      if (!confirm(`Are you sure you want to delete ${file.file_name}?`)) {
        return;
      }

      setDeletingIds(prev => new Set(prev).add(fileId));

      try {
        await deleteAttachment(file);
        onRemove?.(file);
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Failed to delete file');
      } finally {
        setDeletingIds(prev => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
      }
    } else {
      onRemove?.(file);
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No files uploaded yet</p>
      </div>
    );
  }

  if (variant === 'list' || compact) {
    return (
      <div className="space-y-2">
        {files.map(file => {
          const fileId = isUploadFile(file) ? file.id : file.id;
          const isDeleting = deletingIds.has(fileId);

          return (
            <div key={fileId} className={isDeleting ? 'opacity-50' : ''}>
              <FilePreview
                file={file}
                onRemove={
                  showActions && onRemove && !isDeleting
                    ? () => handleRemove(file)
                    : undefined
                }
                onDownload={showActions ? () => handleDownload(file) : undefined}
                showActions={showActions}
                variant="compact"
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map(file => {
        const fileId = isUploadFile(file) ? file.id : file.id;
        const isDeleting = deletingIds.has(fileId);

        return (
          <div key={fileId} className={isDeleting ? 'opacity-50' : ''}>
            <FilePreview
              file={file}
              onRemove={
                showActions && onRemove && !isDeleting
                  ? () => handleRemove(file)
                  : undefined
              }
              onDownload={showActions ? () => handleDownload(file) : undefined}
              showActions={showActions}
              variant="full"
            />
          </div>
        );
      })}
    </div>
  );
}
