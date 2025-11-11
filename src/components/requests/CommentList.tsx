'use client';

import { useState } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { useComments } from '@/hooks/use-comments';
import { useUser } from '@/hooks/use-user';

interface CommentListProps {
  requestId: string;
}

export function CommentList({ requestId }: CommentListProps) {
  const user = useUser();
  const { comments, isLoading, error, addComment, deleteComment } = useComments({
    requestId,
    enabled: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddComment = async (content: string, files?: File[]) => {
    setIsSubmitting(true);
    try {
      await addComment(content, files);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
          {comments.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({comments.length})</span>
          )}
        </h2>
      </div>

      {/* Comment Form */}
      <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />

      {/* Loading State */}
      {isLoading && comments.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading comments...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Comments List */}
      {!isLoading && comments.length === 0 && !error && (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No comments yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
        </div>
      )}

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onDelete={handleDeleteComment}
              isDeleting={deletingId === comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
