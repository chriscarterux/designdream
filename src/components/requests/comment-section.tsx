'use client';

import { useState } from 'react';
import { Send, Paperclip, X, FileIcon, Image as ImageIcon, FileText } from 'lucide-react';
import { Comment, getRelativeTime, formatFileSize } from '@/types/request';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, attachments?: File[]) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function CommentSection({
  comments,
  onAddComment,
  isLoading = false,
  className,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit comment
  const handleSubmit = async () => {
    if (!newComment.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment, attachments);
      setNewComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    return FileIcon;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Comment input */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isSubmitting}
            />

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Attachments ({attachments.length})</p>
                <div className="space-y-2">
                  {attachments.map((file, index) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
                      >
                        <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => document.getElementById('comment-file-input')?.click()}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
                <input
                  id="comment-file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={(!newComment.trim() && attachments.length === 0) || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          comments
            .slice()
            .reverse()
            .map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Comment header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.authorAvatar} />
                          <AvatarFallback>
                            {comment.authorName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{comment.authorName}</p>
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment content */}
                    <div className="ml-13">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Comment attachments */}
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {comment.attachments.map((attachment) => {
                            const Icon = getFileIcon(attachment.type);
                            const isImage = attachment.type.startsWith('image/');

                            return (
                              <div key={attachment.id}>
                                {isImage ? (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-lg border overflow-hidden hover:border-purple-300 transition-colors"
                                  >
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="max-w-full h-auto max-h-96 object-contain"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                                  >
                                    <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(attachment.size)}
                                      </p>
                                    </div>
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
