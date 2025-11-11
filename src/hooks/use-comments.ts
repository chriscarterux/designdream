'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './use-user';

export interface Comment {
  id: string;
  request_id: string;
  author_id: string;
  author_type: 'client' | 'admin';
  author_name: string;
  content: string;
  content_type: 'markdown' | 'plain';
  has_attachments: boolean;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  attachments?: CommentAttachment[];
}

export interface CommentAttachment {
  id: string;
  comment_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  storage_bucket: string;
  uploaded_by: string;
  uploaded_at: string;
  url?: string; // Generated download URL
}

interface UseCommentsProps {
  requestId: string;
  enabled?: boolean;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (content: string, attachments?: File[]) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useComments({
  requestId,
  enabled = true,
}: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authUser = useUser();

  // Fetch comments with attachments
  const fetchComments = useCallback(async () => {
    if (!enabled || !requestId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch attachments for comments that have them
      const commentIds = commentsData
        ?.filter((c: Comment) => c.has_attachments)
        .map((c: Comment) => c.id) || [];

      let attachmentsData: CommentAttachment[] = [];
      if (commentIds.length > 0) {
        const { data, error: attachmentsError } = await supabase
          .from('attachments')
          .select('*')
          .in('comment_id', commentIds);

        if (attachmentsError) throw attachmentsError;
        attachmentsData = data as CommentAttachment[];

        // Generate download URLs for attachments
        for (const attachment of attachmentsData) {
          const { data: urlData } = supabase.storage
            .from(attachment.storage_bucket)
            .getPublicUrl(attachment.file_path);

          attachment.url = urlData.publicUrl;
        }
      }

      // Merge comments with their attachments
      const commentsWithAttachments = commentsData?.map((comment: Comment) => ({
        ...comment,
        attachments: attachmentsData.filter((a: CommentAttachment) => a.comment_id === comment.id),
      })) || [];

      setComments(commentsWithAttachments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, requestId]);

  // Add a new comment
  const addComment = useCallback(
    async (content: string, attachmentFiles?: File[]) => {
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      setError(null);

      try {
        // Fetch user profile to get role and name
        const { data: userProfile } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', authUser.id)
          .single();

        // Determine author type and name
        const authorType = userProfile?.role === 'admin' ? 'admin' : 'client';
        const authorName = userProfile?.name || authUser.email || 'Unknown User';

        // Insert comment
        const { data: commentData, error: commentError } = await supabase
          .from('comments')
          .insert({
            request_id: requestId,
            author_id: authUser.id,
            author_type: authorType,
            author_name: authorName,
            content,
            content_type: 'markdown',
            has_attachments: attachmentFiles && attachmentFiles.length > 0,
          })
          .select()
          .single();

        if (commentError) throw commentError;

        // Handle file attachments if provided
        if (attachmentFiles && attachmentFiles.length > 0) {
          for (const file of attachmentFiles) {
            // Upload file to storage
            const filePath = `${requestId}/${commentData.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('request-attachments')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Create attachment record
            const { error: attachmentError } = await supabase
              .from('attachments')
              .insert({
                comment_id: commentData.id,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                storage_bucket: 'request-attachments',
                uploaded_by: authUser.id,
              });

            if (attachmentError) throw attachmentError;
          }
        }

        // Refetch to get the complete comment with attachments
        await fetchComments();
      } catch (err) {
        console.error('Error adding comment:', err);
        setError(err instanceof Error ? err.message : 'Failed to add comment');
        throw err;
      }
    },
    [authUser, requestId, fetchComments]
  );

  // Delete a comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      setError(null);

      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId)
          .eq('author_id', authUser.id); // Only allow deleting own comments

        if (error) throw error;

        // Update local state
        setComments((prev: Comment[]) => prev.filter((c: Comment) => c.id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete comment');
        throw err;
      }
    },
    [authUser]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!enabled || !requestId) return;

    fetchComments();

    // Subscribe to comment changes
    const channel = supabase
      .channel(`comments:${requestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `request_id=eq.${requestId}`,
        },
        () => {
          // Refetch comments when any change occurs
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, requestId, fetchComments]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    refetch: fetchComments,
  };
}
