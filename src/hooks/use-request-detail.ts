'use client';

import { useState, useCallback } from 'react';
import { RequestDetail, Comment, FileAttachment, RequestStatus } from '@/types/request';

interface UseRequestDetailProps {
  initialRequest: RequestDetail;
  onUpdate?: (request: RequestDetail) => Promise<void>;
}

interface UseRequestDetailReturn {
  request: RequestDetail;
  isLoading: boolean;
  error: string | null;
  addComment: (content: string, attachments?: File[]) => Promise<void>;
  updateStatus: (status: RequestStatus) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  updateRequest: (updates: Partial<RequestDetail>) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useRequestDetail({
  initialRequest,
  onUpdate,
}: UseRequestDetailProps): UseRequestDetailReturn {
  const [request, setRequest] = useState<RequestDetail>(initialRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a comment
  const addComment = useCallback(
    async (content: string, attachmentFiles?: File[]) => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock implementation - replace with actual API call
        const newComment: Comment = {
          id: Date.now().toString(),
          requestId: request.id,
          authorId: 'current-user-id',
          authorName: 'Current User',
          content,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // If there are attachment files, handle them
        if (attachmentFiles && attachmentFiles.length > 0) {
          // Mock file upload - replace with actual implementation
          newComment.attachments = attachmentFiles.map((file) => ({
            id: `file-${Date.now()}-${file.name}`,
            requestId: request.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadedBy: 'current-user-id',
            uploadedAt: new Date().toISOString(),
          }));
        }

        const updatedRequest = {
          ...request,
          comments: [...request.comments, newComment],
          activities: [
            ...request.activities,
            {
              id: `activity-${Date.now()}`,
              requestId: request.id,
              type: 'comment_added' as const,
              userId: 'current-user-id',
              userName: 'Current User',
              description: 'Added a comment',
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        setRequest(updatedRequest);

        if (onUpdate) {
          await onUpdate(updatedRequest);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add comment');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [request, onUpdate]
  );

  // Update request status
  const updateStatus = useCallback(
    async (status: RequestStatus) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedRequest = {
          ...request,
          status,
          activities: [
            ...request.activities,
            {
              id: `activity-${Date.now()}`,
              requestId: request.id,
              type: 'status_changed' as const,
              userId: 'current-user-id',
              userName: 'Current User',
              description: `Changed status to ${status}`,
              metadata: { oldStatus: request.status, newStatus: status },
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        setRequest(updatedRequest);

        if (onUpdate) {
          await onUpdate(updatedRequest);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [request, onUpdate]
  );

  // Upload a file
  const uploadFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock implementation - replace with actual file upload
        const newAttachment: FileAttachment = {
          id: `file-${Date.now()}`,
          requestId: request.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadedBy: 'current-user-id',
          uploadedAt: new Date().toISOString(),
        };

        const updatedRequest = {
          ...request,
          attachments: [...request.attachments, newAttachment],
          activities: [
            ...request.activities,
            {
              id: `activity-${Date.now()}`,
              requestId: request.id,
              type: 'file_uploaded' as const,
              userId: 'current-user-id',
              userName: 'Current User',
              description: `Uploaded ${file.name}`,
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        setRequest(updatedRequest);

        if (onUpdate) {
          await onUpdate(updatedRequest);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload file');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [request, onUpdate]
  );

  // Delete a file
  const deleteFile = useCallback(
    async (fileId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedRequest = {
          ...request,
          attachments: request.attachments.filter((file) => file.id !== fileId),
          updatedAt: new Date().toISOString(),
        };

        setRequest(updatedRequest);

        if (onUpdate) {
          await onUpdate(updatedRequest);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete file');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [request, onUpdate]
  );

  // Update request with partial data
  const updateRequest = useCallback(
    async (updates: Partial<RequestDetail>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedRequest = {
          ...request,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        setRequest(updatedRequest);

        if (onUpdate) {
          await onUpdate(updatedRequest);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update request');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [request, onUpdate]
  );

  // Refetch request data
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock implementation - replace with actual API call
      // const freshData = await fetchRequestById(request.id);
      // setRequest(freshData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refetch request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [request.id]);

  return {
    request,
    isLoading,
    error,
    addComment,
    updateStatus,
    uploadFile,
    deleteFile,
    updateRequest,
    refetch,
  };
}
