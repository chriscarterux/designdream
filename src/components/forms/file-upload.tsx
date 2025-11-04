'use client';

import { useCallback, useState } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { FileUpload } from '@/lib/validations/request.schema';

interface FileUploadProps {
  files: FileUpload[];
  onChange: (files: FileUpload[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  className?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'video/mp4',
  'video/quicktime',
];

export function FileUploadComponent({
  files,
  onChange,
  maxFiles = 10,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes = ACCEPTED_FILE_TYPES,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('video/')) return Video;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return 'File type not supported';
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)}`;
    }
    return null;
  };

  // Handle file selection
  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: FileUpload[] = [];
      const errors: string[] = [];

      // Check if adding these files would exceed max files
      if (files.length + fileList.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        alert(errors.join('\n'));
        return;
      }

      // Process each file
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const error = validateFile(file);

        if (error) {
          errors.push(`${file.name}: ${error}`);
          continue;
        }

        // Create file object
        const fileId = `${Date.now()}-${i}`;
        const fileUpload: FileUpload = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        };

        // Simulate upload progress (in real app, this would be actual upload)
        simulateUpload(fileId);

        // For images, create preview URL
        if (file.type.startsWith('image/')) {
          fileUpload.url = URL.createObjectURL(file);
        }

        newFiles.push(fileUpload);
      }

      if (errors.length > 0) {
        alert('Some files could not be uploaded:\n' + errors.join('\n'));
      }

      if (newFiles.length > 0) {
        onChange([...files, ...newFiles]);
      }
    },
    [files, maxFiles, onChange]
  );

  // Simulate upload progress
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 500);
      }
    }, 100);
  };

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [handleFiles]
  );

  // Remove file
  const removeFile = useCallback(
    (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      onChange(files.filter((f) => f.id !== fileId));
    },
    [files, onChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col items-center justify-center space-y-4"
        >
          <div className="rounded-full bg-purple-100 p-4">
            <Upload className="h-8 w-8 text-purple-600" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drop files here or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Maximum {maxFiles} files, up to {formatFileSize(maxFileSize)} each
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Supported: Images, PDFs, Documents, Videos
            </p>
          </div>

          <Button type="button" variant="outline" size="sm" asChild>
            <span>Choose Files</span>
          </Button>
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length}/{maxFiles})
          </p>

          <div className="grid gap-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              const progress = uploadProgress[file.id];

              return (
                <Card key={file.id} className="p-3">
                  <div className="flex items-start gap-3">
                    {/* File preview or icon */}
                    <div className="flex-shrink-0">
                      {file.url && file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>

                      {/* Progress bar */}
                      {progress !== undefined && progress < 100 && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-1" />
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
