'use client';

import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, FileText, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Comment } from '@/hooks/use-comments';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete?: (commentId: string) => Promise<void>;
  isDeleting?: boolean;
}

export function CommentItem({
  comment,
  currentUserId,
  onDelete,
  isDeleting = false,
}: CommentItemProps) {
  const isAuthor = currentUserId && comment.author_id === currentUserId;
  const initials = comment.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    if (mimeType.includes('text')) return '📝';
    return '📎';
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{comment.author_name}</span>
              {comment.author_type === 'admin' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Team
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
              {comment.created_at !== comment.updated_at && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {/* Delete button (only for own comments) */}
            {isAuthor && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
              </Button>
            )}
          </div>

          {/* Comment Content (Markdown) */}
          <div className="prose prose-sm max-w-none text-gray-700">
            {comment.content_type === 'markdown' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize link styling
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-purple-600 hover:text-purple-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Customize code blocks
                  code: ({ node, className, children, ...props }) => {
                    const inline = !className;
                    return inline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code
                        className={`${className} block bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {comment.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>

          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{getFileIcon(attachment.mime_type)}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 truncate">{attachment.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.file_size)}
                      </p>
                    </div>
                  </div>
                  {attachment.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={attachment.url}
                        download={attachment.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
